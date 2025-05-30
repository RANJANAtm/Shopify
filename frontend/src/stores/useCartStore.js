import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,
	loading: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
			// Don't show error toast for coupon fetch as it's not critical
		}
	},

	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			console.error("Apply coupon error:", error);
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},

	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	getCartItems: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/cart");
			const cartData = Array.isArray(res.data) ? res.data : [];
			set({ cart: cartData, loading: false });
			get().calculateTotals();
		} catch (error) {
			console.error("Error fetching cart items:", error);
			set({ cart: [], loading: false });
			
			// Only show error if it's not a 401 (unauthorized) error
			if (error.response?.status !== 401) {
				const errorMessage = error.response?.data?.message || "Failed to fetch cart items";
				console.log("Cart fetch error:", errorMessage);
				// Don't show toast for cart fetch errors to avoid spam
			}
		}
	},

	clearCart: async () => {
		try {
			set({ cart: [], coupon: null, total: 0, subtotal: 0, isCouponApplied: false });
		} catch (error) {
			console.error("Error clearing cart:", error);
		}
	},

	addToCart: async (product) => {
		if (!product || !product._id) {
			toast.error("Invalid product");
			return;
		}

		try {
			const res = await axios.post("/cart", { productId: product._id });
			toast.success("Product added to cart");

			// Update local state optimistically
			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});
			
			get().calculateTotals();
		} catch (error) {
			console.error("Error adding to cart:", error);
			const errorMessage = error.response?.data?.message || "Failed to add product to cart";
			toast.error(errorMessage);
			throw error; // Re-throw to handle in component if needed
		}
	},

	removeFromCart: async (productId) => {
		if (!productId) {
			toast.error("Invalid product ID");
			return;
		}

		try {
			await axios.delete(`/cart`, { data: { productId } });
			set((prevState) => ({ 
				cart: prevState.cart.filter((item) => item._id !== productId) 
			}));
			get().calculateTotals();
		} catch (error) {
			console.error("Error removing from cart:", error);
			const errorMessage = error.response?.data?.message || "Failed to remove product from cart";
			toast.error(errorMessage);
			throw error;
		}
	},

	updateQuantity: async (productId, quantity) => {
		if (!productId || quantity < 0) {
			toast.error("Invalid parameters");
			return;
		}

		if (quantity === 0) {
			return get().removeFromCart(productId);
		}

		try {
			await axios.put(`/cart/${productId}`, { quantity });
			set((prevState) => ({
				cart: prevState.cart.map((item) => 
					item._id === productId ? { ...item, quantity } : item
				),
			}));
			get().calculateTotals();
		} catch (error) {
			console.error("Error updating quantity:", error);
			const errorMessage = error.response?.data?.message || "Failed to update quantity";
			toast.error(errorMessage);
			throw error;
		}
	},

	calculateTotals: () => {
		const { cart, coupon } = get();
		
		if (!Array.isArray(cart) || cart.length === 0) {
			set({ subtotal: 0, total: 0 });
			return;
		}

		const subtotal = cart.reduce((sum, item) => {
			const price = parseFloat(item.price) || 0;
			const quantity = parseInt(item.quantity) || 0;
			return sum + (price * quantity);
		}, 0);

		let total = subtotal;

		if (coupon && coupon.discountPercentage) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = Math.max(0, subtotal - discount);
		}

		set({ 
			subtotal: parseFloat(subtotal.toFixed(2)), 
			total: parseFloat(total.toFixed(2)) 
		});
	},
}));
