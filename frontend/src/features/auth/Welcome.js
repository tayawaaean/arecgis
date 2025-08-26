import React from 'react'
import { 
  Box, 
  Button, 
  CssBaseline, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Divider,
  Paper,
  useTheme,
  Tooltip,
  Skeleton
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useSelector } from 'react-redux'
import { selectAllInventories } from '../inventories/inventoriesApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import { selectAllBlogs } from '../blogs/blogsApiSlice'
import { 
  SolarPower as SolarIcon,
  Air as WindIcon,
  Water as HydroIcon,
  Grass as BiomassIcon,
  People as UsersIcon,
  Article as BlogIcon,
  Assessment as AssessmentIcon,
  Map as MapIcon,
  Add as AddIcon,
  CheckCircle as OperationalIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material'

const Welcome = () => {
  const navigate = useNavigate()
  const { username, isManager, isAdmin } = useAuth()
  const theme = useTheme()
  
  // Get data from Redux store
  const inventories = useSelector(selectAllInventories)
  const users = useSelector(selectAllUsers)
  const blogs = useSelector(selectAllBlogs)
  
  // Filter for non-commercial data only
  const nonCommercialInventories = inventories?.filter(inv => 
    inv.properties?.reClass === 'Non-Commercial'
  ) || []
  
  // Lightweight loading heuristic for skeletons (no RTK Query here)
  const isOverviewLoading =
    (!inventories || inventories.length === 0) &&
    (!users || users.length === 0) &&
    (!blogs || blogs.length === 0)
  
  // Calculate summary statistics (non-commercial only)
  const totalSystems = nonCommercialInventories?.length || 0
  const totalCapacity = nonCommercialInventories?.reduce((sum, inv) => {
    let capacity = 0;
    const reCat = inv.properties?.reCat;
    
    if (reCat === 'Solar Energy') {
      if (inv.assessment?.solarStreetLights) {
        // Handle solar street lights with multiple items
        capacity = inv.assessment.solarStreetLights.reduce((solarSum, solar) => {
          const cap = (parseFloat(solar.capacity) || 0) / 1000; // Convert W to kW
          const pcs = parseInt(solar.pcs, 10) || 0;
          return solarSum + (cap * pcs);
        }, 0);
      } else if (inv.assessment?.solarUsage === 'Power Generation') {
        capacity = (parseFloat(inv.assessment.capacity) || 0) / 1000; // Convert W to kW
      } else if (inv.assessment?.solarUsage === 'Solar Pump') {
        capacity = (parseFloat(inv.assessment.capacity) || 0) / 1000; // Convert W to kW
      } else if (inv.assessment?.solarUsage === 'Other') {
        capacity = (parseFloat(inv.assessment.capacity) || 0) / 1000; // Convert W to kW
      }
    } else if (reCat === 'Wind Energy') {
      capacity = (parseFloat(inv.assessment?.capacity) || 0) / 1000; // Convert W to kW
    } else if (reCat === 'Biomass') {
      capacity = (parseFloat(inv.assessment?.capacity) || 0) / 1000; // Convert W to kW
    } else if (reCat === 'Hydropower') {
      capacity = (parseFloat(inv.assessment?.capacity) || 0) / 1000; // Convert W to kW
    }
    
    return sum + capacity;
  }, 0) || 0
  
  const systemsByCategory = nonCommercialInventories?.reduce((acc, inv) => {
    const category = inv.properties?.reCat || 'Solar Energy'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {}) || {}
  
  const operationalSystems = nonCommercialInventories?.filter(inv => 
    inv.assessment?.status === 'Operational'
  ).length || 0
  
  const recentInventories = nonCommercialInventories?.slice(-3) || []
  const totalUsers = users?.length || 0
  
  // Debug logging for capacity calculation
  console.log('Welcome - Non-commercial capacity calculation:', {
    totalInventories: nonCommercialInventories?.length || 0,
    totalCapacity: totalCapacity,
    capacityBreakdown: nonCommercialInventories?.reduce((acc, inv) => {
      const reCat = inv.properties?.reCat;
      const reClass = inv.properties?.reClass;
      let capacity = 0;
      
      if (reCat === 'Solar Energy') {
        if (inv.assessment?.solarStreetLights) {
          capacity = inv.assessment.solarStreetLights.reduce((solarSum, solar) => {
            const cap = (parseFloat(solar.capacity) || 0) / 1000; // Convert W to kW
            const pcs = parseInt(solar.pcs, 10) || 0;
            return solarSum + (cap * pcs);
          }, 0);
        } else if (inv.assessment?.solarUsage === 'Power Generation') {
          capacity = (parseFloat(inv.assessment.capacity) || 0) / 1000; // Convert W to kW
        } else if (inv.assessment?.solarUsage === 'Solar Pump') {
          capacity = (parseFloat(inv.assessment.capacity) || 0) / 1000; // Convert W to kW
        } else if (inv.assessment?.solarUsage === 'Other') {
          capacity = (parseFloat(inv.assessment.capacity) || 0) / 1000; // Convert W to kW
        }
      } else if (reCat === 'Wind Energy') {
        capacity = (parseFloat(inv.assessment?.capacity) || 0) / 1000; // Convert W to kW
      } else if (reCat === 'Biomass') {
        capacity = (parseFloat(inv.assessment?.capacity) || 0) / 1000; // Convert W to kW
      } else if (reCat === 'Hydropower') {
        capacity = (parseFloat(inv.assessment?.capacity) || 0) / 1000; // Convert W to kW
      }
      
      if (!acc[reCat]) acc[reCat] = [];
      acc[reCat].push({ capacity, reClass, id: inv._id });
      return acc;
    }, {})
  });
  
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Solar Energy': return <SolarIcon fontSize="small" />
      case 'Wind Energy': return <WindIcon fontSize="small" />
      case 'Hydropower': return <HydroIcon fontSize="small" />
      case 'Biomass': return <BiomassIcon fontSize="small" />
      default: return <SolarIcon fontSize="small" />
    }
  }
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Operational': return <OperationalIcon color="success" fontSize="small" />
      case 'For Repair': return <WarningIcon color="warning" fontSize="small" />
      case 'Condemable': return <ErrorIcon color="error" fontSize="small" />
      default: return <OperationalIcon color="success" fontSize="small" />
    }
  }
  
  const formatCapacity = (capacity) => {
    if (!capacity || capacity === 0) return '0 kW'
    
    // Handle extremely large values (GW range)
    if (capacity >= 1000000) {
      return `${(capacity / 1000000).toFixed(2)} GW`
    }
    // Handle large values (MW range)
    if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)} MW`
    }
    // Handle medium values (kW range)
    if (capacity >= 1) {
      return `${capacity.toFixed(1)} kW`
    }
    // Handle very small values (W range)
    return `${(capacity * 1000).toFixed(0)} W`
  }
  
  const content = (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundImage: 'url(/sun-tornado.svg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <CssBaseline />
      
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          {/* Left Side - Welcome Text & Actions */}
          <Grid item xs={12} md={5}>
            <Box sx={{ 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              <Typography
                component='h1'
                variant='h2'
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                }}
              >
                Hello{' '}
                <Tooltip title={username} placement="top" arrow>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      maxWidth: { xs: '65vw', sm: '50vw', md: '40vw' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      verticalAlign: 'bottom',
                      cursor: 'help'
                    }}
                  >
                    {username}
                  </Box>
                </Tooltip>
                {' '}! 👋
              </Typography>
              
              <Typography variant="h5" sx={{ mb: 4, color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                Welcome to Affiliated Renewable Energy Center Geographic Information System (ARECGIS)
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 5, color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)', lineHeight: 1.6 }}>
                We are currently developing a GIS-based multi-platform application that can gather, manage, and analyze data of Renewable Energy Systems.
              </Typography>
              
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
                <Button 
                  variant='contained' 
                  size='large'
                  startIcon={<MapIcon />}
                  sx={{ 
                    background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #b91c1c, #dc2626)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(220, 38, 38, 0.5)',
                    }
                  }} 
                  onClick={() => navigate('/dashboard/inventories')}
                >
                  Map Dashboard
                </Button>
                
                <Button 
                  variant='contained' 
                  size='large'
                  startIcon={<AddIcon />}
                  sx={{ 
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(25, 118, 210, 0.5)',
                    }
                  }}  
                  onClick={() => navigate('/dashboard/inventories/new')}
                >
                  Assessment Form
                </Button>
              </Box>
            </Box>
          </Grid>
          
          {/* Right Side - Summary Data in White Container */}
          <Grid item xs={12} md={5}>
            <Paper elevation={8} sx={{ 
              height: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              {/* Header */}
              <Box sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                p: 3,
                color: 'white'
              }}>
                <Typography  variant="h4" 
             sx={{ 
               fontWeight: 'bold',
               textShadow: '0 1px 2px rgba(0,0,0,0.3)',
               color: 'white !important'
             }}>
                  📊 System Overview
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, color: 'white !important' }}>
                  Real-time summary of ARECGIS data
                </Typography>
              </Box>
              
              <Box sx={{ p: 3 }}>
                {isOverviewLoading ? (
                  <>
                    {/* Skeleton: Key Metrics */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent sx={{ p: 2 }}>
                            <Skeleton variant="text" width={80} height={36} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width={100} height={18} />
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent sx={{ p: 2 }}>
                            <Skeleton variant="text" width={120} height={36} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width={120} height={18} />
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Skeleton: Systems by Category */}
                    <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
                    <Box sx={{ mb: 3 }}>
                      {[...Array(3)].map((_, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1.5 }}>
                          <Skeleton variant="text" width={140} height={20} />
                          <Skeleton variant="rounded" width={32} height={24} />
                        </Box>
                      ))}
                    </Box>

                    {/* Skeleton: System Status */}
                    <Skeleton variant="text" width={180} height={28} sx={{ mb: 2 }} />
                    <Card>
                      <CardContent sx={{ p: 2 }}>
                        <Skeleton variant="rounded" height={48} />
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    {/* Informational Note */}
                    <Box sx={{ 
                      mb: 3, 
                      p: 2, 
                      borderRadius: 2, 
                      backgroundColor: 'rgba(25, 118, 210, 0.08)', 
                      border: '1px solid rgba(25, 118, 210, 0.2)',
                      textAlign: 'center'
                    }}>
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                        ℹ️ Dashboard Overview displays <strong>Non-Commercial</strong> renewable energy data only. 
                        Navigate to Charts & Statistics to view Commercial data or adjust filters.
                      </Typography>
                    </Box>

                    {/* Key Metrics */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <Card sx={{ 
                          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                          border: `1px solid ${theme.palette.primary.main}`,
                          color: 'white'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: 2 }}>
                            <Tooltip 
                              title={`${totalSystems.toLocaleString()} total systems`}
                              placement="top"
                              arrow
                            >
                              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'white !important', cursor: 'help' }}>
                                {totalSystems}
                              </Typography>
                            </Tooltip>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                              Total Systems
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Card sx={{ 
                          background: `linear-gradient(135deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
                          border: `1px solid ${theme.palette.secondary.main}`,
                          color: 'white'
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: 2 }}>
                            <Tooltip 
                              title={totalCapacity ? `${totalCapacity.toLocaleString()} kW (full value)` : '0 kW'}
                              placement="top"
                              arrow
                            >
                              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'white !important', cursor: 'help' }}>
                                {formatCapacity(totalCapacity)}
                              </Typography>
                            </Tooltip>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                              Total Capacity
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                    
                    {/* Systems by Category */}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'black' }}>
                      🌱 Systems by Category
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      {Object.entries(systemsByCategory).map(([category, count]) => (
                        <Box key={category} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          mb: 1,
                          p: 1.5,
                          borderRadius: 2,
                          background: `rgba(${theme.palette.primary.main}, 0.05)`,
                          border: `1px solid rgba(${theme.palette.primary.main}, 0.1)`
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getCategoryIcon(category)}
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'black' }}>
                              {category}
                            </Typography>
                          </Box>
                          <Chip 
                            label={count} 
                            size="small" 
                            sx={{ 
                              backgroundColor: theme.palette.primary.main,
                              color: 'white !important',
                              fontWeight: 600
                            }} 
                          />
                        </Box>
                      ))}
                    </Box>
                    
                    {/* System Status */}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'black' }}>
                      ⚡ System Status
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      background: `rgba(${theme.palette.success.main}, 0.05)`,
                      border: `1px solid rgba(${theme.palette.success.main}, 0.1)`
                    }}>
                      <OperationalIcon color="success" />
                      <Typography variant="body2" sx={{ flex: 1, color: 'black' }}>
                        Operational Systems
                      </Typography>
                      <Chip 
                        label={operationalSystems} 
                        size="small" 
                        sx={{ 
                          backgroundColor: theme.palette.success.main,
                          color: 'white !important',
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
  
  return content
}

export default Welcome