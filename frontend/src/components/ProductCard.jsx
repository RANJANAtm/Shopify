import toast from "react-hot-toast";
import { ShoppingCart, Heart, Star, Zap } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useState } from "react";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const [isLiked, setIsLiked] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleAddToCart = async () => {
		if (!user) {
			toast.error("Please login to add products to cart", { 
				id: "login",
				icon: "🔐"
			});
			return;
		}

		setIsLoading(true);
		try {
			await addToCart(product);
			// Don't show success toast here as it's already handled in the store
		} catch (error) {
			console.error("Add to cart error:", error);
			toast.error("Failed to add to cart", {
				icon: "❌"
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleLike = () => {
		setIsLiked(!isLiked);
		toast.success(isLiked ? "Removed from wishlist" : "Added to wishlist", {
			icon: isLiked ? "💔" : "💙"
		});
	};

	return (
		<div className='group relative product-card-modern overflow-hidden'>
			{/* Product Image */}
			<div className='relative overflow-hidden rounded-t-2xl'>
				<img 
					className='w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110' 
					src={product.image} 
					alt={product.name}
					loading="lazy"
				/>
				
				{/* Overlay Gradient */}
				<div className='absolute inset-0 bg-gradient-to-t from-darkBlue-900/20 via-transparent to-transparent 
							  opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
				
				{/* Quick Actions */}
				<div className='absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 
							  transform translate-x-8 group-hover:translate-x-0 transition-all duration-300'>
					<button
						onClick={handleLike}
						className={`w-10 h-10 rounded-full backdrop-blur-sm border border-white/20 
								  flex items-center justify-center transition-all duration-300 hover:scale-110
								  ${isLiked 
									? 'bg-primary-500 text-white shadow-glow' 
									: 'bg-white/80 text-text-secondary hover:bg-white'}`}
					>
						<Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
					</button>
				</div>

				{/* Price Badge */}
				<div className='absolute top-4 left-4 glass-card px-3 py-1 opacity-0 group-hover:opacity-100 
							  transform -translate-x-8 group-hover:translate-x-0 transition-all duration-300'>
					<span className='text-2xl font-bold text-gradient-primary'>${product.price}</span>
				</div>

				{/* Trending Badge */}
				<div className='absolute bottom-4 left-4 flex items-center gap-1 glass-card px-2 py-1 
							  opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 
							  transition-all duration-300 delay-100'>
					<Zap className='w-4 h-4 text-warning' />
					<span className='text-xs font-medium text-text-primary'>Trending</span>
				</div>
			</div>

			{/* Product Details */}
			<div className='p-6 bg-white'>
				<div className='mb-4'>
					<h5 className='text-xl font-bold text-text-primary mb-2 group-hover:text-primary-600 
								 transition-colors duration-300 line-clamp-2'>
						{product.name}
					</h5>
					
					{/* Rating */}
					<div className='flex items-center gap-2 mb-3'>
						<div className='flex items-center gap-1'>
							{[...Array(5)].map((_, i) => (
								<Star 
									key={i} 
									className={`w-4 h-4 ${i < 4 ? 'text-warning fill-current' : 'text-text-secondary/30'}`} 
								/>
							))}
						</div>
						<span className='text-sm text-text-secondary'>(4.2)</span>
					</div>

					<div className='flex items-center justify-between mb-4'>
						<div className='flex items-center gap-3'>
							<span className='text-3xl font-bold text-gradient-primary'>
								${product.price}
							</span>
							<span className='text-lg text-text-secondary line-through'>
								${(product.price * 1.3).toFixed(2)}
							</span>
						</div>
						<div className='glass-card px-2 py-1'>
							<span className='text-xs font-medium text-success'>23% OFF</span>
						</div>
					</div>
				</div>

				{/* Add to Cart Button */}
				<button
					className={`w-full btn-primary flex items-center justify-center gap-2 text-sm
							  ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-glow-lg'}`}
					onClick={handleAddToCart}
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
							Adding...
						</>
					) : (
						<>
							<ShoppingCart className='w-5 h-5' />
							Add to Cart
						</>
					)}
				</button>

				{/* Quick Buy Button */}
				<button className='w-full mt-2 btn-secondary text-sm flex items-center justify-center gap-2'>
					<Zap className='w-4 h-4' />
					Quick Buy
				</button>
			</div>

			{/* Hover Glow Effect */}
			<div className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
						  transition-opacity duration-300 pointer-events-none'
				 style={{
					 background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(127, 219, 255, 0.1))',
					 filter: 'blur(20px)',
					 transform: 'scale(1.1)'
				 }} />
		</div>
	);
};

export default ProductCard;
