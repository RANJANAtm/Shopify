import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";

import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";  
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

function App() {
	const { user, checkAuth, checkingAuth } = useUserStore();
	const { getCartItems } = useCartStore();
	
	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!user) return;
		// Small delay to ensure user is fully loaded
		const timer = setTimeout(() => {
			getCartItems();
		}, 100);
		return () => clearTimeout(timer);
	}, [getCartItems, user]);

	if (checkingAuth) return <LoadingSpinner />;

	return (
		<div className='min-h-screen bg-background-light text-text-primary relative overflow-hidden'>
			{/* Modern Elegant Background with Mesh Gradient */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-mesh-elegant opacity-40' />
				<div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-3xl animate-float' />
				<div className='absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-accent-400/20 to-primary-400/20 rounded-full blur-3xl animate-bounce-soft' />
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-success/10 to-warning/10 rounded-full blur-2xl animate-pulse' />
			</div>

			{/* Glass overlay for better readability */}
			<div className='fixed inset-0 bg-white/30 backdrop-blur-sm z-10' />

			<div className='relative z-20'>
				<Navbar />
				<main className='pt-20 min-h-screen'>
					<Routes>
						<Route path='/' element={<HomePage />} />
						<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
						<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
						<Route
							path='/secret-dashboard'
							element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
						/>
						<Route path='/category/:category' element={<CategoryPage />} />
						<Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
						<Route
							path='/purchase-success'
							element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
						/>
						<Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
					</Routes>
				</main>
			</div>
			
			<ChatBot />  
			<Toaster 
				position="top-right"
				toastOptions={{
					duration: 4000,
					style: {
						background: 'rgba(255, 255, 255, 0.95)',
						backdropFilter: 'blur(12px)',
						color: '#2C3E50',
						border: '1px solid rgba(30, 144, 255, 0.2)',
						borderRadius: '12px',
						padding: '16px',
						fontSize: '14px',
						fontWeight: '500',
					},
					success: {
						style: {
							background: 'rgba(46, 204, 113, 0.1)',
							border: '1px solid rgba(46, 204, 113, 0.3)',
							color: '#2ECC71',
						},
					},
					error: {
						style: {
							background: 'rgba(255, 99, 71, 0.1)',
							border: '1px solid rgba(255, 99, 71, 0.3)',
							color: '#FF6347',
						},
					},
				}}
			/>
		</div>
	);
}

export default App;
