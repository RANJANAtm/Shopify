import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-neutral-50 px-4'>
          <div className='glass-card p-8 max-w-lg w-full text-center'>
            {/* Error Icon */}
            <div className='w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full 
                          flex items-center justify-center mx-auto mb-6 shadow-lg'>
              <AlertTriangle className='w-10 h-10 text-white' />
            </div>

            {/* Error Message */}
            <h1 className='text-3xl font-bold text-neutral-700 mb-4'>
              Oops! Something went wrong
            </h1>
            <p className='text-neutral-600 mb-8'>
              We encountered an unexpected error. Don't worry, our team has been notified 
              and we're working to fix it.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left'>
                <h3 className='font-semibold text-red-800 mb-2'>Error Details:</h3>
                <pre className='text-sm text-red-700 overflow-auto max-h-32'>
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            {/* Action Buttons */}
            <div className='space-y-3'>
              <button
                onClick={this.handleRefresh}
                className='w-full btn-primary flex items-center justify-center gap-2'
              >
                <RefreshCw className='w-5 h-5' />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className='w-full btn-ghost flex items-center justify-center gap-2'
              >
                <Home className='w-5 h-5' />
                Go to Homepage
              </button>
            </div>

            {/* Support Info */}
            <div className='mt-8 pt-6 border-t border-neutral-200'>
              <p className='text-sm text-neutral-500'>
                If the problem persists, please contact our support team at{' '}
                <a 
                  href='mailto:support@moderncart.com' 
                  className='text-primary-600 hover:text-primary-500 font-medium'
                >
                  support@moderncart.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
