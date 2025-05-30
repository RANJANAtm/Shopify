import { ArrowRight, CheckCircle, HandHeart, Package, Truck, Clock, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useCartStore();
	const [error, setError] = useState(null);

	useEffect(() => {
		const handleCheckoutSuccess = async (sessionId) => {
			try {
				await axios.post("/payments/checkout-success", {
					sessionId,
				});
				clearCart();
			} catch (error) {
				console.error("Checkout success error:", error);
				setError("Failed to process order completion");
			} finally {
				setIsProcessing(false);
			}
		};

		const sessionId = new URLSearchParams(window.location.search).get("session_id");
		if (sessionId) {
			handleCheckoutSuccess(sessionId);
		} else {
			setIsProcessing(false);
			setError("No session ID found in the URL");
		}
	}, [clearCart]);

	if (isProcessing) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<div className='w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4' />
					<p className='text-neutral-600 font-medium'>Processing your order...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='glass-card p-8 max-w-md w-full text-center'>
					<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
						<X className='w-8 h-8 text-red-500' />
					</div>
					<h2 className='text-xl font-bold text-neutral-700 mb-2'>Something went wrong</h2>
					<p className='text-neutral-600 mb-6'>{error}</p>
					<Link to='/' className='btn-primary'>
						Return to Home
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen flex items-center justify-center px-4 relative overflow-hidden'>
			{/* Confetti Animation */}
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={700}
				recycle={false}
			/>

			{/* Background Elements */}
			<div className='absolute inset-0 pointer-events-none'>
				<div className='absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-success/20 to-primary-400/20 
							  rounded-full blur-3xl animate-float' />
				<div className='absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 
							  rounded-full blur-3xl animate-bounce-soft' />
			</div>

			<motion.div
				className='max-w-lg w-full glass-card p-8 relative z-10'
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6 }}
			>
				{/* Success Icon */}
				<motion.div
					className='flex justify-center mb-6'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<div className='w-20 h-20 bg-gradient-to-r from-success to-green-600 rounded-full 
								  flex items-center justify-center shadow-glow animate-pulse-glow'>
						<CheckCircle className='w-12 h-12 text-white' />
					</div>
				</motion.div>

				{/* Success Message */}
				<motion.div
					className='text-center mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<h1 className='text-3xl font-bold text-gradient-primary mb-3'>
						Order Successful! 🎉
					</h1>
					<p className='text-neutral-600 mb-2'>
						Thank you for shopping with ModernCart! Your order is being processed.
					</p>
					<p className='text-sm text-success font-medium'>
						📧 Check your email for order confirmation and tracking details.
					</p>
				</motion.div>

				{/* Order Details */}
				<motion.div
					className='bg-gradient-to-r from-neutral-50 to-white rounded-xl p-6 mb-6 border border-neutral-200'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}
				>
					<div className='grid grid-cols-2 gap-4'>
						<div className='text-center'>
							<div className='w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2'>
								<Package className='w-5 h-5 text-primary-600' />
							</div>
							<p className='text-sm text-neutral-500'>Order Number</p>
							<p className='font-bold text-neutral-700'>#MC{Math.floor(Math.random() * 10000)}</p>
						</div>
						<div className='text-center'>
							<div className='w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-2'>
								<Truck className='w-5 h-5 text-secondary-600' />
							</div>
							<p className='text-sm text-neutral-500'>Estimated Delivery</p>
							<p className='font-bold text-neutral-700'>3-5 days</p>
						</div>
					</div>
				</motion.div>

				{/* Status Timeline */}
				<motion.div
					className='mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.8 }}
				>
					<h3 className='font-semibold text-neutral-700 mb-4 flex items-center gap-2'>
						<Clock className='w-5 h-5 text-primary-500' />
						Order Status
					</h3>
					<div className='space-y-3'>
						<div className='flex items-center gap-3'>
							<div className='w-2 h-2 bg-success rounded-full animate-pulse' />
							<span className='text-sm text-neutral-600'>Order received and confirmed</span>
						</div>
						<div className='flex items-center gap-3'>
							<div className='w-2 h-2 bg-warning rounded-full animate-pulse' />
							<span className='text-sm text-neutral-600'>Processing your order</span>
						</div>
						<div className='flex items-center gap-3'>
							<div className='w-2 h-2 bg-neutral-300 rounded-full' />
							<span className='text-sm text-neutral-400'>Preparing for shipment</span>
						</div>
					</div>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					className='space-y-3'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 1 }}
				>
					<button className='w-full btn-primary flex items-center justify-center gap-2'>
						<HandHeart className='w-5 h-5' />
						Thanks for choosing us!
					</button>
					
					<Link
						to='/'
						className='w-full btn-ghost flex items-center justify-center gap-2'
					>
						Continue Shopping
						<ArrowRight className='w-5 h-5' />
					</Link>
				</motion.div>

				{/* Rating Request */}
				<motion.div
					className='mt-6 pt-6 border-t border-neutral-200 text-center'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 1.2 }}
				>
					<p className='text-sm text-neutral-500 mb-3'>How was your shopping experience?</p>
					<div className='flex justify-center gap-1'>
						{[1, 2, 3, 4, 5].map((star) => (
							<button
								key={star}
								className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-warning/20 
										 transition-colors duration-200 group'
							>
								<Star className='w-5 h-5 text-neutral-300 group-hover:text-warning group-hover:fill-current 
											   transition-colors duration-200' />
							</button>
						))}
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default PurchaseSuccessPage;
