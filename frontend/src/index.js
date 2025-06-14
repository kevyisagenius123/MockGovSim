// Cache bust v2.1.1 - 2025-06-14T06:45:00Z - Force complete rebuild
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css';
import { safeCall } from './utils/safeCall.js';

// Global error handler for function call errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Check if it's the specific "r is not a function" error
  if (event.error && event.error.message && event.error.message.includes('is not a function')) {
    console.error('Function call error detected:', event.error.message);
    console.error('Stack trace:', event.error.stack);
    
    // Prevent the error from crashing the app
    event.preventDefault();
    
    // Try to recover by reloading if errors persist
    const errorCount = parseInt(sessionStorage.getItem('errorCount') || '0');
    if (errorCount < 3) {
      sessionStorage.setItem('errorCount', (errorCount + 1).toString());
      console.log('Attempting recovery, error count:', errorCount + 1);
    } else {
      console.log('Too many errors, showing fallback UI');
      // Show fallback UI instead of infinite reload
      const fallbackDiv = document.createElement('div');
      fallbackDiv.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
          <h2>Application Error</h2>
          <p>The application encountered an error. Please refresh the page.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; margin: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
          <button onclick="window.history.back()" style="padding: 10px 20px; margin: 10px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Go Back</button>
        </div>
      `;
      document.body.innerHTML = '';
      document.body.appendChild(fallbackDiv);
    }
  }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  if (event.reason && event.reason.message && event.reason.message.includes('is not a function')) {
    console.error('Promise rejection due to function call error');
    event.preventDefault();
  }
});

// Safe render function
const safeRender = () => {
  try {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );
    
    // Clear error count on successful render
    sessionStorage.removeItem('errorCount');
  } catch (error) {
    console.error('Error during React render:', error);
    
    // Fallback rendering
    const fallbackDiv = document.createElement('div');
    fallbackDiv.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h2>Render Error</h2>
        <p>Failed to render the application. Please refresh the page.</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
      </div>
    `;
    document.body.appendChild(fallbackDiv);
  }
};

// Execute safe render
safeCall(safeRender, 'main render'); 