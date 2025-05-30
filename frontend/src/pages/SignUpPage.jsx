import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader, Eye, EyeOff, Shield, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { signup, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		signup(formData);
	};

	// Password validation
	const passwordValidation = {
		minLength: formData.password.length >= 8,
		hasUpperCase: /[A-Z]/.test(formData.password),
		hasLowerCase: /[a-z]/.test(formData.password),
		hasNumber: /\d/.test(formData.password),
		passwordsMatch: formData.password === formData.confirmPassword && formData.confirmPassword !== "",
	};

	const isPasswordValid = Object.values(passwordValidation).every(Boolean);

	return (
		<div className='min-h-screen flex items-center justify-center px-4 relative overflow-hidden py-12'>
			{/* Background Elements */}
			<div className='absolute inset-0'>
				<div className='absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 
							  rounded-full blur-3xl animate-float' />
				<div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-secondary-400/20 to-primary-400/20 
							  rounded-full blur-3xl animate-bounce-soft' />
			</div>

			<div className='relative z-10 w-full max-w-md'>
				{/* Header */}
				<motion.div
					className='text-center mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div className='flex justify-center mb-4'>
						<div className='w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl 
									  flex items-center justify-center shadow-glow animate-pulse-glow'>
							<UserPlus className='w-8 h-8 text-white' />
						</div>
					</div>
					<h1 className='text-4xl font-bold text-gradient-primary mb-2'>Join Shonifity</h1>
					<p className='text-neutral-600'>Create your account and start shopping</p>
				</motion.div>

				{/* Sign Up Form */}
				<motion.div
					className='glass-card p-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Name Field */}
						<div className='form-group'>
							<label htmlFor='name' className='block text-sm font-medium text-neutral-700 mb-2'>
								Full Name
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<User className='h-5 w-5 text-neutral-400' />
								</div>
								<input
									id='name'
									type='text'
									required
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className='input-modern pl-10'
									placeholder='Enter your full name'
								/>
							</div>
						</div>

						{/* Email Field */}
						<div className='form-group'>
							<label htmlFor='email' className='block text-sm font-medium text-neutral-700 mb-2'>
								Email Address
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Mail className='h-5 w-5 text-neutral-400' />
								</div>
								<input
									id='email'
									type='email'
									required
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className='input-modern pl-10'
									placeholder='Enter your email'
								/>
							</div>
						</div>

						{/* Password Field */}
						<div className='form-group'>
							<label htmlFor='password' className='block text-sm font-medium text-neutral-700 mb-2'>
								Password
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-neutral-400' />
								</div>
								<input
									id='password'
									type={showPassword ? 'text' : 'password'}
									required
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									className='input-modern pl-10 pr-10'
									placeholder='Create a strong password'
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute inset-y-0 right-0 pr-3 flex items-center'
								>
									{showPassword ? (
										<EyeOff className='h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors' />
									) : (
										<Eye className='h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors' />
									)}
								</button>
							</div>
							
							{/* Password Validation */}
							{formData.password && (
								<div className='mt-2 space-y-1'>
									<div className='flex items-center gap-2 text-xs'>
										{passwordValidation.minLength ? (
											<Check className='w-3 h-3 text-success' />
										) : (
											<X className='w-3 h-3 text-error' />
										)}
										<span className={passwordValidation.minLength ? 'text-success' : 'text-error'}>
											At least 8 characters
										</span>
									</div>
									<div className='flex items-center gap-2 text-xs'>
										{passwordValidation.hasUpperCase ? (
											<Check className='w-3 h-3 text-success' />
										) : (
											<X className='w-3 h-3 text-error' />
										)}
										<span className={passwordValidation.hasUpperCase ? 'text-success' : 'text-error'}>
											One uppercase letter
										</span>
									</div>
									<div className='flex items-center gap-2 text-xs'>
										{passwordValidation.hasNumber ? (
											<Check className='w-3 h-3 text-success' />
										) : (
											<X className='w-3 h-3 text-error' />
										)}
										<span className={passwordValidation.hasNumber ? 'text-success' : 'text-error'}>
											One number
										</span>
									</div>
								</div>
							)}
						</div>

						{/* Confirm Password Field */}
						<div className='form-group'>
							<label htmlFor='confirmPassword' className='block text-sm font-medium text-neutral-700 mb-2'>
								Confirm Password
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-neutral-400' />
								</div>
								<input
									id='confirmPassword'
									type={showConfirmPassword ? 'text' : 'password'}
									required
									value={formData.confirmPassword}
									onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
									className='input-modern pl-10 pr-10'
									placeholder='Confirm your password'
								/>
								<button
									type='button'
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className='absolute inset-y-0 right-0 pr-3 flex items-center'
								>
									{showConfirmPassword ? (
										<EyeOff className='h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors' />
									) : (
										<Eye className='h-5 w-5 text-neutral-400 hover:text-neutral-600 transition-colors' />
									)}
								</button>
							</div>
							
							{/* Password Match Validation */}
							{formData.confirmPassword && (
								<div className='mt-2 flex items-center gap-2 text-xs'>
									{passwordValidation.passwordsMatch ? (
										<Check className='w-3 h-3 text-success' />
									) : (
										<X className='w-3 h-3 text-error' />
									)}
									<span className={passwordValidation.passwordsMatch ? 'text-success' : 'text-error'}>
										Passwords match
									</span>
								</div>
							)}
						</div>

						{/* Terms and Conditions */}
						<div className='flex items-start gap-3'>
							<input
								type='checkbox'
								required
								className='mt-1 rounded border-neutral-300 text-primary-500 focus:ring-primary-500 focus:ring-offset-0'
							/>
							<label className='text-sm text-neutral-600 leading-relaxed'>
								I agree to the{" "}
								<Link to='#' className='text-primary-600 hover:text-primary-500 font-medium'>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link to='#' className='text-primary-600 hover:text-primary-500 font-medium'>
									Privacy Policy
								</Link>
							</label>
						</div>

						{/* Submit Button */}
						<button
							type='submit'
							className='w-full btn-primary flex items-center justify-center gap-2'
							disabled={loading || !isPasswordValid}
						>
							{loading ? (
								<>
									<Loader className='w-5 h-5 animate-spin' />
									Creating Account...
								</>
							) : (
								<>
									<UserPlus className='w-5 h-5' />
									Create Account
								</>
							)}
						</button>
					</form>

					{/* Login Link */}
					<div className='mt-8 text-center'>
						<p className='text-neutral-600'>
							Already have an account?{" "}
							<Link 
								to='/login' 
								className='font-medium text-gradient-primary hover:opacity-80 transition-opacity 
										 inline-flex items-center gap-1'
							>
								Sign in here
								<ArrowRight className='w-4 h-4' />
							</Link>
						</p>
					</div>

					{/* Security Notice */}
					<div className='mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500'>
						<Shield className='w-4 h-4' />
						<span>Your information is secure and encrypted</span>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default SignUpPage;
