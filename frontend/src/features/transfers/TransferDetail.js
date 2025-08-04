import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Paper, Grid, Typography, IconButton, Button,
  Card, CardContent, Divider, Chip, Alert, CircularProgress,
  List, ListItem, ListItemIcon, ListItemText, Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  Note as NoteIcon
} from '@mui/icons-material/';
import { format } from 'date-fns';
import useAuth from "../../hooks/useAuth";
import useTitle from '../../hooks/useTitle';
import { boxmain, boxpaper } from '../../config/style';
import { useGetTransferQuery } from './transferApiSlice';

const TransferDetail = () => {
  useTitle('ArecGIS | Transfer Details');
  const { id } = useParams();
  const navigate = useNavigate();
  const { isManager, isAdmin } = useAuth();
  
  const { data, isLoading, isError, error } = useGetTransferQuery(id);

  // Function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
    } catch (e) {
      return dateString;
    }
  };
  
  // Function to get status chip color
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };
  
  // Function to download/view document
  const handleViewDocument = (docIndex) => {
    window.open(`/api/transfers/${id}/documents/${docIndex}`, '_blank');
  };

  if (isLoading) return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    </Container>
  );
  
  if (isError || !data) return (
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
              {error?.data?.message || 'Could not load transfer details'}
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

  // Safely access nested properties with null/undefined checks
  const transfer = data;
  
  // Handle both populated objects and plain IDs for references
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

  return (
    <Container maxWidth="md">
      <Box sx={boxmain}>
        <Box sx={boxpaper}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item>
                <IconButton onClick={() => navigate('/dashboard/transfers')}>
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" component="h1">
                  Transfer Request Details
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
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Transfer Information
                    </Typography>
                    
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Status:</strong> {transfer.status || 'Unknown'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          <strong>Submitted:</strong> {formatDate(transfer.createdAt)}
                        </Typography>
                      </Grid>
                      {transfer.approvalDate && (
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            <strong>Processed:</strong> {formatDate(transfer.approvalDate)}
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
                
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Inventory Details
                    </Typography>
                    
                    <Grid container spacing={1}>
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
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Installer Information
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
                
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <NoteIcon sx={{ mr: 1 }} /> Reason for Transfer
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {transfer.reason || 'No reason provided'}
                    </Typography>
                  </CardContent>
                </Card>
                
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
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <DescriptionIcon sx={{ mr: 1 }} /> Supporting Documents
                    </Typography>
                    
                    {transfer.documents && transfer.documents.length > 0 ? (
                      <List dense>
                        {transfer.documents.map((doc, index) => (
                          <ListItem key={index} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <DescriptionIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Link 
                                  component="button" 
                                  variant="body2" 
                                  onClick={() => handleViewDocument(index)}
                                >
                                  {doc.name}
                                </Link>
                              }
                              secondary={doc.size ? `${(doc.size / 1024).toFixed(2)} KB` : 'N/A'}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2">No documents available</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
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
};

export default TransferDetail;