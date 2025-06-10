import mongoose from 'mongoose';
import axios from 'axios';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';

class NLToDatabaseService {
  constructor() {
    this.ollamaUrl = 'http://localhost:11434';
    this.model = 'gemma:2b';
    
    // Define your actual database schema for the LLM to understand
    this.databaseSchema = {
      users: {
        fields: ['_id', 'name', 'email', 'createdAt', 'updatedAt', 'role', 'cartItems'],
        description: 'User accounts and customer information with shopping cart'
      },
      products: {
        fields: ['_id', 'name', 'description', 'price', 'category', 'image', 'isFeatured', 'createdAt', 'updatedAt'],
        description: 'Product catalog with pricing, categories, and featured status'
      },
      orders: {
        fields: ['_id', 'user', 'products', 'totalAmount', 'stripeSessionId', 'createdAt', 'updatedAt'],
        description: 'Customer orders with product details and payment information'
      }
    };
  }

  // Classify user intent and determine if it's a data query
  async classifyIntent(userQuery) {
    const dataKeywords = [
      'how many', 'count', 'total', 'revenue', 'sales', 'orders', 'customers',
      'products', 'inventory', 'analytics', 'dashboard', 'report',
      'today', 'yesterday', 'this week', 'this month', 'recent', 'latest',
      'top selling', 'best', 'featured', 'category', 'price'
    ];
    
    const queryLower = userQuery.toLowerCase();
    const hasDataKeywords = dataKeywords.some(keyword => queryLower.includes(keyword));
    
    if (hasDataKeywords) {
      return {
        type: 'database_query',
        confidence: 0.8,
        intent: await this.extractSpecificIntent(userQuery)
      };
    }
    
    return {
      type: 'general_chat',
      confidence: 0.9
    };
  }

