import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  BugReport as BugReportIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const DocumentViewerDebug = () => {
  const [transferId, setTransferId] = useState('');
  const [documentIndex, setDocumentIndex] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [testSteps, setTestSteps] = useState([]);
  
  const addTestStep = (status, message) => {
    setTestSteps(prev => [...prev, { status, message, timestamp: new Date() }]);
  };
  
  const handleFetchDocument = async () => {
    if (!transferId) {
      setError('Transfer ID is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    setTestSteps([]);
    
    try {
      // Step 1: Test basic fetch without credentials
      addTestStep('info', 'Starting document fetch test...');
      
      // Step 2: Test fetch with credentials
      addTestStep('info', `Fetching document from: /transfers/${transferId}/documents/${documentIndex}`);
      
      const response = await fetch(`/transfers/${transferId}/documents/${documentIndex}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      addTestStep('info', `Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        addTestStep('error', `Error response body: ${errorText}`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Check content type
      const contentType = response.headers.get('content-type');
      addTestStep('success', `Content-Type: ${contentType}`);
      
      // Check content length
      const contentLength = response.headers.get('content-length');
      addTestStep('success', `Content-Length: ${contentLength || 'Not provided'}`);
      
      // Check content disposition
      const contentDisposition = response.headers.get('content-disposition');
      addTestStep('success', `Content-Disposition: ${contentDisposition || 'Not provided'}`);
      
      // Get the blob
      const blob = await response.blob();
      addTestStep('success', `Blob received: ${blob.type}, ${blob.size} bytes`);
      
      // Create object URL
      const url = window.URL.createObjectURL(blob);
      addTestStep('success', `Created blob URL: ${url}`);
      
      setResult({
        contentType,
        contentLength,
        contentDisposition,
        blobType: blob.type,
        blobSize: blob.size,
        objectUrl: url,
        responseHeaders: Array.from(response.headers.entries())
      });
      
      // Clean up the object URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60000);
      
    } catch (error) {
      console.error('Error fetching document:', error);
      setError(error.message);
      addTestStep('error', `Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <BugReportIcon sx={{ mr: 1 }} />
        Document Viewer Debugger
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Use this tool to diagnose issues with document viewing by testing the direct API endpoint.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Transfer ID"
          value={transferId}
          onChange={(e) => setTransferId(e.target.value)}
          placeholder="e.g. 6890301c89ebe7a470e6d46e"
          required
          helperText="Enter the ID of the transfer containing the document"
        />
        
        <TextField
          margin="normal"
          label="Document Index"
          value={documentIndex}
          onChange={(e) => setDocumentIndex(e.target.value)}
          placeholder="0"
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          helperText="Document index (usually 0 for the first document)"
        />
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleFetchDocument}
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
          startIcon={isLoading ? <CircularProgress size={20} /> : <VisibilityIcon />}
        >
          {isLoading ? 'Testing...' : 'Test Document Fetch'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {testSteps.length > 0 && (
        <Accordion defaultExpanded sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Test Steps Log</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {testSteps.map((step, index) => (
              <Alert 
                key={index} 
                severity={step.status} 
                sx={{ mb: 1 }}
                variant="outlined"
              >
                <Typography variant="body2">
                  <strong>{new Date(step.timestamp).toLocaleTimeString()}</strong>: {step.message}
                </Typography>
              </Alert>
            ))}
          </AccordionDetails>
        </Accordion>
      )}
      
      {result && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Test Results
          </Typography>
          
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Document Information
              </Typography>
              
              <Typography variant="body2">
                <strong>Content Type:</strong> {result.contentType || 'Not provided'}
              </Typography>
              
              <Typography variant="body2">
                <strong>Size:</strong> {result.blobSize ? `${(result.blobSize / 1024).toFixed(2)} KB` : 'Unknown'}
              </Typography>
              
              <Typography variant="body2">
                <strong>Blob Type:</strong> {result.blobType || 'Unknown'}
              </Typography>
            </CardContent>
          </Card>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              component="a"
              href={result.objectUrl}
              target="_blank"
              startIcon={<VisibilityIcon />}
            >
              Open Document
            </Button>
          </Box>
          
          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Technical Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" gutterBottom>
                Response Headers:
              </Typography>
              
              <TextField
                multiline
                fullWidth
                rows={8}
                value={result.responseHeaders.map(([key, value]) => `${key}: ${value}`).join('\n')}
                InputProps={{ readOnly: true }}
              />
              
              <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                Object URL:
              </Typography>
              
              <TextField
                fullWidth
                value={result.objectUrl}
                InputProps={{ readOnly: true }}
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Paper>
  );
};

export default DocumentViewerDebug;