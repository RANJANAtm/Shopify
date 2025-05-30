import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { ArrowLeft, Filter, Grid, List, Search } from "lucide-react";

const CategoryPage = () => {
	const { fetchProductsByCategory, products, loading } = useProductStore();
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("name");
	const [viewMode, setViewMode] = useState("grid");

	const { category } = useParams();

	useEffect(() => {
		fetchProductsByCategory(category);
	}, [fetchProductsByCategory, category]);

	// Filter and sort products
	const filteredProducts = products?.filter(product =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase())
	) || [];

	const sortedProducts = [...filteredProducts].sort((a, b) => {
		switch (sortBy) {
			case "price-low":
				return a.price - b.price;
			case "price-high":
				return b.price - a.price;
			case "name":
				return a.name.localeCompare(b.name);
			default:
				return 0;
		}
	});

	const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1) || "Category";

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<div className='w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4' />
					<p className='text-neutral-600 font-medium'>Loading {categoryName}...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen relative'>
			{/* Background Elements */}
			<div className='absolute inset-0 pointer-events-none'>
				<div className='absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-primary-400/10 to-secondary-400/10 
							  rounded-full blur-3xl animate-float' />
				<div className='absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-secondary-400/10 to-success/10 
							  rounded-full blur-2xl animate-bounce-soft' />
			</div>

			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex items-center gap-4 mb-6'>
						<Link to='/' className='btn-ghost p-2 rounded-lg'>
							<ArrowLeft className='w-5 h-5' />
						</Link>
						<div>
							<motion.h1
								className='text-4xl sm:text-5xl font-bold text-gradient-primary'
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}
							>
								{categoryName}
							</motion.h1>
							<motion.p
								className='text-neutral-600 mt-2'
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.1 }}
							>
								{sortedProducts.length} products found
							</motion.p>
						</div>
					</div>

					{/* Filters and Search */}
					<motion.div
						className='glass-card p-6 mb-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<div className='flex flex-wrap items-center gap-4'>
							{/* Search */}
							<div className='flex-1 min-w-64'>
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400' />
									<input
										type='text'
										placeholder='Search products...'
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className='input-modern pl-10 w-full'
									/>
								</div>
							</div>

							{/* Sort */}
							<div className='flex items-center gap-2'>
								<Filter className='w-5 h-5 text-neutral-600' />
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className='input-modern min-w-36'
								>
									<option value="name">Name A-Z</option>
									<option value="price-low">Price: Low to High</option>
									<option value="price-high">Price: High to Low</option>
								</select>
							</div>

							{/* View Mode */}
							<div className='flex items-center bg-neutral-100 rounded-lg p-1'>
								<button
									onClick={() => setViewMode('grid')}
									className={`p-2 rounded-md transition-colors duration-200 ${
										viewMode === 'grid' 
											? 'bg-white text-primary-600 shadow-sm' 
											: 'text-neutral-600 hover:text-neutral-800'
									}`}
								>
									<Grid className='w-5 h-5' />
								</button>
								<button
									onClick={() => setViewMode('list')}
									className={`p-2 rounded-md transition-colors duration-200 ${
										viewMode === 'list' 
											? 'bg-white text-primary-600 shadow-sm' 
											: 'text-neutral-600 hover:text-neutral-800'
									}`}
								>
									<List className='w-5 h-5' />
								</button>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Products Grid */}
				<motion.div
					className={`grid gap-6 justify-items-center ${
						viewMode === 'grid' 
							? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
							: 'grid-cols-1 max-w-4xl mx-auto'
					}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					{sortedProducts.length === 0 ? (
						<div className='col-span-full text-center py-16'>
							<div className='w-24 h-24 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full 
										  flex items-center justify-center mx-auto mb-6'>
								<Search className='w-12 h-12 text-neutral-400' />
							</div>
							<h2 className='text-2xl font-bold text-neutral-700 mb-2'>
								{searchTerm ? 'No products match your search' : 'No products found'}
							</h2>
							<p className='text-neutral-500 mb-6'>
								{searchTerm 
									? `Try adjusting your search term "${searchTerm}" or browse other categories` 
									: 'This category is currently empty. Check back later for new products!'
								}
							</p>
							{searchTerm && (
								<button
									onClick={() => setSearchTerm('')}
									className='btn-secondary'
								>
									Clear Search
								</button>
							)}
						</div>
					) : (
						sortedProducts.map((product, index) => (
							<motion.div
								key={product._id}
								className={viewMode === 'list' ? 'w-full' : ''}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
							>
								<ProductCard product={product} />
							</motion.div>
						))
					)}
				</motion.div>

				{/* Results Summary */}
				{sortedProducts.length > 0 && (
					<motion.div
						className='mt-12 text-center'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.6 }}
					>
						<p className='text-neutral-500'>
							Showing {sortedProducts.length} of {products?.length || 0} products
							{searchTerm && (
								<span> matching "{searchTerm}"</span>
							)}
						</p>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default CategoryPage;
