import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

// Exchange rates (you can update these or fetch from an API)
const EXCHANGE_RATES = {
  USD_TO_INR: 83.12, // 1 USD = 83.12 INR (update as needed)
  INR_TO_USD: 0.012   // 1 INR = 0.012 USD
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    // Get saved currency from localStorage or default to USD
    return localStorage.getItem('selectedCurrency') || 'USD';
  });

  // Save currency selection to localStorage
  useEffect(() => {
    localStorage.setItem('selectedCurrency', currency);
  }, [currency]);

  // Toggle between currencies
  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'INR' : 'USD');
  };

  // Convert price from USD to selected currency
  const convertPrice = (priceInUSD) => {
    const price = parseFloat(priceInUSD);
    if (isNaN(price)) return '0.00';
    
    if (currency === 'INR') {
      return (price * EXCHANGE_RATES.USD_TO_INR).toFixed(2);
    }
    return price.toFixed(2);
  };

  // Format price with currency symbol
  const formatPrice = (priceInUSD) => {
    const convertedPrice = convertPrice(priceInUSD);
    const symbol = currency === 'USD' ? '$' : '₹';
    
    if (currency === 'INR') {
      // Indian number formatting with commas
      return `${symbol}${parseFloat(convertedPrice).toLocaleString('en-IN')}`;
    } else {
      // US number formatting
      return `${symbol}${parseFloat(convertedPrice).toLocaleString('en-US')}`;
    }
  };

  // Convert from any currency to USD (for backend storage)
  const convertToUSD = (price, fromCurrency = currency) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return 0;
    
    if (fromCurrency === 'INR') {
      return (numPrice * EXCHANGE_RATES.INR_TO_USD).toFixed(2);
    }
    return numPrice.toFixed(2);
  };

  const value = {
    currency,
    setCurrency,
    toggleCurrency,
    convertPrice,
    formatPrice,
    convertToUSD,
    exchangeRates: EXCHANGE_RATES
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;