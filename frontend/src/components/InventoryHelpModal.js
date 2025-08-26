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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
  Assessment as AssessmentIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  SolarPower as SolarIcon,
  Air as WindIcon,
  Grass as BiomassIcon,
  Water as HydroIcon
} from '@mui/icons-material';

const InventoryHelpModal = ({ open, onClose, formType = 'new' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState('panel1');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

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
      label: 'Basic Information',
      description: 'Start with the fundamental details of your renewable energy system.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            📋 Essential Fields
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Owner/Company Name" 
                secondary="Enter the name of the system owner, company, cooperative, or association"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="RE Category" 
                secondary="Select the type of renewable energy: Solar, Wind, Biomass, or Hydropower"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="RE Classification" 
                secondary="Choose between Commercial, Non-Commercial, or Residential"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Year Established" 
                secondary="Select when the system was installed or became operational"
              />
            </ListItem>
          </List>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Tip:</strong> All fields marked with an asterisk (*) are required. 
            Fill these out first before proceeding to other sections.
          </Alert>
        </Box>
      )
    },
    {
      label: 'Location Details',
      description: 'Provide accurate location information for mapping and analysis.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            📍 Location Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <LocationIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Address Fields
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Country" secondary="Select your country" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Region" secondary="Enter your region/province" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="City" secondary="Specify your city or municipality" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Barangay" secondary="Enter your barangay (optional)" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <MyLocationIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Coordinates
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Use the map interface to select the exact location of your renewable energy system.
                  </Typography>
                  <Alert severity="warning" sx={{ fontSize: '0.8rem' }}>
                    <strong>Important:</strong> Accurate coordinates help prevent duplicate entries and enable proper mapping.
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Technical Assessment',
      description: 'Provide detailed technical specifications based on your RE category.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            ⚡ Technical Specifications
          </Typography>
          
          <Accordion 
            expanded={expandedAccordion === 'panel1'} 
            onChange={handleAccordionChange('panel1')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center">
                <SolarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Solar Energy</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                Primary Usage Types
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Power Generation" 
                    secondary="Grid-connected systems for electricity production"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Solar Street Lights" 
                    secondary="Standalone lighting systems (not available for power generation systems)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Solar Pump" 
                    secondary="Water pumping systems (not available for power generation systems)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Other" 
                    secondary="Custom solar applications"
                  />
                </ListItem>
              </List>

              <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body2">
                  <strong>Power Generation Systems:</strong> When "Power Generation" is selected, additional subcategories become available for detailed classification.
                </Typography>
              </Alert>

              <Typography variant="subtitle2" gutterBottom color="primary" sx={{ fontWeight: 'bold', mt: 2 }}>
                Power Generation Subcategories
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Rooftop Solar PV" 
                    secondary="Residential, Commercial, or Industrial rooftop installations"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Ground-mounted Solar PV" 
                    secondary="Solar farms, captive plants, or floating solar installations"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Building-integrated PV (BIPV)" 
                    secondary="Integrated into walls, windows, facades, or roofing materials"
                  />
                </ListItem>
              </List>

              <Typography variant="subtitle2" gutterBottom color="primary" sx={{ fontWeight: 'bold', mt: 2 }}>
                System Configuration
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Grid-tied" 
                    secondary="Connected to the electrical grid (required for Commercial systems)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Off-grid" 
                    secondary="Standalone system (not available for net-metered systems)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Hybrid" 
                    secondary="Combination of grid and battery storage"
                  />
                </ListItem>
              </List>

              <Typography variant="subtitle2" gutterBottom color="primary" sx={{ fontWeight: 'bold', mt: 2 }}>
                Technical Specifications
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Capacity (kW)" 
                    secondary="Total installed capacity of your solar system"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Annual Energy Production (kWh)" 
                    secondary="Expected or actual annual energy generation (required for Power Generation)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Status" 
                    secondary="Operational, For Repair, or Condemnable"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Remarks" 
                    secondary="Additional notes or special considerations"
                  />
                </ListItem>
              </List>

              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Important Constraints:</strong>
                </Typography>
                <List dense sx={{ mt: 1 }}>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemText 
                      primary="• Net-metered systems cannot be Off-grid"
                      secondary="Net-metered systems must be connected to the grid"
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemText 
                      primary="• Power generation systems (Net-metered/DER/Own-use) must use Power Generation"
                      secondary="Solar Street Lights and Solar Pump are not available for these systems"
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemText 
                      primary="• Commercial systems automatically use Grid-tied configuration"
                      secondary="Other system types are disabled for Commercial installations"
                    />
                  </ListItem>
                </List>
              </Alert>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expandedAccordion === 'panel2'} 
            onChange={handleAccordionChange('panel2')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center">
                <WindIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Wind Energy</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Capacity (kW)" 
                    secondary="Total installed capacity of your wind system"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Usage Type" 
                    secondary="Power generation, water pumping, etc."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Status" 
                    secondary="Operational, For Repair, or Condemnable"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expandedAccordion === 'panel3'} 
            onChange={handleAccordionChange('panel3')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center">
                <BiomassIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Biomass</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Capacity (kW)" 
                    secondary="Total installed capacity of your biomass system"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Primary Usage" 
                    secondary="Biogas, Gasification, or other biomass conversion methods"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Bio Usage" 
                    secondary="Specific biomass application (if applicable)"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expandedAccordion === 'panel4'} 
            onChange={handleAccordionChange('panel4')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center">
                <HydroIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Hydropower</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Capacity (kW)" 
                    secondary="Total installed capacity of your hydropower system"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Status" 
                    secondary="Operational, For Repair, or Condemnable"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      )
    },
    {
      label: 'Solar Power Generation Subcategories',
      description: 'Detailed classification for solar power generation systems.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            ☀️ Solar Power Generation Classification
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Note:</strong> This section is only available when "Power Generation" is selected as the primary usage type for Solar Energy systems.
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom color="primary">
                    🏠 Rooftop Solar PV
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Residential Rooftop" 
                        secondary="Installed on homes and residential buildings"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Commercial Rooftop" 
                        secondary="Malls, offices, warehouses, and commercial buildings"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Industrial Rooftop" 
                        secondary="Factories, plants, and industrial facilities"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom color="primary">
                    🌍 Ground-mounted Solar PV
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Solar Farms/Parks" 
                        secondary="Utility-scale installations on large open land"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Captive Solar Plants" 
                        secondary="Private land installations for self-use (industries, institutions)"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Floating Solar Farms" 
                        secondary="Installations on reservoirs, lakes, or dams"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom color="primary">
                    🏗️ Building-integrated PV (BIPV)
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Integrated Systems" 
                        secondary="Integrated into walls, windows, facades, or roofing materials"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Architectural Integration" 
                        secondary="Seamlessly integrated into building design"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
            📊 Data Requirements
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Required Fields for Power Generation:</strong>
            </Typography>
            <List dense sx={{ mt: 1 }}>
              <ListItem sx={{ py: 0 }}>
                <ListItemText 
                  primary="• Capacity (kW)" 
                  secondary="Total installed capacity"
                />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText 
                  primary="• Annual Energy Production (kWh)" 
                  secondary="Expected or actual annual generation"
                />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText 
                  primary="• Main Category" 
                  secondary="Rooftop, Ground-mounted, or BIPV"
                />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText 
                  primary="• Subcategory" 
                  secondary="Specific type within the main category"
                />
              </ListItem>
            </List>
          </Alert>

          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Benefits of Detailed Classification:</strong> This system provides comprehensive data for analysis, 
              policy development, and renewable energy planning while maintaining logical consistency and preventing data conflicts.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      label: 'Commercial Details',
      description: 'Additional information required for commercial systems and power generation validation.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            🏢 Commercial System Requirements
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Note:</strong> The following fields are only required when "Commercial" is selected as the RE Classification.
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <BusinessIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    FIT Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="FIT Eligibility" 
                        secondary="Whether your system qualifies for Feed-in Tariff"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="FIT Phase" 
                        secondary="FIT1, FIT2, or Non-FIT"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="FIT Rate" 
                        secondary="Tariff rate in PHP/kWh (optional)"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="FIT Reference" 
                        secondary="Reference number from energy regulatory body (optional)"
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
                    <AssessmentIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    System Assessment
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Net Metered" 
                        secondary="Whether the system is connected to the grid for net metering"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="DER (Distributed Energy Resource)" 
                        secondary="Whether the system is classified as a distributed energy resource"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Own Use" 
                        secondary="Whether the energy is used by the owner or sold to the grid"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Status" 
                        secondary="Current operational status of the system"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
            🔒 Power Generation System Validation
          </Typography>
          
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>Important:</strong> The following validation rules are automatically enforced to ensure logical consistency.
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom color="error">
                    ⚠️ System Type Constraints
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Net-metered Systems" 
                        secondary="Cannot be Off-grid - must be Grid-tied or Hybrid"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Commercial Systems" 
                        secondary="Automatically use Grid-tied configuration"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Power Generation Systems" 
                        secondary="Must use Power Generation usage type"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom color="error">
                    ⚠️ Usage Type Restrictions
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Solar Street Lights" 
                        secondary="Not available for Net-metered/DER/Own-use systems"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Solar Pump" 
                        secondary="Not available for Net-metered/DER/Own-use systems"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Establishment Type" 
                        secondary="Not required for Solar Power Generation (handled by subcategories)"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Smart Validation:</strong> The system automatically prevents invalid combinations and guides you to make appropriate selections. 
              When constraints are active, affected options are disabled and explanatory messages are displayed.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      label: 'Documentation & Images',
      description: 'Upload supporting documents and images for verification.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            📎 Supporting Documentation
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <UploadIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Image Requirements
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="File Types" 
                        secondary="JPG, PNG, or PDF files are accepted"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="File Size" 
                        secondary="Maximum 5MB per file"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="File Count" 
                        secondary="Maximum 3 files per inventory"
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
                    Recommended Images
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="System Overview" 
                        secondary="Full view of the renewable energy system"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Technical Details" 
                        secondary="Close-ups of key components"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Installation Photos" 
                        secondary="Documentation of the installation process"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <strong>Important:</strong> Clear, high-quality images help verify your system and may be required for certain applications.
          </Alert>
        </Box>
      )
    },
    {
      label: 'Review & Submit',
      description: 'Final review and submission of your inventory entry with validation checks.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            ✅ Final Steps
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Review All Information" 
                secondary="Double-check all entered data for accuracy"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Verify Coordinates" 
                secondary="Ensure the location on the map is correct"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Check Required Fields" 
                secondary="All mandatory fields should be filled"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Upload Images" 
                secondary="Add supporting documentation if available"
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
            🔍 Validation Checklist
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>System Validation:</strong> The following checks are automatically performed to ensure data consistency.
            </Typography>
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom color="primary">
                    ⚡ Solar System Validation
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="✓ Net-metered ≠ Off-grid" 
                        secondary="Net-metered systems must be grid-connected"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="✓ Power Generation Systems" 
                        secondary="Must use Power Generation usage type"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="✓ Commercial = Grid-tied" 
                        secondary="Commercial systems use grid-tied configuration"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom color="primary">
                    🏗️ Data Consistency Checks
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="✓ Solar Subcategories" 
                        secondary="Power Generation requires main category and subcategory"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="✓ Establishment Type" 
                        secondary="Not required for Solar Power Generation"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="✓ Annual Energy Production" 
                        secondary="Required for Power Generation systems"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="success" sx={{ mt: 2 }}>
            <strong>Ready to Submit!</strong> Once you're satisfied with all the information and validation checks pass, 
            click the "Save Inventory" button to create your entry.
          </Alert>

          {formType === 'edit' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <strong>Editing Mode:</strong> You're updating an existing inventory. Changes will be saved when you click "Update Inventory".
              All validation rules still apply to ensure data consistency.
            </Alert>
          )}
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
            {formType === 'new' ? 'New Inventory' : 'Edit Inventory'} - User Guide
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
            Welcome to the {formType === 'new' ? 'New Inventory' : 'Edit Inventory'} form! 
            This guide will walk you through each step of the process to ensure you provide accurate and complete information.
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
            startIcon={<EditIcon />}
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
              startIcon={activeStep === steps.length - 1 ? <CheckCircleIcon /> : <AddIcon />}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Continue'}
            </Button>
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default InventoryHelpModal;
