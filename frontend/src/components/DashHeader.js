import React, { useState, useEffect } from "react"
import { styled, alpha } from "@mui/material/styles"
import { useNavigate, useLocation } from "react-router-dom"
import { SwapHoriz as SwapHorizIcon } from "@mui/icons-material/";
import useAuth from "../hooks/useAuth"
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import BarChartIcon from '@mui/icons-material/BarChart';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  MenuItem,
  Menu,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon,
  Grid,
  CssBaseline,
  Stack,
  Chip,
  Button,
  Link,
} from "@mui/material"
import SectionLoading from './SectionLoading'
import {
  Home as HomeIcon,
  MyLocation as MyLocationIcon,
  Menu as MenuIcon,

  AccountCircle as AccountCircle,
  HelpOutline as HelpOutlineIcon,
  Logout as LogoutIcon,
  MoreVert as MoreIcon,
  ManageAccounts as ManageAccountsIcon,
  Info as InfoIcon,
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  Map as MapIcon,
  ListAlt as ListAltIcon,
  Download as DownloadIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Person as PersonIcon,
  Business as BusinessIcon,

} from "@mui/icons-material/"
import { baseUrl } from '../config/baseUrl'

const DASHBOARD_REGEX = /^\/dashboard(\/)?$/
const RENERGIES_REGEX = /^\/dashboard\/renergies(\/)?$/
const USERS_REGEX = /^\/dashboard\/users(\/)?$/


