import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Container,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  SwapHoriz as SwapHorizIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Help as HelpIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { 
  useGetRequestQuery, 
  useApproveRequestMutation, 
  useRejectRequestMutation,
  useDownloadDocumentMutation
} from './requestsApiSlice';
import useTitle from '../../hooks/useTitle';
import RequestHelpModal from '../../components/RequestHelpModal';

const RequestDetail = () => {
  useTitle('ArecGIS | Request Details');
  const { id } = useParams();
  const navigate = useNavigate();
  const { isManager, isAdmin } = useAuth();
  
  // Review dialog states
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState(''); // 'approve' or 'reject'
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewPassword, setReviewPassword] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Help modal state
  const [openHelpModal, setOpenHelpModal] = useState(false);
  
  // Mutations
  const [approveRequest, { isLoading: isApproving }] = useApproveRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectRequestMutation();
  const [downloadDocument] = useDownloadDocumentMutation();

  // Fetch request details
  const { 
    data: request, 
    isLoading, 
    isError, 
    error 
  } = useGetRequestQuery(id);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'transfer':
        return <SwapHorizIcon />;
      case 'account_deletion':
        return <DeleteIcon />;
      default:
        return <AssignmentIcon />;
    }
  };

  // Handle review action
  const handleReviewClick = (action) => {
    setReviewAction(action);
    setReviewNotes('');
    setReviewPassword('');
    setRejectionReason('');
    setReviewDialogOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!reviewAction || !reviewPassword) return;

    // submitting review

    try {
      if (reviewAction === 'approve') {
        await approveRequest({ 
          id: request._id, 
          notes: reviewNotes,
          password: reviewPassword
        }).unwrap();
      } else {
        await rejectRequest({ 
          id: request._id, 
          notes: reviewNotes,
          password: reviewPassword,
          rejectionReason: rejectionReason
        }).unwrap();
      }
      setReviewDialogOpen(false);
    } catch (error) {
      console.error('Error reviewing request:', error);
    }
  };
  
  // Help modal handlers
  const handleOpenHelpModal = () => setOpenHelpModal(true);
  const handleCloseHelpModal = () => setOpenHelpModal(false);
  
  // Debug password changes
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setReviewPassword(newPassword);
  };

  // Rejection reason templates
  const rejectionReasons = [
    'Insufficient documentation',
    'Invalid reason provided',
    'Request not justified',
    'Missing required information',
    'Policy violation',
    'Duplicate request',
    'Incorrect inventory selection',
    'Other (specify in notes)'
  ];

  // Handle rejection reason selection
  const handleRejectionReasonChange = (reason) => {
    setRejectionReason(reason);
    if (reason !== 'Other (specify in notes)') {
      setReviewNotes(reason);
    } else {
      setReviewNotes('');
    }
  };

  // Handle document download
  const handleDocumentDownload = async (documentIndex) => {
    try {
      const result = await downloadDocument({ requestId: request._id, documentIndex }).unwrap();
      
      // Create a blob URL and trigger download
      const blob = new Blob([result]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = request.documents[documentIndex].name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError || !request) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Error loading request details: {error?.data?.message || 'Request not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          {/* Header */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {getTypeIcon(request.requestType)}
                <Typography variant="h4" sx={{ ml: 1 }}>
                  {request.requestType === 'transfer' ? 'Transfer Request' : 'Account Deletion Request'}
                </Typography>
                <Chip
                  label={request.status.toUpperCase()}
                  color={getStatusColor(request.status)}
                  sx={{ ml: 2 }}
                />
              </Box>
              <Typography variant="subtitle1" color="text.secondary">
                Request ID: {request._id}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard/requests')}
              >
                Back to Requests
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<HelpIcon />}
                onClick={handleOpenHelpModal}
              >
                Help
              </Button>
            </Grid>
          </Grid>

          {/* Request Information */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Request Information
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Requested by
                  </Typography>
                  <Typography variant="body1">
                    {request.requesterId?.fullName || request.requesterId?.username}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Request Type
                  </Typography>
                  <Typography variant="body1">
                    {request.requestType === 'transfer' ? 'Transfer Request' : 'Account Deletion Request'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={request.status.toUpperCase()}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Submitted Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(request.createdAt).toLocaleString()}
                  </Typography>
                </Box>

                {request.reviewDate && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Review Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(request.reviewDate).toLocaleString()}
                    </Typography>
                  </Box>
                )}

                {request.reviewedBy && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Reviewed by
                    </Typography>
                    <Typography variant="body1">
                      {request.reviewedBy.fullName || request.reviewedBy.username}
                    </Typography>
                  </Box>
                )}

                {request.status === 'rejected' && request.rejectionReason && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Rejection Reason
                    </Typography>
                    <Typography variant="body1" color="error.main">
                      {request.rejectionReason}
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* Action Buttons for Admin/Manager */}
              {(isAdmin || isManager) && request.status === 'pending' && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Admin Actions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckIcon />}
                      onClick={() => handleReviewClick('approve')}
                      disabled={isApproving || isRejecting}
                    >
                      Approve Request
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<CloseIcon />}
                      onClick={() => handleReviewClick('reject')}
                      disabled={isApproving || isRejecting}
                    >
                      Reject Request
                    </Button>
                  </Box>
                </Paper>
              )}

              {/* Resubmit Button for Rejected Requests */}
              {request.status === 'rejected' && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Request Actions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<RefreshIcon />}
                      onClick={() => navigate(`/dashboard/requests/new?resubmit=${request._id}`)}
                    >
                      Resubmit Request
                    </Button>
                  </Box>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Inventory Information for Transfer Requests */}
              {request.requestType === 'transfer' && request.inventoryId && (
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Inventory Information
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Owner Name
                    </Typography>
                    <Typography variant="body1">
                      {request.inventoryId.properties?.ownerName}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      RE Category
                    </Typography>
                    <Typography variant="body1">
                      {request.inventoryId.properties?.reCat}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      RE Class
                    </Typography>
                    <Typography variant="body1">
                      {request.inventoryId.properties?.reClass}
                    </Typography>
                  </Box>

                  {request.inventoryId.properties?.address && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1">
                        {request.inventoryId.properties.address.city}, {request.inventoryId.properties.address.province}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              )}

              {/* Supporting Documents */}
              {request.documents && request.documents.length > 0 && (
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Supporting Documents
                  </Typography>
                  {request.documents.map((doc, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box>
                        <Typography variant="body1">{doc.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(doc.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                                                            onClick={() => handleDocumentDownload(index)}
                      >
                        Download
                      </Button>
                    </Box>
                  ))}
                </Paper>
              )}
            </Grid>

            {/* Reason */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Reason for Request
                </Typography>
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                  {request.reason}
                </Typography>
              </Paper>
            </Grid>

            {/* Admin Notes */}
            {request.notes && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Admin Notes
                  </Typography>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {request.notes}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {reviewAction === 'approve' ? 'Approve Request' : 'Reject Request'}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to {reviewAction} this {request.requestType === 'transfer' ? 'transfer' : 'account deletion'} request?
          </Typography>
          
          {/* Rejection Reason Selection (only for rejections) */}
          {reviewAction === 'reject' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Rejection Reason</InputLabel>
              <Select
                value={rejectionReason}
                onChange={(e) => handleRejectionReasonChange(e.target.value)}
                label="Select Rejection Reason"
              >
                {rejectionReasons.map((reason) => (
                  <MenuItem key={reason} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label={reviewAction === 'reject' ? 'Additional Notes (optional)' : 'Notes (optional)'}
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder={reviewAction === 'reject' 
              ? 'Add any additional notes about this rejection...' 
              : `Add any notes about this ${reviewAction}al...`
            }
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            type="password"
            label="Confirm Your Password"
            value={reviewPassword}
            onChange={handlePasswordChange}
            placeholder="Enter your password to confirm this action"
            sx={{ mt: 2 }}
            required
            error={!reviewPassword}
            helperText={!reviewPassword ? 'Password is required' : ''}
          />
          
          {request.requestType === 'account_deletion' && reviewAction === 'approve' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <strong>Warning:</strong> Approving this request will set the user's account as inactive.
            </Alert>
          )}
          
          {request.requestType === 'transfer' && reviewAction === 'approve' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <strong>Note:</strong> Approving this request will transfer the inventory ownership to the requesting user.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            color={reviewAction === 'approve' ? 'success' : 'error'}
            disabled={isApproving || isRejecting || !reviewPassword}
          >
            {isApproving || isRejecting ? 'Processing...' : `${reviewAction === 'approve' ? 'Approve' : 'Reject'} Request`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Help Modal */}
      <RequestHelpModal
        open={openHelpModal}
        onClose={handleCloseHelpModal}
        formType="detail"
      />
    </Container>
  );
};

export default RequestDetail;
