import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);
	const [loadingProduct, setLoadingProduct] = useState(null);

	const { addToCart } = useCartStore();
	const { user } = useUserStore();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => 
			Math.min(prevIndex + itemsPerPage, featuredProducts.length - itemsPerPage)
		);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
	};

	const handleAddToCart = async (product) => {
		if (!user) {
			toast.error("Please login to add products to cart", { 
				icon: "🔐"
			});
			return;
		}

		setLoadingProduct(product._id);
		try {
			await addToCart(product);
		} catch (error) {
			console.error("Add to cart error:", error);
			toast.error("Failed to add to cart", {
				icon: "❌"
			});
		} finally {
			setLoadingProduct(null);
		}
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	if (!featuredProducts || featuredProducts.length === 0) {
		return null;
	}

	return (
		<div className='py-12'>
			<div className='container mx-auto px-4'>
				<div className='text-center mb-12'>
					<h2 className='text-4xl font-bold text-gradient-primary mb-4'>Featured Products</h2>
					<p className='text-neutral-600 max-w-2xl mx-auto'>
						Discover our handpicked selection of premium products that combine style, quality, and innovation
					</p>
				</div>
				
				<div className='relative'>
					<div className='overflow-hidden'>
						<div
							className='flex transition-transform duration-500 ease-in-out'
							style={{ transform: `translateX(-${(currentIndex / itemsPerPage) * 100}%)` }}
						>
							{featuredProducts?.map((product) => (
								<div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-3'>
									<div className='glass-card overflow-hidden h-full group hover:shadow-2xl 
												  transition-all duration-500 transform hover:scale-105 hover:-rotate-1'>
										{/* Product Image */}
										<div className='relative overflow-hidden'>
											<img
												src={product.image}
												alt={product.name}
												className='w-full h-48 object-cover transition-transform duration-700 
														 group-hover:scale-110'
												loading="lazy"
											/>
											<div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
														  opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
											
											{/* Price Badge */}
											<div className='absolute top-4 right-4 glass-card px-2 py-1 opacity-0 
														  group-hover:opacity-100 transform translate-x-8 
														  group-hover:translate-x-0 transition-all duration-300'>
												<span className='text-sm font-bold text-gradient-primary'>
													${product.price}
												</span>
											</div>
										</div>

										{/* Product Details */}
										<div className='p-6'>
											<div className='mb-4'>
												<h3 className='text-lg font-bold text-neutral-700 mb-2 
															 group-hover:text-primary-600 transition-colors duration-300 
															 line-clamp-2'>
													{product.name}
												</h3>
												
												{/* Rating */}
												<div className='flex items-center gap-2 mb-3'>
													<div className='flex items-center gap-1'>
														{[...Array(5)].map((_, i) => (
															<Star 
																key={i} 
																className={`w-3 h-3 ${i < 4 ? 'text-warning fill-current' : 'text-neutral-300'}`} 
															/>
														))}
													</div>
													<span className='text-xs text-neutral-500'>(4.2)</span>
												</div>

												<div className='flex items-center justify-between mb-4'>
													<span className='text-2xl font-bold text-gradient-primary'>
														${product.price}
													</span>
													<span className='text-sm text-neutral-400 line-through'>
														${(product.price * 1.2).toFixed(2)}
													</span>
												</div>
											</div>

											{/* Add to Cart Button */}
											<button
												onClick={() => handleAddToCart(product)}
												disabled={loadingProduct === product._id}
												className={`w-full btn-primary flex items-center justify-center gap-2 text-sm
														  ${loadingProduct === product._id 
															? 'opacity-70 cursor-not-allowed' 
															: 'hover:shadow-glow-lg'}`}
											>
												{loadingProduct === product._id ? (
													<>
														<div className='w-4 h-4 border-2 border-white/30 border-t-white 
																	  rounded-full animate-spin' />
														Adding...
													</>
												) : (
													<>
														<ShoppingCart className='w-4 h-4' />
														Add to Cart
													</>
												)}
											</button>
										</div>

										{/* Shine Effect */}
										<div className='absolute inset-0 opacity-0 group-hover:opacity-100 
													  transition-opacity duration-500 pointer-events-none'
											 style={{
												 background: 'linear-gradient(135deg, rgba(255, 111, 97, 0.1), rgba(74, 144, 226, 0.1))',
												 filter: 'blur(20px)',
												 transform: 'scale(1.1)'
											 }} />
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Navigation Buttons */}
					{featuredProducts.length > itemsPerPage && (
						<>
							<button
								onClick={prevSlide}
								disabled={isStartDisabled}
								className={`absolute top-1/2 -left-4 transform -translate-y-1/2 w-12 h-12 
										  rounded-full flex items-center justify-center transition-all duration-300 
										  shadow-lg backdrop-blur-sm border border-white/20 z-10
										  ${isStartDisabled 
											? "bg-neutral-200 text-neutral-400 cursor-not-allowed" 
											: "bg-white/80 text-neutral-700 hover:bg-white hover:scale-110 hover:shadow-glow"}`}
							>
								<ChevronLeft className='w-6 h-6' />
							</button>

							<button
								onClick={nextSlide}
								disabled={isEndDisabled}
								className={`absolute top-1/2 -right-4 transform -translate-y-1/2 w-12 h-12 
										  rounded-full flex items-center justify-center transition-all duration-300 
										  shadow-lg backdrop-blur-sm border border-white/20 z-10
										  ${isEndDisabled 
											? "bg-neutral-200 text-neutral-400 cursor-not-allowed" 
											: "bg-white/80 text-neutral-700 hover:bg-white hover:scale-110 hover:shadow-glow"}`}
							>
								<ChevronRight className='w-6 h-6' />
							</button>
						</>
					)}

					{/* Dots Indicator */}
					{featuredProducts.length > itemsPerPage && (
						<div className='flex justify-center mt-8 gap-2'>
							{Array.from({ length: Math.ceil(featuredProducts.length / itemsPerPage) }).map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentIndex(index * itemsPerPage)}
									className={`w-3 h-3 rounded-full transition-all duration-300 
											  ${currentIndex === index * itemsPerPage 
												? 'bg-gradient-to-r from-primary-500 to-secondary-500 scale-125' 
												: 'bg-neutral-300 hover:bg-neutral-400'}`}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default FeaturedProducts;