const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}))
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}))
const DashHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openDownload = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  }
  const { id, username, status, isManager, isAdmin } = useAuth()
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) {
      // setAnchorEl(null)
      setAnchorElNav(null)
      handleMobileMenuClose()
      navigate('/')
    }

  }, [isSuccess, navigate])

  // Close any open overlays when route changes
  useEffect(() => {
    setOpen(false)
    setAnchorElNav(null)
    setMobileMoreAnchorEl(null)
  }, [pathname])

  if (isLoading) return <SectionLoading label="Signing out…" />


  if (isError) return <p>Error: {error?.data?.message}</p>

  let dashClass = null
  if (!DASHBOARD_REGEX.test(pathname) && !RENERGIES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
    dashClass = "dash-header__container--small"
  }

  const isMenuOpen = Boolean(anchorElNav)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorElNav(null)
    handleMobileMenuClose()
  }



  const goToProfile = () => {
    setAnchorElNav(null)
    navigate('/dashboard/profile')
  }

  const goToAffiliations = () => {
    setAnchorElNav(null)
    navigate('/dashboard/affiliations')
  }



  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = "primary-search-account-menu"


  const mobileMenuId = "primary-search-account-menu-mobile"
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 200,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.08)',
        }
      }}
    >
      {/* Profile Section */}
      <MenuItem 
        onClick={goToProfile}
        sx={{
          py: 1.5,
          px: 2,
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          }
        }}
      >
        <IconButton
          aria-label="user profile"
          color="primary"
          size="small"
        >
          <PersonIcon fontSize="small" />
        </IconButton>
        <Box sx={{ ml: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            My Profile
          </Typography>
          <Typography variant="caption" color="text.secondary">
            View and edit your profile
          </Typography>
        </Box>
      </MenuItem>
      
      {/* Admin/Manager Section */}
      {(isAdmin || isManager) && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              ADMINISTRATION
            </Typography>
          </Box>
          <MenuItem 
            onClick={goToAffiliations}
            sx={{
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              }
            }}
          >
            <IconButton
              aria-label="manage affiliations"
              color="primary"
              size="small"
            >
              <BusinessIcon fontSize="small" />
            </IconButton>
            <Box sx={{ ml: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Manage Affiliations
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Manage user affiliations
              </Typography>
            </Box>
          </MenuItem>
        </>
      )}

      {/* Logout Section */}
      <Divider sx={{ my: 1 }} />
      <MenuItem 
        onClick={sendLogout}
        sx={{
          py: 1.5,
          px: 2,
          '&:hover': {
            backgroundColor: 'rgba(211, 47, 47, 0.08)',
          }
        }}
      >
        <IconButton aria-label="logout" color="error" size="small">
          <LogoutIcon fontSize="small" />
        </IconButton>
        <Box sx={{ ml: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, color: 'error.main' }}>
            Log out
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Sign out of your account
          </Typography>
        </Box>
      </MenuItem>
    </Menu>
  )
  //drawer start


  const handleDrawerToggle = () => {
    setOpen(prev => !prev)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const GoHomeButton = () => {
    navigate('/dashboard')
    setOpen(false)
  }
  //inventories
  const GoToInventories = () => {
    navigate('/dashboard/inventories')
    setOpen(false)
  }
  const GoToInventoryList = () => {
    navigate('/dashboard/inventories/list')
    setOpen(false)
  }
    const GoToPublicCharts = () => {
    navigate('/dashboard/charts');
    setOpen(false);
  };

  const GoToTransactions = () => {
  navigate('/dashboard/requests');
  setOpen(false);
};

  //end inventories
  //renergies
  const GoToRenergies = () => {
    navigate('/dashboard/renergies')
    setOpen(false)
  }
  const GoToRenegyList = () => {
    navigate('/dashboard/renergies/list')
    setOpen(false)
  }
  //end renergies
  const GoToUserSettings = () => {
    navigate('/dashboard/users')
    setOpen(false)
  }
  const GoToAddUser = () => {
    navigate('/dashboard/users/new')
    setOpen(false)
  }
  const GoToServices = () => {
    alert('Sorry, this feature is currently in ongoing development.')
    setOpen(false)
  }
  const GoToAbout = () => {
    navigate('/dashboard/about')
    setOpen(false)
  }


  //drawer end
  const errClass = isError ? "errmsg" : "offscreen"
  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 1 }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={open} onClose={handleDrawerClose} ModalProps={{ keepMounted: false }}>
            <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerClose} onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Shift') handleDrawerClose() }}>
              {/* Drawer Header */}
              <Box sx={{ 
                p: 2, 
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: "bold",
                      color: 'primary.main',
                      fontSize: '1.25rem'
                    }}
                  >
                    A<small style={{ fontSize: '0.8em' }}>REC</small>GIS
                  </Typography>
                  <IconButton 
                    onClick={handleDrawerClose}
                    size="small"
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    display: 'block',
                    mt: 0.5,
                    fontStyle: 'italic'
                  }}
                >
                  Navigation Menu
                </Typography>
              </Box>
              {/* Main Navigation Section */}
              <List>
                <ListItem key="1" disablePadding>
                  <ListItemButton 
                    onClick={GoHomeButton}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <HomeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Home" 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
                
                <ListItem key="3" disablePadding>
                  <ListItemButton 
                    onClick={GoToInventories}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <MapIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Map Dashboard" 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
                
                <ListItem key="4" disablePadding>
                  <ListItemButton 
                    onClick={GoToInventoryList}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <ListAltIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="My Inventory" 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
                
                <ListItem key="transfers" disablePadding>
                  <ListItemButton 
                    onClick={GoToTransactions}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <SwapHorizIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Requests & Transfers" 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>

              {/* Analytics Section */}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  ANALYTICS & DATA
                </Typography>
              </Box>
              <List>
                <ListItem key="charts" disablePadding>
                  <ListItemButton 
                    onClick={GoToPublicCharts}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <BarChartIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Charts & Statistics" 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>



              {/* User & Account Section */}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  USER & ACCOUNT
                </Typography>
              </Box>
              <List>
                <ListItem key="profile" disablePadding>
                  <ListItemButton 
                    onClick={goToProfile}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="My Profile" 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
                

              </List>

              {/* Administration Section */}
              {(isManager || isAdmin) && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      ADMINISTRATION
                    </Typography>
                  </Box>
                  <List>
                    <ListItem key="6" disablePadding>
                      <ListItemButton 
                        onClick={GoToUserSettings}
                        sx={{
                          borderRadius: 1,
                          mx: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          }
                        }}
                      >
                        <ListItemIcon>
                          <GroupIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="User Settings" 
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItemButton>
                    </ListItem>
                    
                    <ListItem key="affiliations" disablePadding>
                      <ListItemButton 
                        onClick={goToAffiliations}
                        sx={{
                          borderRadius: 1,
                          mx: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          }
                        }}
                      >
                        <ListItemIcon>
                          <BusinessIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Manage Affiliations" 
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </>
              )}

              {/* Tools & Downloads Section removed as requested */}
              {/* About & Help Section */}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  SUPPORT & INFO
                </Typography>
              </Box>
              <List>
                <ListItem key="9" disablePadding>
                  <ListItemButton 
                    onClick={GoToAbout}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <InfoIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="About" 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
                

              </List>

              {/* Logout Section */}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  ACCOUNT
                </Typography>
              </Box>
              <List>
                <ListItem key="logout" disablePadding>
                  <ListItemButton 
                    onClick={sendLogout}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.08)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Log out" 
                      primaryTypographyProps={{ 
                        fontWeight: 500,
                        color: 'error.main'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>

            </Box>
          </Drawer>
            <Box
              component="img"
              sx={{
                height: 50,
                width: 50,
                marginRight: 1,
                display: {
                  xs: "none",
                  sm: "block",
                  md: "block"
                }
              }}
              alt="DOE seal"
              src="/doe_logo.jpg"
            />
            <Box
              component="img"
              sx={{
                height: 50,
                width: 50,
                marginRight: 1,
                display: {
                  xs: "none",
                  sm: "block",
                  md: "block"
                }
              }}
              alt="MMSU seal"
              src="/MMSU.png"
            />
            <Box
              component="img"
              sx={{
                height: 50,
                width: 50,

                display: {
                  xs: "none",
                  sm: "block",
                  md: "block"
                }
              }}
              alt="AREC logo"
              src="/AREC.png"
            />

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "block", sm: "none", md: "none" }, ml: 1 }}
            >
              A<small>REC</small>GIS
            </Typography>
            <Grid item xs={12} >
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: "none", sm: "block" }, ml: 1 }}
              >
                A<small>FFILIATED</small> R<small>ENEWABLE</small> E<small>NERGY</small> C<small>ENTER</small>
              </Typography>

              <div style={{ display: "flex", marginTop: '-8px' }}>
                <Typography
                  variant="subtitle1"
                  noWrap
                  component="div"
                  sx={{ display: { xs: "none", sm: "block" }, ml: 1 }}
                >
                  G<small>EOGRAPHIC</small> I<small>NFORMATION</small> S<small>YSTEM</small>
                </Typography>
              </div>
            </Grid>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              
              

              <Stack direction="row" alignItems="center" gap={1}>
                {/* Role indicator chip for admin/manager */}
                {(isAdmin || isManager) && (
                  <Chip
                    label={isAdmin ? "ADMIN" : "MANAGER"}
                    size="small"
                    color="warning"
                    variant="filled"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      height: 24,
                      '& .MuiChip-label': {
                        px: 1,
                      }
                    }}
                  />
                )}
                
                {/* Username display only */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <AccountCircle sx={{ color: 'white' }} />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'white !important',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    {username}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <Button
                variant="outlined"
                onClick={handleMobileMenuOpen}
                startIcon={<MoreIcon sx={{ color: 'white' }} />}
                sx={{
                  color: 'white !important',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  minWidth: 'auto',
                  '& .MuiButton-startIcon': {
                    color: 'white !important',
                  },
                  '& .MuiTypography-root': {
                    color: 'white !important',
                  },
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                }}
              >
                Menu
              </Button>
            </Box>
          </Toolbar>
        </AppBar>


    </>
  )
  return content
}
export default DashHeader
