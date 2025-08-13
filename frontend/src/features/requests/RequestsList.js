import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Container,
  Grid,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  SwapHoriz as SwapHorizIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Help as HelpIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { 
  useGetRequestsQuery, 
  useApproveRequestMutation, 
  useRejectRequestMutation,
  useDownloadDocumentMutation
} from './requestsApiSlice';
import useTitle from '../../hooks/useTitle';
import RequestHelpModal from '../../components/RequestHelpModal';

const RequestsList = () => {
  useTitle('ArecGIS | Requests');
  const navigate = useNavigate();
  const { isManager, isAdmin } = useAuth();
  
  // Debug auth values
  
  
  // Check if user has permissions
  if (!isAdmin && !isManager) {

  } else {
    
  }
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Pagination state
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  
  // Review dialog states
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
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

  // Fetch requests
  const { 
    data: requestsData, 
    isLoading, 
    isError, 
    error 
  } = useGetRequestsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    isAdmin: isAdmin || isManager,
    status: statusFilter,
    requestType: typeFilter
  });

  const requests = requestsData?.data || [];
  

  
  // Check for pending requests
  const pendingRequests = requests.filter(req => req.status === 'pending');

  if (pendingRequests.length > 0) {
    
  }

  // Filter requests by tab
  const filteredRequests = useMemo(() => {
    if (!isAdmin && !isManager) return requests; // Regular users see all their requests
    
    switch (tabValue) {
      case 0: // All
        return requests;
      case 1: // Pending
        return requests.filter(req => req.status === 'pending');
      case 2: // Approved
        return requests.filter(req => req.status === 'approved');
      case 3: // Rejected
        return requests.filter(req => req.status === 'rejected');
      default:
        return requests;
    }
  }, [requests, tabValue, isAdmin, isManager]);

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
  const handleReviewClick = (request, action) => {
    setSelectedRequest(request);
    setReviewAction(action);
    setReviewNotes('');
    setReviewPassword('');
    setRejectionReason('');
    setReviewDialogOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedRequest || !reviewAction || !reviewPassword) return;



    try {
      if (reviewAction === 'approve') {
        await approveRequest({ 
          id: selectedRequest._id, 
          notes: reviewNotes,
          password: reviewPassword
        }).unwrap();
      } else {
        await rejectRequest({ 
          id: selectedRequest._id, 
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  // Define table columns
  const columns = [
    {
      field: 'requestType',
      headerName: 'Type',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {getTypeIcon(params.value)}
          <Typography sx={{ ml: 1 }}>
            {params.value === 'transfer' ? 'Transfer' : 'Account Deletion'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value.toUpperCase()}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'requesterId',
      headerName: 'Requested By',
      width: 200,
      valueGetter: (params) => params.row.requesterId?.fullName || params.row.requesterId?.username,
    },
    {
      field: 'inventoryId',
      headerName: 'Inventory',
      width: 250,
      valueGetter: (params) => {
        if (params.row.requestType === 'transfer' && params.row.inventoryId) {
          return `${params.row.inventoryId.properties?.ownerName} (${params.row.inventoryId.properties?.reCat})`;
        }
        return 'N/A';
      },
    },
    {
      field: 'reason',
      headerName: 'Reason',
      width: 300,
      valueGetter: (params) => {
        const reason = params.row.reason || '';
        return reason.length > 50 ? `${reason.substring(0, 50)}...` : reason;
      },
    },
    {
      field: 'rejectionReason',
      headerName: 'Rejection Reason',
      width: 200,
      valueGetter: (params) => {
        if (params.row.status === 'rejected' && params.row.rejectionReason) {
          return params.row.rejectionReason;
        }
        return '';
      },
      renderCell: (params) => {
        if (params.row.status === 'rejected' && params.row.rejectionReason) {
          return (
            <Chip
              label={params.row.rejectionReason}
              color="error"
              size="small"
              variant="outlined"
            />
          );
        }
        return null;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Submitted',
      width: 150,
      valueGetter: (params) => new Date(params.row.createdAt).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 400,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate(`/dashboard/requests/${params.row._id}`)}
            sx={{ minWidth: 'auto', px: 1 }}
          >
            View
          </Button>
          

          

          
          {(isAdmin || isManager) && params.row.status === 'pending' && (
            <>
              <Button
                size="small"
                color="success"
                variant="outlined"
                startIcon={<CheckIcon />}
                onClick={() => handleReviewClick(params.row, 'approve')}
                sx={{ minWidth: 'auto', px: 1 }}
              >
                Approve
              </Button>
              <Button
                size="small"
                color="error"
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={() => handleReviewClick(params.row, 'reject')}
                sx={{ minWidth: 'auto', px: 1 }}
              >
                Reject
              </Button>
            </>
          )}
          

          
          {params.row.status === 'rejected' && (
            <Button
              size="small"
              color="primary"
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => navigate(`/dashboard/requests/new?resubmit=${params.row._id}`)}
              sx={{ minWidth: 'auto', px: 1 }}
            >
              Resubmit
            </Button>
          )}
        </Box>
      ),
    },
  ];

  // Handle document download
  const handleDownloadDocument = async (requestId, documentIndex, documentName) => {
    try {
      const result = await downloadDocument({ requestId, documentIndex }).unwrap();
      
      // Create a blob URL and trigger download
      const blob = new Blob([result]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = documentName;
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

  if (isError) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading requests: {error?.data?.message || 'Unknown error'}
          </Alert>
          

          
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          
          <Button 
            variant="contained" 
            onClick={() => navigate('/dashboard/requests/new')}
          >
            Try New Request
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                {isAdmin || isManager ? 'All Requests' : 'My Requests'}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AssignmentIcon />}
                onClick={() => navigate('/dashboard/requests/new')}
              >
                New Request
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



          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Filter by Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Filter by Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="transfer">Transfer Requests</MenuItem>
                  <MenuItem value="account_deletion">Account Deletion</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Tabs for admin/manager view */}
          {(isAdmin || isManager) && (
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="All" />
              <Tab label="Pending" />
              <Tab label="Approved" />
              <Tab label="Rejected" />
            </Tabs>
          )}

          {/* Requests Table */}
          {filteredRequests.length === 0 ? (
            <Alert severity="info">
              No requests found. {!isAdmin && !isManager && (
                <>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ ml: 2 }}
                    onClick={() => navigate('/dashboard/requests/new')}
                  >
                    Create New Request
                  </Button>
                </>
              )}
            </Alert>
          ) : (
            <Box sx={{ height: '70vh', width: '100%' }}>
              <DataGrid
                aria-label="Requests table"
                rows={filteredRequests.map(request => ({ ...request, id: request._id }))}
                columns={columns}
                pagination
                paginationMode="server"
                rowCount={requestsData?.total || 0}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10, 20, 50, 100]}
                density="compact"
                disableRowSelectionOnClick
                slots={{ toolbar: GridToolbar, noRowsOverlay: () => (
                  <Box role="status" aria-live="polite" sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">No requests found.</Typography>
                  </Box>
                ) }}
                slotProps={{
                  toolbar: {
                    printOptions: { disableToolbarButton: true },
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
              />
            </Box>
          )}
        </Paper>
      </Box>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {reviewAction === 'approve' ? 'Approve Request' : 'Reject Request'}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to {reviewAction} this {selectedRequest?.requestType === 'transfer' ? 'transfer' : 'account deletion'} request?
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
          
          {selectedRequest?.requestType === 'account_deletion' && reviewAction === 'approve' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <strong>Warning:</strong> Approving this request will set the user's account as inactive.
            </Alert>
          )}
          
          {selectedRequest?.requestType === 'transfer' && reviewAction === 'approve' && (
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
        formType="list"
      />
    </Container>
  );
};

export default RequestsList;
