import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../lib/axios";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  ShoppingBag,
  Package,
  RotateCcw,
  Minimize2,
  Maximize2
} from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Shonifity shopping assistant. How can I help you today? ✨",
      sender: "bot",
      timestamp: new Date(),
      type: "greeting",
      suggestions: ["Show me products", "Track my order", "Help with returns", "Current deals"]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Send message to backend API with fallback to local responses
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    const messageText = inputText;
    // Clear input and suggestions
    setInputText("");
    setSuggestions([]);
    
    // Show loading indicator
    setIsLoading(true);
    
    try {
      // Try to send message to backend first
      console.log('🚀 Sending message to backend:', messageText);
      const response = await axios.post("/chatbot/message", {
        message: messageText
      });
      console.log('✅ Backend response:', response.data);
      
      // Add bot response from backend
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: "bot",
        cached: response.data.cached,
        dataType: response.data.dataType, // Add dataType for special formatting
        queryUsed: response.data.queryUsed, // Add query info
        timestamp: new Date(),
        suggestions: response.data.suggestions || []
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Backend API error, using local responses:", error);
      
      // Fallback to local intelligent responses
      setTimeout(() => {
        const botResponse = getBotResponse(messageText);
        const botMessage = {
          id: Date.now() + 1,
          text: botResponse.text,
          sender: "bot",
          timestamp: new Date(),
          type: botResponse.type,
          suggestions: botResponse.suggestions,
          isLocal: true
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
        }
      }, 800 + Math.random() * 1000);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change and fetch suggestions
  const handleInputChange = async (e) => {
    const text = e.target.value;
    setInputText(text);
    
    // Get suggestions if text is long enough
    if (text.length > 2) {
      try {
        // Try to get suggestions from backend
        const handler = setTimeout(async () => {
          try {
            const response = await axios.get(`/chatbot/suggestions?query=${encodeURIComponent(text)}`);
            if (response.data.suggestions && response.data.suggestions.length > 0) {
              setSuggestions(response.data.suggestions);
            } else {
              // Fallback to local suggestions
              setSuggestions(getLocalSuggestions(text));
            }
          } catch (error) {
            // Fallback to local suggestions
            setSuggestions(getLocalSuggestions(text));
          }
        }, 500);
        
        return () => clearTimeout(handler);
      } catch (error) {
        setSuggestions(getLocalSuggestions(text));
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle key press in input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Apply suggestion to input
  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // Handle pre-defined suggestion click - Updated to use backend API
  const handlePreSuggestionClick = async (suggestion) => {
    const userMessage = {
      id: Date.now(),
      text: suggestion,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Try to send message to backend first (same as handleSendMessage)
      console.log('🚀 Sending suggestion to backend:', suggestion);
      const response = await axios.post("/chatbot/message", {
        message: suggestion
      });
      console.log('✅ Backend response for suggestion:', response.data);
      
      // Add bot response from backend
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: "bot",
        cached: response.data.cached,
        dataType: response.data.dataType, // Add dataType for special formatting
        queryUsed: response.data.queryUsed, // Add query info
        timestamp: new Date(),
        suggestions: response.data.suggestions || []
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Backend API error for suggestion, using local response:", error);
      
      // Fallback to local response
      const botResponse = getBotResponse(suggestion);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse.text,
        sender: "bot",
        timestamp: new Date(),
        type: botResponse.type,
        suggestions: botResponse.suggestions,
        isLocal: true
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  // Local intelligent responses (fallback)
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    const responses = {
      greeting: {
        text: "Hello! Welcome to Shonifity. I can help you find products, check order status, or answer any questions about our premium shopping experience. 🛍️",
        type: "greeting",
        suggestions: ["Show me products", "Track my order", "Help with returns", "Current deals"]
      },
      products: {
        text: "We have an amazing collection of premium products including electronics, fashion, home & garden items, and more. What catches your interest today? ✨",
        type: "product_inquiry",
        suggestions: ["Electronics", "Fashion", "Home & Garden", "View all categories", "Popular items"]
      },
      orders: {
        text: "I'm here to help with your orders! You can track them from your account dashboard or I can guide you through the process. 📦",
        type: "order_inquiry",
        suggestions: ["Track order", "Order history", "Contact support", "Shipping info"]
      },
      returns: {
        text: "Our hassle-free return policy allows returns within 30 days. Items must be in original condition. Let me help you get started! 🔄",
        type: "return_inquiry",
        suggestions: ["Start return", "Return policy", "Contact support", "Refund status"]
      },
      discounts: {
        text: "Great question! We frequently have seasonal sales and exclusive discount coupons. Check our homepage for the latest deals! 🎉",
        type: "discount_inquiry",
        suggestions: ["View current deals", "Sign up for newsletter", "Coupon codes", "Flash sales"]
      },
      sizing: {
        text: "For sizing, each product page has detailed size guides and customer reviews. I recommend checking both for the perfect fit! 📏",
        type: "sizing_inquiry",
        suggestions: ["Size guide", "Customer reviews", "Contact support", "Size chart"]
      },
      payment: {
        text: "We accept all major credit cards, PayPal, and other secure payment methods. Your transactions are always encrypted and secure! 🔒",
        type: "payment_inquiry",
        suggestions: ["Payment methods", "Security info", "Billing help", "Payment issues"]
      },
      shipping: {
        text: "We offer fast and reliable shipping options including standard, express, and overnight delivery. Free shipping on orders over $50! 🚚",
        type: "shipping_inquiry",
        suggestions: ["Shipping rates", "Delivery time", "Track package", "International shipping"]
      }
    };

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return responses.greeting;
    } else if (message.includes("product") || message.includes("item") || message.includes("buy") || message.includes("shop")) {
      return responses.products;
    } else if (message.includes("order") || message.includes("track")) {
      return responses.orders;
    } else if (message.includes("return") || message.includes("refund")) {
      return responses.returns;
    } else if (message.includes("discount") || message.includes("coupon") || message.includes("sale") || message.includes("deal")) {
      return responses.discounts;
    } else if (message.includes("size") || message.includes("fit")) {
      return responses.sizing;
    } else if (message.includes("payment") || message.includes("pay") || message.includes("credit")) {
      return responses.payment;
    } else if (message.includes("ship") || message.includes("deliver")) {
      return responses.shipping;
    }
    
    return {
      text: "Thank you for reaching out! I'm here to help with products, orders, shipping, returns, or any other questions. What would you like to know? 😊",
      type: "general_help",
      suggestions: ["Products", "Orders", "Returns", "Contact support", "Current deals"]
    };
  };

  // Local suggestions (fallback)
  const getLocalSuggestions = (text) => {
    const suggestions = [
      "Show me popular products",
      "Track my order",
      "Help with returns",
      "Current deals and discounts",
      "Size guide",
      "Payment methods",
      "Shipping information",
      "Contact customer support",
      "View my account",
      "Product recommendations"
    ];
    
    return suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(text.toLowerCase())
    ).slice(0, 3);
  };

  // Format markdown text to JSX
  const formatMessage = (text) => {
    if (!text) return text;
    
    // Simple markdown parser for chatbot responses
    let formatted = text;
    
    // Handle the specific patterns from the user's example
    
    // 1. Handle "📊 **Live Data Result:**" pattern
    formatted = formatted.replace(/📊\s*\*\*Live Data Result:\*\*/g, 
      '<div class="bg-blue-50 border-l-4 border-blue-400 p-2 mb-2 rounded flex items-center"><span class="text-blue-800 font-bold">📊 Live Data Result:</span></div>');
    
    // 2. Handle "**Total number of X**: **Y**" pattern
    formatted = formatted.replace(/\*\*Total number of (.*?)\*\*:\s*\*\*(\d+)\*\*/g, 
      '<div class="bg-green-50 border-l-4 border-green-400 p-2 my-1 rounded"><span class="text-green-800 font-semibold">Total number of $1: </span><span class="text-green-900 font-bold text-lg">$2</span></div>');
    
    // 3. Handle "*Query executed: Intent: X*" pattern
    formatted = formatted.replace(/\*Query executed: Intent: (.*?)\*/g, 
      '<div class="text-xs text-gray-500 mt-1 italic bg-gray-100 px-2 py-1 rounded">Query executed: Intent: $1</div>');
    
    // 4. Handle remaining **bold** text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-gray-800">$1</span>');
    
    // 5. Handle remaining *italic* text
    formatted = formatted.replace(/\*([^*]+?)\*/g, '<span class="italic text-gray-600">$1</span>');
    
    // 6. Add line breaks
    formatted = formatted.replace(/\n/g, '<br />');
    
    return formatted;
  };

  // Render formatted message as HTML
  const renderMessage = (text) => {
    const formattedText = formatMessage(text);
    return (
      <div 
        className="text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    );
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case "product_inquiry":
        return <ShoppingBag size={14} className="text-primary-500" />;
      case "order_inquiry":
        return <Package size={14} className="text-accent-500" />;
      case "return_inquiry":
        return <RotateCcw size={14} className="text-warning" />;
      default:
        return <Sparkles size={14} className="text-primary-400" />;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "auto" : "650px"
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-96 max-w-[calc(100vw-2.5rem)] glass-card shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-primary-200 bg-gradient-to-r from-darkBlue-500 to-primary-500 text-white rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-glow">
                    <Bot size={24} className="text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white animate-pulse shadow-lg"></div>
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg">Shonifity Assistant</h3>
                  <p className="text-white/80 text-sm flex items-center gap-1">
                    <Sparkles size={12} className="animate-pulse" />
                    Online & Ready to Help
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
                </motion.button>
                <motion.button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close chat assistant"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>
            
            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-auto p-4 pb-2 bg-gradient-to-b from-white/50 to-white/80 backdrop-blur-sm space-y-4" style={{ height: '320px' }}>
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={msg.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        // User Message (Right Side)
                        <div className="max-w-xs space-y-2">
                          <motion.div 
                            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 rounded-xl shadow-lg backdrop-blur-sm"
                            whileHover={{ scale: 1.02 }}
                          >
                            {renderMessage(msg.text)}
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-white/70">
                                {formatTime(msg.timestamp)}
                              </p>
                              {msg.cached && (
                                <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/80">
                                  cached
                                </span>
                              )}
                              {msg.isLocal && (
                                <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/80">
                                  instant
                                </span>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      ) : (
                        // Bot Message (Left Side)
                        <div className="flex items-start space-x-3">
                          {/* Bot Avatar */}
                          <motion.div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 bg-white border border-primary-200"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Bot size={16} className="text-text-primary" />
                          </motion.div>
                          
                          {/* Bot Message Content */}
                          <div className="max-w-xs space-y-2">
                            <motion.div 
                              className={`p-3 rounded-xl shadow-lg backdrop-blur-sm ${
                                msg.isError
                                ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                                : msg.dataType === 'database_result'
                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 border border-blue-200"
                                : "bg-white border border-primary-200 text-text-primary"
                              }`}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex items-start space-x-2">
                                {msg.type && (
                                  <div className="mt-0.5 flex-shrink-0">
                                    {getMessageIcon(msg.type)}
                                  </div>
                                )}
                                <div className="flex-1">
                                  {renderMessage(msg.text)}
                                  {msg.dataType === 'database_result' && (
                                    <div className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full inline-block">
                                      📊 Live Database Data
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between mt-2">
                                    <p className="text-xs text-text-secondary">
                                      {formatTime(msg.timestamp)}
                                    </p>
                                    {msg.cached && (
                                      <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-600">
                                        cached
                                      </span>
                                    )}
                                    {msg.isLocal && (
                                      <span className="text-xs px-2 py-1 rounded-full bg-accent-100 text-accent-600">
                                        instant
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                            
                            {/* Pre-defined Suggestions */}
                            {msg.suggestions && (
                              <div className="flex flex-wrap gap-2">
                                {msg.suggestions.map((suggestion, index) => (
                                  <motion.button
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handlePreSuggestionClick(suggestion)}
                                    className="px-3 py-1 text-xs bg-white border border-primary-200 hover:bg-gradient-to-r 
                                             hover:from-primary-500 hover:to-accent-500 text-text-secondary hover:text-white 
                                             rounded-full transition-all duration-200 hover:scale-105 hover:border-transparent 
                                             shadow-sm hover:shadow-glow focus:outline-none"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {suggestion}
                                  </motion.button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-3 justify-start"
                    >
                      <div className="w-10 h-10 bg-white border border-primary-200 rounded-xl flex items-center justify-center shadow-lg">
                        <Bot size={16} className="text-text-primary" />
                      </div>
                      <div className="bg-white border border-primary-200 rounded-xl p-3 shadow-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-text-secondary">Assistant is typing</span>
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((i) => (
                              <div 
                                key={i}
                                className="w-2 h-2 bg-accent-500 rounded-full animate-typing-dots"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input Suggestions */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 py-2 bg-white/90 backdrop-blur-sm max-h-24 overflow-y-auto"
                    >
                      <p className="text-xs text-text-secondary mb-2 font-medium">Suggestions:</p>
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="text-left text-sm p-2 mb-1 w-full hover:bg-gradient-to-r hover:from-primary-500 
                                   hover:to-accent-500 hover:text-white rounded-lg transition-all duration-200 
                                   text-text-secondary border border-transparent hover:border-transparent
                                   hover:shadow-glow focus:outline-none"
                          onClick={() => handleSuggestionClick(suggestion)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Actions */}
                <div className="px-4 py-2 bg-transparent">
                  <div className="flex space-x-2 overflow-x-auto">
                    <motion.button
                      onClick={() => handlePreSuggestionClick("Show me popular products")}
                      className="flex items-center space-x-2 px-3 py-2 text-xs bg-white border border-primary-200 
                               hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent-500 text-text-secondary 
                               hover:text-white rounded-xl transition-all duration-200 whitespace-nowrap 
                               hover:border-transparent shadow-sm hover:shadow-glow focus:outline-none"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingBag size={14} />
                      <span>Popular Products</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handlePreSuggestionClick("How many orders today?")}
                      className="flex items-center space-x-2 px-3 py-2 text-xs bg-white border border-blue-200 
                               hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 text-text-secondary 
                               hover:text-white rounded-xl transition-all duration-200 whitespace-nowrap 
                               hover:border-transparent shadow-sm hover:shadow-glow focus:outline-none"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Package size={14} />
                      <span>Orders Today</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handlePreSuggestionClick("What's our total revenue?")}
                      className="flex items-center space-x-2 px-3 py-2 text-xs bg-white border border-green-200 
                               hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 text-text-secondary 
                               hover:text-white rounded-xl transition-all duration-200 whitespace-nowrap 
                               hover:border-transparent shadow-sm hover:shadow-glow focus:outline-none"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RotateCcw size={14} />
                      <span>Total Revenue</span>
                    </motion.button>
                  </div>
                </div>
                
                {/* Input */}
                <div className="p-4 bg-white rounded-b-2xl">
                  <div className="flex space-x-3">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Type a message..."
                      className="input-modern flex-1"
                      value={inputText}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                    />
                    <motion.button
                      className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        inputText.trim() && !isLoading
                          ? "bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white shadow-lg hover:shadow-glow" 
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isLoading}
                      whileHover={{ scale: (inputText.trim() && !isLoading) ? 1.05 : 1 }}
                      whileTap={{ scale: (inputText.trim() && !isLoading) ? 0.95 : 1 }}
                    >
                      <Send size={16} />
                      <span className="hidden sm:inline">Send</span>
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 
                     text-white p-4 rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300 
                     flex items-center justify-center w-16 h-16 animate-pulse-glow group"
            onClick={() => setIsOpen(true)}
            aria-label="Open chat assistant"
          >
            <MessageCircle size={28} className="text-white group-hover:scale-110 transition-transform duration-300" />
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-error to-red-600 text-white text-xs 
                         rounded-full font-bold flex items-center justify-center shadow-lg animate-bounce"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;