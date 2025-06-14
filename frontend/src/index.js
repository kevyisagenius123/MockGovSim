import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css';

// Global error handler for function call errors
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('is not a function')) {
    console.error('Global function call error caught:', {
      message: event.error.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error.stack
    });
    
    // Prevent the error from crashing the app
    event.preventDefault();
    
    // Try to reload the page after a short delay if the error persists
    setTimeout(() => {
      if (document.querySelector('.error-boundary') || 
          document.body.innerHTML.includes('Something went wrong')) {
        console.log('Reloading page due to persistent function call errors...');
        window.location.reload();
      }
    }, 2000);
    
    return true; // Prevent default error handling
  }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('is not a function')) {
    console.error('Global promise rejection with function call error:', event.reason);
    event.preventDefault();
    return true;
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
); 