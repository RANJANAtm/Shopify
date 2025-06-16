import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

// Exchange rates (you can update these or fetch from an API)
const EXCHANGE_RATES = {
  USD_TO_INR: 83.12, // 1 USD = 83.12 INR (update as needed)
  INR_TO_USD: 0.012   // 1 INR = 0.012 USD
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    // Safe localStorage access with fallback
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return localStorage.getItem('selectedCurrency') || 'USD';
      } catch (error) {
        console.warn('localStorage not available:', error);
        return 'USD';
      }
    }
    return 'USD';
  });

  const [exchangeRates, setExchangeRates] = useState(EXCHANGE_RATES);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Safe localStorage save
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('selectedCurrency', currency);
      } catch (error) {
        console.warn('Could not save currency to localStorage:', error);
      }
    }
  }, [currency]);

  // Fetch live exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      if (isLoadingRates) return; // Prevent multiple concurrent requests
      
      setIsLoadingRates(true);
      try {
        // Using a free API for exchange rates
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) throw new Error('Failed to fetch exchange rates');
        
        const data = await response.json();
        if (data.rates?.INR) {
          const newRates = {
            USD_TO_INR: data.rates.INR,
            INR_TO_USD: 1 / data.rates.INR
          };
          setExchangeRates(newRates);
          // Only log once to avoid console spam in development
          if (!window.__EXCHANGE_RATES_LOGGED) {
            console.log('✅ Exchange rates updated successfully:', newRates);
            window.__EXCHANGE_RATES_LOGGED = true;
          }
        }
      } catch (error) {
        console.warn('Could not fetch live exchange rates, using defaults:', error);
        // Keep using the default rates
      } finally {
        setIsLoadingRates(false);
      }
    };

    // Fetch rates on component mount only
    fetchExchangeRates();
    
    // Fetch rates every hour
    const interval = setInterval(fetchExchangeRates, 3600000);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once on mount

  // Toggle between currencies
  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'INR' : 'USD');
  };

  // Convert price from USD to selected currency
  const convertPrice = (priceInUSD) => {
    const price = parseFloat(priceInUSD);
    if (isNaN(price)) return '0.00';
    
    if (currency === 'INR') {
      return (price * exchangeRates.USD_TO_INR).toFixed(2);
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
      return (numPrice * exchangeRates.INR_TO_USD).toFixed(2);
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
    exchangeRates,
    isLoadingRates
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