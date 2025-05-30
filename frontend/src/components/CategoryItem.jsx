import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CategoryItem = ({ category }) => {
	return (
		<div className='group relative overflow-hidden rounded-2xl h-80 w-full interactive-card'>
			<Link to={"/category" + category.href}>
				<div className='relative w-full h-full cursor-pointer'>
					{/* Image */}
					<img
						src={category.imageUrl}
						alt={category.name}
						className='w-full h-full object-cover transition-transform duration-700 ease-out 
								 group-hover:scale-110 group-hover:rotate-2'
						loading='lazy'
					/>
					
					{/* Gradient Overlays */}
					<div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10' />
					<div className='absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 
								  opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-15' />
					
					{/* Glass morphism card */}
					<div className='absolute bottom-0 left-0 right-0 p-6 z-20'>
						<div className='glass-card p-4 transform translate-y-4 group-hover:translate-y-0 
									  transition-transform duration-500'>
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='text-white text-2xl font-bold mb-2 group-hover:text-gradient-primary 
										 transition-all duration-300'>
										{category.name}
									</h3>
									<p className='text-white/80 text-sm flex items-center gap-2'>
										<Sparkles className='w-4 h-4 text-primary-400' />
										Explore Collection
									</p>
								</div>
								<div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center 
											  justify-center transform group-hover:rotate-45 group-hover:bg-primary-500/80
											  transition-all duration-300'>
									<ArrowRight className='w-6 h-6 text-white' />
								</div>
							</div>
						</div>
					</div>

					{/* Floating Elements */}
					<div className='absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full 
								  flex items-center justify-center opacity-0 group-hover:opacity-100 
								  transform scale-50 group-hover:scale-100 transition-all duration-500 delay-200 z-20'>
						<Sparkles className='w-4 h-4 text-white animate-pulse' />
					</div>

					{/* Hover Line Effect */}
					<div className='absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 
								  w-0 group-hover:w-full transition-all duration-500 z-30'></div>
				</div>
			</Link>
		</div>
	);
};

export default CategoryItem;
