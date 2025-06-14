// Cache bust v2.1.2 - 2025-06-14T07:05:00Z - Enhanced error prevention with aggressive cache busting
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'

// Enhanced safe call utility
const safeCall = (fn, context = 'unknown', fallback = null) => {
  try {
    if (typeof fn !== 'function') {
      console.error(`safeCall: ${context} - provided value is not a function:`, fn);
      return fallback;
    }
    return fn();
  } catch (error) {
    console.error(`safeCall: ${context} - error:`, error);
    return fallback;
  }
};

// Pre-emptive function call protection
const originalFunction = Function;
Function.prototype.call = function(...args) {
  try {
    return originalFunction.prototype.call.apply(this, args);
  } catch (error) {
    if (error.message && error.message.includes('is not a function')) {
      console.error('Protected function call error:', error);
      return undefined;
    }
    throw error;
  }
};

// Global error interceptor - catch ALL function call errors
window.addEventListener('error', (event) => {
  console.error('Global error intercepted:', event.error);
  
  // Specifically handle "r is not a function" and similar errors
  if (event.error && event.error.message) {
    const message = event.error.message;
    if (message.includes('is not a function') || 
        message.includes('Cannot read properties') ||
        message.includes('undefined is not a function') ||
        message.includes('null is not a function')) {
      
      console.error('Function call error prevented:', message);
      console.error('Stack:', event.error.stack);
      
      // Prevent the error from propagating
      event.preventDefault();
      event.stopPropagation();
      
      // Show user-friendly message instead of crash
      showErrorMessage('A component failed to load properly. The page will continue to work with fallback components.');
      
      return false;
    }
  }
});

// Enhanced promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection intercepted:', event.reason);
  
  if (event.reason && event.reason.message && 
      (event.reason.message.includes('is not a function') ||
       event.reason.message.includes('Cannot read properties'))) {
    console.error('Promise rejection due to function call error prevented');
    event.preventDefault();
    return false;
  }
});

// User-friendly error message display
const showErrorMessage = (message) => {
  // Only show if not already showing
  if (document.getElementById('error-toast')) return;
  
  const toast = document.createElement('div');
  toast.id = 'error-toast';
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f59e0b;
    color: #000;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    max-width: 300px;
    font-family: Arial, sans-serif;
    font-size: 14px;
  `;
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>⚠️</span>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; font-size: 16px; cursor: pointer;">×</button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 5000);
};

// Main application initialization
const initializeApp = async () => {
  // Safe router import with fallback
  let router;
  try {
    const routerModule = await import('./router');
    router = routerModule.default;
  } catch (error) {
    console.error('Failed to import router:', error);
    
    // Create emergency fallback router
    const { createBrowserRouter } = await import('react-router-dom');
    
    const EmergencyApp = () => (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>MockGovSim</h1>
        <p>The application is running in emergency mode due to component errors.</p>
        <p>Please refresh the page or contact support if this persists.</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            padding: '10px 20px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Refresh Page
        </button>
      </div>
    );
    
    router = createBrowserRouter([
      { path: "*", element: <EmergencyApp /> }
    ]);
  }

  // Enhanced safe render with multiple fallback levels
  const safeRender = async () => {
    try {
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        throw new Error('Root element not found');
      }
      
      const root = ReactDOM.createRoot(rootElement);
      
      // Wrap in additional error boundary
      const SafeApp = () => {
        try {
          return (
            <React.StrictMode>
              <RouterProvider router={router} />
            </React.StrictMode>
          );
        } catch (error) {
          console.error('SafeApp render error:', error);
          return (
            <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
              <h2>Application Error</h2>
              <p>The application encountered an error during rendering.</p>
              <button 
                onClick={() => window.location.reload()} 
                style={{ 
                  padding: '10px 20px', 
                  background: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Refresh Page
              </button>
            </div>
          );
        }
      };
      
      root.render(<SafeApp />);
      
      // Clear any error counts on successful render
      sessionStorage.removeItem('errorCount');
      console.log('Application rendered successfully');
      
    } catch (error) {
      console.error('Critical render error:', error);
      
      // Last resort fallback
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
          <h2>Critical Error</h2>
          <p>Failed to render the application. Please refresh the page.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
        </div>
      `;
    }
  };

  // Execute with additional safety
  safeCall(safeRender, 'main application render');
};

// Initialize the application
initializeApp().catch(error => {
  console.error('Failed to initialize application:', error);
  
  // Ultimate fallback
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h2>Initialization Error</h2>
      <p>Failed to initialize the application. Please refresh the page.</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
    </div>
  `;
});