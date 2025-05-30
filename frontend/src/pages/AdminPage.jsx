import { BarChart, PlusCircle, ShoppingBasket, Settings, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle, color: "from-primary-500 to-primary-600" },
	{ id: "products", label: "Products", icon: ShoppingBasket, color: "from-accent-500 to-primary-500" },
	{ id: "analytics", label: "Analytics", icon: BarChart, color: "from-darkBlue-500 to-primary-500" },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	return (
		<div className='min-h-screen relative overflow-hidden'>
			{/* Background Elements */}
			<div className='absolute inset-0 pointer-events-none'>
				<div className='absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-primary-400/10 to-accent-400/10 
							  rounded-full blur-3xl animate-float' />
				<div className='absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-accent-400/10 to-darkBlue-400/10 
							  rounded-full blur-3xl animate-bounce-soft' />
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 
							  bg-gradient-to-br from-primary-400/5 to-accent-400/5 rounded-full blur-3xl animate-pulse' />
			</div>

			<div className='relative z-10 container mx-auto px-4 py-8'>
				{/* Header */}
				<motion.div
					className='text-center mb-12'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div className='flex justify-center mb-6'>
						<div className='w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl 
									  flex items-center justify-center shadow-glow animate-pulse-glow'>
							<Settings className='w-8 h-8 text-white' />
						</div>
					</div>
					<h1 className='text-4xl sm:text-5xl font-bold text-gradient-primary mb-4'>
						Admin Dashboard
					</h1>
					<p className='text-text-secondary max-w-2xl mx-auto'>
						Manage your Shonifity store, create products, analyze performance, and track your business growth
					</p>
				</motion.div>

				{/* Tab Navigation */}
				<motion.div
					className='flex justify-center mb-12'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<div className='glass-card p-2 inline-flex rounded-2xl'>
						{tabs.map((tab, index) => (
							<motion.button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center px-6 py-3 mx-1 rounded-xl font-medium transition-all duration-300 
										  relative overflow-hidden group ${
									activeTab === tab.id
										? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
										: "text-text-secondary hover:text-text-primary hover:bg-white/50"
								}`}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								whileHover={{ scale: activeTab === tab.id ? 1.05 : 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<tab.icon className='mr-2 h-5 w-5' />
								<span className='hidden sm:inline'>{tab.label}</span>
								<span className='sm:hidden'>{tab.label.split(' ')[0]}</span>
								
								{/* Glow effect for active tab */}
								{activeTab === tab.id && (
									<div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent 
												  rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
								)}
							</motion.button>
						))}
					</div>
				</motion.div>

				{/* Tab Content */}
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className='glass-card p-8 rounded-2xl'
				>
					{activeTab === "create" && (
						<div>
							<div className='flex items-center gap-3 mb-8'>
								<div className='w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl 
											  flex items-center justify-center shadow-glow'>
									<PlusCircle className='w-5 h-5 text-white' />
								</div>
								<div>
									<h2 className='text-2xl font-bold text-text-primary'>Create New Product</h2>
									<p className='text-text-secondary'>Add a new product to your store inventory</p>
								</div>
							</div>
							<CreateProductForm />
						</div>
					)}
					
					{activeTab === "products" && (
						<div>
							<div className='flex items-center gap-3 mb-8'>
								<div className='w-10 h-10 bg-gradient-to-r from-accent-500 to-primary-500 rounded-xl 
											  flex items-center justify-center shadow-glow-accent'>
									<ShoppingBasket className='w-5 h-5 text-white' />
								</div>
								<div>
									<h2 className='text-2xl font-bold text-text-primary'>Product Management</h2>
									<p className='text-text-secondary'>View, edit, and manage your product catalog</p>
								</div>
							</div>
							<ProductsList />
						</div>
					)}
					
					{activeTab === "analytics" && (
						<div>
							<div className='flex items-center gap-3 mb-8'>
								<div className='w-10 h-10 bg-gradient-to-r from-darkBlue-500 to-primary-500 rounded-xl 
											  flex items-center justify-center shadow-glow'>
									<TrendingUp className='w-5 h-5 text-white' />
								</div>
								<div>
									<h2 className='text-2xl font-bold text-text-primary'>Analytics & Insights</h2>
									<p className='text-text-secondary'>Track your store performance and sales data</p>
								</div>
							</div>
							<AnalyticsTab />
						</div>
					)}
				</motion.div>

				{/* Quick Stats Cards */}
				<motion.div
					className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<div className='glass-card p-6 text-center group hover:shadow-glow transition-all duration-300'>
						<div className='w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl 
									  flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
							<PlusCircle className='w-6 h-6 text-white' />
						</div>
						<h3 className='font-bold text-text-primary mb-2'>Quick Create</h3>
						<p className='text-text-secondary text-sm'>Add products instantly</p>
					</div>
					
					<div className='glass-card p-6 text-center group hover:shadow-glow-accent transition-all duration-300'>
						<div className='w-12 h-12 bg-gradient-to-r from-accent-500 to-primary-500 rounded-xl 
									  flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
							<ShoppingBasket className='w-6 h-6 text-white' />
						</div>
						<h3 className='font-bold text-text-primary mb-2'>Inventory</h3>
						<p className='text-text-secondary text-sm'>Manage your catalog</p>
					</div>
					
					<div className='glass-card p-6 text-center group hover:shadow-glow transition-all duration-300'>
						<div className='w-12 h-12 bg-gradient-to-r from-darkBlue-500 to-primary-500 rounded-xl 
									  flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
							<BarChart className='w-6 h-6 text-white' />
						</div>
						<h3 className='font-bold text-text-primary mb-2'>Analytics</h3>
						<p className='text-text-secondary text-sm'>Track performance</p>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default AdminPage;
