import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  Help as HelpIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  SwapHoriz as SwapHorizIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Warning as WarningIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const RequestHelpModal = ({ open, onClose, formType = 'general' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const steps = [
    {
      label: 'Request System Overview',
      description: 'Understanding the request system and available request types.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            📋 Request System Basics
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <AssignmentIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    What are Requests?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Requests are formal submissions that allow users to make changes to their account or 
                    request ownership transfers of renewable energy inventories. All requests require 
                    administrative review and approval.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <SecurityIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Security & Review
                  </Typography>
                  <Typography variant="body2" paragraph>
                    All requests go through a secure review process by administrators or managers. 
                    This ensures data integrity and prevents unauthorized changes to the system.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Request Types',
      description: 'Learn about the different types of requests you can submit.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            🔄 Available Request Types
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <SwapHorizIcon color="info" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Transfer Request
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Purpose:</strong> Request ownership transfer of any renewable energy inventory to yourself.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>What happens:</strong> You become the new owner of the selected inventory.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Requirements:</strong> Supporting documents and detailed reason are mandatory.
                  </Typography>
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      You can transfer any inventory, regardless of current ownership.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <DeleteIcon color="warning" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Account Deactivation Request
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Purpose:</strong> Request to set your account as inactive while preserving all data.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>What happens:</strong> Your account is set as inactive, but all data is preserved.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Requirements:</strong> Detailed reason required; documents are optional.
                  </Typography>
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      <strong>Note:</strong> Your data is preserved and can be reactivated by an administrator.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Enhanced Reject System',
      description: 'Learn about the new rejection workflow with reason templates.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            🚫 Enhanced Rejection System
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <ErrorIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Rejection Reason Templates
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Standardized Reasons:</strong> Admins can select from predefined rejection reasons:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body2" color="error">•</Typography>
                      </ListItemIcon>
                      <ListItemText primary="Insufficient documentation" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body2" color="error">•</Typography>
                      </ListItemIcon>
                      <ListItemText primary="Invalid reason provided" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body2" color="error">•</Typography>
                      </ListItemIcon>
                      <ListItemText primary="Request not justified" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body2" color="error">•</Typography>
                      </ListItemIcon>
                      <ListItemText primary="Missing required information" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body2" color="error">•</Typography>
                      </ListItemIcon>
                      <ListItemText primary="Policy violation" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body2" color="error">•</Typography>
                      </ListItemIcon>
                      <ListItemText primary="Duplicate request" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body2" color="error">•</Typography>
                      </ListItemIcon>
                      <ListItemText primary="Incorrect inventory selection" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body2" color="error">•</Typography>
                      </ListItemIcon>
                      <ListItemText primary="Other (custom notes)" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <InfoIcon color="info" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Rejection Workflow
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>1. Select Reason:</strong> Choose from template or custom reason
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>2. Add Notes:</strong> Provide additional context if needed
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>3. Password Confirmation:</strong> Admin must confirm with password
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>4. Process Rejection:</strong> Request is marked as rejected with reason
                  </Typography>
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      <strong>Benefit:</strong> Clear communication helps users understand why their request was rejected.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Resubmission Workflow',
      description: 'How to handle rejected requests and resubmit them.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            🔄 Resubmission Process
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <RefreshIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    After Rejection
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Review Feedback:</strong> Check the rejection reason and admin notes
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Address Issues:</strong> Fix the problems identified in rejection
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Gather Documents:</strong> Ensure all required documents are ready
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Prepare Response:</strong> Write a clear reason addressing previous feedback
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <CheckCircleIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Resubmission Steps
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>1. Click Resubmit:</strong> Use the resubmit button on rejected request
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>2. Fill Form:</strong> Complete the request form with improvements
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>3. Upload Documents:</strong> Include all required supporting materials
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>4. Submit:</strong> Send the improved request for review
                  </Typography>
                  <Alert severity="success" sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      <strong>Tip:</strong> Reference the previous rejection reason in your new submission.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'How to Submit a Request',
      description: 'Step-by-step guide to submitting your request.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            📝 Request Submission Process
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <CheckCircleIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Step-by-Step Process
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="h6" color="primary">1</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Select Request Type" 
                        secondary="Choose between Transfer Request or Account Deactivation Request"
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="h6" color="primary">2</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Fill Request Details" 
                        secondary="Provide reason and select inventory (for transfer requests)"
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="h6" color="primary">3</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Upload Documents & Confirm Password" 
                        secondary="Attach supporting documents and confirm your password"
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="h6" color="primary">4</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Review & Submit" 
                        secondary="Review all information including password confirmation and submit your request"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Admin Review Process',
      description: 'How administrators review and process requests.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            👨‍💼 Administrative Review
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <CheckCircleIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Approval Process
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>1. Review Request:</strong> Examine all submitted information
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>2. Check Documents:</strong> Verify supporting materials
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>3. Add Notes:</strong> Include approval comments if needed
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>4. Confirm Password:</strong> Enter admin password for security
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>5. Approve:</strong> Process the approved request
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <ErrorIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Rejection Process
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>1. Select Reason:</strong> Choose from rejection reason templates
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>2. Add Notes:</strong> Provide detailed explanation
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>3. Confirm Password:</strong> Enter admin password for security
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>4. Reject:</strong> Process the rejection with reason
                  </Typography>
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      <strong>Important:</strong> Clear rejection reasons help users improve their submissions.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Request Status & Tracking',
      description: 'Understanding request statuses and how to track your requests.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            📊 Request Status & Tracking
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <InfoIcon color="info" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Request Statuses
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="h6" color="warning">⏳</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Pending" 
                        secondary="Request submitted and awaiting review"
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="h6" color="success">✅</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Approved" 
                        secondary="Request approved and processed"
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="h6" color="error">❌</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Rejected" 
                        secondary="Request rejected with reason provided"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <PersonIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Tracking Your Requests
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • View all your submitted requests in the Requests List
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Check current status and any admin notes
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • See rejection reasons for rejected requests
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Download submitted documents if needed
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Use resubmit button for rejected requests
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Contact administrators for questions about specific requests
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Tips & Best Practices',
      description: 'Helpful tips for successful request submission.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            💡 Tips & Best Practices
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <CheckCircleIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    For Transfer Requests
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Provide clear, detailed reasons for the transfer
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Include relevant supporting documents
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Ensure you have the right to request the transfer
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Double-check inventory selection before submission
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <InfoIcon color="info" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    For Rejected Requests
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Carefully read the rejection reason
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Address all issues mentioned in rejection
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Gather additional documents if needed
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Explain how you've addressed previous feedback
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <InfoIcon color="info" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    General Tips
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Be thorough and accurate in your submissions
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Keep copies of submitted documents
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Follow up if you don't receive a response
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Contact support for technical issues
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Need Help?</strong> If you have questions about the request process or need assistance, 
              contact your system administrator or support team.
            </Typography>
          </Alert>
        </Box>
      )
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          maxHeight: isMobile ? '100%' : '90vh',
          minHeight: isMobile ? '100%' : '600px'
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        bgcolor: theme.palette.primary.main, 
        color: 'white !important',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box display="flex" alignItems="center">
          <HelpIcon sx={{ mr: 1, color: 'white' }} />
          <Typography 
            variant="h6" 
            color="inherit"
            sx={{ 
              fontWeight: 'bold',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Enhanced Request System - User Guide
          </Typography>
        </Box>
        <IconButton
          aria-label="close help dialog"
          onClick={onClose}
          sx={{
            color: 'white !important',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            },
            '&:focus': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon sx={{ color: 'white' }} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Welcome to the Enhanced Request System User Guide! This comprehensive guide covers the new rejection 
            workflow, reason templates, resubmission process, and all the features that make request management 
            more efficient and transparent.
          </Typography>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>New Features:</strong> Enhanced rejection system with reason templates, improved resubmission 
              workflow, and better user experience for both requesters and administrators.
            </Typography>
          </Alert>

          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Security Note:</strong> All request submissions and approvals require password confirmation 
              to ensure the security of your account and the system.
            </Typography>
          </Alert>

          <Stepper activeStep={activeStep} orientation={isMobile ? "vertical" : "horizontal"}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={index === steps.length - 1 ? (
                    <Typography variant="caption">Final step</Typography>
                  ) : null}
                >
                  {step.label}
                </StepLabel>
                {isMobile && (
                  <StepContent>
                    <Box sx={{ mb: 2 }}>
                      {step.content}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={index === steps.length - 1 ? handleReset : handleNext}
                        sx={{ mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                )}
              </Step>
            ))}
          </Stepper>

          {!isMobile && (
            <Box sx={{ mt: 3 }}>
              {steps[activeStep].content}
            </Box>
          )}
        </Box>
      </DialogContent>

      {!isMobile && (
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Box>
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{ mr: 1 }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleReset : handleNext}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Continue'}
            </Button>
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default RequestHelpModal;
