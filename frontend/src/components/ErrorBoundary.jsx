import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log specific function call errors
    if (error.message && error.message.includes('is not a function')) {
      console.error('Function call error detected:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorType: 'FUNCTION_CALL_ERROR'
      });
      
      // Try to identify the specific function that failed
      const stackLines = error.stack?.split('\n') || [];
      const relevantLines = stackLines.filter(line => 
        line.includes('at ') && 
        (line.includes('.jsx') || line.includes('.js'))
      );
      
      console.error('Relevant stack trace lines:', relevantLines);
    }

    // Log React-specific errors
    if (error.message && (error.message.includes('React') || error.message.includes('render'))) {
      console.error('React rendering error detected:', {
        message: error.message,
        componentStack: errorInfo.componentStack,
        errorType: 'REACT_RENDER_ERROR'
      });
    }

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold text-red-500 mb-4">Something went wrong</h2>
            <p className="text-text-secondary mb-4">
              We encountered an error while rendering this component. This might be due to a temporary issue.
            </p>
            
            {this.state.error?.message?.includes('is not a function') && (
              <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded">
                <p className="text-yellow-400 text-sm">
                  <strong>Function Call Error:</strong> This appears to be a JavaScript function call error. 
                  The page should work correctly after refreshing.
                </p>
              </div>
            )}
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-accent">Error Details (Development)</summary>
                <pre className="mt-2 text-xs bg-background p-2 rounded overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/80 transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 