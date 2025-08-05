import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
  Link
} from '@mui/material';
import { 
  Close as CloseIcon, 
  GetApp as DownloadIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';

const DocumentPreviewDialog = ({ open, onClose, previewData }) => {
  if (!previewData) return null;
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = previewData.url;
    link.download = previewData.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{previewData.name}</Typography>
          <IconButton onClick={onClose} edge="end" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {previewData.type === 'image' && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <img 
              src={previewData.url} 
              alt={previewData.name} 
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} 
            />
          </Box>
        )}
        {previewData.type === 'pdf' && (
          <Box>
            <Typography variant="body1" paragraph>
              Your PDF is ready. You can view it directly or download it using the buttons below.
            </Typography>
            
            <Box sx={{ height: '500px', mb: 2 }}>
              <iframe 
                src={`${previewData.url}#toolbar=0`} 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
                title="PDF Preview"
              />
            </Box>
            
            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<OpenInNewIcon />}
                component="a"
                href={previewData.url}
                target="_blank"
              >
                Open PDF in New Tab
              </Button>
            </Box>
          </Box>
        )}
        {previewData.type === 'other' && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" gutterBottom>
              This file type cannot be previewed directly
            </Typography>
            <Typography variant="body1" paragraph>
              You can download the file to view it with an appropriate application on your computer.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{ mt: 2 }}
            >
              Download File
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        {previewData.type !== 'other' && (
          <Button 
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            variant="outlined"
          >
            Download
          </Button>
        )}
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentPreviewDialog;