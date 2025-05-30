import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import { Sparkles, TrendingUp, Star, ShoppingBag } from "lucide-react";

const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
	{ href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
	{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
	{ href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
	{ href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
	{ href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, loading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				
				{/* Hero Section */}
				<div className='text-center mb-20 animate-fade-in'>
					<div className='flex justify-center items-center gap-4 mb-6'>
						<div className='w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl 
									  flex items-center justify-center shadow-glow animate-pulse-glow'>
							<Sparkles className='w-6 h-6 text-white' />
						</div>
						<h1 className='text-5xl sm:text-7xl font-bold text-gradient-primary leading-tight'>
							Shonifity
						</h1>
						<div className='w-12 h-12 bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl 
									  flex items-center justify-center shadow-glow-accent animate-float'>
							<TrendingUp className='w-6 h-6 text-white' />
						</div>
					</div>
					
					<h2 className='text-4xl sm:text-6xl font-bold text-text-primary mb-6'>
						Shopping Experience
					</h2>
					
					<p className='text-xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed'>
						Discover premium quality products with our elegant modern design. 
						Experience the future of online shopping with our curated collections.
					</p>
					
					<div className='flex justify-center items-center gap-6 mb-12'>
						<div className='flex items-center gap-2 glass-card px-4 py-2 animate-slide-up'>
							<Star className='w-5 h-5 text-warning fill-current' />
							<span className='text-text-secondary font-medium'>Premium Quality</span>
						</div>
						<div className='flex items-center gap-2 glass-card px-4 py-2 animate-slide-up' style={{animationDelay: '0.1s'}}>
							<Sparkles className='w-5 h-5 text-primary-500' />
							<span className='text-text-secondary font-medium'>Latest Trends</span>
						</div>
						<div className='flex items-center gap-2 glass-card px-4 py-2 animate-slide-up' style={{animationDelay: '0.2s'}}>
							<ShoppingBag className='w-5 h-5 text-success' />
							<span className='text-text-secondary font-medium'>Fast Delivery</span>
						</div>
					</div>
				</div>

				{/* Categories Section */}
				<div className='mb-20'>
					<div className='text-center mb-12'>
						<h3 className='text-3xl sm:text-4xl font-bold text-text-primary mb-4'>
							Explore Our 
							<span className='text-gradient-primary ml-2'>Categories</span>
						</h3>
						<p className='text-lg text-text-secondary max-w-xl mx-auto'>
							Curated collections designed for modern lifestyle and exceptional taste
						</p>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{categories.map((category, index) => (
							<div key={category.name} 
								 className='animate-scale-in' 
								 style={{animationDelay: `${index * 0.1}s`}}>
								<CategoryItem category={category} />
							</div>
						))}
					</div>
				</div>

				{/* Featured Products Section */}
				{!loading && products.length > 0 && (
					<div className='animate-slide-up'>
						<div className='text-center mb-12'>
							<h3 className='text-3xl sm:text-4xl font-bold text-text-primary mb-4'>
								Featured 
								<span className='text-gradient-secondary ml-2'>Products</span>
							</h3>
							<p className='text-lg text-text-secondary max-w-xl mx-auto'>
								Handpicked items that represent the best of modern design and functionality
							</p>
						</div>
						<FeaturedProducts featuredProducts={products} />
					</div>
				)}

				{/* Stats Section */}
				<div className='mt-20 glass-card p-8 animate-fade-in'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
						<div className='group'>
							<div className='text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300'>
								10K+
							</div>
							<div className='text-text-secondary font-medium'>Happy Customers</div>
						</div>
						<div className='group'>
							<div className='text-4xl font-bold text-gradient-secondary mb-2 group-hover:scale-110 transition-transform duration-300'>
								500+
							</div>
							<div className='text-text-secondary font-medium'>Premium Products</div>
						</div>
						<div className='group'>
							<div className='text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300'>
								99%
							</div>
							<div className='text-text-secondary font-medium'>Satisfaction Rate</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
