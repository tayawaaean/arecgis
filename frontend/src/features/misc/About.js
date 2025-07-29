
import { Box, Container, Grid, Link, Typography } from "@mui/material"
import { listItemStyle } from "../../config/style"


import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import FacebookIcon from '@mui/icons-material/Facebook'
import DirectionsIcon from '@mui/icons-material/Directions'


const About = () => {

    const content = (
        <>
            <Box
                component="img"
                sx={{
                    position: 'absolute',
                    zIndex: -1,
                    width: '100%',
                    marginTop: -10,
                }}
                alt="AREC logo"
                src="/covernberic.png"
            />
            <Container maxWidth="lg" >
                <Box
                    sx={{
                        // width: '120%',
                        // '&:hover': {
                        //   backgroundColor: 'white.main',
                        //   opacity: [0.9, 0.8, 0.7],
                        // },
                        backgroundImage: "url(/inmap.png)",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        // filter: "blur(8px)",
                        opacity: 0.95,
                        borderRadius: 0.5,
                        padding: { xs: 1, sm: 5, md: 5, lg: 10 },
                        marginTop: 10,
                        marginBottom: 10,

                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item sm={12} md={10} lg={8}>
                            <Box>
                                <Typography variant="h3" color="primary.ocean" gutterBottom>
                                    About <b style={{color: "#FFBF00"}}>A<small>REC</small>GIS</b>
                                </Typography>
                                <Typography variant="body1" color="primary.ocean" gutterBottom>
                                    A<small>REC</small>GIS, developed by the Affiliated Renewable Energy Center (AREC) at Mariano Marcos State University and funded by the Department of Energy (DOE), is a mobile and web-based Geographic Information System (GIS). It serves the purpose of inventorying non-commercial renewable energy (RE) systems across the Philippines. The nationwide inventory is a crucial step towards quantifying the contribution of non-commercial RE systems in fulfilling the DOE's goal of achieving a 50% power generation mix from renewable energy sources by 2040.
                                </Typography>
                            </Box>

                            <Box marginTop={5}>
                                <Typography variant="h5" sx={{color: "#CBCBD4"}} gutterBottom>
                                    Contact Us
                                </Typography>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item marginRight={1}>
                                        <DirectionsIcon sx={{color: "#CBCBD4"}}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1" gutterBottom sx={listItemStyle}>
                                            <Link href="#" style={{ color: "#CBCBD4", textDecoration: 'none' }}>
                                                Mariano Marcos State University<br />
                                                National Bioenergy Research and Innovation Center (NBERIC),<br />
                                                City of Batac, Philippines
                                            </Link>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item marginRight={1}>
                                        <MailOutlineIcon sx={{color: "#CBCBD4"}}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1" gutterBottom sx={listItemStyle}>
                                            <Link href="#" style={{ color: "#CBCBD4", textDecoration: 'none' }}>
                                                arec@mmsu.edu.ph
                                            </Link>

                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item marginRight={1}>
                                        <LocalPhoneIcon sx={{color: "#CBCBD4"}}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1" color="primary.ocean" gutterBottom sx={listItemStyle}>
                                            (077) 774 0013
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item marginRight={1}>
                                        <FacebookIcon sx={{color: "#CBCBD4"}}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1" gutterBottom sx={listItemStyle}>
                                            <Link href="https://www.facebook.com/NBERIC.MMSU" target="_blank" style={{color: "#CBCBD4", textDecoration: 'none' }}>
                                                NBERIC.MMSU
                                            </Link>

                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            {/* <Item>xs=4</Item> */}
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    )
    return content
}
export default About