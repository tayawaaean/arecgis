import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Container,
  Grid,
  Typography,
  IconButton,
  Alert,
  Collapse,
  Paper,
  CircularProgress,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Zoom,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { 
  Upload as UploadFileIcon, 
  ArrowBack as ArrowBackIcon,
  Description as DocumentIcon,
  SwapHoriz as TransferIcon,
  CheckCircleOutline as CheckCircleIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  CheckCircle as SuccessIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import useAuth from "../../hooks/useAuth";
import { useAddNewTransferMutation } from "./transferApiSlice";
import { useVerifyPasswordMutation } from "../../features/auth/authApiSlice";
import { format } from "date-fns";

// Styled components for file upload
const UploadArea = styled('div')(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: isDragActive ? theme.palette.action.hover : theme.palette.background.default,
  transition: 'all 0.3s',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const FilePreview = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  position: 'relative',
}));

// Animation for success icon
const SuccessIconStyled = styled(SuccessIcon)(({ theme }) => ({
  fontSize: '4rem',
  color: theme.palette.success.main,
  animation: 'pulse 1.5s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.95)',
      boxShadow: '0 0 0 0 rgba(0, 200, 83, 0.7)',
    },
    '70%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 10px rgba(0, 200, 83, 0)',
    },
    '100%': {
      transform: 'scale(0.95)',
      boxShadow: '0 0 0 0 rgba(0, 200, 83, 0)',
    },
  },
}));

const WarningIconStyled = styled(WarningIcon)(({ theme }) => ({
  fontSize: '4rem',
  color: theme.palette.warning.main,
  marginBottom: theme.spacing(2)
}));

