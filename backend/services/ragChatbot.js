import axios from 'axios';
import NLToDatabaseService from './nlToDatabase.js';

class RAGChatbotService {
  constructor() {
    this.ollamaUrl = 'http://localhost:11434';
    this.model = 'gemma:2b'; // Using your local Gemma 2B model
    this.nlToDbService = new NLToDatabaseService(); // Initialize NL to Database service
    
    // Shonifity knowledge base - Expanded with more specific context
    this.knowledgeBase = [
      {
        topic: "products",
        content: "Shonifity is a premium e-commerce platform specializing in high-quality products across multiple categories: Electronics (smartphones, laptops, headphones, smartwatches), Fashion (designer clothing, shoes, accessories), Home & Garden (furniture, décor, kitchen appliances), Beauty & Personal Care, Sports & Fitness equipment. All products are carefully curated for quality and come with authentic warranties. We feature both international brands and emerging designers."
      },
      {
        topic: "shipping",
        content: "Shonifity Shipping: FREE shipping on orders over $50 worldwide. Standard delivery: 3-5 business days ($8.99 under $50). Express delivery: 1-2 business days ($15.99). Overnight delivery: Next business day ($24.99). International shipping available to 50+ countries with customs handling included. Order tracking provided via SMS and email. Same-day delivery available in major cities."
      },
      {
        topic: "returns",
        content: "Shonifity Return Policy: Hassle-free 30-day returns on all items. Items must be unused, in original packaging with tags attached. Free return shipping for defective/damaged items. Customer pays return shipping for other reasons ($9.99). Refunds processed within 5-7 business days to original payment method. Exchange option available. No questions asked policy for premium members."
      },
      {
        topic: "payment",
        content: "Shonifity Payment Options: Accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, Shop Pay, buy-now-pay-later options (Klarna, Afterpay). All transactions secured with 256-bit SSL encryption and PCI DSS compliance. Multiple currencies supported: USD, EUR, GBP, CAD, AUD. Payment plans available for orders over $500."
      },
      {
        topic: "support",
        content: "Shonifity Customer Support: Available 24/7 via live chat, email (support@shonifity.com), and phone (1-800-SHONIFY). Multilingual support in English, Spanish, French. Average response time: Under 30 minutes for chat, 2 hours for email. Dedicated account managers for VIP customers. Video call support for technical products. Extended warranty and white-glove service available."
      },
      {
        topic: "account",
        content: "Shonifity Account Benefits: Create free account to unlock: Order tracking, wishlists, personalized recommendations, exclusive member discounts (up to 20% off), early access to sales, birthday rewards, loyalty points program (1 point = $1), saved payment methods, address book, review history. VIP membership available for frequent shoppers with additional perks."
      },
      {
        topic: "company",
        content: "About Shonifity: Founded in 2020, Shonifity is a modern e-commerce platform focused on providing premium shopping experiences. We curate products from trusted brands and emerging designers worldwide. Committed to sustainability with eco-friendly packaging and carbon-neutral shipping. Headquartered in San Francisco with warehouses globally. Winner of 'Best E-commerce Experience 2023' award."
      },
      {
        topic: "deals",
        content: "Shonifity Deals & Offers: Weekly flash sales up to 70% off, seasonal clearance events, new customer 15% discount code 'WELCOME15', student discount 10% with valid ID, military discount 12%, referral program ($20 credit for both parties), bundle deals, price-match guarantee against major competitors. Subscribe to newsletter for exclusive deals."
      },
      {
        topic: "quality",
        content: "Shonifity Quality Promise: All products undergo rigorous quality inspection before shipping. Partnerships with authorized dealers only. Authenticity guarantee with certificates for luxury items. Quality control team inspects returned items. Customer reviews and ratings help maintain high standards. 30-day quality guarantee - if not satisfied, full refund provided."
      },
      {
        topic: "technology",
        content: "Shonifity Platform Features: AI-powered product recommendations, advanced search filters, augmented reality try-on for fashion items, 360° product views, size prediction algorithms, real-time inventory updates, mobile app with exclusive features, voice search capability, personalized shopping assistant, social commerce integration."
      }
    ];
  }

