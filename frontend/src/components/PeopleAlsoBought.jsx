import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const PeopleAlsoBought = () => {
	const [recommendations, setRecommendations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const res = await axios.get("/products/recommendations");
				setRecommendations(res.data || []);
			} catch (error) {
				console.error("Error fetching recommendations:", error);
				// Don't show error toast for recommendations as it's not critical
				setRecommendations([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecommendations();
	}, []);

	if (isLoading) {
		return (
			<div className='mt-12'>
				<div className='glass-card p-8'>
					<div className='flex items-center justify-center'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500'></div>
						<span className='ml-3 text-neutral-600'>Loading recommendations...</span>
					</div>
				</div>
			</div>
		);
	}

	if (!recommendations || recommendations.length === 0) {
		return null; // Don't show anything if no recommendations
	}

	return (
		<motion.div 
			className='mt-12'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
		>
			{/* Header */}
			<div className='flex items-center gap-3 mb-8'>
				<div className='w-10 h-10 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-xl 
							  flex items-center justify-center shadow-glow'>
					<Users className='w-5 h-5 text-white' />
				</div>
				<div>
					<h3 className='text-2xl font-bold text-gradient-secondary'>People also bought</h3>
					<p className='text-neutral-500 text-sm'>Recommended based on your cart items</p>
				</div>
			</div>

			{/* Products Grid */}
			<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
				{recommendations.slice(0, 3).map((product, index) => (
					<motion.div
						key={product._id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
					>
						<div className='relative'>
							<ProductCard product={product} />
							{/* Recommendation Badge */}
							<div className='absolute -top-2 -right-2 z-10'>
								<div className='w-8 h-8 bg-gradient-to-r from-warning to-yellow-600 rounded-full 
											  flex items-center justify-center shadow-lg animate-pulse'>
									<Sparkles className='w-4 h-4 text-white' />
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* View More Button */}
			{recommendations.length > 3 && (
				<motion.div 
					className='text-center mt-8'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<button className='btn-ghost'>
						View More Recommendations
					</button>
				</motion.div>
			)}
		</motion.div>
	);
};

export default PeopleAlsoBought;