  // Extract specific intent from user query
  async extractSpecificIntent(userQuery) {
    const intentMap = {
      'user': ['users', 'customers', 'accounts', 'members'],
      'product': ['products', 'items', 'inventory', 'catalog'],
      'order': ['orders', 'sales', 'purchases', 'transactions'],
      'revenue': ['revenue', 'money', 'earnings', 'income', 'profit'],
      'analytics': ['analytics', 'metrics', 'dashboard', 'statistics']
    };
    
    const queryLower = userQuery.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(intentMap)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        return intent;
      }
    }
    
    return 'general';
  }

  // Execute predefined safe queries based on user intent
  async executeSafeQuery(userQuery, intent) {
    console.log(`Executing safe query for intent: ${intent}`);
    
    try {
      // Handle user-related queries
      if (intent === 'user' || userQuery.toLowerCase().includes('user') || userQuery.toLowerCase().includes('customer')) {
        if (userQuery.toLowerCase().includes('how many') || userQuery.toLowerCase().includes('count')) {
          const count = await User.countDocuments();
          return {
            type: 'count',
            value: count,
            description: 'Total number of registered users'
          };
        }
        
        if (userQuery.toLowerCase().includes('recent') || userQuery.toLowerCase().includes('latest')) {
          const users = await User.find({}).sort({ createdAt: -1 }).limit(5).select('name email createdAt');
          return {
            type: 'list',
            value: users,
            description: 'Recent user registrations'
          };
        }
      }
      
      // Handle product-related queries
      if (intent === 'product' || userQuery.toLowerCase().includes('product')) {
        if (userQuery.toLowerCase().includes('how many') || userQuery.toLowerCase().includes('count')) {
          const count = await Product.countDocuments();
          return {
            type: 'count',
            value: count,
            description: 'Total number of products in catalog'
          };
        }
        
        if (userQuery.toLowerCase().includes('featured')) {
          const featuredProducts = await Product.find({ isFeatured: true }).select('name price category');
          return {
            type: 'list',
            value: featuredProducts,
            description: 'Featured products'
          };
        }
        
        if (userQuery.toLowerCase().includes('category') || userQuery.toLowerCase().includes('categories')) {
          const categories = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ]);
          return {
            type: 'aggregation',
            value: categories,
            description: 'Products by category'
          };
        }
        
        if (userQuery.toLowerCase().includes('recent') || userQuery.toLowerCase().includes('latest')) {
          const products = await Product.find({}).sort({ createdAt: -1 }).limit(5).select('name price category');
          return {
            type: 'list',
            value: products,
            description: 'Recently added products'
          };
        }
      }
      
      // Handle order-related queries
      if (intent === 'order' || userQuery.toLowerCase().includes('order') || userQuery.toLowerCase().includes('sale')) {
        if (userQuery.toLowerCase().includes('how many') || userQuery.toLowerCase().includes('count')) {
          let query = {};
          
          // Handle time-based filters
          if (userQuery.toLowerCase().includes('today')) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query.createdAt = { $gte: today };
          } else if (userQuery.toLowerCase().includes('this week')) {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            weekStart.setHours(0, 0, 0, 0);
            query.createdAt = { $gte: weekStart };
          }
          
          const count = await Order.countDocuments(query);
          const timeframe = userQuery.toLowerCase().includes('today') ? 'today' : 
                          userQuery.toLowerCase().includes('this week') ? 'this week' : 'total';
          return {
            type: 'count',
            value: count,
            description: `Number of orders ${timeframe}`
          };
        }
        
        if (userQuery.toLowerCase().includes('recent') || userQuery.toLowerCase().includes('latest')) {
          const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .select('totalAmount createdAt');
          return {
            type: 'list',
            value: orders,
            description: 'Recent orders'
          };
        }
      }
      
      // Handle revenue-related queries
      if (intent === 'revenue' || userQuery.toLowerCase().includes('revenue') || userQuery.toLowerCase().includes('money')) {
        let matchCondition = {};
        
        // Handle time-based filters
        if (userQuery.toLowerCase().includes('today')) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          matchCondition.createdAt = { $gte: today };
        } else if (userQuery.toLowerCase().includes('this week')) {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          weekStart.setHours(0, 0, 0, 0);
          matchCondition.createdAt = { $gte: weekStart };
        }
        
        const result = await Order.aggregate([
          { $match: matchCondition },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        
        const timeframe = userQuery.toLowerCase().includes('today') ? 'today' : 
                        userQuery.toLowerCase().includes('this week') ? 'this week' : 'total';
        
        return {
          type: 'revenue',
          value: result[0]?.total || 0,
          description: `Total revenue ${timeframe}`
        };
      }
      
      // Default fallback
      return {
        type: 'info',
        value: 'Query processed but no specific data found',
        description: 'General database query'
      };
      
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Format the database result for user-friendly response
  formatResult(result, userQuery) {
    if (!result) return 'No data found.';
    
    switch (result.type) {
      case 'count':
        return `📊 **${result.description}**: **${result.value.toLocaleString()}**`;
      
      case 'revenue':
        return `💰 **${result.description}**: **$${result.value.toLocaleString()}**`;
      
      case 'list':
        if (!result.value || result.value.length === 0) {
          return `📋 No ${result.description.toLowerCase()} found.`;
        }
        
        let formattedList = `📋 **${result.description}** (${result.value.length} items):\n\n`;
        
        result.value.forEach((item, index) => {
          if (item.name && item.price !== undefined) {
            // Product format
            formattedList += `${index + 1}. **${item.name}** - $${item.price} (${item.category})\n`;
          } else if (item.name && item.email) {
            // User format
            formattedList += `${index + 1}. **${item.name}** (${item.email}) - ${new Date(item.createdAt).toLocaleDateString()}\n`;
          } else if (item.totalAmount !== undefined) {
            // Order format
            const userName = item.user?.name || 'Unknown';
            formattedList += `${index + 1}. **$${item.totalAmount}** by ${userName} - ${new Date(item.createdAt).toLocaleDateString()}\n`;
          } else {
            // Generic format
            formattedList += `${index + 1}. ${JSON.stringify(item)}\n`;
          }
        });
        
        return formattedList;
      
      case 'aggregation':
        if (!result.value || result.value.length === 0) {
          return `📊 No ${result.description.toLowerCase()} found.`;
        }
        
        let formattedAgg = `📊 **${result.description}**:\n\n`;
        result.value.forEach((item, index) => {
          formattedAgg += `${index + 1}. **${item._id || 'Unknown'}**: ${item.count} items\n`;
        });
        
        return formattedAgg;
      
      default:
        return `ℹ️ ${result.description}: ${result.value}`;
    }
  }

  // Main method to process natural language database queries
  async processNLQuery(userQuery) {
    try {
      // Step 1: Classify intent
      const classification = await this.classifyIntent(userQuery);
      
      if (classification.type !== 'database_query') {
        return null; // Not a database query
      }
      
      console.log(`Processing database query: "${userQuery}" with intent: ${classification.intent}`);
      
      // Step 2: Execute safe query
      const result = await this.executeSafeQuery(userQuery, classification.intent);
      
      // Step 3: Format result
      const formattedResult = this.formatResult(result, userQuery);
      
      return {
        success: true,
        response: formattedResult,
        queryUsed: `Intent: ${classification.intent}`,
        dataType: 'database_result'
      };
      
    } catch (error) {
      console.error('NL to DB processing error:', error);
      return {
        success: false,
        error: 'Failed to process database query'
      };
    }
  }
}

export default NLToDatabaseService;
