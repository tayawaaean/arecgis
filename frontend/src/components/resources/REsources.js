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
  ListItem,
  ListItemText,
  List,
}
  from '@mui/material/'

import MenuIcon from '@mui/icons-material/Menu'


import { experimentalStyled as styled } from '@mui/material/styles'
import { listItemStyle } from '../../config/style'


const SolarEnergyCard = () => {
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
        <Button onClick={() => alert("hi")} size="small">Read more...</Button>
      </CardActions>
    </Card>
  );
}
const WindEnergyCard = () => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/wind-energy.webp"
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
        <Button size="small">Read more...</Button>
      </CardActions>
    </Card>
  )
}
const BiogasEnergyCard = () => {
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
          <Button size="small">Read more...</Button>
        </CardActions>
      </Card>
    </>
  )
}

const GeothermalEnergyCard = () => {
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
          <Button size="small">Read more...</Button>
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

const pages = [
  {
    id: 1,
    title: 'Map Dashboard',
    href: "/mapdashboard",

  },
  {
    id: 2,
    title: 'About',
    href: "#",
  },
  {
    id: 3,
    title: 'Services',
    href: "#",
  },
  {
    id: 4,
    title: 'Home',
    href: "/",
  },
  {
    id: 5,
    title: 'Log In',
    href: "/login",
  },

]
// const pages = ['Products', 'Pricing', 'Blog']
const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

const   REsources = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
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
    <>
      <CssBaseline />
      {/* <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
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
          Welcome to ArecGIS
          We are currently developing a GIS &#x28;Geographic Information System&#x29; that will be a useful tool for analyzing and designing renewable energy systems.
        </Typography>
      </Container> */}
      {/* End hero unit */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            width: '100%',
            backgroundColor: 'white.main',
            // '&:hover': {
            //   backgroundColor: 'white.main',
            //   opacity: [0.9, 0.8, 0.7],
            // },
            padding: { xs: 1, md: 5, lg: 10 }
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Renewable Energy Resources
          </Typography>
          <Typography
            component="h1"
            variant="h5"
            align="left"
            color="text.primary"
          >
            <b>A.</b> Solar Energy Systems (SES)
          </Typography>
          <Grid container >
            <Grid xs={12} md={8} >
              <List >
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="• This type is like a machine. It takes energy from the sun and turns it into electricity that we can use in our homes and businesses." />
                </ListItem>
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="• It uses special panels that capture sunlight and turn it into electricity that can be used right away or saved for later" />
                </ListItem>
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="• This kind of energy is good for the environment because it does not use up resources like oil or gas. It helps reduce pollution." />
                </ListItem>
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="• Solar energy systems can be put on top of buildings or on the ground. They are getting more popular because they are becoming cheaper and more efficient." />
                </ListItem>
              </List>
            </Grid>
            <Grid xs={12} md={4} >
              <Paper elevation={0} sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  sx={{
                    width: { xs: '50%', md: '90%' }
                  }}
                  // alt="The house from the offer."
                  src="/solarhomesystem.jpg"
                />
                <small>Figure 1. Solar Home System <sup><a href='https://www.solarreviews.com/content/images/blog/home-solar-power-system-diagram.png'>[1]</a></sup></small>
              </Paper>
            </Grid>
          </Grid>

          <List disablePadding>
            <ListItem sx={listItemStyle}>
              <ListItemText primary="• Is the most abundant of all energy sources and can even be harnessed in cloudy weather. The rate at which solar energy is intercepted by the Earth is about 10, 000 times greater than the rate at which humankind consumes energy." />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary="• Solar technologies can deliver heat, cooling, natural lighting, electricity, and fuels for a host of applications. Solar technologies convert sunlight into electrical energy either through photovoltaic panels or through mirrors that concentrate solar radiation." />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary="• Although not all countries are equally endowed with solar energy, a significant contribution to the energy mix from direct solar energy is possible for every country." />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
            gutterBottom
          >
            <b>TYPES OF SOLAR ENERGY TECHNOLOGIES AND ITS APPLICATIONS</b>
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            1. Photovoltaic (PV) Solar Panels
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="• These are the most common type of solar panels and consist of multiple solar cells made from semiconductor materials, such as silicon, which convert sunlight directly into electricity using the photovoltaic effect. When sunlight hits the solar panels, the solar cells absorb photons of light and release electrons. These electrons flow through a circuit, generating direct current (DC) electricity. " />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary="The DC electricity produced by the solar panels is then either used immediately to power homes or businesses or stored in batteries for later use." />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary="• The efficiency of PV solar panels varies depending on the type and quality of the panel, as well as factors such as weather and shading. However, advances in technology have made PV solar panels more efficient and cost-effective over time, making them a popular choice for solar energy systems." />
            </ListItem>
          </List>
          <Paper elevation={0} sx={{ textAlign: 'center' }}>
            <Box
              component="img"
              sx={{
                width: { xs: '50%', md: '30%' }
              }}
              // alt="The house from the offer."
              src="/solar-panel-diagram.jpg"
            />
            <Box><small>Figure 2. Solar Panel Diagram <sup><a href='https://etap.com/images/default-source/solutions/renewables/solar-panel-diagram.jpg?sfvrsn=af3ab47f_44'>[2]</a></sup></small></Box>

          </Paper>

          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            Here are some common applications of Photovoltaic Solar Panels:
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Residential and Commercial buildings.</b> Solar panels are commonly installed on rooftops or as part of building-integrated solar systems in residential and commercial buildings. They can generate electricity to power lights, appliances, cooling systems, and other electrical loads within the building, reducing electricity bills and carbon emissions.</Typography>} />
            </ListItem>
          </List>
          <Paper elevation={0} sx={{ textAlign: 'center' }}>
            <Box
              component="img"
              sx={{
                width: { xs: '50%', md: '30%' }
              }}
              // alt="The house from the offer."
              src="/solar-panel.jpg"
            />
            <Box><small>Figure 3. Solar Panel <sup><a href='https://www.energytechnologiesinc.com/wp-content/uploads/2022/01/pexels-photo-9875445-980x735.jpg'>[3]</a></sup></small></Box>

          </Paper>
          <List>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Off-Grid Power Generation.</b> Solar panels can be used in remote areas where there is no access to the traditional power grid. This can be useful for powering homes, cabins, and other small structures.</Typography>} />
            </ListItem>
          </List>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Water Pumping.</b> Solar panels can be used to power water pumps in rural areas where there is no access to electricity. This can help provide clean water for drinking and irrigation.</Typography>} />
            </ListItem>
          </List>
          <Paper elevation={0} sx={{ textAlign: 'center' }}>
            <Box
              component="img"
              sx={{
                width: { xs: '50%', md: '30%' }
              }}
              // alt="The house from the offer."
              src="/solar-pump.jpg"
            />
            <Box><small>Figure 4. Solar Pump <sup><a href='https://media.licdn.com/dms/image/D4E22AQHBLM4MtvqA1g/feedshare-shrink_800/0/1697209638068?e=1700697600&v=beta&t=LH0F5aoBFVBO6a2qG4oW4kUg6QA5rb7hBA_KLwwYO8c'>[4]</a></sup></small></Box>

          </Paper>
          <List >
            <ListItem sx={listItemStyle} >
              <ListItemText primary={<Typography><b>-	Solar-Powered Vehicles.</b> Solar panels can be used to power electric vehicles, including cars, boats, and airplanes.</Typography>} />
            </ListItem>
          </List>
          <Paper elevation={0} sx={{ textAlign: 'center' }}>
            <Box
              component="img"
              sx={{
                width: { xs: '50%', md: '30%' }
              }}
              // alt="The house from the offer."
              src="/solar-powered-car.jpg"
            />
            <Box><small>Figure 5. Solar Powered Car <sup><a href='https://www.reuters.com/resizer/IZYgB5VP3TchGqyPeWo20TiQQSk=/960x0/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/WMQFKWY2EVKKBIOGGBLHMX6ZOM.jpg'>[5]</a></sup></small></Box>

          </Paper>
          <List>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Portable Power.</b> Solar panels can be used to power portable devices, such as phones, tablets, and laptops, while on the go.</Typography>} />
            </ListItem>
          </List>
          <Paper elevation={0} sx={{ textAlign: 'center', marginBottom: '50px' }}>
            <Box
              component="img"
              sx={{
                width: { xs: '50%', md: '30%' }
              }}
              // alt="The house from the offer."
              src="/solar-portable.jpg"
            />
            <Box><small>Figure 6. Portable Solar <sup><a href='https://www.rei.com/dam/Content_Team_060819_0002_EA_SolarChargers.jpg?t=ea16by9lg'>[6]</a></sup></small></Box>

          </Paper>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
            gutterBottom
          >
            2. Solar Water Heating (SWH) Systems
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="•	These systems is the method of converting sunlight into thermal energy that can be utilized for heating domestic water. The heated water can be used for various purposes such as showering, washing clothes and dishes, radiant floor heating, or even for swimming pool heating. " />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary="•	SWH systems utilize various technologies, and can be implemented in almost any part of the world." />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>There are two main components of a SWH systems:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Solar collectors.</b> Absorbs sunlight and convert it into thermal energy to heat the water.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Storage tanks.</b> Hold the heated water until it is needed.</Typography>} />
            </ListItem>
          </List>
          <Paper elevation={0} sx={{ textAlign: 'center', marginBottom: '50px' }}>
            <Box
              component="img"
              sx={{
                width: { xs: '50%', md: '30%' }
              }}
              // alt="The house from the offer."
              src="/solar-water-heating.jpg"
            />
            <Box><small>Figure 7. Solar Water Heating <sup><a href='https://thumbs.dreamstime.com/z/solar-water-heating-system-home-hot-bath-shower-outline-diagram-solar-water-heating-system-home-hot-bath-shower-260201288.jpg?w=768'>[7]</a></sup></small></Box>

          </Paper>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Benefits of Solar Energy Systems:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Renewable and Sustainable.</b> Solar energy is a renewable and sustainable energy source, as sunlight is abundant and constantly available. It does not deplete natural resources, and it does not produce harmful emissions or pollutants during operation, making it environmentally friendly.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Reduced Greenhouse Gas Emissions.</b> Solar energy systems produce electricity or heat without emitting greenhouse gases, which are responsible for climate change. By using solar energy, we can reduce our reliance on fossil fuels and lower our carbon footprint, helping to mitigate climate change.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Energy Cost Savings.</b> Solar energy can lead to significant cost savings on electricity or heating bills over the long term. Once a solar energy system is installed, it can generate electricity or heat for free, reducing or eliminating the need to purchase electricity or fuel.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Energy Independence.</b> Solar energy systems provide an opportunity for greater energy independence, as they allow individuals, businesses, and communities to generate their own electricity or heat, reducing reliance on external energy sources and increasing self-sufficiency.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Diverse Applications.</b> Solar energy can be used for various applications, including electricity generation through photovoltaic (PV) systems, and water or space heating through solar thermal systems. Solar energy can be integrated into residential, commercial, industrial, and agricultural settings, providing flexibility and versatility.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Limitations of Solar Energy Systems:</b>
          </Typography>
          <List  >
            <ListItem sx={listItemStyle} >
              <ListItemText primary={<Typography><b>- Weather-dependent.</b> Solar energy systems rely on sunlight, and their performance can be affected by weather conditions such as cloud cover, shading, and the angle and orientation of the solar panels. This means that solar energy production may be reduced or even halted during periods of low sunlight, which can impact system performance and reliability.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Upfront costs.</b> While solar energy systems can result in long-term cost savings, the initial installation costs can be relatively high. The upfront investment required for purchasing and installing solar panels or solar thermal collectors may be a barrier for some individuals or businesses, although costs have been declining over the years.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Space requirement.</b> Solar energy systems require adequate space for installation, especially for PV systems that need a sufficient area with good solar exposure to maximize electricity production. In some cases, space limitations may restrict the size or capacity of the solar energy system that can be installed.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Energy Storage challenges.</b> Solar energy is generated during the day when the sun is shining, but electricity or heat may be needed at other times, including at night or during cloudy days. Energy storage technologies, such as batteries, can be used to store excess energy for later use, but they can add to the overall system costs.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Variability of Solar resources.</b> The availability of solar resources, such as sunlight intensity and duration, can vary depending on geographical location, season, and time of day. Some regions may have less favorable solar resources, which can affect the efficiency and effectiveness of solar energy systems.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Manifacturing and disposal impacts.</b> The production and disposal of solar panels or other components of solar energy systems can have environmental impacts, including energy use, resource extraction, and waste generation. Proper manufacturing and disposal practices are necessary to minimize these impacts.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h5"
            align="left"
            color="text.primary"
          >
            <b>B.</b> Wind Energy Systems (WES)
          </Typography>
          <Grid container >
            <Grid xs={12} md={6} >
              <List >
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="• This is the type of renewable energy that is generated by harnessing the power of wind to produce electricity. Wind turbines are used to capture the kinetic energy of the wind and convert it into electrical energy" />
                </ListItem>
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="• Wind turbines have large blades that are designed to rotate when the wind blows, creating mechanical energy. This mechanical energy is then converted into electrical energy by a generator. The amount of electricity that a wind turbine can produce depends on several factors, including the speed of the wind, the size and design of the turbine, and the location of the turbine." />
                </ListItem>
              </List>
            </Grid>
            <Grid xs={12} md={6} >
              <Paper elevation={0} sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  sx={{
                    width: { xs: '50%', md: '60%' }
                  }}
                  // alt="The house from the offer."
                  src="/wind-energy.svg"
                />
                <Box><small>Figure 8. Wind Energy System <sup><a href='https://storyset.com/illustration/wind-turbine/bro'>[8]</a></sup></small></Box>

              </Paper>
            </Grid>
          </Grid>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
            gutterBottom
          >
            <b>TYPES OF WIND ENERGY TECHNOLOGIES</b>
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            1.	Wind Pump Irrigation System
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="•	These system uses wind energy to pump water for irrigation from a well or another water source. In most cases, the system consists of a windmill or wind turbine that is linked to a pump that transports water from a well or other water source to a storage tank or directly to the irrigation system." />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary="•	The wind pump irrigation system is frequently utilized in rural locations where there is little to no access to electricity and where water sources are difficult to reach." />
            </ListItem>
          </List>
          <Paper elevation={0} sx={{ textAlign: 'center' }}>
            <Box
              component="img"
              sx={{
                width: { xs: '50%', md: '30%' }
              }}
              // alt="The house from the offer."
              src="/wind-pump.jpg"
            />
            <Box><small>Figure 9. Wind Pump <sup><a href='https://pixabay.com/photos/arizona-windmill-cattle-tank-ranch-2501835/'>[9]</a></sup></small></Box>

          </Paper>

          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            2.	Wind Turbines
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="•	Wind turbines are the most common type of wind technology used for generating electricity. They consist of large blades that are mounted on a tower, and when the wind blows, it causes the blades to rotate. The rotational motion is then converted into electricity through a generator. There are various types of wind turbines, including horizontal-axis wind turbines (HAWT) and vertical-axis wind turbines (VAWT), each with its benefits and limitations." />
            </ListItem>
          </List>
          <Paper elevation={0} sx={{ textAlign: 'center' }}>
            <Box
              component="img"
              sx={{
                width: { xs: '50%', md: '30%' }
              }}
              // alt="The house from the offer."
              src="/wind-turbine.webp"
            />
            <Box><small>Figure 10. Bangui wind farm, Ilocos Norte <sup><a href='https://essc.org.ph/content/wp-content/uploads/2012/04/Bangui-wind-farm-Ilocos-Norte-300x225.jpg'>[10]</a></sup></small></Box>

          </Paper>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            3. Offshore Wind Turbines
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="•	Offshore wind turbines are similar to onshore wind turbines, but they are installed in bodies of water, typically in coastal areas or offshore locations. Offshore wind has the potential to generate larger amounts of electricity due to higher wind speeds and fewer obstructions, but it also presents additional challenges such as installation and maintenance in harsh marine environments." />
            </ListItem>
          </List>
          <Paper elevation={0} sx={{ textAlign: 'center' }}>
            <Box
              component="img"
              sx={{
                width: { xs: '50%', md: '30%' }
              }}
              // alt="The house from the offer."
              src="/offshore-wind-turbine.jpg"
            />
            <Box><small>Figure 11. Offshore wind turbine <sup><a href='https://cargostore.com/wp-content/uploads/2023/04/Are-Offshore-Wind-Farms-Environmentally-Friendly-Cargostore-Worldwide.jpg'>[11]</a></sup></small></Box>

          </Paper>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            4.	Small-Scale Wind Turbines
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="•	Small-scale wind turbines are typically used for decentralized or distributed energy generation, such as powering individual homes, farms, or small businesses. They are usually smaller in size compared to utility-scale wind turbines and can be installed in various locations, including rooftops, remote areas, or off-grid locations." />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            5.	Vertical-Axis Wind Turbines (VAWT)
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="•	Vertical-axis wind turbines are less common compared to horizontal-axis wind turbines, but they have unique design features that allow them to capture wind from any direction, making them suitable for urban or constrained environments where wind direction may be variable or in areas usually visited by typhoons." />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            6.	Floating Wind Turbines
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="•	Floating wind turbines are a type of offshore wind technology where the turbines are installed on floating structures instead of fixed foundations. This allows for installation in deeper waters where traditional fixed-bottom offshore wind turbines may not be feasible, opening up new areas for wind energy development." />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Benefits of Wind Energy Systems:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Renewable and Clean Energy.</b> Wind energy is a renewable and clean source of power, as it is derived from the natural movement of wind. Unlike fossil fuels, wind energy does not produce harmful greenhouse gas emissions, air pollution, or other pollutants that contribute to climate change and air quality degradation.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Climate Change Mitigation.</b> Wind energy systems play a crucial role in mitigating climate change by reducing the reliance on fossil fuels, which are major contributors to greenhouse gas emissions. By generating electricity from wind, wind energy systems help to reduce carbon dioxide and other greenhouse gas emissions, which are responsible for global warming and climate change.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Energy Independence and Security.</b> Wind energy can contribute to energy independence and security by diversifying the energy mix and reducing dependence on fossil fuel imports. Unlike fossil fuels, which are subject to price vitality and geopolitical risks, wind energy is a domestic, abundant, and indigenous source of power that can enhance energy security and reduce vulnerability to energy price fluctuations.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Economic Benefits.</b> Wind energy systems can provide economic benefits, including job creation, local investment, and revenue generation. The development, construction, operation, and maintenance of wind farms can create jobs in manufacturing, construction, operations, and maintenance sectors. Wind energy projects can also attract local investment and generate revenue through lease payments to landowners, royalties, taxes, and other economic activities, contributing to local economic development and growth.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Sustainable Rural Development.</b> Wind energy systems can support sustainable rural development by providing opportunities for farmers and rural communities to lease their land for wind turbine installations and generate income. This can help diversify income sources for rural communities, increase agricultural productivity by providing additional income, and contribute to rural revitalization and resilience.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Air Pollution Reduction.</b> Unlike fossil fuel-based power generation, wind energy systems do not produce air pollutants, such as sulfur dioxide, nitrogen oxides, particulate matter, and other harmful emissions that can have detrimental effects on human health and the environment. By reducing air pollution, wind energy can help improve air quality, protect public health, and mitigate the negative impacts of air pollution on climate change and environmental degradation.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Water Conservation.</b> Wind energy systems do not require water for their operation, unlike conventional power generation technologies, such as coal, natural gas, and nuclear power plants, which require significant amounts of water for cooling and other processes. Wind energy can help conserve precious water resources, especially in water-scarce regions, and contribute to sustainable water management.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Low Lifecycle Emissions.</b> Wind energy systems have low lifecycle emissions, considering their entire lifecycle from manufacturing, installation, operation, and decommissioning. Although there are some emissions associated with the production and installation of wind turbines, they are relatively low compared to the emissions from fossil fuel-based power generation. Over their operational lifetime, wind energy systems have significantly lower greenhouse gas emissions compared to conventional power generation sources.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Public Health Benefits.</b> Wind energy systems can also have public health benefits by reducing air pollution, which can lead to improved respiratory health, reduced hospitalization rates, and other positive impacts on public health. By contributing to cleaner air and a healthier environment, wind energy can help improve the overall well-being and quality of life of local communities.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Climate Adaptation and Resilience.</b> Wind energy systems can contribute to climate adaptation and resilience by providing a reliable source of electricity that is not dependent on vulnerable and finite fossil fuel resources. As climate change poses challenges such as extreme weather events, sea level rise, and other impacts, renewable energy sources like wind can help communities adapt and build resilience to these challenges.</Typography>} />
            </ListItem>

          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Limitations of Wind Energy Systems:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Intermittency and Variability.</b> One of the main limitations of wind energy is its intermittency and variability. Wind is not constant and can vary in speed and direction, resulting in fluctuations in electricity generation. This variability requires backup power sources or energy storage systems to ensure a consistent and reliable electricity supply when the wind is not blowing.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Site-Specific and Land Use Requirements.</b> Wind energy systems require specific site characteristics, including sufficient wind resources, suitable land availability, and proximity to transmission lines, which may limit their deployment in certain areas. Large-scale wind farms also require significant land use, which can impact local ecosystems, wildlife habitats, and visual landscapes.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Visual and Noise Impacts.</b> Wind turbines can be visible from a distance and can impact the aesthetic appeal of landscapes, which may be a concern for some communities. Additionally, wind turbines can produce noise during operation, which can potentially impact local residents depending on their proximity to the turbines.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Economic Benefits.</b> Wind energy systems can provide economic benefits, including job creation, local investment, and revenue generation. The development, construction, operation, and maintenance of wind farms can create jobs in manufacturing, construction, operations, and maintenance sectors. Wind energy projects can also attract local investment and generate revenue through lease payments to landowners, royalties, taxes, and other economic activities, contributing to local economic development and growth.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Wildlife Impacts.</b>Wind turbines can pose risks to birds and bats, which can be affected by collisions with the spinning turbine blades. This can result in wildlife mortality, although the extent of these impacts varies depending on factors such as turbine design, location, and local wildlife populations.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Grid Integration and Transmission Challenges.</b> Integrating wind energy into the electric grid can pose challenges due to its variability and intermittency. Wind farms need to be connected to the grid, and additional transmission infrastructure may be required to transport electricity from remote wind-rich areas to population centers, which can be expensive and face regulatory and community challenges.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Upfront Costs and Financial Considerations.</b>While the operational costs of wind energy systems are relatively low, the upfront capital costs for developing wind farms and installing wind turbines can be significant. Financing and economic considerations, including factors such as electricity prices, policy incentives, and regulatory frameworks, can impact the viability and financial feasibility of wind energy projects.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Maintenance and Operations.</b>. Wind turbines require regular maintenance and operations to ensure their optimal performance, including inspections, repairs, and component replacements. Maintenance and operations can add to the overall costs of wind energy systems and require specialized expertise.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Social and Community Considerations.</b> The integration of large-scale wind energy into the electricity grid can impact grid stability and power quality, as wind energy is inherently variable and intermittent. Balancing the variable output from wind energy systems with the demand on the grid can pose challenges, and additional grid infrastructure and energy storage may be needed to maintain grid stability and power quality.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Local Community Engagement and Acceptance.</b> Wind energy projects can face challenges related to local community engagement and acceptance. Local residents and stakeholders may have concerns about the visual, noise, and wildlife impacts of wind turbines, as well as potential changes to local land use and property values. Engaging with local communities, addressing concerns, and ensuring fair benefits-sharing can be critical for successful wind energy project development.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Regulatory and Policy Frameworks.</b> The regulatory and policy frameworks governing wind energy development can vary widely across different jurisdictions, and changes in regulations or policies can impact the feasibility and economics of wind energy projects. Navigating the regulatory and policy landscape can pose challenges and uncertainties for wind energy developers.</Typography>} />
            </ListItem>
          </List>

          <Typography
            component="h1"
            variant="h5"
            align="left"
            color="text.primary"
          >
            <b>C.</b> Geothermal Energy Systems (GES)
          </Typography>
          <Grid container >
            <Grid xs={12} md={7} >
              <List >
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="•	GES is a renewable energy source that comes from the natural heat of the Earth. It is a sustainable and clean energy source that can help reduce reliance on fossil fuels and decrease our impact on the environment. The heat for geothermal energy comes from the Earth's crust, and it's continuously replenished, making it a reliable and constant source of energy that's available 24/7." />
                </ListItem>
                <ListItem sx={listItemStyle}>
                  <ListItemText primary={<Typography
                    component="h1"
                    variant="h6"
                    align="left"
                    color="text.primary"
                    gutterBottom
                  >
                    <b>TYPES OF GEOTHERMAL ENERGY TECHNOLOGIES</b>
                  </Typography>} />
                </ListItem>
                <ListItem sx={listItemStyle}>
                  <ListItemText primary={<Typography
                    component="h1"
                    variant="h6"
                    align="left"
                    color="text.primary"
                  >
                    1.	Geothermal Power Plants
                  </Typography>} />
                </ListItem>
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="•	These are used to generate electricity from the heat stored in the Earth’s crust." />
                </ListItem>

              </List>
            </Grid>
            <Grid xs={12} md={5} >
              <Paper elevation={0} sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  sx={{
                    width: { xs: '50%', md: '60%' }
                  }}
                  // alt="The house from the offer."
                  src="/geothermal-energy.jpg"
                />
                <Box><small>Figure 12. Geothermal Energy <sup><a href='https://www.enbridge.com/~/media/Enb/Images/LearnAboutEnergy/101-Pages/Geothermal/geothermal_Icon_520px.jpg?h=520&iar=0&w=520&rev=4bd47d9a1ba14558af289064bfa61992&hash=1B58D969C825C71827A5457DE3F2E41C'>[12]</a></sup></small></Box>

              </Paper>
            </Grid>
          </Grid>

          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography
                component="h1"
                variant="h6"
                align="left"
                color="text.primary"
              >
                Three Main Types of Geothermal Power Plants:
              </Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Dry Steam Power Plants.</b> In this type of geothermal power plants, steam from the geothermal reservoir is directly used to drive a turbine, which then generates electricity.</Typography>} />
            </ListItem>
          </List>
          <Paper elevation={0} sx={{ textAlign: 'center' }}>
            <Box
              component="img"
              sx={{
                width: { xs: '50%', md: '50%' }
              }}
              // alt="The house from the offer."
              src="/dry-steam.webp"
            />
            <Box><small>Figure 13. Dry Steam <sup><a href='https://cdn.britannica.com/41/152541-050-26D5DBED/power-generation.jpg'>[13]</a></sup></small></Box>

          </Paper>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Flash Steam Power Plants.</b> In this type of geothermal power plant, hot water from the geothermal reservoir is flashed into steam as it is released to a lower-pressure environment, and the steam is used to drive a turbine to generate electricity.</Typography>} />
            </ListItem>
          </List>
          <Paper elevation={0} sx={{ textAlign: 'center' }}>
            <Box
              component="img"
              sx={{
                width: { xs: '50%', md: '50%' }
              }}
              // alt="The house from the offer."
              src="/flash-steam.webp"
            />
            <Box><small>Figure 14. Flash Steam <sup><a href='https://cdn.britannica.com/82/152582-050-D3A5CF6B/Flash-power-generation.jpg'>[14]</a></sup></small></Box>

          </Paper>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Binary Cycle Power Plants.</b> In this type of geothermal plant, hot water or steam from the geothermal reservoir is used to heat a working fluid with a lower boiling point, such as isobutene or ammonia, which then vaporizes and drives a turbine to generate electricity.</Typography>} />
            </ListItem>
          </List>
          <Paper elevation={0} sx={{ textAlign: 'center' }}>
            <Box
              component="img"
              sx={{
                width: { xs: '50%', md: '50%' }
              }}
              // alt="The house from the offer."
              src="/binary-cycle-steam.webp"
            />
            <Box><small>Figure 15. Binary-cycle Steam <sup><a href='https://cdn.britannica.com/81/152581-050-17AB4D05/power-generation.jpg'>[15]</a></sup></small></Box>

          </Paper>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            2.	Direct use geothermal systems
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="•	Direct use geothermal systems use hot water or steam from geothermal reservoirs for various applications, such as heating greenhouses, drying crops, warming fish ponds, or providing heat for industrial processes." />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Benefits of Geothermal Energy Systems:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Renewable and Sustainable.</b> Geothermal energy is a renewable and sustainable energy source as it is derived from the natural heat stored in the Earth’s crust. It is continuously replenished by the heat generated from the natural decay of radioactive materials, making It a long-term and reliable energy option.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Low Emissions.</b> Geothermal energy systems emit minimal greenhouse gases (GHGs) compared to fossil fuels, making them a cleaner alternative for electricity and heat production. Geothermal power plants emit low levels of carbon dioxide (CO2), sulfur dioxide (SO2), nitrogen oxides (NOx), and other air pollutants, helping to reduce air pollution and mitigate climate change.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Energy Efficiency.</b> Geothermal energy systems are highly efficient as they utilize the heat directly from the Earth, eliminating the need for combustion or other energy conversion processes. Geothermal heat pumps, in particular, are known for their high energy efficiency in heating and cooling buildings, reducing energy consumption and costs.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Reliability and baseload power.</b> Geothermal energy systems provide reliable and consistent power supply as they can operate 24/7, regardless of weather conditions. Geothermal power plants can provide baseload power, which means they can generate electricity at a constant rate, helping to stabilize the grid and meet the continuous demand for electricity.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Cost-effective.</b> While the upfront costs of geothermal energy systems can be higher compared to other energy sources, geothermal energy has low operational and maintenance costs, resulting in long-term cost savings. Geothermal heat pumps can also significantly reduce heating and cooling costs for buildings, providing ongoing cost benefits over their lifespan.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Local economic benefits.</b> Geothermal energy projects can create local economic benefits by creating jobs, stimulating economic growth, and generating revenue for local communities. Geothermal resources are often found in rural or remote areas, where they can provide economic opportunities and support local economies.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Environmental benefits.</b> Geothermal energy systems have minimal environmental impacts, as they do not require fuel combustion, which reduces air pollution and associated health risks. Geothermal power plants also have a small physical footprint compared to other conventional power plants, minimizing land disturbance and preserving natural habitats.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Versatility.</b> Geothermal energy systems can be used for various applications, including electricity generation, heating, and cooling for residential, commercial, and industrial sectors. Geothermal heat pumps can be used for space heating, water heating, and even for agricultural and industrial processes, making them a versatile and flexible energy option.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Long-lifespan.</b> Geothermal energy systems have a long lifespan, typically lasting for several decades with proper maintenance. This makes them a reliable and durable energy option with a stable energy source for many years.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Limitations of Geothermal Energy Systems:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Location dependency.</b> Geothermal energy systems require specific geological conditions to be viable. The presence of hot rocks or reservoirs of heated water or stream is necessary. Therefore, geothermal energy systems are limited to areas with suitable geothermal resources, which may not be available everywhere. This makes it location-dependent and restricts its widespread use globally.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	High upfront costs.</b> The initial installation costs of geothermal energy systems can be high. Drilling deep wells, installing heat exchange systems, and building power plants can be expensive, making it economically challenging for some regions to adopt geothermal energy. However, the operational costs of geothermal energy systems are generally low, which can offset the high upfront costs over the long term.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Environmental concerns.</b> Geothermal energy systems can have potential environmental impacts. Drilling deep geothermal wells can release gases and chemicals from the underground, including greenhouse gases, which can contribute to air and water pollution. Geothermal power plants may also release hydrogen sulfide, a corrosive and foul-smelling gas. However, these emissions are generally lower than those of fossil fuels, but environmental monitoring and mitigation measures are necessary.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Resource Depletion and Sustainability.</b> Geothermal energy systems extract heat from the Earth's subsurface, and excessive or prolonged use of geothermal energy from a particular area can lead to depletion of the geothermal reservoir, reducing its sustainability. Careful management and monitoring of geothermal resources are essential to prevent over-extraction and ensure long-term sustainability.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Cost-effective.</b> Geothermal energy systems may face technical limitations, such as the need for specific drilling techniques and equipment to tap into deep geothermal reservoirs, which can increase costs and technical complexity. Additionally, geothermal energy is typically only available as heat or electricity, limiting its applications compared to other forms of energy, such as oil or natural gas, which can be used in a wider range of applications.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Transmission and Distribution Challenges.</b> Geothermal energy resources are often located in remote areas, which can pose challenges in transmitting and distributing the generated electricity to the end users. Building extensive transmission lines and distribution infrastructure can be costly and require significant planning and coordination.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h5"
            align="left"
            color="text.primary"
          >
            <b>D.</b> Ocean Energy Systems (OES)
          </Typography>
          <Grid container >
            <Grid xs={12} md={7} >
              <List >
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="•	OES harnesses the power of the ocean to generate electricity. This energy is derived from various sources, including waves, tides, salt concentration gradient and temperature differences in the ocean water. Each source has its unique characteristics and requires specific technologies to harness its potential." />
                </ListItem>
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="•	Wave energy systems capture the energy from the motion of waves on the ocean's surface and convert it into electricity. The waves' energy is captured using devices like oscillating water columns or submerged pressure differential devices. These devices convert the mechanical energy of the waves into electrical energy using turbines or generators." />
                </ListItem>
              </List>
            </Grid>
            <Grid xs={12} md={5} >
              <Paper elevation={0} sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  sx={{
                    width: { xs: '50%', md: '60%' }
                  }}
                  // alt="The house from the offer."
                  src="/ocean-energy.png"
                />
                <Box><small>Figure 16. Ocean Energy <sup><a href='https://www.freepik.com/icon/tidal-power_2355141'>[12]</a></sup></small></Box>
              </Paper>
            </Grid>
          </Grid>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>TYPES OF OCEAN ENERGY SYSTEMS AND ITS APPLICATIONS</b>
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            1. Tidal Energy Systems
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="Electricity is generated by harnessing the power or tides, which result from the gravitational pull of the moon and the sun. Tidal energy systems are usually situated in locations where there is a significant disparity between high and low tides, such as estuaries or coastal areas. Tidal turbines or barrages are employed to capture the energy from the tides and convert it into electrical energy." />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Here are the applications of Tidal Energy Systems:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Power Generation.</b> Tidal energy systems can generate electricity that can be used to power homes, businesses, and other infrastructure. Tidal turbines are placed underwater to capture the movement of the tides and convert it into electricity.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Grid Stabilization.</b> Tidal energy systems can help stabilize the power grid by providing a consistent source of electricity. Since tides are predictable, tidal energy can help balance out the intermittency of other renewable energy sources like wind and solar power.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Desalination.</b> Tidal energy systems can also be used for desalination, or the process of removing salt and other minerals from seawater to make it suitable for drinking and irrigation. This can be particularly useful in coastal areas where freshwater resources are limited.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Coastal Protection.</b> Tidal energy systems can also help protect coastal areas from erosion and storm surges. The presence of tidal turbines can help break up waves and reduce their energy, which can help protect shorelines from damage.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Industrial Applications.</b> Tidal energy can also be used in various industrial applications, such as powering offshore oil rigs or providing energy for underwater mining operations.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            2.	Ocean Thermal Energy Conversion (OTEC) Systems.
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="Use the temperature difference between warm surface water and cold deep water to generate electricity. This temperature difference is harnessed using heat exchangers, which transfer the heat from warm water to a working fluid. The working fluid is then used to power a turbine or generator, producing electrical energy." />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Here are the applications of OTEC:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Electricity Generation.</b> OTEC can be used to generate electricity, which can be fed into the power grid. However, this application requires a significant investment in infrastructure and may not be economically viable in all locations.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Desalination.</b> OTEC can also be used to desalinate seawater by using the cold water to condense water vapor, leaving behind fresh water. This application could be particularly useful in arid regions where fresh water is scarce.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Cooling.</b> OTEC can also be used for cooling purposes by pumping cold water to the surface and using it to cool buildings or industrial processes. This application could help reduce energy consumption in air conditioning systems.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            3.	Wave Energy
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="Generated by harnessing the kinetic energy of ocean waves. Wave energy converters use the up-and-down motion of waves to generate electricity." />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Here are the applications of Wave Energy</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Electricity Generation.</b> Wave energy systems can be used to generate electricity that can be fed into the power grid. This can provide a sustainable and renewable source of energy.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Water Desalination.</b> Wave energy can also be used to power desalination plants to provide fresh water in areas with limited access to water resources.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Aquaculture.</b> Wave energy can be used to power aquaculture farms, providing a sustainable source of energy for fish farms, seaweed farms, and other forms of ocean-based agriculture.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Offshore Operations.</b> Wave energy can be used to power offshore oil rigs, platforms, and other offshore operations, reducing the need for fossil fuel-powered generators.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Coastal Protection.</b> Wave energy systems can be used for coastal protection by reducing the impact of waves on coastlines, helping to prevent erosion and flooding.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Benefits of Ocean Energy Systems:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Renewable Energy Source.</b> The ocean energy is a renewable and virtually inexhaustible resource. It is estimated that the energy from waves alone could provide more than 2,000 TWh per year globally, which is equivalent to the electricity demand of several countries.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Predictable and Reliable.</b> Unlike wind and solar energy, ocean energy is more predictable and reliable since the ocean is less influenced by external factors. Waves, tides, and currents are all regular and can be predicted with high accuracy, making it easier to plan energy generation.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Low Carbon Footprint.</b> OES produce electricity with a low carbon footprint. They emit little or no greenhouse gases, which helps reduce global warming and combat climate change.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Modular and Scalable.</b> OES can be modular and scalable, allowing them to be easily deployed and adapted to different locations and energy needs. They can also be installed near shorelines or offshore, depending on the site conditions.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Minimal Visual Impact.</b> OES have a minimal visual impact on the environment since most of the equipment is underwater or just above the water surface. This reduces the impact on marine ecosystems and maintains the aesthetic beauty of coastal areas.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Synergistic with Other Ocean Activities.</b> OES can be designed to be synergistic with other ocean activities, such as aquaculture or marine transportation. This can create a more sustainable and integrated approach to ocean resource management.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Limitations of Ocean Energy Systems:</b>
          </Typography>
          <List  >
            <ListItem sx={listItemStyle} >
              <ListItemText primary={<Typography><b>-	High Capital Costs.</b> The cost of building and installing OES can be high due to the challenging marine environment and the need for specialized equipment.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Maintenance and Repair Challenges.</b> OES are exposed to harsh marine conditions, which can make maintenance and repair challenging and expensive.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Environmental Impact.</b> The installation and operation of ocean energy systems can have negative impacts on marine ecosystems, including marine mammals, fish, and seabirds.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Intermittency and variability.</b> The availability of ocean energy can be intermittent and variable, depending on factors such as weather, tides, and currents.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Grid Integration Challenges.</b> Integrating ocean energy systems into existing power grids can be challenging due to the intermittent and variable nature of the energy source.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Limited Scalability.</b>The amount of ocean energy that can be extracted is limited by the available resources and the technology’s capacity.</Typography>}/>
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h5"
            align="left"
            color="text.primary"
          >
            <b>E.</b> BIO ENERGY Systems (BES)
          </Typography>
          <Grid container >
            <Grid xs={12} md={7} >
              <List >
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="•	BES utilizes organic materials derived from plants or animals to generate electricity, heat, or fuel. This organic material is referred to as biomass and can be in the form of wood, crops, or animal waste. Bioenergy systems convert biomass into various forms of energy such as biogas, biofuels, and electricity" />
                </ListItem>
              </List>
            </Grid>
            <Grid xs={12} md={5} >
              <Paper elevation={0} sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  sx={{
                    width: { xs: '50%', md: '60%' }
                  }}
                  // alt="The house from the offer."
                  src="/bio-energy.png"
                />
                <Box><small>Figure 17. Biomass <sup><a href='https://letstalkscience.ca/educational-resources/backgrounders/generating-electricity-biomass'>[12]</a></sup></small></Box>
              </Paper>
            </Grid>
          </Grid>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>TYPES OF BIO ENERGY SYSTEMS AND ITS APPLICATIONS</b>
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            1. Biomass
          </Typography>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>The three biomass processes:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Torrefaction.</b> This is a process that involves heating biomass to 200-300°C without oxygen. This partially decomposes the biomass and alters its chemical structure, resulting in a solid fuel that is more energy-dense and hydrophobic than raw biomass. This process removes water and volatile compounds, leaving a solid fuel with improved combustion properties, which can be used as a direct replacement for coal or as a feedstock for other bioenergy processes.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Pyrolysis.</b> This process is a thermochemical conversion process where biomass is heated without oxygen to produce bio-oil, biochar, and syngas. During pyrolysis, biomass is rapidly heated to temperatures between 400 and 800°C, which causes it to break down into its constituent components: water vapor, char, and various organic compounds, including bio-oil.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Gasification.</b> This is also a thermochemical process that converts biomass into a gas mixture called "syngas" by heating the biomass at high temperatures in the presence of a gasifying agent, such as air, oxygen, or steam. During gasification, the complex organic compounds in biomass are broken down into simpler molecules, primarily carbon monoxide, hydrogen, and methane. The syngas produced during gasification can be used as a fuel for power generation, heating, or as a feedstock to produce liquid biofuels or chemicals. Gasification can also produce biochar, a solid byproduct that can be used as a soil amendment to improve soil fertility and sequester carbon.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Here are the applications of Biomass:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Energy Production.</b> Biomass can be used to produce electricity, heat, and fuel. This is done through combustion, gasification, and anaerobic digestion.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Biofuels.</b> Biomass can be converted into biofuels such as ethanol, biodiesel, and biogas. These biofuels can be used as a renewable alternative to fossil fuels.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Agriculture.</b> Biomass can be used as a soil amendment to improve soil quality and increase crop yields. It can also be used as animal feed.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Chemicals and Materials.</b> Biomass can be used to produce chemicals such as plastics, resins, and adhesives. It can also be used to produce materials such as paper, textiles, and construction materials.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Waste Management.</b>Biomass can be used to treat and manage waste, such as in composting and bioremediation.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            2. Biogas Plant
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="It transforms organic waste into biogas via anaerobic digestion. Biogas is a mixture of methane, carbon dioxide, and other gases that can be burned to generate electricity or heat. Biogas plants are commonly used in agriculture to process animal waste and other organic matter." />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Here are the applications of Biogas Plant:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Electricity Generation.</b> Biogas can be used to generate electricity through a gas engine or a gas turbine. The electricity generated can be used to power hoes, businesses, and industries.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Heat Generation.</b> Biogas can be used as a fuel for heating applications such as space heating, water heating, and industrial processes.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Cooking Fuel.</b> Biogas can be used as a cooking fuel in households, restaurants, and other food-related businesses.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Vehicle Fuel.</b> Biogas can be upgraded to biomethane and used as a vehicle fuel, either directly in the form of compressed natural gas (CNG) or as a replacement for fossil fuels in transportation.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Fertilizer.</b> The solid residue from the anaerobic digestion process, known as digestate, can be used as a fertilizer in agriculture.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Waste Management.</b> Biogas plants help in the proper disposal of organic waste materials, reducing the amount of waste going to landfills and reducing greenhouse gas emissions from waste.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Bio-based Chemicals.</b> Biogas can be converted into bio-based chemicals such as ethanol, hydrogen, and methane for various industrial applications.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            3. Biofuel Production
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary="It transforms biomass into liquid fuels like biodiesel or ethanol, which can power vehicles or substitute fossil fuels in power generation." />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Biofuels Production can be divided into three generations:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	First-generation Biofuels.</b> These biofuels are produced using edible crops such as corn, sugarcane, and soybeans, and are converted into biofuels through processes such as fermentation and distillation. First-generation biofuels have faced criticism due to their effects on food prices and land utilization.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Second-generation Biofuels.</b> These biofuels are produced from non-food crops such as switchgrass, wood chips, and agricultural waste, and are converted into biofuels through advanced processes such as gasification and pyrolysis. Second-generation biofuels are widely regarded as a more sustainable option compared to first-generation biofuels.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Third-generation Biofuels.</b> These biofuels are produced from algae, which can be grown in wastewater or seawater, and can be converted into biofuels through processes such as fermentation and trans esterification. Third-generation biofuels offer numerous benefits, including enhanced productivity and reduced land utilization.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Here are the applications of Biofuels:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Transportation.</b> Biofuels can be used as a substitute for gasoline and diesel in vehicles. They can be blended with fossil fuels or used as pure biofuels in flex-fuel vehicles or vehicles specifically designed for biofuels.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Heat and Electricity Generation.</b> Biofuels can be used as a fuel source in heating systems and power plants.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Aviation.</b> Biofuels can be used as a substitute for jet fuel in airplanes. </Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Chemicals and Materials.</b> Biofuels can be used as a feedstock for the production of bio-based chemicals and materials, such as bioplastics and bio-based lubricants.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Benefits of BIO Energy Systems</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Renewable Source of Energy.</b> Bioenergy is a renewable source of energy that can be continuously replenished, unlike fossil fuels that are finite resources.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Renewable Greenhouse Gas Emissions</b> Bioenergy systems have lower greenhouse gas emissions compared to fossil fuels. When biomass is burned for energy, it releases carbon dioxide, but this carbon dioxide is offset by the carbon dioxide that was absorbed by the plants during their growth, resulting in a neutral or even negative carbon footprint.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Energy Security.</b> Bioenergy systems can reduce reliance on imported fossil fuels and increase energy security by utilizing locally available resources.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Waste Management</b> Bioenergy systems can provide a sustainable solution for the management of organic waste materials, reducing the amount of waste going to landfills and reducing greenhouse gas emissions from waste.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Rural Development</b> Bioenergy systems can create economic opportunities for rural communities by utilizing locally available biomass resources.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Diversification of Energy Sources.</b> Bioenergy systems can diversify the energy mix, reducing reliance on a single energy source and enhancing energy independence.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Improved Soil Health.</b> Bioenergy systems can improve soil health by providing a source of organic matter and nutrients for plants.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Limitations of BIO Energy Systems</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Land Use.</b> The production of biomass for energy can compete with food production and other land uses, which can lead to deforestation, land degradation, and loss of biodiversity. To avoid negative impacts, sustainable land management practices and careful selection of feedstocks are necessary.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Water Use.</b> Bioenergy production can require significant amounts of water, which can lead to competition for water resources in areas with limited water availability.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Energy Efficiency.</b> Bioenergy systems may have lower energy efficiency compared to fossil fuel-based systems, which can affect their overall economic viability. The conversion of biomass to energy also requires significant amounts of energy and resources.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Feedstock Availability.</b> The availability of suitable biomass feedstocks can vary depending on location, climate, and season, which can affect the reliability and consistency of bioenergy production.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Technology Limitations.</b> The technology used for bioenergy production is still evolving, and some processes may be expensive or have technical limitations, such as the need for specialized equipment or materials.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Emissions.</b> Although bioenergy systems have lower greenhouse gas emissions than fossil fuels, some processes used in bioenergy production can still produce air pollutants and greenhouse gases such as carbon dioxide and methane.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Cost.</b> The cost of bioenergy production can be higher compared to traditional fossil fuel-based systems, which can limit its adoption and implementation.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h5"
            align="left"
            color="text.primary"
          >
            <b>F.</b> Hydropower Energy Systems (HES)
          </Typography>
          <Grid container >
            <Grid xs={12} md={7} >
              <List >
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="•	HES is a highly efficient and reliable source of renewable energy that has been used for over a century to generate electricity." />
                </ListItem>
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="•	Hydropower plants work by harnessing the power of water through the use of turbines that transform the kinetic energy of moving water into electrical energy." />
                </ListItem>
                <ListItem sx={listItemStyle}>
                  <ListItemText primary="•	Hydropower currently is the largest source of renewable energy in the electricity sector. It relies on generally stable rainfall patterns and can be negatively impacted by climate-induced droughts or changes to ecosystems which impact rainfall patterns." />
                </ListItem>
              </List>
            </Grid>
            <Grid xs={12} md={5} >
              <Paper elevation={0} sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  sx={{
                    width: { xs: '50%', md: '60%' }
                  }}
                  // alt="The house from the offer."
                  src="/hydro-energy.png"
                />
                <Box><small>Figure 18. Hydropower <sup><a href='https://www.cleanpng.com/png-hydroelectricity-hydropower-dam-power-station-clip-4574653/'>[12]</a></sup></small></Box>
              </Paper>
            </Grid>
          </Grid>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>TYPES OF HYDROPOWER FACILITIES/ TECHNOLOGIES AND ITS APPLICATIONS</b>
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            1. Conventional Hydropower. 
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography>This technology uses a dam or reservoir to store water, which is released through turbines to generate electricity.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            align="left"
            color="text.primary"
          >
            <b>Here are the applications of Conventional Hydropower:</b>
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>- Baseload Power.</b> Conventional hydropower is capable of generating a large amount of electricity on a continuous basis, making it well-suited for providing baseload power to the electric grid. Baseload power is the minimum amount of power needed to meet the constant demand for electricity.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Flood Control.</b> Dams can be used to manage the flow of water in rivers, preventing flooding during periods of heavy rainfall. The water can be stored in the reservoir and released slowly over time to avoid flooding downstream.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Water Supply.</b> Reservoirs created by dams can be used to store water for municipal and agricultural use. The stored water can be released as needed to meet water demands.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Recreation.</b> Reservoirs created by dams can be used for recreational purposes such as fishing, boating, and swimming.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>-	Environmental Benefits.</b> Conventional hydropower can provide environmental benefits such as reducing greenhouse gas emissions by displacing fossil fuel-based power plants and reducing the need for other forms of power generation that have a higher environmental impact.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            2. Run-of-River Hydropower 
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography>This does technology does not require a dam or reservoir, but instead diverts a portion of a river’s flow through a channel or penstock to drive turbines and generate electricity.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            3.	Pumped Storage 
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography>Use excess electricity during off-peak hours to pump water to a higher elevation, such as a reservoir or lake, where it can be stored until it is needed to generate electricity during peak demand periods. This type is highly efficient and can respond quickly to changes in demand, making it an important part of modern electrical grids. However, it can also be expensive to build and may require a significant amount of land.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="text.primary"
          >
            4.	Small-Scale Hydropower 
          </Typography>
          <List >
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography>This technology can generate electricity on a smaller scale, such as from a small stream or irrigation canal.</Typography>} />
            </ListItem>
          </List>
          <Typography
            component="h1"
            variant="h5"
            align="left"
            color="text.primary"
          >
            <b>G.</b> Energy Storage System (ESS) as a Renewable Energy
          </Typography>
          <List >
          <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>General Policies</b></Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography>- The Department of Energy (DOE) acknowledges the potential of ESS, an evolving technology, to enhance the power grid with a view of securing a dependable, consistent, secure, durable, and reasonably priced supply of electricity, while also expediting the exploration, development, and use of renewable energy (RE) sources. Consequently, to make the most of these benefits, ESS must adhere to the guidelines of:</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography>&nbsp;&nbsp;&nbsp;•	ESS that contributes to the Grid or Distribution System by injecting or extracting electricity. Or by providing reliability services.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography>&nbsp;&nbsp;&nbsp;•	Grid-connected and embedded ESS with a significant impact on the Grid must comply with the Central Dispatch, operated by the System Operator, to facilitate the economical operation and maintenance of the transmission and distribution system, ensuring its quality, stability, reliability, and security.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography>&nbsp;&nbsp;&nbsp;•	ESS must adhere to the Electric Power Industry Reform Act (EPIRA) and its Implementing Rules and Regulations (IRR), the Philippine Grid Code (PGC), the Philippine Distribution Code (PDC), the Wholesale Electricity Spot Market (WESM) Rules and its Market Manuals, Philippine Electrical Code and other pertinent issuances by the DOE, Energy Regulatory Commission (ERC) and other relevant government agencies responsible for ensuring the reliability and supply security of the Grid of the Distribution System.</Typography>} />
            </ListItem>
          </List>
          <List >
          <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>ESS as RE</b></Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography>-	Electricity stored in ESS which was generated in an RE facility will be classified as RE.</Typography>} />
            </ListItem>
          </List>
          <List >
          <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>Type & Definition</b></Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography>-	An ESS is a facility with the ability to absorb energy directly from the Grid or Distribution System. It can also receive energy from RE plant or a conventional plant connected to the Grid or Distribution System. The ESS stores this energy for a specific duration and releases it when required, thereby contributing to maintaining reliability and balance in the power system.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><i>Type of this include the following:</i></Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>•	Battery Energy Storage System</b> also known as <b>BESS-</b> It has the capability to store electrical energy through electrochemical means, allowing it to both charge and discharge electric energy</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>•	Compressed Air Energy Storage</b> also known as <b>CAES-</b> This utilizes electrical energy to inject high-pressure air containers. When energy is needed, the pressurized air is heated and expanded in a turbine, driving a generator to produce electricity.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>•	Flywheel Energy Storage</b> also known as <b>FES-</b> This utilizes electric energy to speed up a rotating mass, known as a “rotor”, to store kinetic energy. The system extracts energy by drawing down the kinetic energy from the rotor.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>•	Pumped-Storage Hydropower</b> also known as <b>PSH-</b> This utilizes electric energy to pump water from a lower reservoir to a higher one. When needed, the water flows back from the upper to the lower reservoir, driving a turbine coupled to a generator to generate electricity.</Typography>} />
            </ListItem>
          </List>
          <List >
          <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>Purpose of ESS</b></Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography>-	Owners or entities of ESS must apply for registration to operate their ESS for one or more of the following purposes:</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>•	Provision of Ancillary Services-</b> ESS can be utilized to reinforce both the transmission capacity and energy, crucial for upholding the quality and reliability of the Grid.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>•	Provision of Energy through Bilateral Supply Contracts of Trading in the WESM-</b> Generation Companies have the option to employ ESS to sell power either through contractual agreements or by participating in energy trading within the WEMS.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>•	Manage the Variability of Renewable Energy-</b> Generation Companies have the option to incorporate ESS into their VRE facilities to alleviate fluctuations in their variable generation output and assist the Grid in maintaining power quality and reliability. Importantly, integrating ESS into Feed-in-Tariff (FIT)-eligible VRE facility should not result in an increase in the capacity of the plant, or the generation entitled to FIT. The ESS is exclusively charged from the output of the VRE facilities.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>•	Auxiliary Load Management for Generation Companies-</b> When incorporated into the power system of a Generation Company, ESS can enhance the supply during peak demand hours, facilitating increased energy dispatch.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>•	Transmission and Distribution Facility Upgrades Deferment-</b> When appropriately connected to nodes, ESS can delay the requirement for additional upgrades to transmission and distribution facilities by utilizing ESS to supply peak demand for both grid and end-users.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>•	Transmission and Distribution Utility Power Quality Management-</b> Encompassing utilizing ESS to enhance the power quality of a Transmission and Distribution System.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>•	End-User Demand Management-</b> ESS can be utilized to oversee the energy demands for end-users.</Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>• Distribution Utility Demand Management-</b> This process involves storing energy acquired during off-peak periods and deploying the stored energy into the power system during peak hours, thereby diminishing the reliance on Grid consumption at peak times.</Typography>} />
            </ListItem>
          </List>
          <List >
          <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography><b>Standards & Safety</b></Typography>} />
            </ListItem>
            <ListItem sx={listItemStyle}>
              <ListItemText primary={<Typography>-	The Department of Energy (DOE), in coordination with the Professional Regulatory Commission (PRC), Department of Environment and Natural Resources (DENR), Department of Labor and Employment (DOLE), Department of Trade and Industry-Bureau of Product Standards, as well as other pertinent government bodies and stakeholders, will consolidate or establish occupational safety and health standards for both ESS technologies and ESS installations. This will be done without compromising compliance with the rules and regulations of other relevant agencies.</Typography>} />
            </ListItem>

          </List>
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
export default REsources