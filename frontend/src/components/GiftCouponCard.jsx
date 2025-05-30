import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { Gift, Tag, X, Check } from "lucide-react";

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const [isApplying, setIsApplying] = useState(false);
	const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	useEffect(() => {
		getMyCoupon();
	}, [getMyCoupon]);

	useEffect(() => {
		if (coupon) setUserInputCode(coupon.code);
	}, [coupon]);

	const handleApplyCoupon = async () => {
		if (!userInputCode.trim()) return;
		
		setIsApplying(true);
		try {
			await applyCoupon(userInputCode.trim());
		} catch (error) {
			console.error("Apply coupon error:", error);
		} finally {
			setIsApplying(false);
		}
	};

	const handleRemoveCoupon = async () => {
		try {
			await removeCoupon();
			setUserInputCode("");
		} catch (error) {
			console.error("Remove coupon error:", error);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleApplyCoupon();
		}
	};

	return (
		<motion.div
			className='glass-card p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			{/* Header */}
			<div className='flex items-center gap-3 mb-6'>
				<div className='w-8 h-8 bg-gradient-to-r from-warning to-yellow-600 rounded-lg 
							  flex items-center justify-center'>
					<Gift className='w-4 h-4 text-white' />
				</div>
				<h3 className='text-lg font-bold text-neutral-700'>Promo Code</h3>
			</div>

			{/* Coupon Input */}
			<div className='space-y-4'>
				<div>
					<label htmlFor='voucher' className='block text-sm font-medium text-neutral-700 mb-2'>
						Have a voucher or gift card?
					</label>
					<div className='relative'>
						<input
							type='text'
							id='voucher'
							className='input-modern pl-10 pr-4'
							placeholder='Enter your promo code'
							value={userInputCode}
							onChange={(e) => setUserInputCode(e.target.value)}
							onKeyPress={handleKeyPress}
							disabled={isCouponApplied}
						/>
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<Tag className='h-5 w-5 text-neutral-400' />
						</div>
					</div>
				</div>

				{/* Apply Button */}
				{!isCouponApplied && (
					<motion.button
						type='button'
						className={`w-full btn-secondary flex items-center justify-center gap-2 text-sm
								  ${isApplying || !userInputCode.trim() ? 'opacity-70 cursor-not-allowed' : ''}`}
						whileHover={{ scale: !isApplying && userInputCode.trim() ? 1.02 : 1 }}
						whileTap={{ scale: !isApplying && userInputCode.trim() ? 0.98 : 1 }}
						onClick={handleApplyCoupon}
						disabled={isApplying || !userInputCode.trim()}
					>
						{isApplying ? (
							<>
								<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
								Applying...
							</>
						) : (
							<>
								<Check className='w-4 h-4' />
								Apply Code
							</>
						)}
					</motion.button>
				)}
			</div>

			{/* Applied Coupon Display */}
			{isCouponApplied && coupon && (
				<motion.div
					className='mt-6 p-4 bg-gradient-to-r from-success/10 to-green-100 rounded-xl border border-success/20'
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
				>
					<div className='flex items-center justify-between mb-3'>
						<div className='flex items-center gap-2'>
							<div className='w-6 h-6 bg-success rounded-full flex items-center justify-center'>
								<Check className='w-4 h-4 text-white' />
							</div>
							<span className='font-medium text-success'>Coupon Applied!</span>
						</div>
						<button
							onClick={handleRemoveCoupon}
							className='w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center 
									 justify-center transition-colors duration-200 group'
						>
							<X className='w-4 h-4 text-red-600 group-hover:text-red-700' />
						</button>
					</div>

					<div className='flex items-center justify-between'>
						<span className='text-sm text-neutral-600'>Code: <strong>{coupon.code}</strong></span>
						<span className='text-sm font-bold text-success'>{coupon.discountPercentage}% OFF</span>
					</div>
				</motion.div>
			)}

			{/* Available Coupon Display */}
			{coupon && !isCouponApplied && (
				<motion.div
					className='mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200'
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div className='flex items-center gap-2 mb-2'>
						<Gift className='w-5 h-5 text-primary-500' />
						<span className='font-medium text-neutral-700'>Available Coupon</span>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-sm text-neutral-600'>Code: <strong>{coupon.code}</strong></span>
						<span className='text-sm font-bold text-gradient-primary'>{coupon.discountPercentage}% OFF</span>
					</div>
				</motion.div>
			)}

			{/* Help Text */}
			<div className='mt-4 text-xs text-neutral-500 text-center'>
				💡 Promo codes are case-sensitive and cannot be combined with other offers
			</div>
		</motion.div>
	);
};

export default GiftCouponCard;
