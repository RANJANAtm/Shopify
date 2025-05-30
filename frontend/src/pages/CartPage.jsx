import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart, Package, Sparkles, ArrowLeft } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";

const CartPage = () => {
	const { cart } = useCartStore();

	return (
		<div className='py-8 md:py-16 relative'>
			{/* Background Elements */}
			<div className='absolute inset-0 pointer-events-none'>
				<div className='absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-primary-400/10 to-secondary-400/10 
							  rounded-full blur-2xl animate-float' />
				<div className='absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-secondary-400/10 to-success/10 
							  rounded-full blur-3xl animate-bounce-soft' />
			</div>

			<div className='mx-auto max-w-screen-xl px-4 2xl:px-0 relative z-10'>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex items-center gap-4 mb-4'>
						<Link to='/' className='btn-ghost p-2 rounded-lg'>
							<ArrowLeft className='w-5 h-5' />
						</Link>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl 
										  flex items-center justify-center shadow-glow'>
								<ShoppingCart className='w-5 h-5 text-white' />
							</div>
							<div>
								<h1 className='text-3xl font-bold text-neutral-700'>Shopping Cart</h1>
								<p className='text-neutral-500'>
									{cart.length === 0 ? 'Your cart is empty' : `${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className='mt-6 sm:mt-8 md:gap-8 lg:flex lg:items-start xl:gap-12'>
					<motion.div
						className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						{cart.length === 0 ? (
							<EmptyCartUI />
						) : (
							<div className='space-y-4'>
								{cart.map((item, index) => (
									<motion.div
										key={item._id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: index * 0.1 }}
									>
										<CartItem item={item} />
									</motion.div>
								))}
							</div>
						)}
						{cart.length > 0 && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.6 }}
							>
								<PeopleAlsoBought />
							</motion.div>
						)}
					</motion.div>

					{cart.length > 0 && (
						<motion.div
							className='mx-auto mt-8 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<OrderSummary />
							<GiftCouponCard />
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CartPage;

const EmptyCartUI = () => (
	<motion.div
		className='glass-card p-12 text-center'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='mb-8'>
			<div className='w-24 h-24 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full 
						  flex items-center justify-center mx-auto mb-6 animate-float'>
				<Package className='w-12 h-12 text-neutral-400' />
			</div>
			<h3 className='text-2xl font-bold text-neutral-700 mb-2'>Your cart is empty</h3>
			<p className='text-neutral-500 mb-8 max-w-md mx-auto'>
				Discover amazing products and add them to your cart to get started with your shopping journey.
			</p>
		</div>

		<div className='space-y-4'>
			<Link
				to='/'
				className='btn-primary inline-flex items-center gap-2'
			>
				<Sparkles className='w-5 h-5' />
				Start Shopping
			</Link>
			
			<div className='flex justify-center gap-8 text-sm text-neutral-500 mt-8'>
				<div className='flex items-center gap-2'>
					<div className='w-2 h-2 bg-success rounded-full' />
					<span>Free Shipping</span>
				</div>
				<div className='flex items-center gap-2'>
					<div className='w-2 h-2 bg-primary-500 rounded-full' />
					<span>Easy Returns</span>
				</div>
				<div className='flex items-center gap-2'>
					<div className='w-2 h-2 bg-secondary-500 rounded-full' />
					<span>24/7 Support</span>
				</div>
			</div>
		</div>
	</motion.div>
);
