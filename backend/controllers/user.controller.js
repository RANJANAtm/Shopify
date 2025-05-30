import User from "../models/user.model.js";

export const cleanupCartData = async (req, res) => {
	try {
		// Clean up all users' cart data - remove null/invalid items
		const users = await User.find({});
		
		for (let user of users) {
			if (user.cartItems && user.cartItems.length > 0) {
				// Filter out null or invalid cart items
				const cleanItems = user.cartItems.filter(item => 
					item && item.product && item.quantity && item.quantity > 0
				);
				
				if (cleanItems.length !== user.cartItems.length) {
					user.cartItems = cleanItems;
					await user.save();
				}
			}
		}
		
		res.json({ message: "Cart data cleaned up successfully" });
	} catch (error) {
		console.log("Error in cleanupCartData", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getUserCart = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		res.json({ cartItems: user.cartItems || [] });
	} catch (error) {
		console.log("Error in getUserCart", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
