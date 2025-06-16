import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode, currency = 'USD' } = req.body;

		console.log('Creating checkout session for:', { 
			products: products?.length, 
			couponCode, 
			currency,
			userId: req.user._id 
		});

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			// Always convert to USD for Stripe (Stripe requires USD for test mode)
			let priceInUSD = parseFloat(product.price);
			
			// If the product price is in INR, convert to USD
			// The frontend should already convert to USD before sending, but double-check
			if (currency === 'INR' && priceInUSD > 500) {
				// If price seems too high for USD, it might be in INR, convert it
				priceInUSD = priceInUSD * 0.012; // Convert INR to USD
				console.log(`Converting INR ${product.price} to USD ${priceInUSD}`);
			}
			
			const amount = Math.round(priceInUSD * 100); // stripe wants in cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd", // Always use USD for Stripe
					product_data: {
						name: product.name,
						images: [product.image],
						metadata: {
							original_currency: currency,
							original_price: product.price
						}
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		if (totalAmount >= 20000) {
			try {
				await createNewCoupon(req.user._id);
				console.log('New coupon created for large order');
			} catch (couponError) {
				console.error('Error creating new coupon:', couponError);
				// Don't fail the checkout if coupon creation fails
			}
		}

		console.log('Checkout session created successfully:', session.id);
		res.status(200).json({ 
			id: session.id, 
			totalAmount: totalAmount / 100,
			success: true
		});
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ 
			message: "Error processing checkout", 
			error: error.message,
			success: false
		});
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		
		if (!sessionId) {
			return res.status(400).json({ 
				message: "Session ID is required",
				success: false 
			});
		}

		console.log('🔄 Processing checkout success for session:', sessionId);
		
		// Check if order already exists to prevent duplicates
		const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
		if (existingOrder) {
			console.log('✅ Order already exists for session:', sessionId, '- Returning existing order');
			return res.status(200).json({
				success: true,
				message: "Order already processed successfully",
				orderId: existingOrder._id,
				totalAmount: existingOrder.totalAmount,
				isExisting: true
			});
		}
		
		// Retrieve session from Stripe
		let session;
		try {
			session = await stripe.checkout.sessions.retrieve(sessionId);
			console.log('💳 Stripe session retrieved:', sessionId, 'Status:', session.payment_status);
		} catch (stripeError) {
			console.error('❌ Stripe session retrieval failed:', stripeError);
			return res.status(400).json({
				success: false,
				message: "Invalid or expired payment session",
				error: stripeError.message
			});
		}

		if (session.payment_status === "paid") {
			console.log('✅ Payment confirmed for session:', sessionId);
			
			// Handle coupon deactivation with error handling
			if (session.metadata.couponCode) {
				try {
					await Coupon.findOneAndUpdate(
						{
							code: session.metadata.couponCode,
							userId: session.metadata.userId,
						},
						{
							isActive: false,
						}
					);
					console.log('🎫 Coupon deactivated:', session.metadata.couponCode);
				} catch (couponError) {
					console.error('⚠️ Error deactivating coupon:', couponError);
					// Don't fail the entire process if coupon update fails
				}
			}

			// Create the order with additional validation
			try {
				if (!session.metadata.products) {
					throw new Error('No products found in session metadata');
				}

				const products = JSON.parse(session.metadata.products);
				if (!Array.isArray(products) || products.length === 0) {
					throw new Error('Invalid products data in session');
				}

				const newOrder = new Order({
					user: session.metadata.userId,
					products: products.map((product) => ({
						product: product.id,
						quantity: product.quantity,
						price: product.price,
					})),
					totalAmount: session.amount_total / 100, // convert from cents to dollars
					stripeSessionId: sessionId,
				});

				// Save order with retry logic
				let savedOrder;
				try {
					savedOrder = await newOrder.save();
				} catch (saveError) {
					// Check if this is a duplicate key error (race condition)
					if (saveError.code === 11000 && saveError.keyValue?.stripeSessionId) {
						console.log('🔄 Duplicate session detected during save, fetching existing order');
						const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
						if (existingOrder) {
							return res.status(200).json({
								success: true,
								message: "Order already processed successfully",
								orderId: existingOrder._id,
								totalAmount: existingOrder.totalAmount,
								isExisting: true
							});
						}
					}
					throw saveError; // Re-throw if not a duplicate error
				}

				console.log('✅ Order created successfully:', savedOrder._id);

				res.status(200).json({
					success: true,
					message: "Payment successful, order created",
					orderId: savedOrder._id,
					totalAmount: session.amount_total / 100
				});
			} catch (orderError) {
				console.error('❌ Error creating order:', orderError);
				res.status(500).json({
					success: false,
					message: "Payment successful but failed to create order record",
					error: orderError.message,
					sessionId: sessionId
				});
			}
		} else {
			console.log('❌ Payment not completed for session:', sessionId, 'Status:', session.payment_status);
			res.status(400).json({
				success: false,
				message: "Payment was not completed",
				paymentStatus: session.payment_status,
				sessionId: sessionId
			});
		}
	} catch (error) {
		console.error("❌ Error processing checkout success:", error);
		res.status(500).json({ 
			message: "Internal server error during payment processing", 
			error: error.message,
			success: false,
			timestamp: new Date().toISOString()
		});
	}
};

async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}
