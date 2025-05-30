import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();

	return (
		<header className='fixed top-0 left-0 w-full glass-card border-0 shadow-lg z-50 transition-all duration-300'>
			<div className='container mx-auto px-4 py-4'>
				<div className='flex flex-wrap justify-between items-center'>
					<Link to='/' className='text-2xl font-bold text-gradient-primary items-center space-x-2 flex group'>
						<Sparkles className='w-8 h-8 text-primary-500 group-hover:animate-wiggle transition-all duration-300' />
						<span className='bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent'>
							Shonifity
						</span>
					</Link>

					<nav className='flex flex-wrap items-center gap-4'>
						<Link
							to={"/"}
							className='text-text-secondary hover:text-primary-500 transition-all duration-300 ease-in-out 
									 font-medium px-3 py-2 rounded-lg hover:bg-white/50 backdrop-blur-sm'
						>
							Home
						</Link>
						
						{user && (
							<Link
								to={"/cart"}
								className='relative group text-text-secondary hover:text-primary-500 transition-all duration-300 
										 ease-in-out font-medium px-3 py-2 rounded-lg hover:bg-white/50 backdrop-blur-sm flex items-center gap-2'
							>
								<ShoppingCart className='w-5 h-5 group-hover:scale-110 transition-transform duration-300' />
								<span className='hidden sm:inline'>Cart</span>
								{cart.length > 0 && (
									<span
										className='absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white 
												 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold
												 animate-bounce shadow-lg'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}
						
						{isAdmin && (
							<Link
								className='bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 
										 hover:to-primary-600 text-white px-4 py-2 rounded-xl font-medium
										 transition-all duration-300 ease-in-out flex items-center gap-2 shadow-lg
										 hover:shadow-glow transform hover:scale-105 active:scale-95'
								to={"/secret-dashboard"}
							>
								<Lock className='w-4 h-4' />
								<span className='hidden sm:inline'>Dashboard</span>
							</Link>
						)}

						{user ? (
							<button
								className='bg-white/70 hover:bg-white/90 text-text-primary hover:text-darkBlue-600 
										 py-2 px-4 rounded-xl flex items-center gap-2 transition-all duration-300 
										 ease-in-out border border-white/20 hover:border-primary-200 backdrop-blur-sm
										 shadow-lg hover:shadow-glow transform hover:scale-105 active:scale-95'
								onClick={logout}
							>
								<LogOut className='w-4 h-4' />
								<span className='hidden sm:inline font-medium'>Log Out</span>
							</button>
						) : (
							<div className='flex items-center gap-3'>
								<Link
									to={"/signup"}
									className='btn-primary flex items-center gap-2 text-sm'
								>
									<UserPlus className='w-4 h-4' />
									<span>Sign Up</span>
								</Link>
								<Link
									to={"/login"}
									className='btn-ghost flex items-center gap-2 text-sm text-text-primary'
								>
									<LogIn className='w-4 h-4' />
									<span>Login</span>
								</Link>
							</div>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
