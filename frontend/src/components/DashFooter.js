import React from "react"
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Container,
} from "@mui/material"

const DashFooter = () => {
    const currentYear = new Date().getFullYear()

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                top: 'auto', 
                bottom: 0,
                backgroundColor: 'primary.main',
                boxShadow: '0px -2px 8px rgba(0,0,0,0.1)'
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'center', minHeight: '48px' }}>
                    {/* Center - Copyright and branding */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 0.5, sm: 1 }
                    }}>
                        <Typography
                            variant="body2"
                            sx={{ 
                                color: 'white',
                                fontWeight: 500,
                                textAlign: 'center'
                            }}
                        >
                            AREC GIS
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ 
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '0.75rem'
                            }}
                        >
                            © {currentYear} All Rights Reserved
                        </Typography>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default DashFooter