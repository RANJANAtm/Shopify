// API Error Handler Utility
export const handleApiError = (error, defaultMessage = "Something went wrong") => {
  console.error("API Error:", error);
  
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || error.response.data?.error || defaultMessage;
  } else if (error.request) {
    // Request was made but no response received
    return "Network error. Please check your connection and try again.";
  } else {
    // Something else happened
    return error.message || defaultMessage;
  }
};

// Format price utility
export const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

// Format currency utility
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Debounce utility for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate email utility
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random ID utility
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Local storage utilities
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error getting from localStorage:", error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting to localStorage:", error);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },
};

// Truncate text utility
export const truncateText = (text, length = 100) => {
  if (!text) return "";
  return text.length <= length ? text : text.substr(0, length) + "...";
};

// Smooth scroll utility
export const smoothScrollTo = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};
