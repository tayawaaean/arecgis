import React from 'react';
import { Box, Typography, Button, Alert, AlertTitle } from '@mui/material';
import { Refresh as RefreshIcon, Warning as WarningIcon } from '@mui/icons-material';
import { reportError } from '../lib/monitoring';

class FeatureErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Feature Error:', error);
      // eslint-disable-next-line no-console
      console.error('Error Info:', errorInfo);
    }
    if (process.env.NODE_ENV === 'production') {
      reportError(error, { componentStack: errorInfo?.componentStack, source: 'FeatureErrorBoundary' });
    }
    
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  }

  render() {
    if (this.state.hasError) {
      const { fallback, featureName = 'Feature' } = this.props;
      
      // Use custom fallback if provided
      if (fallback) {
        return fallback(this.state.error, this.handleRetry);
      }

      // Default fallback UI
      return (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          <AlertTitle>Error Loading {featureName}</AlertTitle>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            There was a problem loading this {featureName.toLowerCase()}. Please try again.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={this.handleRetry}
            >
              Retry
            </Button>
            
            {process.env.NODE_ENV === 'development' && (
              <Button
                size="small"
                variant="text"
                onClick={() => console.error('Error details:', this.state.error)}
              >
                Debug
              </Button>
            )}
          </Box>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default FeatureErrorBoundary;
