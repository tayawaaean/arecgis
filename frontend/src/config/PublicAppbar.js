import { AppBar, Box, Button, Divider, Grid, IconButton, Link, Menu, MenuItem, Stack, Toolbar, Typography, alpha, styled } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import { pages } from "./techAssesment"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import DownloadIcon from '@mui/icons-material/Download'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { baseUrl } from '../config/baseUrl'

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
const PublicAppbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  }
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  const navigate = useNavigate()

  const content = (
    <AppBar
      position="sticky"
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
      <Box
          component="img"
          sx={{
            height: 50,
            width: 50,
            marginRight: 1,

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

          }}
          alt="MMSU seal"
          src="/MMSU.png"
        />
        <Box
          component="img"
          sx={{
            height: 50,
            width: 50,

          }}
          alt="AREC logo"
          src="/AREC.png"
        />

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "block", sm: "none" }, ml: 1 }}
        >
          A<small>REC</small>GIS
        </Typography>
        <Grid item xs={12} sx={{ flexGrow: 1 }} >
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

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page.id} onClick={() => navigate(page.href)}>
                <Typography textAlign="center">{page.title}</Typography>
              </MenuItem>
            ))}
              <MenuItem onClick={() => navigate("/login")}>
                <Typography textAlign="center">Log in</Typography>
              </MenuItem>

              <MenuItem >
              <Button
            sx={{color: '#000'}}
            id="demo-customized-button"
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="outlined"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            
            Downloads
          </Button>
              </MenuItem>

          </Menu>
        </Box>
        <Stack direction="row" alignItems="center" gap={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button key={page.id} color='inherit' onClick={() => navigate(page.href)} variant={'text'} sx={{ my: 1 }}>
              {page.title}
            </Button>
          ))}
          <Button
            color='inherit'
            id="demo-customized-button"
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="text"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Downloads
          </Button>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              'aria-labelledby': 'demo-customized-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {/* <MenuItem onClick={handleClose} disableRipple>
              <DownloadIcon />
              <Link href="https://www.dropbox.com/scl/fi/tjrbfwwer7cd4w4omxoso/AREC-V1.apk?rlkey=pxr2vv40fd6m8ujyvaejersq8&dl=0" target="_blank" style={{textDecoration: 'none'}}>A<small>REC</small>GIS_v1.apk</Link>
              <a href={baseUrl + "mobile/" + "65336db4d90f0cc2036e3d68"} target="_blank">A<small>REC</small>GIS_beta.apk</a>
            </MenuItem> */}
            <MenuItem onClick={handleClose} disableRipple>
              <DownloadIcon />
              <a href={baseUrl + "mobile/" + "6535d746400c288fd3201c6f"} target="_blank">A<small>REC</small>GIS_v1.0.0.apk</a>
            </MenuItem>
          </StyledMenu>
          <Button color='inherit' onClick={() => navigate('/login')} variant={'outlined'} sx={{ my: 1, borderColor: 'rgba(255,255,255,0.6)' }}>
            Log in
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  )
  return content
}
export default PublicAppbar