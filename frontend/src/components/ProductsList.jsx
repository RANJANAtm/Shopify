import { motion } from "framer-motion";
import { Trash, Star, Edit, Eye, Package } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState } from "react";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();
	const [filter, setFilter] = useState("all");

	const filteredProducts = products?.filter(product => {
		if (filter === "featured") return product.isFeatured;
		if (filter === "regular") return !product.isFeatured;
		return true;
	}) || [];

	const handleDeleteProduct = async (productId, productName) => {
		if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
			try {
				await deleteProduct(productId);
			} catch (error) {
				console.error("Error deleting product:", error);
			}
		}
	};

	return (
		<motion.div
			className='w-full'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
		>
			{/* Filter Tabs */}
			<div className='flex items-center gap-4 mb-8'>
				<div className='flex items-center gap-2'>
					<Package className='w-5 h-5 text-neutral-600' />
					<span className='font-medium text-neutral-700'>Filter:</span>
				</div>
				<div className='flex bg-neutral-100 rounded-lg p-1'>
					{[
						{ key: "all", label: "All Products" },
						{ key: "featured", label: "Featured" },
						{ key: "regular", label: "Regular" }
					].map((tab) => (
						<button
							key={tab.key}
							onClick={() => setFilter(tab.key)}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
								filter === tab.key
									? "bg-white text-primary-600 shadow-sm"
									: "text-neutral-600 hover:text-neutral-800"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
				<div className='ml-auto text-sm text-neutral-500'>
					{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
				</div>
			</div>

			{/* Products Grid */}
			{filteredProducts.length === 0 ? (
				<div className='text-center py-16'>
					<div className='w-24 h-24 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full 
								  flex items-center justify-center mx-auto mb-6'>
						<Package className='w-12 h-12 text-neutral-400' />
					</div>
					<h3 className='text-xl font-bold text-neutral-700 mb-2'>No products found</h3>
					<p className='text-neutral-500'>
						{filter === "all" 
							? "Start by creating your first product" 
							: `No ${filter} products available`}
					</p>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{filteredProducts.map((product, index) => (
						<motion.div
							key={product._id}
							className='glass-card p-6 group hover:shadow-lg transition-all duration-300'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
						>
							{/* Product Image */}
							<div className='relative mb-4'>
								<div className='w-full h-48 rounded-xl overflow-hidden bg-neutral-100'>
									<img
										src={product.image}
										alt={product.name}
										className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
									/>
								</div>
								
								{/* Featured Badge */}
								{product.isFeatured && (
									<div className='absolute top-3 left-3 bg-gradient-to-r from-warning to-yellow-600 
												  text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1'>
										<Star className='w-3 h-3 fill-current' />
										Featured
									</div>
								)}
								
								{/* Quick Actions */}
								<div className='absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 
											  transform translate-x-8 group-hover:translate-x-0 transition-all duration-300'>
									<button
										onClick={() => toggleFeaturedProduct(product._id)}
										className={`w-10 h-10 rounded-full backdrop-blur-sm border border-white/20 
												  flex items-center justify-center transition-all duration-300 hover:scale-110
												  ${product.isFeatured 
													? 'bg-warning text-white shadow-glow' 
													: 'bg-white/80 text-neutral-600 hover:bg-white'}`}
										title={product.isFeatured ? "Remove from featured" : "Add to featured"}
									>
										<Star className={`w-5 h-5 ${product.isFeatured ? 'fill-current' : ''}`} />
									</button>
								</div>
							</div>

							{/* Product Details */}
							<div className='space-y-3'>
								<div>
									<h3 className='font-bold text-neutral-700 text-lg group-hover:text-primary-600 
												 transition-colors duration-300 line-clamp-2'>
										{product.name}
									</h3>
									<p className='text-neutral-500 text-sm capitalize'>
										{product.category}
									</p>
								</div>

								<div className='flex items-center justify-between'>
									<span className='text-2xl font-bold text-gradient-primary'>
										${product.price?.toFixed(2)}
									</span>
									<div className='flex items-center gap-1 text-neutral-400'>
										<Eye className='w-4 h-4' />
										<span className='text-xs'>ID: {product._id.slice(-6)}</span>
									</div>
								</div>

								{/* Actions */}
								<div className='flex items-center gap-2 pt-4 border-t border-neutral-200'>
									<button
										className='flex-1 btn-ghost text-sm flex items-center justify-center gap-2'
										title='Edit product'
									>
										<Edit className='w-4 h-4' />
										Edit
									</button>
									
									<button
										onClick={() => handleDeleteProduct(product._id, product.name)}
										className='w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 
												 hover:bg-red-100 transition-colors duration-200 group/btn'
										title='Delete product'
									>
										<Trash className='w-4 h-4 text-red-500 group-hover/btn:text-red-600 
													   transition-colors duration-200' />
									</button>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			)}
		</motion.div>
	);
};

export default ProductsList;
