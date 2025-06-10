import axios from 'axios';

// Test Ollama connection
async function testOllama() {
  try {
    console.log('Testing Ollama connection...');
    
    // Test if Ollama is running
    const healthCheck = await axios.get('http://localhost:11434/api/version');
    console.log('✅ Ollama is running:', healthCheck.data);
    
    // Test if gemma:2b model is available
    const modelsResponse = await axios.get('http://localhost:11434/api/tags');
    console.log('📋 Available models:', modelsResponse.data.models.map(m => m.name));
    
    // Test generating a response
    const testPrompt = {
      model: 'gemma:2b',
      prompt: 'Hello, how are you?',
      stream: false
    };
    
    console.log('🧠 Testing model generation...');
    const response = await axios.post('http://localhost:11434/api/generate', testPrompt);
    console.log('✅ Model response:', response.data.response);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testOllama();
