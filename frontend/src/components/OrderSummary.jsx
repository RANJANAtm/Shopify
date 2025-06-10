import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight, Shield, CreditCard, Truck, ArrowRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import Price from "./Price";

const stripePromise = loadStripe(
	"pk_test_51R7CofH6tbonX8fNnxT2KnOPKGirBt9N6v4Rc9jt5eGS2dEhTG4XD5yRU1jS9KdDhjq6fkudh3dwnDuOxElM0UBb00LjIAr2gU"
);

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	const handlePayment = async () => {
		const stripe = await stripePromise;
		const res = await axios.post("/payments/create-checkout-session", {
			products: cart,
			couponCode: coupon ? coupon.code : null,
		});

		const session = res.data;
		const result = await stripe.redirectToCheckout({
			sessionId: session.id,
		});

		if (result.error) {
			console.error("Error:", result.error);
		}
	};

	return (
		<motion.div
			className='glass-card p-6 sticky top-24'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{/* Header */}
			<div className='flex items-center gap-3 mb-6'>
				<div className='w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg 
							  flex items-center justify-center'>
					<CreditCard className='w-4 h-4 text-white' />
				</div>
				<h2 className='text-xl font-bold text-neutral-700'>Order Summary</h2>
			</div>

			{/* Order Details */}
			<div className='space-y-4 mb-6'>
				<div className='space-y-3'>
					<div className='flex items-center justify-between'>
						<span className='text-neutral-600'>Subtotal ({cart.length} items)</span>
						<Price price={formattedSubtotal} weight="medium" className="text-neutral-700" />
					</div>

					<div className='flex items-center justify-between'>
						<span className='text-neutral-600'>Shipping</span>
						<span className='font-medium text-success'>Free</span>
					</div>

					{savings > 0 && (
						<div className='flex items-center justify-between text-success'>
							<span>Savings</span>
							<span className='font-medium'>-<Price price={formattedSavings} /></span>
						</div>
					)}

					{coupon && isCouponApplied && (
						<div className='flex items-center justify-between text-success'>
							<span>Coupon ({coupon.code})</span>
							<span className='font-medium'>-{coupon.discountPercentage}%</span>
						</div>
					)}
				</div>

				<div className='border-t border-neutral-200 pt-4'>
					<div className='flex items-center justify-between'>
						<span className='text-lg font-bold text-neutral-700'>Total</span>
						<Price price={formattedTotal} size="2xl" weight="bold" className="text-gradient-primary" />
					</div>
				</div>
			</div>

			{/* Checkout Button */}
			<motion.button
				className='w-full btn-primary flex items-center justify-center gap-2 mb-4'
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				onClick={handlePayment}
			>
				<CreditCard className='w-5 h-5' />
				Proceed to Checkout
				<ArrowRight className='w-5 h-5' />
			</motion.button>

			{/* Continue Shopping */}
			<div className='text-center mb-6'>
				<Link
					to='/'
					className='inline-flex items-center gap-2 text-sm font-medium text-primary-600 
							 hover:text-primary-500 transition-colors duration-200'
				>
					Continue Shopping
					<MoveRight className='w-4 h-4' />
				</Link>
			</div>

			{/* Security Features */}
			<div className='space-y-3 pt-4 border-t border-neutral-200'>
				<div className='flex items-center gap-3 text-sm text-neutral-600'>
					<Shield className='w-4 h-4 text-success' />
					<span>Secure 256-bit SSL encryption</span>
				</div>
				<div className='flex items-center gap-3 text-sm text-neutral-600'>
					<Truck className='w-4 h-4 text-primary-500' />
					<span>Free shipping on all orders</span>
				</div>
				<div className='flex items-center gap-3 text-sm text-neutral-600'>
					<CreditCard className='w-4 h-4 text-secondary-500' />
					<span>Multiple payment options</span>
				</div>
			</div>

			{/* Payment Methods */}
			<div className='mt-6 pt-4 border-t border-neutral-200'>
				<p className='text-xs text-neutral-500 mb-3'>We accept</p>
				<div className='flex items-center gap-2'>
					<div className='w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white 
								  text-xs flex items-center justify-center font-bold'>
						V
					</div>
					<div className='w-8 h-5 bg-gradient-to-r from-red-600 to-red-700 rounded text-white 
								  text-xs flex items-center justify-center font-bold'>
						M
					</div>
					<div className='w-8 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded text-white 
								  text-xs flex items-center justify-center font-bold'>
						P
					</div>
					<div className='w-8 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded text-white 
								  text-xs flex items-center justify-center font-bold'>
						D
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderSummary;
