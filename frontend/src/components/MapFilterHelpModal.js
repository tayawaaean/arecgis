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
  FilterList as FilterListIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  ClearAll as ClearAllIcon
} from '@mui/icons-material';

const MapFilterHelpModal = ({ open, onClose }) => {
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
      label: 'Getting Started',
      description: 'Learn how to access and use the map filters effectively.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            🗺️ Map Filter Basics
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <FilterListIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Accessing Filters
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Filter Button" 
                        secondary="Click the filter icon (🔍) on the map to open the filter panel"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Right Side Panel" 
                        secondary="Filters appear as a drawer on the right side of the screen"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Real-time Updates" 
                        secondary="Map updates automatically as you apply filters"
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
                    <ClearAllIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Managing Filters
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Clear All Button" 
                        secondary="Use the 'Clear All' button to reset all filters at once"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Individual Reset" 
                        secondary="You can also reset individual filters by selecting 'All' options"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Close Panel" 
                        secondary="Click the X button or outside the panel to close filters"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Pro Tip:</strong> Start with broad filters and gradually narrow down your search for better results. Solar Energy category now includes specialized filters for net metering, own use, and system status.
          </Alert>
        </Box>
      )
    },
    {
      label: 'Location & Uploader Filters',
      description: 'Filter by geographic location and data contributors.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            📍 Location & User Filtering
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <SearchIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    City/Municipality Search
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Text Search" 
                        secondary="Type city or municipality names to filter by location"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Partial Matching" 
                        secondary="Search works with partial names (e.g., 'Manila' finds 'Manila City')"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Case Insensitive" 
                        secondary="Search is not case-sensitive for easier use"
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
                    Uploader Filter
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Affiliation Groups" 
                        secondary="Users are organized by their institutional affiliations"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Select All Users" 
                        secondary="Click on affiliation name to select/deselect all users in that group"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Individual Selection" 
                        secondary="Select specific users by checking their names individually"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Visual Indicators" 
                        secondary="Checkbox states show selected, partially selected, or unselected groups"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <strong>Note:</strong> The uploader filter helps you verify data sources and focus on specific organizations or users.
          </Alert>
        </Box>
      )
    },
    {
      label: 'Classification & Status',
      description: 'Filter by system type and operational status.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            🏢 System Classification & Status
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <BusinessIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Commercial Classification
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Commercial" 
                        secondary="For-profit systems, businesses, and large-scale operations"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Non-Commercial" 
                        secondary="Non-profit, educational, and government facilities"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Residential" 
                        secondary="Home-based systems and personal installations"
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
                    <InfoIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    System Status
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Operational" 
                        secondary="Systems currently producing energy"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="For Repair" 
                        secondary="Systems temporarily offline for maintenance"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Condemnable" 
                        secondary="Systems that are no longer functional"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Solar Energy Specific" 
                        secondary="Available in Solar Energy category filters"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Tip:</strong> Use classification filters to focus on specific types of installations or operational statuses.
          </Alert>
        </Box>
      )
    },
    {
      label: 'RE Category Filters',
      description: 'Filter by renewable energy types and their specific usage patterns.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            ⚡ Renewable Energy Categories
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <CategoryIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Category Selection
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Solar Energy ☀️" 
                        secondary="Photovoltaic and solar thermal systems"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Wind Energy 💨" 
                        secondary="Wind turbines and wind farms"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Biomass 🌱" 
                        secondary="Organic waste and bioenergy systems"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Hydropower 🌊" 
                        secondary="Water-based energy generation"
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
                    <InfoIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Usage Type Filters
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Multiple Selection" 
                        secondary="Select multiple usage types within each category"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Category Dependencies" 
                        secondary="Usage filters only appear when their category is selected"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Real-time Updates" 
                        secondary="Map updates as you select/deselect usage types"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <strong>Important:</strong> Select a category first, then choose specific usage types to narrow down your search.
          </Alert>
        </Box>
      )
    },
    {
      label: 'Solar Energy Filters',
      description: 'Specialized filters for solar energy systems and installations.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            ☀️ Solar Energy Specific Filters
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <InfoIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Net Metering & Own Use
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="⚡ Net Metered" 
                        secondary="Filter systems connected to the grid with bidirectional power flow"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="🏠 Own Use" 
                        secondary="Filter systems designed for self-consumption vs. commercial sale"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Multiple Selection" 
                        secondary="Select both Yes and No to see all systems"
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
                    <InfoIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    System Status & Usage
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="🔧 System Status" 
                        secondary="Filter by operational, repair, or condemnable status"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="☀️ Usage Types" 
                        secondary="Power generation, street lighting, water pumping, etc."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="🏢 Classification" 
                        secondary="Commercial vs. non-commercial installations"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Tip:</strong> Solar Energy filters are particularly useful for analyzing grid integration, self-consumption patterns, and system reliability across different installation types.
          </Alert>
        </Box>
      )
    },
    {
      label: 'Advanced Filtering Tips',
      description: 'Learn advanced techniques for effective data exploration.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            🚀 Advanced Filtering Strategies
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <CheckCircleIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Filter Combinations
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Layered Filtering" 
                        secondary="Combine multiple filter types for precise results"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Progressive Refinement" 
                        secondary="Start broad, then narrow down step by step"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Cross-Reference" 
                        secondary="Use different filter types to verify data accuracy"
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
                    <InfoIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Performance Tips
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Efficient Loading" 
                        secondary="Apply filters gradually to avoid overwhelming the map"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Memory Management" 
                        secondary="Clear filters when switching between different analyses"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Regular Updates" 
                        secondary="Refresh filters periodically to see new data"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="success" sx={{ mt: 2 }}>
            <strong>Best Practice:</strong> Save your filter combinations by taking screenshots or notes for future reference.
          </Alert>
        </Box>
      )
    },
    {
      label: 'Troubleshooting',
      description: 'Common issues and solutions for map filtering.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            🔧 Troubleshooting Common Issues
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <InfoIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    No Results Found
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Check Filter Combinations" 
                        secondary="Your filters might be too restrictive"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Verify Selections" 
                        secondary="Ensure you haven't accidentally excluded all data"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Clear and Restart" 
                        secondary="Use 'Clear All' and rebuild your filters"
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
                    <CheckCircleIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Performance Issues
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Reduce Filter Complexity" 
                        secondary="Too many active filters can slow down the map"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Close Unused Filters" 
                        secondary="Close the filter panel when not actively filtering"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Browser Refresh" 
                        secondary="Refresh the page if filters become unresponsive"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Need Help?</strong> If you continue to experience issues, contact your system administrator or refer to the main help documentation.
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
            Map Filter User Guide
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
           <CloseIcon />
         </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Welcome to the Map Filter User Guide! This comprehensive guide will teach you how to effectively use 
            the map filtering system to explore renewable energy data. Learn how to combine different filter types 
            for precise data analysis and visualization.
          </Typography>

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
            startIcon={<InfoIcon />}
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
              startIcon={activeStep === steps.length - 1 ? <CheckCircleIcon /> : <InfoIcon />}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Continue'}
            </Button>
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default MapFilterHelpModal;

