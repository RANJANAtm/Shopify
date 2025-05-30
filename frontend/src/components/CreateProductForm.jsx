import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, Image as ImageIcon } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
	});

	const { createProduct, loading } = useProductStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createProduct(newProduct);
			setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
		} catch {
			console.log("error creating a product");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setNewProduct({ ...newProduct, image: reader.result });
			};

			reader.readAsDataURL(file);
		}
	};

	return (
		<motion.div
			className='max-w-2xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
		>
			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* Product Name */}
					<div className='form-group'>
						<label htmlFor='name' className='block text-sm font-medium text-neutral-700 mb-2'>
							Product Name
						</label>
						<input
							type='text'
							id='name'
							name='name'
							value={newProduct.name}
							onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
							className='input-modern'
							placeholder='Enter product name'
							required
						/>
					</div>

					{/* Category */}
					<div className='form-group'>
						<label htmlFor='category' className='block text-sm font-medium text-neutral-700 mb-2'>
							Category
						</label>
						<select
							id='category'
							name='category'
							value={newProduct.category}
							onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
							className='input-modern'
							required
						>
							<option value=''>Select a category</option>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category.charAt(0).toUpperCase() + category.slice(1)}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Description */}
				<div className='form-group'>
					<label htmlFor='description' className='block text-sm font-medium text-neutral-700 mb-2'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='4'
						className='input-modern resize-none'
						placeholder='Describe your product...'
						required
					/>
				</div>

				{/* Price */}
				<div className='form-group'>
					<label htmlFor='price' className='block text-sm font-medium text-neutral-700 mb-2'>
						Price ($)
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						min='0'
						className='input-modern'
						placeholder='0.00'
						required
					/>
				</div>

				{/* Image Upload */}
				<div className='form-group'>
					<label className='block text-sm font-medium text-neutral-700 mb-2'>
						Product Image
					</label>
					<div className='flex items-center gap-4'>
						<input 
							type='file' 
							id='image' 
							className='sr-only' 
							accept='image/*' 
							onChange={handleImageChange} 
						/>
						<label
							htmlFor='image'
							className='btn-ghost cursor-pointer flex items-center gap-2'
						>
							<Upload className='w-5 h-5' />
							Upload Image
						</label>
						
						{newProduct.image && (
							<div className='flex items-center gap-2 text-success'>
								<ImageIcon className='w-5 h-5' />
								<span className='text-sm font-medium'>Image uploaded successfully</span>
							</div>
						)}
					</div>
					
					{/* Image Preview */}
					{newProduct.image && (
						<motion.div
							className='mt-4'
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							<div className='w-32 h-32 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg'>
								<img
									src={newProduct.image}
									alt='Product preview'
									className='w-full h-full object-cover'
								/>
							</div>
						</motion.div>
					)}
				</div>

				{/* Submit Button */}
				<motion.button
					type='submit'
					className='w-full btn-primary flex items-center justify-center gap-2'
					disabled={loading}
					whileHover={{ scale: loading ? 1 : 1.02 }}
					whileTap={{ scale: loading ? 1 : 0.98 }}
				>
					{loading ? (
						<>
							<Loader className='w-5 h-5 animate-spin' />
							Creating Product...
						</>
					) : (
						<>
							<PlusCircle className='w-5 h-5' />
							Create Product
						</>
					)}
				</motion.button>
			</form>

			{/* Success Animation */}
			{!loading && (
				<motion.div
					className='mt-8 text-center'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
				>
					<p className='text-neutral-500 text-sm'>
						Fill out the form above to add a new product to your store
					</p>
				</motion.div>
			)}
		</motion.div>
	);
};

export default CreateProductForm;
