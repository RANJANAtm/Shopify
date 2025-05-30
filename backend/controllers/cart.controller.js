import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
	try {
		// Check if user has cart items
		if (!req.user.cartItems || req.user.cartItems.length === 0) {
			return res.json([]);
		}

		// Filter out any null or invalid cart items
		const validCartItems = req.user.cartItems.filter(item => item && item.product);
		
		if (validCartItems.length === 0) {
			return res.json([]);
		}

		const productIds = validCartItems.map(item => item.product);
		const products = await Product.find({ _id: { $in: productIds } });

		// add quantity for each product
		const cartItems = products.map((product) => {
			const item = validCartItems.find((cartItem) => cartItem.product.toString() === product._id.toString());
			return { ...product.toJSON(), quantity: item ? item.quantity : 1 };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		// Validate productId
		if (!productId) {
			return res.status(400).json({ message: "Product ID is required" });
		}

		// Check if product exists
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		// Initialize cartItems if it doesn't exist
		if (!user.cartItems) {
			user.cartItems = [];
		}

		const existingItem = user.cartItems.find((item) => item && item.product && item.product.toString() === productId);
		
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push({ product: productId, quantity: 1 });
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;
		
		if (!productId) {
			user.cartItems = [];
		} else {
			// Filter out the specific product and any null items
			user.cartItems = user.cartItems.filter((item) => 
				item && item.product && item.product.toString() !== productId
			);
		}
		
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in removeAllFromCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;

		// Validate inputs
		if (!productId) {
			return res.status(400).json({ message: "Product ID is required" });
		}

		if (quantity < 0) {
			return res.status(400).json({ message: "Quantity must be non-negative" });
		}

		// Initialize cartItems if it doesn't exist
		if (!user.cartItems) {
			user.cartItems = [];
		}

		const existingItem = user.cartItems.find((item) => 
			item && item.product && item.product.toString() === productId
		);

		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => 
					item && item.product && item.product.toString() !== productId
				);
			} else {
				existingItem.quantity = quantity;
			}
			
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found in cart" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
