// Simple test component to verify everything is working
import { useState } from 'react';

function TestApp() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
        🚀 ModernCart Frontend Test
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        If you can see this, the frontend is working! ✅
      </p>
      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: '12px 24px',
          fontSize: '1rem',
          background: '#FF6F61',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '1rem'
        }}
      >
        Click count: {count}
      </button>
      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
        Once verified, we'll switch back to the full app
      </p>
    </div>
  );
}

export default TestApp;
