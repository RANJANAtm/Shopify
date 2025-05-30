import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader, Eye, EyeOff, Shield } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { login, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		login(email, password);
	};

	return (
		<div className='min-h-screen flex items-center justify-center px-4 relative overflow-hidden'>
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
							<LogIn className='w-8 h-8 text-white' />
						</div>
					</div>
					<h1 className='text-4xl font-bold text-gradient-primary mb-2'>Welcome Back</h1>
					<p className='text-neutral-600'>Sign in to your account to continue shopping</p>
				</motion.div>

				{/* Login Form */}
				<motion.div
					className='glass-card p-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<form onSubmit={handleSubmit} className='space-y-6'>
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
									value={email}
									onChange={(e) => setEmail(e.target.value)}
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
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className='input-modern pl-10 pr-10'
									placeholder='Enter your password'
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
						</div>

						{/* Remember Me & Forgot Password */}
						<div className='flex items-center justify-between'>
							<label className='flex items-center cursor-pointer'>
								<input type='checkbox' className='rounded border-neutral-300 text-primary-500 
													 focus:ring-primary-500 focus:ring-offset-0' />
								<span className='ml-2 text-sm text-neutral-600'>Remember me</span>
							</label>
							<Link to='#' className='text-sm text-primary-600 hover:text-primary-500 font-medium 
												 transition-colors duration-200'>
								Forgot password?
							</Link>
						</div>

						{/* Submit Button */}
						<button
							type='submit'
							className='w-full btn-primary flex items-center justify-center gap-2'
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='w-5 h-5 animate-spin' />
									Signing In...
								</>
							) : (
								<>
									<LogIn className='w-5 h-5' />
									Sign In
								</>
							)}
						</button>
					</form>

					{/* Sign Up Link */}
					<div className='mt-8 text-center'>
						<p className='text-neutral-600'>
							Don't have an account?{" "}
							<Link 
								to='/signup' 
								className='font-medium text-gradient-primary hover:opacity-80 transition-opacity 
										 inline-flex items-center gap-1'
							>
								Create one now
								<ArrowRight className='w-4 h-4' />
							</Link>
						</p>
					</div>

					{/* Security Notice */}
					<div className='mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500'>
						<Shield className='w-4 h-4' />
						<span>Your data is protected with 256-bit SSL encryption</span>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default LoginPage;
