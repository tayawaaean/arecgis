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
  useMediaQuery,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Paper,
  Tabs,
  Tab,
  Tooltip,
  Fade
} from '@mui/material';
import {
  Close as CloseIcon,
  Help as HelpIcon,
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon,
  PieChart as PieChartIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Nature as NatureIcon,
  Lightbulb as LightbulbIcon,
  Air as AirIcon,
  Water as WaterIcon,
  Grass as GrassIcon,
  ExpandMore as ExpandMoreIcon,
  Speed as SpeedIcon,
  BugReport as BugReportIcon,
  School as SchoolIcon,
  TipsAndUpdates as TipsIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const ChartHelpModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const steps = [
    {
      label: 'Charts & Statistics Overview',
      description: 'Understanding the comprehensive analytics system.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            📊 Analytics & Insights System
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <AnalyticsIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    What are Charts & Statistics?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Our comprehensive analytics system provides real-time insights into renewable energy 
                    installations, capacity trends, and environmental impact across different energy types 
                    and time periods.
                  </Typography>
                  <Chip 
                    icon={<SpeedIcon />} 
                    label="Real-time Updates" 
                    color="success" 
                    size="small" 
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip 
                    icon={<VisibilityIcon />} 
                    label="Interactive Charts" 
                    color="info" 
                    size="small" 
                    sx={{ mr: 1, mb: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <TrendingUpIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Key Benefits
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Track installation progress over time" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Monitor capacity growth trends" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Analyze environmental impact" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Compare different energy types" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Start Guide */}
          <Paper elevation={1} sx={{ mt: 2, p: 2, backgroundColor: 'rgba(25, 118, 210, 0.08)' }}>
            <Typography variant="subtitle2" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              🚀 Quick Start Guide
            </Typography>
            <Typography variant="body2" color="text.secondary">
              1. Select your RE Category (Solar, Wind, Hydro, Biomass) → 2. Choose Chart Type → 3. Apply filters → 4. Analyze results
            </Typography>
          </Paper>
        </Box>
      )
    },
    {
      label: 'Chart Types Available',
      description: 'Explore all available chart types and their purposes.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            📈 Available Chart Types
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <BarChartIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Bar Charts
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Best for:</strong> Comparing values across categories
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Use cases:</strong> Monthly capacity comparisons, system counts
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Advantages:</strong> Easy to read, good for discrete data
                  </Typography>
                  <Chip 
                    icon={<TipsIcon />} 
                    label="Tip: Use for monthly comparisons" 
                    color="info" 
                    size="small" 
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <LineChartIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Line Charts
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Best for:</strong> Showing trends over time
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Use cases:</strong> Growth patterns, seasonal trends
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Advantages:</strong> Shows progression, identifies patterns
                  </Typography>
                  <Chip 
                    icon={<TipsIcon />} 
                    label="Tip: Perfect for trend analysis" 
                    color="success" 
                    size="small" 
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Chart Selection Guide */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" color="primary">
                🎯 Chart Selection Guide
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Capacity Analysis:</strong> Use Bar Charts for monthly capacity comparisons
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Growth Trends:</strong> Use Line Charts for long-term growth patterns
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Category Comparison:</strong> Use Bar Charts for energy type comparisons
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      )
    },
    {
      label: 'Chart Categories',
      description: 'Detailed breakdown of all chart categories and metrics.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            🎯 Chart Categories & Metrics
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <LightbulbIcon color="warning" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Solar Energy Charts
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Typography variant="body2" color="warning">💡</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Solar Streetlights" 
                        secondary="Capacity trends for solar streetlight installations"
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Typography variant="body2" color="warning">☀️</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Solar Power Generation" 
                        secondary="Monthly solar power generation capacity (kWp)"
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Typography variant="body2" color="warning">🚰</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Solar Pumps" 
                        secondary="Solar pump capacity trends and installations"
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Typography variant="body2" color="warning">⚡</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Annual Energy Production" 
                        secondary="Solar energy production trends (kWh)"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <NatureIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Other Renewable Energy Types
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Typography variant="body2" color="success">💨</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Wind Energy" 
                        secondary="Monthly wind energy capacity trends (kWp)"
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Typography variant="body2" color="info">🌊</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Hydropower" 
                        secondary="Hydropower capacity trends and installations"
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Typography variant="body2" color="success">🌱</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Biomass" 
                        secondary="Biomass energy capacity trends (kWp)"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <AnalyticsIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Overview Charts
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" paragraph>
                        <strong>📊 Total Capacity Overview:</strong> Monthly total capacity installation across all RE types
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>🔢 System Count Overview:</strong> Number of RE systems added each month
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" paragraph>
                        <strong>🌍 Environmental Impact:</strong> CO2 emissions saved and trees equivalent
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>📈 Growth Trends:</strong> Overall system growth and operational status
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Filtering & Customization',
      description: 'How to use filters and customize your charts.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            🔍 Filtering & Customization Options
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <FilterIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Time-Based Filters
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Year Selection:</strong> Choose specific years or view all years
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Month Range:</strong> Focus on specific months or view full year
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Trend Analysis:</strong> Compare different time periods
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <InfoIcon color="info" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Category Filters
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>RE Category:</strong> Filter by energy type (Solar, Wind, Hydro, Biomass, Geothermal)
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Classification:</strong> Commercial vs Non-Commercial systems
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Status:</strong> Operational, For Repair, or Condemnable
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <CheckCircleIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Advanced Filtering Tips
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Combination Filters:</strong> Use multiple filters together for precise analysis
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Real-time Updates:</strong> Charts update automatically when filters change
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Export Options:</strong> Save filtered data for external analysis
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filter Best Practices */}
          <Paper elevation={1} sx={{ mt: 2, p: 2, backgroundColor: 'rgba(76, 175, 80, 0.08)' }}>
            <Typography variant="subtitle2" gutterBottom color="success" sx={{ fontWeight: 600 }}>
              💡 Filter Best Practices
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Start Broad:</strong> Begin with general filters, then narrow down
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Use Combinations:</strong> Combine time + category for focused insights
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Reset Regularly:</strong> Clear filters to see overall trends
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )
    },
    {
      label: 'Environmental Impact Metrics',
      description: 'Understanding CO2 savings and environmental benefits.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            🌍 Environmental Impact Analysis
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <WarningIcon color="warning" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    CO2 Emissions Saved
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Calculation:</strong> Based on 0.82 kg CO2 per kWh saved
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Solar Energy:</strong> 30% capacity factor for realistic estimates
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Wind Energy:</strong> 30% capacity factor for wind turbines
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Hydropower:</strong> 60% capacity factor for hydro systems
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Geothermal Energy:</strong> 90% capacity factor for geothermal systems
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <NatureIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Environmental Benefits
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Trees Equivalent:</strong> CO2 savings converted to tree planting equivalent
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Air Quality:</strong> Reduction in air pollution from fossil fuels
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Sustainability:</strong> Long-term environmental impact assessment
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Environmental Impact Calculator */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" color="success">
                🧮 Environmental Impact Calculator
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>CO2 Calculation:</strong> Capacity (kW) × Hours × Capacity Factor × 0.82 kg CO2/kWh
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Tree Equivalent:</strong> 1 tree absorbs ~22 kg CO2/year
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Example:</strong> 100 kW solar system saves ~2,160 kg CO2/year
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Tree Equivalent:</strong> ~98 trees planted annually
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      )
    },
    {
      label: 'Data Interpretation',
      description: 'How to read and understand your charts effectively.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            📊 Data Interpretation Guide
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <AnalyticsIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Reading Bar Charts
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Height Comparison:</strong> Taller bars = higher values
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Pattern Recognition:</strong> Look for consistent trends
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Outlier Detection:</strong> Identify unusually high/low values
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <TrendingUpIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Reading Line Charts
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Trend Direction:</strong> Upward = growth, Downward = decline
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Slope Analysis:</strong> Steep slope = rapid change
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Seasonal Patterns:</strong> Look for recurring cycles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Common Patterns */}
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                🔍 Common Data Patterns to Look For
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>📈 Growth Trends:</strong> Consistent upward movement over time
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>📉 Decline Patterns:</strong> Decreasing values or capacity
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>🔄 Seasonal Cycles:</strong> Recurring patterns throughout the year
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>📊 Plateaus:</strong> Periods of stable performance
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>⚠️ Anomalies:</strong> Unusual spikes or drops in data
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>🎯 Breakthroughs:</strong> Sudden improvements or innovations
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )
    },
    {
      label: 'Troubleshooting & Tips',
      description: 'Common issues and solutions for better chart experience.',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            🛠️ Troubleshooting & Pro Tips
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <BugReportIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Common Issues
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <WarningIcon color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="No Data Displayed" 
                        secondary="Check if filters are too restrictive"
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <WarningIcon color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Charts Not Loading" 
                        secondary="Refresh page or check internet connection"
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <WarningIcon color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Slow Performance" 
                        secondary="Reduce filter complexity or time range"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <TipsIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Pro Tips
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Bookmark Filters" 
                        secondary="Save frequently used filter combinations"
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Export Data" 
                        secondary="Download filtered results for external analysis"
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Compare Periods" 
                        secondary="Use filters to compare different time ranges"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Performance Optimization */}
          <Paper elevation={1} sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255, 152, 0, 0.08)' }}>
            <Typography variant="subtitle2" gutterBottom color="warning" sx={{ fontWeight: 600 }}>
              ⚡ Performance Optimization Tips
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Limit Time Range:</strong> Use shorter periods for faster loading
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Simplify Filters:</strong> Use fewer filters for better performance
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Clear Cache:</strong> Refresh browser if charts become slow
                </Typography>
              </Grid>
            </Grid>
          </Paper>
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
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
    >
      <DialogTitle 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HelpIcon sx={{ color: 'white !important' }} />
          <Typography variant="h6" sx={{ color: 'white !important' }}>
            Charts & Statistics Help Guide
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon sx={{ color: 'white !important' }} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Welcome to the Charts & Statistics User Guide! This comprehensive guide will help you understand 
            all available chart types, filtering options, and how to interpret the data effectively for 
            renewable energy analysis and reporting.
          </Typography>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Interactive Charts:</strong> All charts are interactive and update in real-time based on 
              your filter selections. Use the filters to customize your view and gain deeper insights.
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

export default ChartHelpModal;
