import { useState, useCallback } from 'react';
import { reportError } from '../lib/monitoring';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleError = useCallback((error) => {
    console.error('Error caught by hook:', error);
    
    // Set error state
    setError(error);
    setIsError(true);

    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      reportError(error, { source: 'useErrorHandler' });
    }

    // Auto-clear error after 10 seconds
    setTimeout(() => {
      clearError();
    }, 10000);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  const retry = useCallback((retryFunction) => {
    if (typeof retryFunction === 'function') {
      clearError();
      retryFunction();
    }
  }, [clearError]);

  return {
    error,
    isError,
    handleError,
    clearError,
    retry
  };
};

// Deprecated: handled by reportError

export default useErrorHandler;
