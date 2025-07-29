import {
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    styled,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    Paper,
    TableCell,
    TableHead,
    Typography,
    Stack,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    useTheme,
    useMediaQuery,
} from "@mui/material"
import PropTypes from "prop-types"
import {
    Close as CloseIcon,
} from "@mui/icons-material"
import React, { useEffect, useState } from "react"
import { StyledTableRow, scrollbarStyle } from "./style";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#000',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    // "& .MuiDialogContent-root": {
    //     padding: theme.spacing(2),
    // },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}))

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props

    return (
        <DialogTitle sx={{ m: 0, p: 0, bgcolor: "#000066", color: "#fff" }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    )
}
BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
}


export const GenModal = (props) => {
    const handleCloseModal = () => {
        props.setOpenGenModal(false)
        props.setActive(true)
    }
    const aveSunHour = 4.7
    const { project } = props
    let date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    // console.log(year, month)
    const January = { noDays: new Date(year, 1, 0).getDate(), sunHour: 5.1 }
    const February = { noDays: new Date(year, 2, 0).getDate(), sunHour: 5.2 }
    const March = { noDays: new Date(year, 3, 0).getDate(), sunHour: 6 }
    const April = { noDays: new Date(year, 4, 0).getDate(), sunHour: 5.8 }
    const May = { noDays: new Date(year, 5, 0).getDate(), sunHour: 5.1 }
    const June = { noDays: new Date(year, 6, 0).getDate(), sunHour: 4.4 }
    const July = { noDays: new Date(year, 7, 0).getDate(), sunHour: 3.8 }
    const August = { noDays: new Date(year, 8, 0).getDate(), sunHour: 3.5 }
    const September = { noDays: new Date(year, 9, 0).getDate(), sunHour: 4.3 }
    const October = { noDays: new Date(year, 10, 0).getDate(), sunHour: 4.7 }
    const November = { noDays: new Date(year, 11, 0).getDate(), sunHour: 4.5 }
    const December = { noDays: new Date(year, 12, 0).getDate(), sunHour: 4.5 }

    const [capacity, setCapacity] = useState(0)
    const [genYearly, setGenYearly] = useState(0)

    // const [janMon, setJanMon] = useState(0)
    // const [febMon, setFebMon] = useState(0)
    // const [marMon, setMarMon] = useState(0)
    // const [aprMon, setAprMon] = useState(0)
    // const [mayMon, setMayMon] = useState(0)
    // const [junMon, setJunMon] = useState(0)
    // const [julMon, setJulMon] = useState(0)
    // const [augMon, setAugMon] = useState(0)
    // const [sepMon, setSepMon] = useState(0)
    // const [octMon, setOctMon] = useState(0)
    // const [novMon, setNovMon] = useState(0)
    // const [decMon, setDecMon] = useState(0)

    // console.log(capacity)
    useEffect(() => {
        if (project?.assessment?.solarStreetLights) {
            const rawSolarItems = project.assessment.solarStreetLights
            // return ({capacity: rawSolarItems.map(x=>x.capacity)})
            // return rawSolarItems
            const product = rawSolarItems.map((solar => solar.capacity * solar.pcs))
            const initialValue = 0;
            const rawSolarStreet = product.reduce((accumulator, currentValue) =>
                accumulator + currentValue, initialValue
            )
            setCapacity(rawSolarStreet)
        }

        if (project?.assessment?.solarUsage === 'Power Generation') {
            setCapacity(parseFloat(project.assessment.capacity))
        }

        if (project?.assessment?.solarUsage === 'Solar Pump') {
            setCapacity(parseFloat(project.assessment.capacity))
        }

        const yearly = [
            parseFloat((capacity * January.noDays * January.sunHour) / 1000),
            parseFloat((capacity * February.noDays * February.sunHour) / 1000),
            parseFloat((capacity * March.noDays * March.sunHour) / 1000),
            parseFloat((capacity * April.noDays * April.sunHour) / 1000),
            parseFloat((capacity * May.noDays * May.sunHour) / 1000),
            parseFloat((capacity * June.noDays * June.sunHour) / 1000),
            parseFloat((capacity * July.noDays * July.sunHour) / 1000),
            parseFloat((capacity * August.noDays * August.sunHour) / 1000),
            parseFloat((capacity * September.noDays * September.sunHour) / 1000),
            parseFloat((capacity * October.noDays * October.sunHour) / 1000),
            parseFloat((capacity * November.noDays * November.sunHour) / 1000),
            parseFloat((capacity * December.noDays * December.sunHour) / 1000)
        ]
        const initialValue = 0
        const rawItems = yearly.reduce((accumulator, currentValue) =>
            accumulator + currentValue, initialValue
        )
        setGenYearly(parseInt(rawItems))

    }, [props])
    const oneDay = 1000 * 60 * 60 * 24
    const perDay = (capacity * aveSunHour) / 1000
    const treeFactor = 0.0006327
    const coalFactor = 9
    const co2Factor = 0.512

    const yearEst = parseInt(project?.properties?.yearEst)
    const createdAt = new Date(project?.createdAt)
    let dateEst = new Date(`1/1/${yearEst}`);

    const diffInTime = createdAt.getTime() - dateEst.getTime()
    const noOfDays = Math.round(diffInTime / oneDay)
    const totalAve = (capacity * aveSunHour * noOfDays) / 1000

    const stdCoal = ((totalAve * 3.6) / coalFactor) / 1000
    const CO2 = (totalAve * co2Factor) / 1000
    const Tree = (Math.round(totalAve * treeFactor))
    const theme = useTheme();
    const [data, setData] = useState([])
    const [desc, setDesc] = useState("")
    const [city, setCity] = useState("")
    const [humidity, setHumidity] = useState("")
    const [visibility, setVisibility] = useState("")
    const [windspeed, setWindSpeed] = useState("")
    const [temperature, setTemperature] = useState("")
    const [wicon, setWicon] = useState("")
    useEffect(() => {
        if(props.openGenModal === true){
            const fetchData = async () => {
                //   navigator.geolocation.getCurrentPosition(function(position) {
                //     setLat(position.coords.latitude);
                //     setLong(position.coords.longitude);
                //   });
                await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${props?.project?.coordinates[1]}&lon=${props?.project?.coordinates[0]}&appid=a30ee7b050677eb2e7e16b14dc7080a5`)
                    .then(res => res.json())
                    .then(result => {
                        setTemperature(Math.round(result.main.temp - 273.15))
                        setDesc(result.weather[0].description)
                        setCity(`${result.name}, ${result.sys.country}`)
                        setHumidity(result.main.humidity)
                        setVisibility(result.visibility / 1000)
                        setWindSpeed(result.wind.speed)
                        setWicon(result.weather[0].icon)
                    });
            }
            fetchData();
        }
        
    }, [props])


    return (
        <>
            <BootstrapDialog
                onClose={handleCloseModal}
                open={props.openGenModal}
                fullWidth
                maxWidth={"md"}

            >
                <BootstrapDialogTitle id="custom-dialog-title" onClose={handleCloseModal}>
                    <ListItem alignItems="flex-start" disablePadding>
                        <ListItemAvatar>
                            <img alt="weather logo" src={`/${wicon}.svg`} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="h6"
                                        color="inherit"
                                    >
                                        {city}
                                    </Typography>


                                </React.Fragment>
                            }
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="white.main"
                                    >
                                        {temperature}<span>&deg;</span> C, {desc}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    {/* {Math.round(data?.main?.temp - 273.15)}<span>&deg;</span> */}

                    <small></small>

                </BootstrapDialogTitle>

                <DialogContent dividers sx={scrollbarStyle}>

                    <List sx={{ width: '100%', paddingX: 2, flexDirection: { xs: "column", sm: "row", md: "row" } }} component={Stack} >

                        <ListItem alignItems="flex-start" >
                            <ListItemAvatar>
                                <Avatar alt="solar panel" src="/solar-energy-solar-panel-svgrepo-com.svg" />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="h6"
                                            color="text.primary"
                                        >
                                            {Math.round(totalAve)}
                                        </Typography>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            &nbsp;kWh
                                        </Typography>
                                    </React.Fragment>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Total yield
                                        </Typography>
                                        {" — from January " + yearEst + " to " + createdAt?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>

                        <Divider orientation={useMediaQuery(theme.breakpoints.down("sm")) ? "horizontal" : "vertical"} flexItem={true} />
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt="renewable-energy" src="/renewable-energy-svgrepo-com.svg" />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="h6"
                                            color="text.primary"
                                        >
                                            {perDay.toFixed(2)}
                                        </Typography>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            &nbsp;kWh
                                        </Typography>

                                    </React.Fragment>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Yield per day
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider orientation={useMediaQuery(theme.breakpoints.down("sm")) ? "horizontal" : "vertical"} flexItem={true} />
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt="calendar" src="/calendar-svgrepo-com.svg" />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="h6"
                                            color="text.primary"
                                        >
                                            {genYearly.toLocaleString("en-US")}
                                        </Typography>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            &nbsp;kWh
                                        </Typography>

                                    </React.Fragment>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Yield per year
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    </List>
                    <Grid container sx={{ marginTop: 2, flexDirection: { xs: "row", sm: "row", md: "row" } }}>
                        <Grid item xs={12} sm={8} md={8}>

                            <TableContainer component={Paper} sx={{ ...scrollbarStyle, paddingX: 2, boxShadow: 'none', maxHeight: 300 }}>
                                <Table size="small" stickyHeader >
                                    <TableHead >
                                        <TableRow >
                                            <TableCell sx={{ bgcolor: '#ffd15d', fontWeight: "Medium" }}>
                                                Monthly yield
                                            </TableCell >
                                            <TableCell align="left" sx={{ bgcolor: '#ffd15d', fontWeight: "Medium" }}>
                                                kWh
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody >
                                        <StyledTableRow >
                                            <TableCell sx={{ fontWeight: "Medium" }}>January</TableCell>
                                            <TableCell align="left">
                                                {((capacity * January.noDays * January.sunHour) / 1000).toFixed(2)}
                                            </TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell sx={{ fontWeight: "Medium" }}>February</TableCell>
                                            <TableCell align="left">
                                                {((capacity * February.noDays * February.sunHour) / 1000).toFixed(2)}
                                            </TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell sx={{ fontWeight: "Medium" }}>March</TableCell>
                                            <TableCell align="left">
                                                {((capacity * March.noDays * March.sunHour) / 1000).toFixed(2)}
                                            </TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell sx={{ fontWeight: "Medium" }}>April</TableCell>
                                            <TableCell align="left">
                                                {((capacity * April.noDays * April.sunHour) / 1000).toFixed(2)}
                                            </TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell sx={{ fontWeight: "Medium" }}>May</TableCell>
                                            <TableCell align="left">
                                                {((capacity * May.noDays * May.sunHour) / 1000).toFixed(2)}
                                            </TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell sx={{ fontWeight: "Medium" }}>June</TableCell>
                                            <TableCell align="left">
                                                {((capacity * June.noDays * June.sunHour) / 1000).toFixed(2)}
                                            </TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell sx={{ fontWeight: "Medium" }}>July</TableCell>
                                            <TableCell align="left">
                                                {((capacity * July.noDays * July.sunHour) / 1000).toFixed(2)}
                                            </TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell sx={{ fontWeight: "Medium" }}>August</TableCell>
                                            <TableCell align="left">
                                                {((capacity * August.noDays * August.sunHour) / 1000).toFixed(2)}
                                            </TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell sx={{ fontWeight: "Medium" }}>September</TableCell>
                                            <TableCell align="left">
                                                {((capacity * September.noDays * September.sunHour) / 1000).toFixed(2)}
                                            </TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell sx={{ fontWeight: "Medium" }}>October</TableCell>
                                            <TableCell align="left">
                                                {((capacity * October.noDays * October.sunHour) / 1000).toFixed(2)}
                                            </TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell sx={{ fontWeight: "Medium" }}>November</TableCell>
                                            <TableCell align="left">
                                                {((capacity * November.noDays * November.sunHour) / 1000).toFixed(2)}
                                            </TableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <TableCell sx={{ fontWeight: "Medium" }}>December</TableCell>
                                            <TableCell align="left">
                                                {((capacity * December.noDays * December.sunHour) / 1000).toFixed(2)}
                                            </TableCell>
                                        </StyledTableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <List sx={{ width: '100%', paddingX: 2 }} >
                                <ListItem alignItems="flex-start">
                                    <Typography
                                        variant="h6"
                                        color="text.primary">
                                        Social Contributions
                                    </Typography>

                                </ListItem>
                                <ListItem alignItems="flex-start">

                                    <ListItemAvatar>
                                        <Avatar alt="Coal" src="/coal-svgrepo-com.svg" />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="h6"
                                                    color="text.primary"
                                                >
                                                    {stdCoal.toFixed(2)}
                                                </Typography>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    &nbsp;(ton)
                                                </Typography>

                                            </React.Fragment>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="caption"
                                                    color="text.primary"
                                                >
                                                    Standard coal save
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt="Coal" src="/ecology-plant-svgrepo-com.svg" />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="h6"
                                                    color="text.primary"
                                                >
                                                    {CO2.toFixed(2)}
                                                </Typography>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    &nbsp;(ton)
                                                </Typography>
                                            </React.Fragment>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="caption"
                                                    color="text.primary"
                                                >
                                                    C0₂ avoided
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt="Coal" src="/save-energy-svgrepo-com.svg" />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="h6"
                                                    color="text.primary"
                                                >
                                                    {Tree}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="caption"
                                                    color="text.primary"
                                                >
                                                    Trees planted
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            </List>
                            <Divider orientation="horizontal" flexItem={true} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCloseModal}>
                        Exit
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )
}