import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Activity, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");
				setAnalyticsData(response.data.analyticsData);
				setDailySalesData(response.data.dailySalesData);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-16'>
				<div className='text-center'>
					<div className='w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4' />
					<p className='text-neutral-600 font-medium'>Loading analytics...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='w-full space-y-8'>
			{/* Stats Cards */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
				<AnalyticsCard
					title='Total Users'
					value={analyticsData.users.toLocaleString()}
					icon={Users}
					color='from-primary-500 to-primary-600'
					change='+12%'
					changeType='positive'
				/>
				<AnalyticsCard
					title='Total Products'
					value={analyticsData.products.toLocaleString()}
					icon={Package}
					color='from-secondary-500 to-secondary-600'
					change='+8%'
					changeType='positive'
				/>
				<AnalyticsCard
					title='Total Sales'
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
					color='from-success to-green-600'
					change='+15%'
					changeType='positive'
				/>
				<AnalyticsCard
					title='Total Revenue'
					value={`$${analyticsData.totalRevenue.toLocaleString()}`}
					icon={DollarSign}
					color='from-warning to-yellow-600'
					change='+23%'
					changeType='positive'
				/>
			</div>

			{/* Charts Section */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{/* Sales Trend Chart */}
				<motion.div
					className='glass-card p-6'
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<div className='flex items-center gap-3 mb-6'>
						<div className='w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl 
									  flex items-center justify-center shadow-glow'>
							<TrendingUp className='w-5 h-5 text-white' />
						</div>
						<div>
							<h3 className='text-lg font-bold text-neutral-700'>Sales Trend</h3>
							<p className='text-neutral-500 text-sm'>Daily sales and revenue overview</p>
						</div>
					</div>
					
					<ResponsiveContainer width='100%' height={300}>
						<LineChart data={dailySalesData}>
							<CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
							<XAxis dataKey='name' stroke='#6B7280' fontSize={12} />
							<YAxis yAxisId='left' stroke='#6B7280' fontSize={12} />
							<YAxis yAxisId='right' orientation='right' stroke='#6B7280' fontSize={12} />
							<Tooltip 
								contentStyle={{
									backgroundColor: 'rgba(255, 255, 255, 0.9)',
									border: 'none',
									borderRadius: '12px',
									boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
								}}
							/>
							<Legend />
							<Line
								yAxisId='left'
								type='monotone'
								dataKey='sales'
								stroke='#FF6F61'
								strokeWidth={3}
								activeDot={{ r: 6, fill: '#FF6F61' }}
								name='Sales'
							/>
							<Line
								yAxisId='right'
								type='monotone'
								dataKey='revenue'
								stroke='#4A90E2'
								strokeWidth={3}
								activeDot={{ r: 6, fill: '#4A90E2' }}
								name='Revenue ($)'
							/>
						</LineChart>
					</ResponsiveContainer>
				</motion.div>

				{/* Performance Overview */}
				<motion.div
					className='glass-card p-6'
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<div className='flex items-center gap-3 mb-6'>
						<div className='w-10 h-10 bg-gradient-to-r from-success to-green-600 rounded-xl 
									  flex items-center justify-center shadow-glow'>
							<Activity className='w-5 h-5 text-white' />
						</div>
						<div>
							<h3 className='text-lg font-bold text-neutral-700'>Performance</h3>
							<p className='text-neutral-500 text-sm'>Key performance indicators</p>
						</div>
					</div>

					<div className='space-y-4'>
						<div className='flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-200'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center'>
									<Users className='w-5 h-5 text-primary-600' />
								</div>
								<div>
									<p className='font-medium text-neutral-700'>Conversion Rate</p>
									<p className='text-sm text-neutral-500'>Users to customers</p>
								</div>
							</div>
							<div className='text-right'>
								<p className='text-2xl font-bold text-gradient-primary'>3.2%</p>
								<p className='text-sm text-success'>+0.5%</p>
							</div>
						</div>

						<div className='flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-200'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center'>
									<ShoppingCart className='w-5 h-5 text-secondary-600' />
								</div>
								<div>
									<p className='font-medium text-neutral-700'>Avg. Order Value</p>
									<p className='text-sm text-neutral-500'>Per transaction</p>
								</div>
							</div>
							<div className='text-right'>
								<p className='text-2xl font-bold text-gradient-secondary'>$84.50</p>
								<p className='text-sm text-success'>+12%</p>
							</div>
						</div>

						<div className='flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-200'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center'>
									<Calendar className='w-5 h-5 text-success' />
								</div>
								<div>
									<p className='font-medium text-neutral-700'>Monthly Growth</p>
									<p className='text-sm text-neutral-500'>Revenue increase</p>
								</div>
							</div>
							<div className='text-right'>
								<p className='text-2xl font-bold text-success'>+18.5%</p>
								<p className='text-sm text-success'>Excellent</p>
							</div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Quick Actions */}
			<motion.div
				className='glass-card p-6'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.6 }}
			>
				<h3 className='text-lg font-bold text-neutral-700 mb-4'>Quick Actions</h3>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<button className='btn-primary text-sm flex items-center justify-center gap-2'>
						<TrendingUp className='w-4 h-4' />
						Export Report
					</button>
					<button className='btn-secondary text-sm flex items-center justify-center gap-2'>
						<Activity className='w-4 h-4' />
						View Details
					</button>
					<button className='btn-ghost text-sm flex items-center justify-center gap-2'>
						<Calendar className='w-4 h-4' />
						Schedule Report
					</button>
				</div>
			</motion.div>
		</div>
	);
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color, change, changeType }) => (
	<motion.div
		className='glass-card p-6 group hover:shadow-glow transition-all duration-300 relative overflow-hidden'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='flex items-start justify-between mb-4'>
			<div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center 
						   shadow-lg group-hover:scale-110 transition-transform duration-300`}>
				<Icon className='w-6 h-6 text-white' />
			</div>
			{change && (
				<div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
							   ${changeType === 'positive' ? 'bg-green-100 text-success' : 'bg-red-100 text-error'}`}>
					<TrendingUp className={`w-3 h-3 ${changeType !== 'positive' ? 'rotate-180' : ''}`} />
					{change}
				</div>
			)}
		</div>
		
		<div>
			<p className='text-neutral-500 text-sm mb-1 font-medium'>{title}</p>
			<h3 className='text-3xl font-bold text-neutral-700 group-hover:text-gradient-primary transition-colors duration-300'>
				{value}
			</h3>
		</div>

		{/* Subtle background pattern */}
		<div className='absolute bottom-0 right-0 w-16 h-16 opacity-5'>
			<Icon className='w-full h-full text-neutral-800' />
		</div>
	</motion.div>
);