  // Enhanced similarity search for RAG
  findRelevantContent(query) {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(' ').filter(word => word.length > 2);
    
    const relevantDocs = this.knowledgeBase.map(doc => {
      let score = 0;
      
      // Direct topic matching (highest weight)
      if (queryLower.includes(doc.topic)) {
        score += 3;
      }
      
      // Keyword matching in content
      const contentLower = doc.content.toLowerCase();
      queryWords.forEach(word => {
        if (contentLower.includes(word)) {
          score += 1;
        }
      });
      
      // Enhanced keyword matching for common e-commerce terms
      const ecommerceKeywords = {
        'product': ['products', 'items', 'buy', 'purchase', 'shop', 'sell'],
        'shipping': ['delivery', 'ship', 'send', 'fast', 'free', 'cost'],
        'returns': ['return', 'refund', 'exchange', 'money back'],
        'payment': ['pay', 'credit', 'card', 'paypal', 'checkout', 'billing'],
        'support': ['help', 'contact', 'customer', 'service', 'assistance'],
        'account': ['login', 'register', 'profile', 'membership', 'signup'],
        'deals': ['discount', 'sale', 'offer', 'coupon', 'deal', 'promo'],
        'quality': ['quality', 'guarantee', 'warranty', 'authentic']
      };
      
      // Check for semantic matches
      Object.keys(ecommerceKeywords).forEach(topic => {
        if (doc.topic === topic) {
          ecommerceKeywords[topic].forEach(keyword => {
            if (queryLower.includes(keyword)) {
              score += 2;
            }
          });
        }
      });
      
      return { ...doc, score };
    }).filter(doc => doc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Return top 3 most relevant documents
    
    // If no matches found, return general info
    if (relevantDocs.length === 0) {
      return [this.knowledgeBase.find(doc => doc.topic === 'company') || this.knowledgeBase[0]];
    }
    
    return relevantDocs;
  }

  // Simple similarity calculation
  calculateSimilarity(text1, text2) {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    const intersection = words1.filter(word => words2.includes(word));
    return intersection.length / Math.max(words1.length, words2.length);
  }

  // Generate response using Ollama
  async generateResponse(userQuery, relevantDocs) {
    const context = relevantDocs.map(doc => doc.content).join('\n\n');
    
    const prompt = `You are Shonifity's official AI shopping assistant. You represent a premium e-commerce platform that prioritizes quality, customer service, and innovation. Use ONLY the provided context information to answer questions accurately.

IMPORTANT CONTEXT ABOUT SHONIFITY:
${context}

CUSTOMER QUESTION: ${userQuery}

INSTRUCTIONS:
- Answer ONLY based on the provided Shonifity context above
- Be helpful, professional, and enthusiastic about Shonifity's services
- Use specific details from the context (prices, timeframes, features)
- If asked about something not in the context, say "Let me connect you with our support team for detailed information about that"
- Always mention Shonifity by name when relevant
- Keep responses conversational but informative
- End with a helpful follow-up question when appropriate

Your response as Shonifity's assistant:`;

    try {
      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: this.model,
        prompt: prompt,
        stream: false
      });

      return response.data.response;
    } catch (error) {
      console.error('Ollama API error:', error);
      // Fallback to rule-based response
      return this.getFallbackResponse(userQuery, relevantDocs);
    }
  }

  // Fallback rule-based responses
  getFallbackResponse(query, relevantDocs) {
    if (relevantDocs.length > 0) {
      const mainDoc = relevantDocs[0];
      return `Based on your question about ${mainDoc.topic}, here's what I can help you with: ${mainDoc.content}`;
    }
    
    return "Thank you for your question! I'm here to help with Shonifity products, orders, shipping, returns, and more. Could you please provide more details about what you'd like to know?";
  }

  // Main chat method - Enhanced with database queries
  async chat(userMessage) {
    try {
      // Step 1: Check if this is a database query
      const dbResult = await this.nlToDbService.processNLQuery(userMessage);
      
      if (dbResult && dbResult.success) {
        // It's a database query and we got results
        return {
          response: `📊 **Live Data Result:**\n\n${dbResult.response}\n\n*Query executed: ${dbResult.queryUsed}*`,
          sources: ['live_database'],
          dataType: 'database_result',
          queryUsed: dbResult.queryUsed,
          timestamp: new Date(),
          cached: false
        };
      } else if (dbResult && !dbResult.success) {
        // It was identified as a database query but failed
        console.error('Database query failed:', dbResult.error);
        // Continue with regular RAG as fallback
      }
      
      // Step 2: Regular RAG processing for general queries
      // Find relevant documents
      const relevantDocs = this.findRelevantContent(userMessage);
      
      // Generate response using RAG
      const response = await this.generateResponse(userMessage, relevantDocs);
      
      return {
        response: response,
        sources: relevantDocs.map(doc => doc.topic),
        timestamp: new Date(),
        cached: false
      };
    } catch (error) {
      console.error('RAG Chatbot error:', error);
      return {
        response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment or contact our support team for immediate assistance.",
        error: true,
        timestamp: new Date()
      };
    }
  }

  // Get suggestions based on partial input
  getSuggestions(partialQuery) {
    const suggestions = [
      "Tell me about your products",
      "What's your return policy?",
      "How much is shipping?",
      "What payment methods do you accept?",
      "How do I track my order?",
      "Do you have customer support?",
      "What currencies do you support?",
      "How do I create an account?"
    ];

    if (!partialQuery || partialQuery.length < 3) {
      return suggestions.slice(0, 4);
    }

    const filtered = suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(partialQuery.toLowerCase())
    );

    return filtered.length > 0 ? filtered : suggestions.slice(0, 3);
  }
}

export default RAGChatbotService;