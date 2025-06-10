import React from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '../context/CurrencyContext';
import { DollarSign, IndianRupee } from 'lucide-react';

const CurrencyToggle = () => {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <motion.div
      className="relative inline-flex items-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.button
        onClick={toggleCurrency}
        className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary-200 
                 rounded-full hover:bg-white hover:shadow-glow transition-all duration-300 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Currency Icons */}
        <div className="flex items-center space-x-1">
          <motion.div
            className={`p-1 rounded-full transition-all duration-300 ${
              currency === 'USD' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                : 'text-text-secondary'
            }`}
            animate={{ scale: currency === 'USD' ? 1.1 : 1 }}
          >
            <DollarSign size={14} />
          </motion.div>
          
          <motion.div
            className={`p-1 rounded-full transition-all duration-300 ${
              currency === 'INR' 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
                : 'text-text-secondary'
            }`}
            animate={{ scale: currency === 'INR' ? 1.1 : 1 }}
          >
            <IndianRupee size={14} />
          </motion.div>
        </div>

        {/* Currency Text */}
        <div className="flex items-center space-x-1">
          <motion.span
            className={`text-sm font-medium transition-all duration-300 ${
              currency === 'USD' ? 'text-green-600' : 'text-text-secondary'
            }`}
            animate={{ scale: currency === 'USD' ? 1.05 : 1 }}
          >
            USD
          </motion.span>
          
          <span className="text-text-secondary text-xs">/</span>
          
          <motion.span
            className={`text-sm font-medium transition-all duration-300 ${
              currency === 'INR' ? 'text-orange-600' : 'text-text-secondary'
            }`}
            animate={{ scale: currency === 'INR' ? 1.05 : 1 }}
          >
            INR
          </motion.span>
        </div>

        {/* Toggle Indicator */}
        <motion.div
          className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
          animate={{ 
            x: currency === 'USD' ? -8 : 8,
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileHover={{ opacity: 1, y: -40 }}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-darkBlue-600 text-white 
                 text-xs rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
      >
        Switch to {currency === 'USD' ? 'INR' : 'USD'}
      </motion.div>
    </motion.div>
  );
};

export default CurrencyToggle;