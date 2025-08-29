import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Stack,
  Box,
  Button,
  CssBaseline,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
}
  from '@mui/material/'

import MenuIcon from '@mui/icons-material/Menu'

import { experimentalStyled as styled } from '@mui/material/styles'
import { pages } from '../config/techAssesment'
import PublicAppbar from '../config/PublicAppbar'

const SolarEnergyCard = () => {
  const navigate = useNavigate()
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/solar-energy.png"
        title="solar panels"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Solar Energy Systems (SES)
        </Typography>
        <Typography variant="body2" color="text.secondary">
        Solar energy is a renewable energy source that converts sunlight into electricity using special panels. It's environmentally friendly, doesn't deplete resources like oil or gas, and helps reduce pollution.
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={()=>navigate('/public/resources')} size="small">Read more...</Button>
      </CardActions>
    </Card>
  )
}

const WindEnergyCard = () => {
  const navigate = useNavigate()
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/wind-energy.jpg"
        title="wind energy"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Wind Energy Systems (WES)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Wind energy is a renewable source that generates electricity by utilizing wind power through wind turbines. These turbines capture the kinetic energy of the wind and convert it into electrical energy.
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={()=>navigate('/public/resources')} size="small">Read more...</Button>
      </CardActions>
    </Card>
  )
}

const BiogasEnergyCard = () => {
  const navigate = useNavigate()
  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image="/biogas-energy.jpg"
          title="biogas energy"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Bio Energy Systems (BES)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            BES utilizes organic materials
            derived from plants or animals to
            generate electricity, heat, or fuel.
            This organic material is referred to as
            biomass and can be in the form of
            wood, crops, or animal waste.
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={()=>navigate('/public/resources')} size="small">Read more...</Button>
        </CardActions>
      </Card>
    </>
  )
}

const GeothermalEnergyCard = () => {
  const navigate = useNavigate()
  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image="/geothermal-energy.jpg"
          title="geothermal energy"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Geothermal Energy Systems (GES)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Geothermal energy harnesses the Earth's
            internal heat to generate electricity,
            provide direct heating, or power heat pumps.
            This renewable energy source offers consistent
            and reliable power generation with minimal
            environmental impact.
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={()=>navigate('/public/resources')} size="small">Read more...</Button>
        </CardActions>
      </Card>
    </>
  )
}

const Copyright = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" >
      {'Copyright © '}
      <Link color="inherit" href="https://localhost:3000/">
        A<small>REC</small>GIS
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Public = () => {
  const content = (
    <>
      <CssBaseline />
      <PublicAppbar/>
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          A<small>REC</small>GIS
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Welcome to Affiliated Renewable Energy Center Geographic Information System (A<small>REC</small>GIS) <br/>
          We are currently developing a GIS-based multi-platform application that can gather, manage, and analyze data of Renewable Energy Systems.
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={2} sm={4} md={4} key={Math.random()}>
              <SolarEnergyCard />
            </Grid>
            <Grid item xs={2} sm={4} md={4} key={Math.random()}>
              <WindEnergyCard />
            </Grid>
            <Grid item xs={2} sm={4} md={4} key={Math.random()}>
              <BiogasEnergyCard />
            </Grid>
            <Grid item xs={2} sm={4} md={4} key={Math.random()}>
              <GeothermalEnergyCard />
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Container
        maxWidth='md'
        component='footer'
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </>
  )
  return content
}

export default Public