import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"


import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
} from "@mui/material"
import {
  Home as HomeIcon,

} from "@mui/icons-material/"
const DashFooter = () => {


    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/dashboard')

    let goHomeButton = null
    if (pathname !== '/dashboard') {
        goHomeButton = (

            <IconButton
                onClick={onGoHomeClicked}
            >
                <HomeIcon/>
            </IconButton>
 
        )
    }

    const content = (
        <>
        <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
        <IconButton color="inherit">
            {goHomeButton}
          </IconButton> 
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Status:
          </Typography>

               
        </Toolbar>
      </AppBar>
        </>
    )
    return content
}
export default DashFooter