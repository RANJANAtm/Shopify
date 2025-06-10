// Alternative: Using Hugging Face Inference API (Free Tier)
import axios from 'axios';

class HuggingFaceChatbotService {
  constructor() {
    // Free Hugging Face models (no API key needed for some)
    this.modelUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
    
    // Shonifity knowledge base
    this.knowledgeBase = [
      {
        topic: "products",
        content: "Shonifity offers premium products including electronics, fashion, home & garden items, shoes, glasses, jackets, suits, and bags. All products come with quality guarantee and 30-day return policy.",
        keywords: ["product", "items", "electronics", "fashion", "shoes", "clothes", "buy", "shop"]
      },
      {
        topic: "shipping",
        content: "Shonifity provides free shipping on orders over $50. Standard delivery takes 3-5 business days, express delivery 1-2 days, overnight delivery available.",
        keywords: ["shipping", "delivery", "ship", "send", "transport", "fast", "overnight"]
      },
      {
        topic: "returns",
        content: "Shonifity offers hassle-free returns within 30 days. Items must be in original condition with tags. Return shipping is free for defective items.",
        keywords: ["return", "refund", "exchange", "back", "defective", "wrong"]
      },
      {
        topic: "payment",
        content: "Shonifity accepts all major credit cards, PayPal, and digital wallets. All transactions are secured with 256-bit SSL encryption. Support for USD and INR currencies.",
        keywords: ["payment", "pay", "card", "credit", "paypal", "money", "price", "cost"]
      }
    ];
  }

  // Enhanced RAG retrieval
  findRelevantContent(query) {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(' ');
    
    const scored = this.knowledgeBase.map(doc => {
      let score = 0;
      
      // Exact topic match
      if (queryLower.includes(doc.topic)) score += 10;
      
      // Keyword matching
      doc.keywords.forEach(keyword => {
        if (queryLower.includes(keyword)) score += 5;
        queryWords.forEach(word => {
          if (keyword.includes(word) && word.length > 2) score += 2;
        });
      });
      
      // Content similarity
      const contentWords = doc.content.toLowerCase().split(' ');
      queryWords.forEach(word => {
        if (contentWords.includes(word) && word.length > 3) score += 1;
      });
      
      return { ...doc, score };
    });
    
    return scored
      .filter(doc => doc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
  }

  // Generate contextual response
  async generateResponse(userQuery, relevantDocs) {
    if (relevantDocs.length === 0) {
      return "I'm here to help with Shonifity! I can assist you with products, shipping, returns, payments, and more. What would you like to know?";
    }

    const context = relevantDocs[0];
    const templates = {
      products: [
        `Great question about our products! ${context.content} Is there a specific category you're interested in?`,
        `I'd be happy to help you with Shonifity products! ${context.content} What type of items are you looking for?`
      ],
      shipping: [
        `Here's what you need to know about Shonifity shipping: ${context.content} Do you have a specific delivery timeframe in mind?`,
        `Let me help you with shipping information: ${context.content} Would you like to know about international shipping too?`
      ],
      returns: [
        `Our return policy is designed to be customer-friendly: ${context.content} Do you need help starting a return?`,
        `I can help you with returns: ${context.content} Is there a specific item you'd like to return?`
      ],
      payment: [
        `Here's everything about Shonifity payments: ${context.content} Do you have questions about a specific payment method?`,
        `Let me explain our payment options: ${context.content} Are you looking for information about currency conversion?`
      ]
    };

    const responses = templates[context.topic] || [context.content];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async chat(userMessage) {
    try {
      const relevantDocs = this.findRelevantContent(userMessage);
      const response = await this.generateResponse(userMessage, relevantDocs);
      
      return {
        response: response,
        sources: relevantDocs.map(doc => doc.topic),
        confidence: relevantDocs.length > 0 ? relevantDocs[0].score / 10 : 0.5,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Chatbot error:', error);
      return {
        response: "I apologize for the technical difficulty. Our customer support team is available 24/7 to help you with any questions about Shonifity!",
        error: true,
        timestamp: new Date()
      };
    }
  }

  getSuggestions(partialQuery = '') {
    const allSuggestions = [
      "What products do you sell?",
      "How much does shipping cost?",
      "What's your return policy?",
      "What payment methods do you accept?",
      "Do you ship internationally?",
      "How long does delivery take?",
      "Can I track my order?",
      "Do you accept PayPal?",
      "What currencies do you support?",
      "How do I contact customer support?"
    ];

    if (partialQuery.length < 2) {
      return allSuggestions.slice(0, 4);
    }

    const filtered = allSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(partialQuery.toLowerCase())
    );

    return filtered.length > 0 ? filtered.slice(0, 5) : allSuggestions.slice(0, 3);
  }
}

export default HuggingFaceChatbotService;