const TransferForm = ({ allUsers, inventory = null }) => {
  const [addNewTransfer, { isLoading, isSuccess, isError, error }] = useAddNewTransferMutation();
  const [verifyPassword, { isLoading: isVerifying }] = useVerifyPasswordMutation();
  const navigate = useNavigate();
  const { username, isManager, isAdmin } = useAuth();

  // FORM STATES
  const [transferDocuments, setTransferDocuments] = useState(null);
  const [filesCount, setFilesCount] = useState(null);
  const [transferReason, setTransferReason] = useState("");
  const [newInstallerId, setNewInstallerId] = useState("");
  const [newInstallerName, setNewInstallerName] = useState(""); // Add state for installer name
  const [inventoryId, setInventoryId] = useState(inventory ? inventory.id : "");
  const [isDragActive, setIsDragActive] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Password confirmation dialog states
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  // Success Dialog State
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Duplicate check states
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [existingTransfers, setExistingTransfers] = useState([]);
  
  // If inventory not provided as prop, we need a list of inventories to select from
  const [inventories, setInventories] = useState([]);
  const [isLoadingInventories, setIsLoadingInventories] = useState(false);

  // Get current user's ID
  const getUserId = allUsers.filter((user) => user.username === username);
  const currentUserId = Object.values(getUserId).map((user) => user.id).toString();

  // Filter users to only show those with Installer role
  const installerUsers = useMemo(() => {
    return allUsers.filter(user => 
      // Check if roles is an array that includes 'Installer'
      (Array.isArray(user.roles) && user.roles.includes('Installer')) ||
      // Or if role is a string equal to 'Installer'
      user.role === 'Installer' ||
      // Or if roles is an object with Installer property
      (typeof user.roles === 'object' && user.roles.Installer)
    );
  }, [allUsers]);

  // Reset form after successful submission
  useEffect(() => {
    if (isSuccess) {
      setShowSuccessDialog(true);
      
      // Navigate back to inventories page after delay (after user closes the dialog or auto-timeout)
      setTimeout(() => {
        if (showSuccessDialog) {
          setShowSuccessDialog(false);
          setTimeout(() => navigate("/dashboard/inventories"), 500);
        }
      }, 5000);
    }
  }, [isSuccess, navigate, showSuccessDialog]);

  // If inventory not provided, fetch list of user's inventories
  useEffect(() => {
    if (!inventory) {
      const fetchInventories = async () => {
        setIsLoadingInventories(true);
        try {
          // This is a placeholder - you'll need to implement the actual API call
          const response = await fetch(`/api/inventories/user/${currentUserId}`);
          const data = await response.json();
          setInventories(data);
        } catch (err) {
          console.error("Failed to fetch inventories:", err);
        } finally {
          setIsLoadingInventories(false);
        }
      };
      
      fetchInventories();
    }
  }, [inventory, currentUserId]);

  // Form handlers
  const onReasonChanged = (e) => {
    setTransferReason(e.target.value);
    validateField('reason', e.target.value);
  };
  
  const onNewInstallerChanged = (e) => {
    const id = e.target.value;
    setNewInstallerId(id);
    
    // Store the installer username when selecting them
    const selectedUser = installerUsers.find(user => user.id === id);
    if (selectedUser) {
      setNewInstallerName(selectedUser.username);
    }
    
    validateField('installer', id);
  };
  
  const onInventoryChanged = (e) => {
    setInventoryId(e.target.value);
    validateField('inventory', e.target.value);
  };
  
  const onDocumentsChanged = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setTransferDocuments(files);
      setFilesCount(files.length);
      validateField('documents', files);
    }
  };

  // Success dialog handler
  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    navigate("/dashboard/inventories");
  };

  // Duplicate dialog handlers
  const handleCloseDuplicateDialog = () => {
    setDuplicateDialogOpen(false);
    setExistingTransfers([]);
  };

  const handleProceedWithTransfer = () => {
    handleCloseDuplicateDialog();
    setPasswordDialogOpen(true);
  };

  // Check for duplicate transfer requests
  const checkForDuplicates = async () => {
    setCheckingDuplicates(true);
    try {
      // Get the inventory ID to check
      const idToCheck = inventoryId || (inventory ? inventory.id : null);
      
      if (!idToCheck) {
        setCheckingDuplicates(false);
        return false;
      }
      
      // Call API to check for existing transfers for this inventory
      const response = await fetch(`/api/transfers/check/${idToCheck}`);
      const data = await response.json();
      
      // If there are pending transfers, show the duplicate dialog
      if (data && data.length > 0) {
        setExistingTransfers(data);
        setDuplicateDialogOpen(true);
        setCheckingDuplicates(false);
        return true;
      }
      
      // No duplicates found
      setCheckingDuplicates(false);
      return false;
    } catch (err) {
      console.error("Failed to check for duplicates:", err);
      setCheckingDuplicates(false);
      return false;
    }
  };

  // Password dialog handlers
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    setPassword("");
    setPasswordError("");
  };

  const handlePasswordVerification = async () => {
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    try {
      await verifyPassword({ password }).unwrap();
      // Password verification successful, proceed with transfer
      handlePasswordDialogClose();
      submitTransfer();
    } catch (error) {
      setPasswordError(error?.data?.message || "Password verification failed");
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setTransferDocuments(files);
      setFilesCount(files.length);
      validateField('documents', files);
    }
  };

  const handleRemoveFile = (index) => {
    if (transferDocuments) {
      const dt = new DataTransfer();
      
      for (let i = 0; i < transferDocuments.length; i++) {
        if (i !== index) {
          dt.items.add(transferDocuments[i]);
        }
      }
      
      setTransferDocuments(dt.files);
      setFilesCount(dt.files.length);
      validateField('documents', dt.files);
    }
  };

  // Field validation
  const validateField = (field, value) => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'reason':
        if (!value || value.trim() === '') {
          errors.reason = 'Reason is required';
        } else if (value.length < 10) {
          errors.reason = 'Reason should be at least 10 characters';
        } else {
          delete errors.reason;
        }
        break;
      
      case 'installer':
        if (!value) {
          errors.installer = 'New installer selection is required';
        } else {
          delete errors.installer;
        }
        break;
      
      case 'inventory':
        if (!value) {
          errors.inventory = 'Inventory selection is required';
        } else {
          delete errors.inventory;
        }
        break;
      
      case 'documents':
        if (!value || value.length === 0) {
          errors.documents = 'At least one document is required';
        } else if (value.length > 5) {
          errors.documents = 'Maximum 5 files allowed';
        } else {
          delete errors.documents;
        }
        break;
      
      default:
        break;
    }
    
    setValidationErrors(errors);
  };

  // Validate fields based on current step
  const validateCurrentStep = (step) => {
    let isValid = true;
    
    switch(step) {
      case 0:
        // Inventory step
        if (!inventoryId && !inventory) {
          setValidationErrors(prev => ({...prev, inventory: 'Inventory selection is required'}));
          isValid = false;
        }
        break;
        
      case 1:
        // New installer and reason step
        if (!newInstallerId) {
          setValidationErrors(prev => ({...prev, installer: 'New installer selection is required'}));
          isValid = false;
        }
        if (!transferReason || transferReason.trim() === '') {
          setValidationErrors(prev => ({...prev, reason: 'Reason is required'}));
          isValid = false;
        } else if (transferReason.length < 10) {
          setValidationErrors(prev => ({...prev, reason: 'Reason should be at least 10 characters'}));
          isValid = false;
        }
        break;
        
      case 2:
        // Documents step
        if (!transferDocuments || transferDocuments.length === 0) {
          setValidationErrors(prev => ({...prev, documents: 'At least one document is required'}));
          isValid = false;
        } else if (transferDocuments.length > 5) {
          setValidationErrors(prev => ({...prev, documents: 'Maximum 5 files allowed'}));
          isValid = false;
        }
        break;
        
      default:
        break;
    }
    
    return isValid;
  };

  // Step handling
  const handleNext = () => {
    const isValid = validateCurrentStep(activeStep);
    
    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Validation for final submission
  const canSave = 
    [inventoryId || (inventory ? inventory.id : ''), newInstallerId, transferReason].every(Boolean) && 
    transferDocuments && 
    transferDocuments.length > 0 && 
    transferDocuments.length <= 5 &&
    !isLoading;

  // Handle the initial submit button click - checks for duplicates first
  const onSubmitTransferClicked = async (e) => {
    e.preventDefault();
    
    if (canSave) {
      // Check for duplicate transfers before proceeding
      const hasDuplicates = await checkForDuplicates();
      
      // If no duplicates, proceed directly to password dialog
      if (!hasDuplicates) {
        setPasswordDialogOpen(true);
      }
      // If there are duplicates, the duplicate dialog will be shown by checkForDuplicates()
    }
  };

  // Actual submission after password verification
  const submitTransfer = async () => {
    const formData = new FormData();
    formData.append("inventoryId", inventoryId || (inventory ? inventory.id : ''));
    formData.append("newInstallerId", newInstallerId);
    formData.append("reason", transferReason);
    
    // Append all selected files
    for (let i = 0; i < transferDocuments.length; i++) {
      formData.append("documents", transferDocuments[i]);
    }
    
    try {
      await addNewTransfer(formData).unwrap();
      // Success handling is done in the useEffect above
    } catch (err) {
      // Error handling is done by RTK Query
      window.scrollTo(0, 0);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd HH:mm:ss");
    } catch (err) {
      return dateString;
    }
  };

  // Steps for the stepper
  const steps = ['Select Inventory', 'Choose New Installer', 'Provide Documentation'];

  // Reset form function
  const resetForm = () => {
    setTransferReason("");
    setNewInstallerId("");
    setNewInstallerName("");
    setInventoryId("");
    setTransferDocuments(null);
    setFilesCount(null);
    setActiveStep(0);
    setValidationErrors({});
  };

  // Step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            {!inventory ? (
              <TextField
                fullWidth
                required
                size="small"
                id="inventory"
                select
                label="Select Inventory to Transfer"
                value={inventoryId || ""}
                onChange={onInventoryChanged}
                disabled={isLoadingInventories}
                error={!!validationErrors.inventory}
                helperText={validationErrors.inventory}
              >
                {isLoadingInventories ? (
                  <MenuItem value="">Loading inventories...</MenuItem>
                ) : inventories.length === 0 ? (
                  <MenuItem value="">No inventories found</MenuItem>
                ) : (
                  inventories.map((inv) => (
                    <MenuItem key={inv.id} value={inv.id}>
                      {inv.properties.ownerName} - {inv.properties.reCat} ({inv.properties.address.city})
                    </MenuItem>
                  ))
                )}
              </TextField>
            ) : (
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Selected Inventory
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon color="action" />
                        <Typography variant="body1">
                          <strong>Owner:</strong> {inventory.properties.ownerName}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CategoryIcon color="action" />
                        <Typography variant="body1">
                          <strong>Category:</strong> {inventory.properties.reCat}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationIcon color="action" />
                        <Typography variant="body1">
                          <strong>Location:</strong> {inventory.properties.address.city}, {inventory.properties.address.province}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Current Installer:</strong> {inventory.username}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Chip 
                        label={inventory.properties.reClass || "Non-Commercial"} 
                        color={inventory.properties.reClass === "Commercial" ? "success" : "default"} 
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              required
              size="small"
              id="newInstaller"
              select
              label="New Installer/Owner"
              value={newInstallerId || ""}
              onChange={onNewInstallerChanged}
              helperText={validationErrors.installer || "Select the installer who will be responsible for this inventory after transfer"}
              error={!!validationErrors.installer}
            >
              {installerUsers.length === 0 ? (
                <MenuItem value="" disabled>
                  No installers available
                </MenuItem>
              ) : (
                installerUsers
                  .filter(user => user.id !== currentUserId) // Filter out current user
                  .map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.username}
                    </MenuItem>
                  ))
              )}
            </TextField>
            
            {installerUsers.length === 0 && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                No users with Installer role found in the system.
              </Alert>
            )}
            
            <TextField
              fullWidth
              required
              size="small"
              label="Reason for Transfer"
              id="transferReason"
              name="transferReason"
              type="text"
              multiline
              rows={4}
              value={transferReason}
              onChange={onReasonChanged}
              helperText={validationErrors.reason || "Provide a detailed explanation for this transfer request"}
              error={!!validationErrors.reason}
              margin="normal"
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }} component="label">
              Documentation Proof*
            </Typography>
            
            <UploadArea 
              isDragActive={isDragActive}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("transferDocuments").click()}
            >
              <input
                type="file"
                id="transferDocuments"
                name="transferDocuments"
                accept="application/pdf,image/*,.doc,.docx"
                multiple
                hidden
                onChange={onDocumentsChanged}
              />
              <UploadFileIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body1" gutterBottom>
                Drag and drop files here, or click to select files
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accepted formats: PDF, Images, DOC (Max 5 files)
              </Typography>
            </UploadArea>
            
            {validationErrors.documents && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {validationErrors.documents}
              </Alert>
            )}
            
            {transferDocuments && transferDocuments.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Selected Files ({transferDocuments.length})
                </Typography>
                
                <List dense>
                  {Array.from(transferDocuments).map((file, index) => (
                    <FilePreview key={index} variant="outlined">
                      <ListItem
                        secondaryAction={
                          <Tooltip title="Remove file">
                            <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        }
                      >
                        <ListItemIcon>
                          <DocumentIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={formatFileSize(file.size)}
                        />
                      </ListItem>
                    </FilePreview>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container sx={{ maxWidth: { lg: "md" }, mt: 4 }}>
      <form onSubmit={onSubmitTransferClicked}>
        <Box sx={{
          minHeight: "100vh",
          maxWidth: "100%",
          "& .MuiTextField-root": { my: 1 },
        }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
            }}
          >
            <Collapse timeout={{ exit: 1 }} in={isError}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error?.data?.message || "An error occurred during transfer request"}
              </Alert>
            </Collapse>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
              <Grid item xs>
                <Typography component="h1" variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TransferIcon sx={{ mr: 1 }} /> 
                  Transfer Inventory
                </Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              
              <Box sx={{ flex: '1 1 auto' }} />
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!canSave || isLoading || checkingDuplicates}
                  startIcon={isLoading || checkingDuplicates ? undefined : <CheckCircleIcon />}
                >
                  {isLoading || checkingDuplicates ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      {checkingDuplicates ? "Checking..." : "Submitting..."}
                    </>
                  ) : (
                    'Submit Transfer'
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
            
            {isLoading && (
              <LinearProgress sx={{ mt: 3 }} />
            )}
          </Paper>
        </Box>
      </form>
      
      {/* Duplicate Transfer Check Dialog */}
      <Dialog
        open={duplicateDialogOpen}
        onClose={handleCloseDuplicateDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
          <WarningIconStyled sx={{ fontSize: '2rem', mr: 1 }} />
          Existing Transfer Requests Found
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3 }}>
            There are already pending transfer requests for this inventory. Creating a new request may cause confusion.
          </Alert>
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
            Existing Requests:
          </Typography>
          
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell><strong>New Installer</strong></TableCell>
                  <TableCell><strong>Reason</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Submitted</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {existingTransfers.map((transfer, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{transfer.newInstallerName || "Unknown"}</TableCell>
                    <TableCell>
                      {transfer.reason.length > 50 ? 
                        `${transfer.reason.substring(0, 50)}...` : 
                        transfer.reason}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={transfer.status} 
                        color={transfer.status === "pending" ? "warning" : "default"} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDate(transfer.createdAt)}
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Typography variant="body2" color="text.secondary">
            Do you still want to proceed with creating a new transfer request for this inventory?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDuplicateDialog} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleProceedWithTransfer}
          >
            Proceed Anyway
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Password Confirmation Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={handlePasswordDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center' }}>
          <LockIcon sx={{ mr: 1, color: 'primary.main' }} />
          Confirm Your Password
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            For security reasons, please enter your password to confirm this transfer request.
          </Alert>
          
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handlePasswordDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handlePasswordVerification}
            variant="contained" 
            color="primary"
            disabled={isVerifying}
            startIcon={isVerifying ? <CircularProgress size={20} /> : null}
          >
            {isVerifying ? "Verifying..." : "Confirm Transfer"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={handleCloseSuccessDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          Transfer Request Submitted!
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
            <SuccessIconStyled />
            
            <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
              Your transfer request has been submitted successfully
            </Typography>
            
            <Box sx={{ mt: 2, mb: 1, width: '100%' }}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    <strong>Transfer Details:</strong>
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>New Installer:</strong> {newInstallerName || "N/A"}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Documents:</strong> {filesCount} file(s) attached
                  </Typography>
                  
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Your transfer request is pending approval by an administrator.
                  </Alert>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            onClick={handleCloseSuccessDialog}
          >
            Return to Inventories
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TransferForm;