import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Container,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Checkbox,
  FormGroup
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useAddNewRequestMutation } from './requestsApiSlice';
import { useSelector } from 'react-redux';
import { selectAllInventories } from '../inventories/inventoriesApiSlice';
import RequestHelpModal from '../../components/RequestHelpModal';
import { sendRequestNotification } from '../../config/emailjs';

const steps = ['Select Request Type', 'Choose Transfer Type', 'Fill Details', 'Upload Documents', 'Review & Submit'];

const RequestForm = () => {
  const navigate = useNavigate();
  const { username, isManager, isAdmin } = useAuth();
  const [addNewRequest, { isLoading, isSuccess, isError, error }] = useAddNewRequestMutation();
  const [addBulkTransferRequest, { isLoading: isBulkLoading, isSuccess: isBulkSuccess, isError: isBulkError, error: bulkError }] = useAddNewRequestMutation();
  
  // Get all inventories for transfer requests (users can transfer any inventory to themselves)
  const allInventories = useSelector(selectAllInventories);

  // Form states
  const [activeStep, setActiveStep] = useState(0);
  const [requestType, setRequestType] = useState('');
  const [transferType, setTransferType] = useState(''); // 'single' or 'bulk'
  const [selectedInventoryId, setSelectedInventoryId] = useState('');
  const [selectedInventoryIds, setSelectedInventoryIds] = useState([]); // For bulk transfers
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Inventory filtering states
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('');
  const [inventoryClassFilter, setInventoryClassFilter] = useState('');

  // Filter and search inventories
  const filteredInventories = useMemo(() => {
    return allInventories.filter(inventory => {
      const matchesSearch = inventorySearch === '' || 
        inventory.properties.ownerName?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        inventory.properties.reCat?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        inventory.properties.address?.city?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        inventory.properties.address?.province?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        inventory.username?.toLowerCase().includes(inventorySearch.toLowerCase());
      
      const matchesCategory = inventoryCategoryFilter === '' || 
        inventory.properties.reCat === inventoryCategoryFilter;
      
      const matchesClass = inventoryClassFilter === '' || 
        inventory.properties.reClass === inventoryClassFilter;
      
      return matchesSearch && matchesCategory && matchesClass;
    });
  }, [allInventories, inventorySearch, inventoryCategoryFilter, inventoryClassFilter]);

  // Get unique categories and classes for filters
  const uniqueCategories = useMemo(() => {
    const categories = [...new Set(allInventories.map(inv => inv.properties.reCat))];
    return categories.filter(Boolean).sort();
  }, [allInventories]);

  const uniqueClasses = useMemo(() => {
    const classes = [...new Set(allInventories.map(inv => inv.properties.reClass))];
    return classes.filter(Boolean).sort();
  }, [allInventories]);
  
  // Success Dialog State
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Help Modal State
  const [openHelpModal, setOpenHelpModal] = useState(false);

  // Reset form on success
  useEffect(() => {
    if (isSuccess || isBulkSuccess) {
      setShowSuccessDialog(true);
    }
  }, [isSuccess, isBulkSuccess]);

  // Reset inventory filters when request type changes
  useEffect(() => {
    if (requestType !== 'transfer') {
      setInventorySearch('');
      setInventoryCategoryFilter('');
      setInventoryClassFilter('');
      setSelectedInventoryId('');
      setSelectedInventoryIds([]);
      setTransferType('');
    }
  }, [requestType]);

  // Validation functions
  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0:
        if (!requestType) {
          errors.requestType = 'Please select a request type';
        }
        break;
      case 1:
        if (requestType === 'transfer' && !transferType) {
          errors.transferType = 'Please choose a transfer type';
        }
        break;
      case 2:
        if (requestType === 'transfer') {
          if (transferType === 'single' && !selectedInventoryId) {
            errors.selectedInventoryId = 'Please select an inventory to transfer';
          }
          if (transferType === 'bulk' && selectedInventoryIds.length === 0) {
            errors.selectedInventoryIds = 'Please select at least one inventory for bulk transfer';
          }
          if (transferType === 'bulk' && selectedInventoryIds.length > 10) {
            errors.selectedInventoryIds = 'Cannot select more than 10 inventories for bulk transfer';
          }
        }
        if ((requestType === 'transfer') && filteredInventories.length === 0) {
          errors.selectedInventoryId = 'No inventories match your search criteria. Please adjust your filters.';
        }
        if (!reason.trim()) {
          errors.reason = 'Please provide a reason for your request';
        } else if (reason.trim().length < 10) {
          errors.reason = 'Reason must be at least 10 characters long';
        }
        break;
      case 3:
        if ((requestType === 'transfer') && documents.length === 0) {
          errors.documents = 'Supporting documents are required for transfer requests';
        }
        if (!password.trim()) {
          errors.password = 'Please enter your password to confirm this request';
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation functions
  const handleNext = () => {
    if (validateStep(activeStep)) {
      // Additional check for transfer requests
      if (activeStep === 0 && requestType === 'transfer' && filteredInventories.length === 0) {
        setValidationErrors({ requestType: 'No inventories available for transfer. Please check back later.' });
        return;
      }
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // File handling
  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).slice(0, 5 - documents.length); // Limit to 5 total files
    setDocuments(prev => [...prev, ...newFiles]);
  };

  const handleFileRemove = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    const formData = new FormData();
    formData.append('requestType', requestType);
    formData.append('reason', reason);
    formData.append('password', password);
    
    if (requestType === 'transfer') {
      if (transferType === 'single') {
        formData.append('inventoryId', selectedInventoryId);
      } else if (transferType === 'bulk') {
        // For bulk transfers, append each inventory ID
        selectedInventoryIds.forEach(id => {
          formData.append('inventoryIds[]', id);
        });
      }
    }

    // Add documents
    documents.forEach((file) => {
      formData.append('documents', file);
    });

    try {
      let result;
      if (requestType === 'transfer' && transferType === 'bulk') {
        result = await addBulkTransferRequest(formData);
      } else {
        result = await addNewRequest(formData);
      }

      // If request was successful, send email notification to AREC
      if (result.data) {
        // Prepare inventory details for email
        let inventoryDetails = 'N/A';
        if (requestType === 'transfer') {
          if (transferType === 'single' && selectedInventoryId) {
            const inventory = allInventories.find(inv => inv._id === selectedInventoryId);
            if (inventory) {
              // Debug: Log the inventory structure to see where capacity is stored
              console.log('Inventory object structure:', inventory);
              console.log('Inventory properties:', inventory.properties);
              console.log('Inventory assessment:', inventory.assessment);
              
              // Get capacity from the correct location in the inventory object
              const capacity = inventory.assessment?.capacity || inventory.properties?.capacity || 'N/A';
              const ownerName = inventory.properties?.ownerName || 'Unknown Owner';
              const reCat = inventory.properties?.reCat || 'Unknown Category';
              
              console.log('Extracted values:', { capacity, ownerName, reCat });
              
              inventoryDetails = `${ownerName} - ${reCat} (${capacity} kW)`;
            }
          } else if (transferType === 'bulk') {
            const selectedInventories = allInventories.filter(inv => selectedInventoryIds.includes(inv._id));
            inventoryDetails = `${selectedInventories.length} inventories: ${selectedInventories.map(inv => {
              const capacity = inv.assessment?.capacity || inv.properties?.capacity || 'N/A';
              const ownerName = inv.properties?.ownerName || 'Unknown Owner';
              const reCat = inv.properties?.reCat || 'Unknown Category';
              
              return `${ownerName} - ${reCat} (${capacity} kW)`;
            }).join(', ')}`;
          }
        }

        // Send email notification to AREC
        const emailData = {
          requestType: requestType === 'transfer' ? 
            (transferType === 'single' ? 'Single Transfer' : 'Bulk Transfer') : 
            'Account Deletion',
          requesterName: username,
          requesterUsername: username,
          reason: reason,
          inventoryDetails: inventoryDetails
        };

        const emailResult = await sendRequestNotification(emailData);
        if (emailResult.success) {
          console.log('Email notification sent to AREC successfully');
        } else {
          console.warn('Failed to send email notification to AREC:', emailResult.error);
        }
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  // Success dialog handlers
  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate('/dashboard/requests');
  };
  
  // Help modal handlers
  const handleOpenHelpModal = () => setOpenHelpModal(true);
  const handleCloseHelpModal = () => setOpenHelpModal(false);

  // Step content rendering
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset" fullWidth error={!!validationErrors.requestType}>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
                What type of request would you like to make?
              </FormLabel>
              <RadioGroup
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
              >
                <FormControlLabel
                  value="transfer"
                  control={<Radio />}
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        Transfer Request
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Request to transfer ownership of any inventory to yourself (you will become the new owner)
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, alignItems: 'flex-start' }}
                />
                <FormControlLabel
                  value="account_deletion"
                  control={<Radio />}
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        Account Deletion Request
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Request to permanently delete your account and all associated data
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start' }}
                />
              </RadioGroup>
              {validationErrors.requestType && (
                <Typography color="error" variant="caption">
                  {validationErrors.requestType}
                </Typography>
              )}
            </FormControl>
          </Box>
        );

      case 1:
        if (requestType === 'transfer') {
          return (
            <Box sx={{ mt: 2 }}>
              <FormControl component="fieldset" fullWidth error={!!validationErrors.transferType}>
                <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Choose Transfer Type
                </FormLabel>
                <RadioGroup
                  value={transferType}
                  onChange={(e) => setTransferType(e.target.value)}
                >
                  <FormControlLabel
                    value="single"
                    control={<Radio />}
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          Single Transfer
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Transfer ownership of one specific inventory to yourself
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 2, alignItems: 'flex-start' }}
                  />
                  <FormControlLabel
                    value="bulk"
                    control={<Radio />}
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          Bulk Transfer
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Transfer ownership of multiple inventories (up to 10) to yourself in one request
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start' }}
                  />
                </RadioGroup>
                {validationErrors.transferType && (
                  <Typography color="error" variant="caption">
                    {validationErrors.transferType}
                  </Typography>
                )}
              </FormControl>
            </Box>
          );
        }
        return null;

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            {requestType === 'transfer' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {transferType === 'single' ? 'Select Inventory to Transfer' : 'Select Inventories for Bulk Transfer'}
                </Typography>
                
                {/* Search and Filter Controls */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Search Inventories"
                      placeholder="Search by owner, category, location, or uploader..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={inventoryCategoryFilter}
                        onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                        label="Category"
                      >
                        <MenuItem value="">All Categories</MenuItem>
                        {uniqueCategories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Classification</InputLabel>
                      <Select
                        value={inventoryClassFilter}
                        onChange={(e) => setInventoryClassFilter(e.target.value)}
                        label="Classification"
                      >
                        <MenuItem value="">All Types</MenuItem>
                        {uniqueClasses.map((classType) => (
                          <MenuItem key={classType} value={classType}>
                            {classType}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Results Summary */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {filteredInventories.length} of {allInventories.length} inventories found
                  </Typography>
                  {(inventorySearch || inventoryCategoryFilter || inventoryClassFilter) && (
                    <Button
                      size="small"
                      onClick={() => {
                        setInventorySearch('');
                        setInventoryCategoryFilter('');
                        setInventoryClassFilter('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </Box>

                {/* Inventory Selection */}
                {transferType === 'single' ? (
                  // Single inventory selection
                  <FormControl fullWidth error={!!validationErrors.selectedInventoryId}>
                    <InputLabel>Select Inventory</InputLabel>
                    <Select
                      value={selectedInventoryId}
                      onChange={(e) => setSelectedInventoryId(e.target.value)}
                      input={<OutlinedInput label="Select Inventory" />}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 400,
                          },
                        },
                      }}
                    >
                      {filteredInventories.length === 0 ? (
                        <MenuItem disabled>
                          <Typography variant="body2" color="text.secondary">
                            No inventories match your search criteria
                          </Typography>
                        </MenuItem>
                      ) : (
                        filteredInventories.map((inventory) => (
                          <MenuItem key={inventory.id} value={inventory.id}>
                            <Box sx={{ width: '100%' }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {inventory.properties.ownerName}
                              </Typography>
                              <Typography variant="body2" color="primary">
                                {inventory.properties.reCat} • {inventory.properties.reClass}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                📍 {inventory.properties.address?.city}, {inventory.properties.address?.province}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                👤 Uploaded by: {inventory.username}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {validationErrors.selectedInventoryId && (
                      <Typography color="error" variant="caption">
                        {validationErrors.selectedInventoryId}
                      </Typography>
                    )}
                  </FormControl>
                ) : (
                  // Bulk inventory selection
                  <FormControl fullWidth error={!!validationErrors.selectedInventoryIds}>
                    <InputLabel>Select Inventories (Max 10)</InputLabel>
                    <Select
                      multiple
                      value={selectedInventoryIds}
                      onChange={(e) => setSelectedInventoryIds(e.target.value)}
                      input={<OutlinedInput label="Select Inventories (Max 10)" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const inventory = filteredInventories.find(inv => inv.id === value);
                            return (
                              <Chip
                                key={value}
                                label={inventory?.properties?.ownerName || 'Unknown'}
                                size="small"
                                onDelete={() => {
                                  setSelectedInventoryIds(selectedInventoryIds.filter(id => id !== value));
                                }}
                              />
                            );
                          })}
                        </Box>
                      )}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 400,
                          },
                        },
                      }}
                    >
                      {filteredInventories.length === 0 ? (
                        <MenuItem disabled>
                          <Typography variant="caption" color="text.secondary">
                            No inventories match your search criteria
                          </Typography>
                        </MenuItem>
                      ) : (
                        filteredInventories.map((inventory) => (
                          <MenuItem key={inventory.id} value={inventory.id}>
                            <Box sx={{ width: '100%' }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {inventory.properties.ownerName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                📍 {inventory.properties.address?.city}, {inventory.properties.address?.province}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {validationErrors.selectedInventoryIds && (
                      <Typography color="error" variant="caption">
                        {validationErrors.selectedInventoryIds}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Selected: {selectedInventoryIds.length} inventories
                    </Typography>
                  </FormControl>
                )}

                {allInventories.length === 0 && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    No inventories available for transfer.
                  </Alert>
                )}
              </Box>
            )}

            <TextField
              fullWidth
              multiline
              rows={4}
              label={`Reason for ${requestType === 'transfer' ? 'Transfer' : 'Account Deletion'} Request`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={!!validationErrors.reason}
              helperText={validationErrors.reason || 'Please provide a detailed explanation for your request'}
              placeholder={
                requestType === 'transfer' || requestType === 'bulk_transfer'
                  ? 'Explain why you want to transfer this inventory/inventories...'
                  : 'Explain why you want to delete your account...'
              }
            />

            {requestType === 'account_deletion' && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Warning:</strong> Account deactivation will set your account as inactive. 
                  Your data will be preserved but you won't be able to access the system until reactivated by an administrator.
                </Typography>
              </Alert>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Supporting Documents
              {requestType === 'transfer' && (
                <Typography component="span" color="error"> *</Typography>
              )}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {requestType === 'transfer'
                ? 'Upload supporting documents for your transfer request (required)'
                : 'Upload any supporting documents for your account deletion request (optional)'
              }
            </Typography>

            {/* Password Confirmation */}
            <TextField
              fullWidth
              type="password"
              label="Confirm Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!validationErrors.password}
              helperText={validationErrors.password || 'Enter your password to confirm this request'}
              placeholder="Enter your password"
              sx={{ mb: 3 }}
            />

            <Box
              sx={{
                border: 2,
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                borderStyle: 'dashed',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                cursor: 'pointer',
                mb: 2,
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Drop files here or click to upload
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5 files)
              </Typography>
            </Box>

            {validationErrors.documents && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {validationErrors.documents}
              </Alert>
            )}

            {documents.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Uploaded Files ({documents.length}/5)
                </Typography>
                {documents.map((file, index) => (
                  <Chip
                    key={index}
                    label={`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`}
                    onDelete={() => handleFileRemove(index)}
                    deleteIcon={<DeleteIcon />}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            )}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Supporting Documents
              {requestType === 'transfer' && (
                <Typography component="span" color="error"> *</Typography>
              )}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {requestType === 'transfer'
                ? 'Upload supporting documents for your transfer request (required)'
                : 'Upload any supporting documents for your account deletion request (optional)'
              }
            </Typography>

            {/* Password Confirmation */}
            <TextField
              fullWidth
              type="password"
              label="Confirm Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!validationErrors.password}
              helperText={validationErrors.password || 'Enter your password to confirm this request'}
              placeholder="Enter your password"
              sx={{ mb: 3 }}
            />

            <Box
              sx={{
                border: 2,
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                borderStyle: 'dashed',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                cursor: 'pointer',
                mb: 2,
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Drop files here or click to upload
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5 files)
              </Typography>
            </Box>

            {validationErrors.documents && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {validationErrors.documents}
              </Alert>
            )}

            {documents.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Uploaded Files ({documents.length}/5)
                </Typography>
                {documents.map((file, index) => (
                  <Chip
                    key={index}
                    label={`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`}
                    onDelete={() => handleFileRemove(index)}
                    deleteIcon={<DeleteIcon />}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            )}
          </Box>
        );

      case 4:
        const selectedInventory = allInventories.find(inv => inv.id === selectedInventoryId);
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Request
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Request Type
                  </Typography>
                  <Typography variant="body1">
                    {requestType === 'transfer' ? 
                     (transferType === 'single' ? 'Single Transfer Request' : 'Bulk Transfer Request') : 
                     'Account Deletion Request'}
                  </Typography>
                </Paper>
              </Grid>

              {requestType === 'transfer' && transferType === 'single' && selectedInventory && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Inventory to Transfer
                    </Typography>
                    <Typography variant="body1">
                      <strong>Owner:</strong> {selectedInventory.properties.ownerName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Category:</strong> {selectedInventory.properties.reCat}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Location:</strong> {selectedInventory.properties.address?.city}, {selectedInventory.properties.address?.province}
                    </Typography>
                  </Paper>
                </Grid>
              )}

              {requestType === 'transfer' && transferType === 'bulk' && selectedInventoryIds.length > 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Inventories for Bulk Transfer ({selectedInventoryIds.length} total)
                    </Typography>
                    {selectedInventoryIds.map((inventoryId, index) => {
                      const inventory = allInventories.find(inv => inv.id === inventoryId);
                      return inventory ? (
                        <Box key={inventoryId} sx={{ mb: 2, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {index + 1}. {inventory.properties.ownerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {inventory.properties.reCat} • {inventory.properties.reClass}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            📍 {inventory.properties.address?.city}, {inventory.properties.address?.province}
                          </Typography>
                        </Box>
                      ) : null;
                    })}
                  </Paper>
                </Grid>
              )}

              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Reason
                  </Typography>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {reason}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Password Confirmation
                  </Typography>
                  <Typography variant="body1">
                    {password ? '✓ Password provided' : '✗ Password not provided'}
                  </Typography>
                </Paper>
              </Grid>

              {documents.length > 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Supporting Documents
                    </Typography>
                    {documents.map((file, index) => (
                      <Typography key={index} variant="body2">
                        • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                    ))}
                  </Paper>
                </Grid>
              )}
            </Grid>

            {requestType === 'account_deletion' && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Final Warning:</strong> By submitting this request, you acknowledge that your account will be set as inactive if approved by an administrator. 
                  Your data will be preserved but you won't be able to access the system.
                </Typography>
              </Alert>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard/requests')}
              sx={{ mr: 2 }}
            >
              Back to Requests
            </Button>
            <Typography variant="h4" align="center" sx={{ flex: 1 }}>
              Submit a Request
            </Typography>
            <Button
              variant="outlined"
              startIcon={<HelpIcon />}
              onClick={handleOpenHelpModal}
              sx={{ ml: 2 }}
            >
              Help
            </Button>
          </Box>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {(isError || isBulkError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {(error?.data?.message || bulkError?.data?.message) || 'An error occurred while submitting your request'}
            </Alert>
          )}

          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
            >
              Back
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={isLoading || isBulkLoading || 
                    (requestType === 'transfer' && allInventories.length === 0)}
                  startIcon={(isLoading || isBulkLoading) ? <CircularProgress size={20} /> : <AssignmentIcon />}
                >
                  {(isLoading || isBulkLoading) ? 'Submitting...' : 'Submit Request'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={
                    (activeStep === 0 && !requestType) ||
                    (activeStep === 1 && requestType === 'transfer' && allInventories.length === 0)
                  }
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onClose={handleSuccessDialogClose}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
          <Typography variant="h5">Request Submitted Successfully!</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography align="center">
            Your {requestType === 'transfer' ? 
                   (transferType === 'single' ? 'single transfer' : 'bulk transfer') : 
                   'account deletion'} request has been submitted and is pending review by an administrator.
            {requestType === 'transfer' && transferType === 'single' && (
              <>
                <br /><br />
                If approved, the selected inventory will be transferred to your account and you will become the new owner.
              </>
            )}
            {requestType === 'transfer' && transferType === 'bulk' && (
              <>
                <br /><br />
                If approved, all {selectedInventoryIds.length} selected inventories will be transferred to your account and you will become the new owner of all of them.
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={handleSuccessDialogClose} variant="contained">
            View My Requests
          </Button>
        </DialogActions>
      </Dialog>

      {/* Help Modal */}
      <RequestHelpModal
        open={openHelpModal}
        onClose={handleCloseHelpModal}
        formType="new"
      />
    </Container>
  );
};

export default RequestForm;
