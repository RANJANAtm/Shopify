import express from 'express';
import RAGChatbotService from '../services/ragChatbot.js';

const router = express.Router();
const chatbot = new RAGChatbotService();

// Chat endpoint
router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }

    const response = await chatbot.chat(message);
    res.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      response: 'Sorry, I encountered an error. Please try again.'
    });
  }
});

// Suggestions endpoint
router.get('/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    const suggestions = chatbot.getSuggestions(query || '');
    
    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestions API error:', error);
    res.json({ suggestions: [] });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'RAG Chatbot',
    timestamp: new Date()
  });
});

export default router;