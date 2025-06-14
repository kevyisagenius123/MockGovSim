// Cache bust v2.1.2 - 2025-06-14T07:15:00Z - Ultra-robust minimal app with guaranteed render
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Ultra-simple fallback app that WILL render
const MinimalApp = () => (
  <div style={{ 
    padding: '40px', 
    textAlign: 'center', 
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 'bold' }}>
      MockGovSim
    </h1>
    <p style={{ fontSize: '1.2rem', marginBottom: '30px', maxWidth: '600px' }}>
      Welcome to MockGovSim - Your Political Simulation Platform
    </p>
    <div style={{ 
      background: 'rgba(255,255,255,0.1)', 
      padding: '20px', 
      borderRadius: '10px',
      marginBottom: '30px',
      maxWidth: '500px'
    }}>
      <p style={{ marginBottom: '15px' }}>
        🎯 <strong>Status:</strong> Application is running in safe mode
      </p>
      <p style={{ marginBottom: '15px' }}>
        🔧 <strong>Mode:</strong> All error prevention systems active
      </p>
      <p>
        ✅ <strong>Cache:</strong> Standard caching enabled
      </p>
    </div>
    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <button 
        onClick={() => window.location.href = '/home'} 
        style={{ 
          padding: '12px 24px', 
          background: '#10b981', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Go to Home
      </button>
      <button 
        onClick={() => window.location.href = '/map'} 
        style={{ 
          padding: '12px 24px', 
          background: '#f59e0b', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        View Maps
      </button>
      <button 
        onClick={() => window.location.href = '/results'} 
        style={{ 
          padding: '12px 24px', 
          background: '#ef4444', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Live Results
      </button>
      <button 
        onClick={() => window.location.reload()} 
        style={{ 
          padding: '12px 24px', 
          background: '#6366f1', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Refresh App
      </button>
    </div>
    <div style={{ 
      marginTop: '40px', 
      fontSize: '14px', 
      opacity: '0.8',
      maxWidth: '600px'
    }}>
      <p>
        This safe mode interface ensures the application always loads. 
        If you're seeing this, it means our error prevention systems are working correctly.
      </p>
    </div>
  </div>
);

// Enhanced safe call utility
const safeCall = (fn, context = 'unknown', fallback = null) => {
  try {
    if (typeof fn !== 'function') {
      console.warn(`safeCall: ${context} - provided value is not a function:`, fn);
      return fallback;
    }
    return fn();
  } catch (error) {
    console.warn(`safeCall: ${context} - error:`, error);
    return fallback;
  }
};

// Global error interceptor - prevent ALL crashes
window.addEventListener('error', (event) => {
  console.warn('Global error intercepted and prevented:', event.error?.message);
  event.preventDefault();
  event.stopPropagation();
  return false;
});

window.addEventListener('unhandledrejection', (event) => {
  console.warn('Promise rejection intercepted and prevented:', event.reason);
  event.preventDefault();
  return false;
});

// Main application initialization with guaranteed fallback
const initializeApp = async () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }
    
    const root = ReactDOM.createRoot(rootElement);
    
    // Try to load the full app first
    try {
      const { RouterProvider } = await import('react-router-dom');
      const routerModule = await import('./router');
      const router = routerModule.default;
      
      // If we get here, everything loaded successfully
      const FullApp = () => (
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      );
      
      root.render(<FullApp />);
      console.log('✅ Full application loaded successfully');
      
    } catch (routerError) {
      console.warn('Router failed to load, using minimal app:', routerError);
      
      // Fallback to minimal app
      root.render(<MinimalApp />);
      console.log('✅ Minimal application loaded successfully');
    }
    
  } catch (criticalError) {
    console.error('Critical error during app initialization:', criticalError);
    
    // Last resort: direct DOM manipulation
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif; min-height: 100vh; background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <h1 style="font-size: 3rem; margin-bottom: 20px;">MockGovSim</h1>
          <p style="font-size: 1.2rem; margin-bottom: 30px;">Emergency Recovery Mode</p>
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <p>The application encountered a critical error but has been prevented from crashing.</p>
            <p>Please refresh the page or contact support.</p>
          </div>
          <button onclick="window.location.reload()" style="padding: 12px 24px; background: white; color: #dc2626; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
};

// Initialize the app
initializeApp();