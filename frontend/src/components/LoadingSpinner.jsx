import { Sparkles, ShoppingBag } from "lucide-react";

const LoadingSpinner = () => {
	return (
		<div className='flex items-center justify-center min-h-screen bg-neutral-50 relative overflow-hidden'>
			{/* Background Animation */}
			<div className='absolute inset-0'>
				<div className='absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 
							  rounded-full blur-3xl animate-float' />
				<div className='absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-secondary-400/20 to-primary-400/20 
							  rounded-full blur-3xl animate-bounce-soft' />
			</div>

			<div className='relative z-10 text-center'>
				{/* Main Loading Animation */}
				<div className='relative mb-8'>
					{/* Outer Ring */}
					<div className='w-24 h-24 border-4 border-neutral-200 rounded-full' />
					
					{/* Spinning Ring */}
					<div className='w-24 h-24 border-4 border-transparent border-t-primary-500 border-r-secondary-500 
								  animate-spin rounded-full absolute left-0 top-0' />
					
					{/* Inner Glow */}
					<div className='w-16 h-16 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full 
								  absolute top-4 left-4 animate-pulse' />
					
					{/* Center Icon */}
					<div className='absolute inset-0 flex items-center justify-center'>
						<ShoppingBag className='w-8 h-8 text-primary-500 animate-bounce' />
					</div>
				</div>

				{/* Loading Text */}
				<div className='space-y-4'>
					<div className='flex items-center justify-center gap-2'>
						<Sparkles className='w-5 h-5 text-primary-500 animate-pulse' />
						<h3 className='text-2xl font-bold text-gradient-primary'>ModernCart</h3>
						<Sparkles className='w-5 h-5 text-secondary-500 animate-pulse' style={{animationDelay: '0.5s'}} />
					</div>
					
					<p className='text-neutral-600 font-medium'>Loading your shopping experience...</p>
					
					{/* Dots Animation */}
					<div className='flex justify-center gap-2 mt-4'>
						<div className='w-2 h-2 bg-primary-500 rounded-full animate-bounce' />
						<div className='w-2 h-2 bg-secondary-500 rounded-full animate-bounce' style={{animationDelay: '0.1s'}} />
						<div className='w-2 h-2 bg-success rounded-full animate-bounce' style={{animationDelay: '0.2s'}} />
					</div>
				</div>

				{/* Glass Card */}
				<div className='glass-card p-6 mt-8 max-w-sm mx-auto'>
					<div className='text-sm text-neutral-500 space-y-2'>
						<div className='flex justify-between items-center'>
							<span>Connecting to server</span>
							<div className='w-2 h-2 bg-success rounded-full animate-pulse' />
						</div>
						<div className='flex justify-between items-center'>
							<span>Loading products</span>
							<div className='w-8 h-1 bg-neutral-200 rounded-full overflow-hidden'>
								<div className='w-full h-full bg-gradient-to-r from-primary-500 to-secondary-500 
											  animate-pulse rounded-full' />
							</div>
						</div>
						<div className='flex justify-between items-center'>
							<span>Preparing interface</span>
							<div className='w-2 h-2 bg-warning rounded-full animate-pulse' />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;
