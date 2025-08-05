import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Paper, Grid, Typography, IconButton, Button,
  Card, CardContent, Divider, Chip, Alert, CircularProgress,
  List, ListItem, ListItemIcon, ListItemText, Backdrop, Tooltip,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  Note as NoteIcon,
  GetApp as DownloadIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material/';
import { format } from 'date-fns';
import useAuth from '../../hooks/useAuth';
import useTitle from '../../hooks/useTitle';
import { boxmain, boxpaper } from '../../config/style';
import { useGetTransferQuery, useGetTransferDocumentMutation } from './transferApiSlice';

const TransferDetail = () => {
  useTitle('ArecGIS | Transfer Details');
  const { id } = useParams();
  const navigate = useNavigate();
  const { isManager, isAdmin } = useAuth();
  
  // State for document handling and UI feedback
  const [isDownloadingDocument, setIsDownloadingDocument] = useState(false);
  const [currentDocIndex, setCurrentDocIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // RTK Query hooks
  const { 
    data: transfer, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetTransferQuery(id);
  
  // Document download mutation from RTK Query
  const [getDocument, { isLoading: isDocumentLoading }] = useGetTransferDocumentMutation();
  
  // Function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
    } catch (e) {
      return dateString;
    }
  };
  
  // Function to determine status chip color
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };
  
  // Function to handle document download with RTK Query
  const handleDownloadDocument = async (docIndex) => {
    setIsDownloadingDocument(true);
    setCurrentDocIndex(docIndex);
    
    try {
      console.log(`Downloading document at index ${docIndex} for transfer ${id}`);
      
      // Use RTK Query mutation to get document data
      const response = await getDocument({ 
        transferId: id, 
        documentIndex: docIndex 
      }).unwrap();
      
      // Safety check for the response
      if (!response) {
        throw new Error('Empty response received');
      }
      
      // Create a Blob from the response
      const documentBlob = new Blob([response], { 
        type: transfer.documents[docIndex].type || 'application/pdf' 
      });
      
      // Get document name from transfer data
      const docInfo = transfer.documents[docIndex];
      const documentName = docInfo?.name || `document-${docIndex}.pdf`;
      
      // Create a download link using window.document to avoid naming conflicts
      const url = URL.createObjectURL(documentBlob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = documentName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      // Show success message
      setSnackbarMessage(`Document "${documentName}" downloaded successfully`);
      setSnackbarOpen(true);
      
      // Clean up the URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 30000);
      
    } catch (err) {
      console.error('Error downloading document:', err);
      setSnackbarMessage(`Error downloading document: ${err.message || 'Unknown error'}`);
      setSnackbarOpen(true);
    } finally {
      setIsDownloadingDocument(false);
      setCurrentDocIndex(null);
    }
  };
  
  // Function to handle refresh
  const handleRefresh = () => {
    refetch();
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Loading state
  if (isLoading) return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    </Container>
  );
  
  // Error state
  if (isError || !transfer) return (
    <Container maxWidth="md">
      <Box sx={boxmain}>
        <Box sx={boxpaper}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <IconButton onClick={() => navigate('/dashboard/transfers')}>
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" component="h1">
                  Error Loading Transfer
                </Typography>
              </Grid>
            </Grid>
            <Alert severity="error" sx={{ mt: 2 }}>
              {error?.data?.message || 'Could not load transfer details. Please try again later.'}
            </Alert>
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => navigate('/dashboard/transfers')}
              >
                Back to Transfers
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );

  // Extract inventory details, handling both populated objects and plain IDs
  const getInventoryDetails = () => {
    const inventory = transfer.inventoryId || {};
    
    // Check if inventoryId is populated or just an ID
    if (typeof inventory === 'string' || !inventory.properties) {
      return {
        ownerName: 'Not available',
        reCat: 'Not available',
        address: { city: 'Not available', province: 'Not available' }
      };
    }
    
    return {
      ownerName: inventory.properties.ownerName || 'Not available',
      reCat: inventory.properties.reCat || 'Not available',
      address: inventory.properties.address || { city: 'Not available', province: 'Not available' }
    };
  };
  
  // Get installer usernames, handling both populated objects and plain IDs
  const getPreviousInstallerName = () => {
    if (!transfer.previousInstallerId) return 'Not available';
    return typeof transfer.previousInstallerId === 'object' && transfer.previousInstallerId.username 
      ? transfer.previousInstallerId.username 
      : 'ID: ' + transfer.previousInstallerId;
  };
  
  const getNewInstallerName = () => {
    if (!transfer.newInstallerId) return 'Not available';
    return typeof transfer.newInstallerId === 'object' && transfer.newInstallerId.username 
      ? transfer.newInstallerId.username 
      : 'ID: ' + transfer.newInstallerId;
  };
  
  // Get admin name who processed the transfer
  const getProcessedByName = () => {
    if (!transfer.approvedBy) return 'Not available';
    return typeof transfer.approvedBy === 'object' && transfer.approvedBy.username
      ? transfer.approvedBy.username
      : 'ID: ' + transfer.approvedBy;
  };
  
  const inventoryDetails = getInventoryDetails();
  
  // Check if user can edit the transfer
  const canEdit = isAdmin || (isManager && transfer.status === 'pending');

  return (
    <Container maxWidth="md">
      <Box sx={boxmain}>
        <Box sx={boxpaper}>
          <Paper elevation={3} sx={{ p: 3 }}>
            {/* Header with back button, title and status */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Grid item>
                <IconButton onClick={() => navigate('/dashboard/transfers')}>
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" component="h1">
                  Transfer Request #{transfer._id?.substring(transfer._id.length - 6).toUpperCase() || 'N/A'}
                </Typography>
              </Grid>
              <Grid item>
                <Chip 
                  label={transfer.status || 'Unknown'} 
                  color={getStatusColor(transfer.status)} 
                  size="medium"
                />
              </Grid>
            </Grid>
            
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              {/* Left column */}
              <Grid item xs={12} md={6}>
                {/* Transfer Information Card */}
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Transfer Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Status:</strong> {transfer.status || 'Unknown'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Created:</strong> {formatDate(transfer.createdAt)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Last Updated:</strong> {formatDate(transfer.updatedAt)}
                        </Typography>
                      </Grid>
                      {transfer.approvalDate && (
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            <strong>Processed On:</strong> {formatDate(transfer.approvalDate)}
                          </Typography>
                        </Grid>
                      )}
                      {transfer.approvedBy && (
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            <strong>Processed By:</strong> {getProcessedByName()}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
                
                {/* Inventory Details Card */}
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Inventory Details
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Owner:</strong> {inventoryDetails.ownerName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Category:</strong> {inventoryDetails.reCat}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Location:</strong> {
                            `${inventoryDetails.address.city || 'N/A'}, ${inventoryDetails.address.province || 'N/A'}`
                          }
                        </Typography>
                      </Grid>
                      {transfer.inventoryId && typeof transfer.inventoryId !== 'string' && (
                        <Grid item xs={12}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/dashboard/inventory/${transfer.inventoryId._id}`)}
                          >
                            View Inventory
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Right column */}
              <Grid item xs={12} md={6}>
                {/* Installer Information Card */}
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Installer Information
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        <strong>From:</strong> {getPreviousInstallerName()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon color="secondary" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        <strong>To:</strong> {getNewInstallerName()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                
                {/* Reason Card */}
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <NoteIcon sx={{ mr: 1 }} /> Reason for Transfer
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', minHeight: '40px' }}>
                      {transfer.reason || 'No reason provided'}
                    </Typography>
                  </CardContent>
                </Card>
                
                {/* Admin Notes Card (only if present) */}
                {transfer.notes && (
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Admin Notes
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {transfer.notes}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Grid>
              
              {/* Documents section (full width) */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <DescriptionIcon sx={{ mr: 1 }} /> Supporting Documents
                    </Typography>
                    
                    {transfer.documents && transfer.documents.length > 0 ? (
                      <List>
                        {transfer.documents.map((doc, index) => (
                          <ListItem
                            key={index}
                            divider={index !== transfer.documents.length - 1}
                            secondaryAction={
                              <Button
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleDownloadDocument(index)}
                                disabled={isDownloadingDocument && currentDocIndex === index}
                                color="primary"
                              >
                                {isDownloadingDocument && currentDocIndex === index 
                                  ? 'Downloading...' 
                                  : 'Download'}
                              </Button>
                            }
                          >
                            <ListItemIcon>
                              <DescriptionIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={doc.name}
                              secondary={
                                <>
                                  {doc.type || 'Unknown Type'} 
                                  {doc.size && ` • ${Math.round(doc.size / 1024)} KB`}
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Alert severity="info">No documents were attached to this transfer request.</Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Bottom action buttons */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard/transfers')}
              >
                Back to Transfers
              </Button>
              
              {canEdit && (
                <Tooltip title={
                  transfer.status !== 'pending' 
                    ? 'This transfer has already been processed' 
                    : 'Process this transfer'
                }>
                  <span>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/dashboard/transfers/process/${transfer._id}`)}
                      disabled={transfer.status !== 'pending'}
                    >
                      Process Transfer
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
      
      {/* Loading overlay */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isDownloadingDocument || isDocumentLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      {/* Notification snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default TransferDetail;