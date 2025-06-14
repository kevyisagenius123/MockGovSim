import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
      console.error('Production Error:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-xl p-6 border border-red-500">
            <div className="flex items-center mb-4">
              <div className="bg-red-500 rounded-full p-2 mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-red-400">Application Error</h1>
                <p className="text-gray-400 text-sm">Error ID: {errorId}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Something went wrong while rendering this component. This might be due to:
              </p>
              <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                <li>Network connectivity issues</li>
                <li>Missing or corrupted data</li>
                <li>Browser compatibility problems</li>
                <li>Temporary server issues</li>
              </ul>
            </div>

            {isDevelopment && error && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Error Details (Development)</h3>
                <div className="bg-gray-900 p-4 rounded border border-gray-700 overflow-auto">
                  <p className="text-red-300 font-mono text-sm mb-2">{error.message}</p>
                  {error.stack && (
                    <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {isDevelopment && errorInfo && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Component Stack</h3>
                <div className="bg-gray-900 p-4 rounded border border-gray-700 overflow-auto">
                  <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Go Back
              </button>
            </div>

            {!isDevelopment && (
              <div className="mt-4 p-3 bg-yellow-900 border border-yellow-600 rounded">
                <p className="text-yellow-200 text-sm">
                  <strong>Note:</strong> If this error persists, please try refreshing the page or contact support with Error ID: {errorId}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 