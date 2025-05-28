import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  ShoppingBag,
  Package,
  RotateCcw
} from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your shopping assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
      type: "greeting",
      suggestions: ["Show me products", "Track my order", "Help with returns"]
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(newMessage);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse.text,
        sender: "bot",
        timestamp: new Date(),
        type: botResponse.type,
        suggestions: botResponse.suggestions
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1000 + Math.random() * 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    const userMessage = {
      id: Date.now(),
      text: suggestion,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(suggestion);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse.text,
        sender: "bot",
        timestamp: new Date(),
        type: botResponse.type,
        suggestions: botResponse.suggestions
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 1000);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    const responses = {
      greeting: {
        text: "Hello! Welcome to our store. I can help you find products, check order status, or answer any questions about our services.",
        type: "greeting",
        suggestions: ["Show me products", "Track my order", "Help with returns"]
      },
      products: {
        text: "We have a wide range of products including electronics, clothing, home & garden items, and more. What specific type of product are you looking for?",
        type: "product_inquiry",
        suggestions: ["Electronics", "Clothing", "Home & Garden", "View all categories"]
      },
      orders: {
        text: "I can help you with order-related questions. You can track your orders from your account dashboard or contact our support team for detailed information.",
        type: "order_inquiry",
        suggestions: ["Track order", "Order history", "Contact support"]
      },
      returns: {
        text: "Our return policy allows returns within 30 days of purchase. Items must be in original condition. Would you like me to guide you through the return process?",
        type: "return_inquiry",
        suggestions: ["Start return", "Return policy", "Contact support"]
      },
      discounts: {
        text: "Great question! We often have seasonal sales and discount coupons. Check our homepage for the latest deals or sign up for our newsletter to get exclusive offers.",
        type: "discount_inquiry",
        suggestions: ["View current deals", "Sign up for newsletter", "Coupon codes"]
      },
      sizing: {
        text: "For clothing items, you can find detailed size guides on each product page. If you're unsure about sizing, I recommend checking our size chart or reading customer reviews.",
        type: "sizing_inquiry",
        suggestions: ["Size guide", "Customer reviews", "Contact support"]
      },
      payment: {
        text: "We accept all major credit cards, PayPal, and other secure payment methods. All transactions are encrypted and secure.",
        type: "payment_inquiry",
        suggestions: ["Payment methods", "Security info", "Billing help"]
      }
    };

    if (message.includes("hello") || message.includes("hi")) {
      return responses.greeting;
    } else if (message.includes("product") || message.includes("item") || message.includes("buy") || message.includes("show me products")) {
      return responses.products;
    } else if (message.includes("order") || message.includes("shipping") || message.includes("track")) {
      return responses.orders;
    } else if (message.includes("return") || message.includes("refund")) {
      return responses.returns;
    } else if (message.includes("discount") || message.includes("coupon") || message.includes("sale")) {
      return responses.discounts;
    } else if (message.includes("size") || message.includes("fit")) {
      return responses.sizing;
    } else if (message.includes("payment") || message.includes("credit card") || message.includes("pay")) {
      return responses.payment;
    }
    
    return {
      text: "Thank you for your message! I'm here to help with any questions about our products, orders, shipping, or returns. Could you please provide more details so I can assist you better?",
      type: "general_help",
      suggestions: ["Products", "Orders", "Returns", "Contact support"]
    };
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case "product_inquiry":
        return <ShoppingBag size={14} className="text-emerald-400" />;
      case "order_inquiry":
        return <Package size={14} className="text-blue-400" />;
      case "return_inquiry":
        return <RotateCcw size={14} className="text-orange-400" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Chat Toggle Button - FIXED POSITIONING */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleChat}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white p-4 rounded-full shadow-lg transition-all duration-200 cursor-pointer"
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999,
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MessageCircle size={24} />
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-red-500 text-white text-xs rounded-full font-bold"
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window - FIXED POSITIONING */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "60px" : "600px"
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden backdrop-blur-sm"
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999,
              width: '384px', // w-96 = 384px
              maxWidth: 'calc(100vw - 48px)' // Responsive for mobile
            }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bot size={24} className="text-white" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <span className="text-white font-semibold">Shopping Assistant</span>
                  <p className="text-emerald-100 text-xs">Online now</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-emerald-600 p-2 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </button>
                <button
                  onClick={toggleChat}
                  className="text-white hover:bg-emerald-600 p-2 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages Container */}
                <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900 to-gray-800">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-xs ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                        {/* Avatar */}
                        <div className={`p-2 rounded-full ${message.sender === "user" ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-gradient-to-r from-gray-600 to-gray-700"} shadow-lg flex-shrink-0`}>
                          {message.sender === "user" ? (
                            <User size={16} className="text-white" />
                          ) : (
                            <Bot size={16} className="text-white" />
                          )}
                        </div>
                        
                        {/* Message Content */}
                        <div className="space-y-2">
                          {/* Message Bubble */}
                          <div className={`p-3 rounded-2xl shadow-lg ${
                            message.sender === "user" 
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white" 
                              : "bg-gray-700 text-gray-100 border border-gray-600"
                          }`}>
                            <div className="flex items-start space-x-2">
                              {message.sender === "bot" && message.type && (
                                <div className="mt-0.5 flex-shrink-0">
                                  {getMessageIcon(message.type)}
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                  {message.text}
                                </p>
                                <p className="text-xs opacity-70 mt-2">
                                  {formatTime(message.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Suggestions */}
                          {message.suggestions && message.sender === "bot" && (
                            <div className="flex flex-wrap gap-2 ml-1">
                              {message.suggestions.map((suggestion, index) => (
                                <motion.button
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="px-3 py-1 text-xs bg-gray-600 hover:bg-emerald-600 text-gray-200 rounded-full transition-all duration-200 border border-gray-500 hover:border-emerald-500 hover:scale-105"
                                >
                                  {suggestion}
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-3 max-w-xs">
                        <div className="p-2 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 shadow-lg">
                          <Bot size={16} className="text-white" />
                        </div>
                        <div className="p-3 rounded-2xl bg-gray-700 text-gray-100 border border-gray-600 shadow-lg">
                          <div className="flex space-x-1 items-center">
                            <span className="text-xs text-gray-300 mr-2">Typing</span>
                            <div className="flex space-x-1">
                              <motion.div 
                                className="w-2 h-2 bg-emerald-400 rounded-full"
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ 
                                  duration: 1.2, 
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                              <motion.div 
                                className="w-2 h-2 bg-emerald-400 rounded-full"
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ 
                                  duration: 1.2, 
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 0.2
                                }}
                              />
                              <motion.div 
                                className="w-2 h-2 bg-emerald-400 rounded-full"
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ 
                                  duration: 1.2, 
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 0.4
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
                  <div className="flex space-x-2 overflow-x-auto">
                    <button
                      onClick={() => handleSuggestionClick("Show me popular products")}
                      className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-700 hover:bg-emerald-600 text-gray-200 rounded-full transition-colors whitespace-nowrap"
                    >
                      <ShoppingBag size={12} />
                      <span>Popular Products</span>
                    </button>
                    <button
                      onClick={() => handleSuggestionClick("Track my order")}
                      className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-700 hover:bg-emerald-600 text-gray-200 rounded-full transition-colors whitespace-nowrap"
                    >
                      <Package size={12} />
                      <span>Track Order</span>
                    </button>
                    <button
                      onClick={() => handleSuggestionClick("Help with returns")}
                      className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-700 hover:bg-emerald-600 text-gray-200 rounded-full transition-colors whitespace-nowrap"
                    >
                      <RotateCcw size={12} />
                      <span>Returns</span>
                    </button>
                  </div>
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 bg-gray-800">
                  <div className="flex space-x-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm border border-gray-600 transition-all duration-200"
                      disabled={isTyping}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isTyping}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-xl transition-all duration-200 shadow-lg"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;