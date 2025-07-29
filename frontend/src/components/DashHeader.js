import React, { useState, useEffect } from "react"
import { styled, alpha } from "@mui/material/styles"
import { useNavigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
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
import { MoonLoader } from 'react-spinners'
import {
  Home as HomeIcon,
  MyLocation as MyLocationIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircle,
  HelpOutline as HelpOutlineIcon,
  Logout as LogoutIcon,
  MoreVert as MoreIcon,
  Language as LanguageIcon,
  ManageAccounts as ManageAccountsIcon,
  Info as InfoIcon,
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  Map as MapIcon,
  ListAlt as ListAltIcon,
  Download as DownloadIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
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

  if (isLoading) return (
    <>
      <CssBaseline />
      <Grid
        container
        spacing={0}
        direction="row"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item >
          <MoonLoader color={"#fffdd0"} />
        </Grid>
      </Grid>
    </>
  )


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

  const accSettings = () => {
    setAnchorElNav(null)
    navigate(`/dashboard/settings/${id}`)
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = "primary-search-account-menu"
  const renderMenu = (
    <Menu
      anchorEl={anchorElNav}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={accSettings} >
        <ListItemIcon>
          <SettingsIcon color="primary" fontSize="small" />
        </ListItemIcon>
        Account Settings
      </MenuItem>
      <MenuItem onClick={sendLogout}>
        <ListItemIcon>
          <LogoutIcon color="primary" fontSize="small" />
        </ListItemIcon>
        Log out
      </MenuItem>

    </Menu>
  )

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
    >
      <MenuItem onClick={accSettings}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle color="primary" fontSize="small" />
        </IconButton>
        <p>Account Settings</p>
      </MenuItem>
      <MenuItem onClick={sendLogout}>
        <IconButton aria-label="logout" color="inherit">
          <LogoutIcon color="primary" fontSize="small" />
        </IconButton >
        <p>Log out</p>
      </MenuItem>
    </Menu>
  )
  //drawer start


  const handleDrawerOpen = () => {
    setOpen(true)
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
  const GoToHelp = () => {
    alert('Sorry, this feature is currently in ongoing development.')
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
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={open} onClose={handleDrawerClose}>
              <Box sx={{ width: 250 }} role="presentation">
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <IconButton sx={{ padding: 0 }} onClick={handleDrawerClose}>
                        <MenuIcon />
                      </IconButton>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{ display: "inline", fontWeight: "bold" }}
                          component="span"
                          variant="h6"
                          color="text.primary"
                        >
                          A<small>REC</small>GIS
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
                <List>
                  <ListItem key="1" disablePadding>
                    <ListItemButton onClick={GoHomeButton}>
                      <ListItemIcon>
                        <HomeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Home" />
                    </ListItemButton>
                  </ListItem>
                  {/* <ListItem key="2" disablePadding>
                    <ListItemButton onClick={GoToRenergies}>
                      <ListItemIcon>
                        <MapIcon />
                      </ListItemIcon>
                      <ListItemText primary="Map Dashboard" />
                    </ListItemButton>
                  </ListItem> */}
                  <ListItem key="3" disablePadding>
                    <ListItemButton onClick={GoToInventories}>
                      <ListItemIcon>
                        <MapIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Map Dashboard" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem key="4" disablePadding>
                    <ListItemButton onClick={GoToInventoryList}>
                      <ListItemIcon>
                        <ListAltIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="My Inventory" />
                    </ListItemButton>
                  </ListItem>
                  {/* <ListItem key="5" disablePadding>
                    <ListItemButton onClick={GoToRenegyList}>
                      <ListItemIcon>
                        <ListAltIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Technical Assessment list (RE)" />
                    </ListItemButton>
                  </ListItem> */}
                  {(isManager || isAdmin) &&
                    <ListItem key="6" disablePadding>
                      <ListItemButton onClick={GoToUserSettings}>
                        <ListItemIcon>
                          <GroupIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="User Settings" />
                      </ListItemButton>
                    </ListItem>}
                  {(isManager || isAdmin) &&
                    <ListItem key="7" disablePadding>
                      <ListItemButton onClick={GoToAddUser}>
                        <ListItemIcon>
                          <PersonAddIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Create New User" />
                      </ListItemButton>
                    </ListItem>}
                  <ListItem key="8" disablePadding>
                    <ListItemButton disabled onClick={GoToServices}>
                      <ListItemIcon>
                        <LanguageIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Services" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem key="9" disablePadding>
                    <ListItemButton  onClick={handleClick}>
                      <ListItemIcon>
                        <DownloadIcon  color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Downloads" />
                    </ListItemButton>
                  </ListItem>
                </List>
                <Divider />
                <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={openDownload}
                onClose={handleClose}
              >
                {/* <MenuItem onClick={handleClose} disableRipple>
                  <DownloadIcon />
                  <Link href="https://www.dropbox.com/scl/fi/tjrbfwwer7cd4w4omxoso/AREC-V1.apk?rlkey=pxr2vv40fd6m8ujyvaejersq8&dl=0" target="_blank" style={{textDecoration: 'none'}}>A<small>REC</small>GIS_v1.apk</Link>
                  <a href={baseUrl+"mobile/"+"65336db4d90f0cc2036e3d68"} target="_blank">A<small>REC</small>GIS_beta.apk</a>
                </MenuItem> */}
                <MenuItem onClick={handleClose} disableRipple>
                  <DownloadIcon />
                  <a href={baseUrl+"mobile/"+"6535d746400c288fd3201c6f"} target="_blank">A<small>REC</small>GIS_v1.0.0.apk</a>
                </MenuItem>
              </StyledMenu>
                <List>
                  <ListItem key="9" disablePadding>
                    <ListItemButton onClick={GoToAbout}>
                      <ListItemIcon>
                        <InfoIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="About" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem key="10" disablePadding>
                    <ListItemButton disabled onClick={GoToHelp}>
                      <ListItemIcon>
                        <HelpOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Help" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                  <ListItem key="11" disablePadding>
                    <ListItemButton >
                      {/* <ListItemIcon>
                        <ManageAccountsIcon />
                      </ListItemIcon>
                      <ListItemText primary= /> */}
                      <Chip icon={<ManageAccountsIcon />} label={status} size="small" color="error" />
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


            {/* <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search> */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              
              

              <Stack direction="row" alignItems="center" gap={1}>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Typography variant="body1">{username}</Typography>
              </Stack>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}

    </>
  )
  return content
}
export default DashHeader
