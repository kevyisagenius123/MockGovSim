import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import './index.css'

// Enhanced global error handling
const setupGlobalErrorHandling = () => {
  // Catch JavaScript errors
  window.addEventListener('error', (event) => {
    const error = event.error;
    if (error && error.message) {
      if (error.message.includes('is not a function')) {
        console.error('🔧 Function call error intercepted:', {
          message: error.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
        
        // Prevent the error from propagating
        event.preventDefault();
        event.stopPropagation();
        
        // Show user-friendly message
        console.log('🛡️ Error prevented from crashing the application');
        
        return true;
      }
    }
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason && reason.message && reason.message.includes('is not a function')) {
      console.error('🔧 Promise rejection with function call error intercepted:', reason);
      event.preventDefault();
      return true;
    }
  });

  // React error boundary fallback
  window.addEventListener('react-error', (event) => {
    console.error('🔧 React error intercepted:', event.detail);
  });
};

// Initialize error handling
setupGlobalErrorHandling();

// Safe React rendering with error recovery
const renderApp = () => {
  try {
    const root = ReactDOM.createRoot(document.getElementById('root'))
    root.render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    )
    console.log('✅ Application rendered successfully')
  } catch (error) {
    console.error('❌ Failed to render application:', error)
    
    // Fallback rendering
    document.getElementById('root').innerHTML = `
      <div style="
        display: flex; 
        align-items: center; 
        justify-content: center; 
        min-height: 100vh; 
        background: #0d1117; 
        color: #f0f6fc; 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <div style="max-width: 500px;">
          <h1 style="color: #f85149; margin-bottom: 16px;">Application Error</h1>
          <p style="margin-bottom: 16px;">
            The application encountered an error during startup. This is likely a temporary issue.
          </p>
          <button 
            onclick="window.location.reload()" 
            style="
              background: #238636; 
              color: white; 
              border: none; 
              padding: 8px 16px; 
              border-radius: 6px; 
              cursor: pointer;
              font-size: 14px;
            "
          >
            Reload Application
          </button>
        </div>
      </div>
    `;
  }
};

// Render the application
renderApp();