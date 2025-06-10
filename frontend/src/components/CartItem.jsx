import { Minus, Plus, Trash, Heart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useState } from "react";
import toast from "react-hot-toast";
import Price from "./Price";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();
	const [isRemoving, setIsRemoving] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	const handleRemove = async () => {
		setIsRemoving(true);
		try {
			await removeFromCart(item._id);
			toast.success("Item removed from cart", { icon: "🗑️" });
		} catch (error) {
			console.error("Remove from cart error:", error);
			toast.error("Failed to remove item");
		} finally {
			setIsRemoving(false);
		}
	};

	const handleQuantityChange = async (newQuantity) => {
		if (newQuantity < 1) {
			handleRemove();
			return;
		}
		
		setIsUpdating(true);
		try {
			await updateQuantity(item._id, newQuantity);
		} catch (error) {
			console.error("Update quantity error:", error);
			toast.error("Failed to update quantity");
		} finally {
			setIsUpdating(false);
		}
	};

	const totalPrice = (item.price * item.quantity).toFixed(2);

	return (
		<div className='glass-card p-6 group hover:shadow-lg transition-all duration-300'>
			<div className='flex flex-col md:flex-row md:items-center gap-6'>
				{/* Product Image */}
				<div className='flex-shrink-0'>
					<div className='relative overflow-hidden rounded-xl w-24 h-24 md:w-32 md:h-32'>
						<img 
							className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
							src={item.image} 
							alt={item.name}
							loading="lazy"
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 
									  group-hover:opacity-100 transition-opacity duration-300' />
					</div>
				</div>

				{/* Product Info */}
				<div className='flex-1 min-w-0'>
					<div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
						<div className='flex-1'>
							<h3 className='text-lg font-semibold text-neutral-700 group-hover:text-primary-600 
										 transition-colors duration-300 line-clamp-2'>
								{item.name}
							</h3>
							{item.description && (
								<p className='text-sm text-neutral-500 mt-1 line-clamp-2'>
									{item.description}
								</p>
							)}
							<div className='flex items-center gap-4 mt-3'>
							<Price price={totalPrice} size="2xl" weight="bold" className="text-gradient-primary" />
							<span className='text-sm text-neutral-400'>
							 <Price price={item.price} /> each
							</span>
							</div>
						</div>
					</div>
				</div>

				{/* Quantity Controls */}
				<div className='flex flex-col sm:flex-row items-center gap-4'>
					<div className='flex items-center gap-3'>
						<label className='text-sm font-medium text-neutral-600'>Quantity:</label>
						<div className='flex items-center bg-neutral-100 rounded-lg p-1'>
							<button
								className={`w-8 h-8 flex items-center justify-center rounded-md hover:bg-white 
										 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
										 ${isUpdating ? 'cursor-not-allowed' : ''}`}
								onClick={() => handleQuantityChange(item.quantity - 1)}
								disabled={item.quantity <= 1 || isUpdating}
							>
								<Minus className='w-4 h-4 text-neutral-600' />
							</button>
							<span className='px-3 py-1 text-neutral-700 font-medium min-w-[2rem] text-center'>
								{isUpdating ? (
									<div className='w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin mx-auto' />
								) : (
									item.quantity
								)}
							</span>
							<button
								className={`w-8 h-8 flex items-center justify-center rounded-md hover:bg-white 
										 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
										 ${isUpdating ? 'cursor-not-allowed' : ''}`}
								onClick={() => handleQuantityChange(item.quantity + 1)}
								disabled={isUpdating}
							>
								<Plus className='w-4 h-4 text-neutral-600' />
							</button>
						</div>
					</div>

					{/* Action Buttons */}
					<div className='flex items-center gap-2'>
						<button
							className='w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-100 
									 hover:bg-neutral-200 transition-colors duration-200 group/btn'
							onClick={() => toast.success("Added to wishlist", { icon: "💖" })}
						>
							<Heart className='w-5 h-5 text-neutral-500 group-hover/btn:text-primary-500 
										   transition-colors duration-200' />
						</button>
						
						<button
							className={`w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 
									  hover:bg-red-100 transition-all duration-200 group/btn
									  ${isRemoving ? 'opacity-50 cursor-not-allowed' : ''}`}
							onClick={handleRemove}
							disabled={isRemoving}
						>
							{isRemoving ? (
								<div className='w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin' />
							) : (
								<Trash className='w-5 h-5 text-red-500 group-hover/btn:text-red-600 
											   transition-colors duration-200' />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Price Display */}
			<div className='md:hidden mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center'>
				<span className='text-neutral-600'>Total:</span>
				<Price price={totalPrice} size="xl" weight="bold" className="text-gradient-primary" />
			</div>
		</div>
	);
};

export default CartItem;
