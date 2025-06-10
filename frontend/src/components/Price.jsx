import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

const Price = ({ 
  price, 
  className = '', 
  showOriginal = false, 
  size = 'md',
  weight = 'normal'
}) => {
  const { formatPrice, currency } = useCurrency();

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm', 
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const formattedPrice = formatPrice(price);

  return (
    <span className={`${sizeClasses[size]} ${weightClasses[weight]} ${className}`}>
      {formattedPrice}
      {showOriginal && currency === 'INR' && (
        <span className="text-xs text-text-secondary ml-1">
          (${parseFloat(price).toFixed(2)})
        </span>
      )}
    </span>
  );
};

export default Price;