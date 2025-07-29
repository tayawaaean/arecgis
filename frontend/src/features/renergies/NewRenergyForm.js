import React, { useState, useEffect, useMemo } from "react"
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  LayersControl,
  ZoomControl,
} from "react-leaflet"
import { useNavigate } from "react-router-dom"
import { useAddNewRenergyMutation } from "./renergiesApiSlice"
import { reCats } from "../../config/reCats"
import { Solar } from '../categories/Solar'
import { Wind } from '../categories/Wind'
import { Biomass } from '../categories/Biomass'
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Container,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from "@mui/material"
import PropTypes from 'prop-types'
import { boxwrapstyle } from '../../config/style'
import useAuth from "../../hooks/useAuth"
import {
  rawSolarUsage,
  rawSolarSysTypes,
  rawModuleTypes,
  rawBatteryTypes,
  rawMountingLoc,
  rawSolarPanelStatus,
  rawChargeControllerStatus,
  rawWiringsStatus,
  rawBatteryStatus,
  rawWindSysTypes,
  rawWindUsage,
  rawWindSystemStatus,
  rawWindTurbineTypes,
  rawWindTowerTypes,
  rawBiomassDigester,
  rawBiomassLoc,
  rawBiomassPriUsage,
  rawBiomassSystemStatus,
}
  from "../../config/techAssesment"
import Control from "react-leaflet-custom-control"
import { FadeLoader } from 'react-spinners'
import {
  Upload as UploadFileIcon,
  MyLocation as MyLocationIcon,
  ArrowBack as ArrowBackIcon,
  NearMe as NearMeIcon,
  Close as CloseIcon,
} from '@mui/icons-material'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
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
const { BaseLayer } = LayersControl
const NewRenergyForm = ({ allUsers }) => {

  const { username, isManager, isAdmin, } = useAuth()

  const getUserId = allUsers.filter(user => user.username === username)
  const getFilteredID = Object.values(getUserId).map((user) => user.id).toString()
  useEffect(() => {
    if (!isManager || !isAdmin) {
      setUserId(getFilteredID)
    }
  }, [getFilteredID])

  const GEOCODE_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location="

  const MarkLocation = (props) => {

    const fly = () => {
      map.locate()
      props.setLoading(true)

    }
    const map = useMapEvents({
      locationfound(e) {
        props.setLoading(false)
        map.flyTo(e.latlng, 18)
        props.setPosition(e.latlng)
        reverseGeoCoding(e.latlng)

      },
    })
    return (
      <>
        <Button variant="contained" color="white" sx={{ color: 'primary.main' }} onClick={fly}>
          <NearMeIcon />
        </Button>
      </>
    )
  }
  const navigate = useNavigate()
  // const [position, setPosition] = useState(null)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [addNewRenergy, { isLoading, isSuccess, isError, error }] = useAddNewRenergyMutation()
  const [position, setPosition] = useState(null)
  const [ownerName, setOwnerName] = useState("")
  const [country, setCountry] = useState("")
  const [region, setRegion] = useState("")
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [brgy, setBrgy] = useState("")
  const [type, setType] = useState("Point")
  const [coordinates, setCoordinates] = useState("")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [retype, setReType] = useState(["Solar Energy"])
  const [myUploads, setmyUploads] = useState("")
  const [userId, setUserId] = useState("")
  const [solar, setSolar] = useState([])
  const [wind, setWind] = useState([])
  const [biomass, setBiomass] = useState([])
  const [loading, setLoading] = useState(false)

  const markerEventHandler = useMemo(
    () => ({
      dragend(e) {
        setLat(e.target.getLatLng().lat)
        setLng(e.target.getLatLng().lng)
        const { lng, lat } = e.target.getLatLng()
        setCoordinates([lng, lat])
        setPosition(e.target.getLatLng())
        reverseGeoCoding(e.target.getLatLng())
      },
    }),
    []
  )
  useEffect(() => {
    rawSolarUsage.map((item) => item.checked = false)
    rawSolarSysTypes.map((item) => item.checked = false)
    rawModuleTypes.map((item) => item.checked = false)
    rawBatteryTypes.map((item) => item.checked = false)
    rawMountingLoc.map((item) => item.checked = false)
    rawSolarPanelStatus.map((item) => item.checked = false)
    rawChargeControllerStatus.map((item) => item.checked = false)
    rawWiringsStatus.map((item) => item.checked = false)
    rawBatteryStatus.map((item) => item.checked = false)
    rawWindSysTypes.map((item) => item.checked = false)
    rawWindUsage.map((item) => item.checked = false)
    rawWindSystemStatus.map((item) => item.checked = false)
    rawWindTurbineTypes.map((item) => item.checked = false)
    rawWindTowerTypes.map((item) => item.checked = false)
    rawBiomassDigester.map((item) => item.checked = false)
    rawBiomassLoc.map((item) => item.checked = false)
    rawBiomassPriUsage.map((item) => item.checked = false)
    rawBiomassSystemStatus.map((item) => item.checked = false)
  }, [retype])

  useEffect(() => {
    if (isSuccess) {
      setOwnerName("")
      setCountry("")
      setRegion("")
      setProvince("")
      setCity("")
      setBrgy("")
      setLng("")
      setLat("")
      setCoordinates([])
      setType([])
      setReType([])
      setUserId("")
      setSolar([])
      navigate("/dashboard/renergies")
    }
  }, [isSuccess, navigate])

  const onOwnerNameChanged = (e) => setOwnerName(e.target.value)
  const onCountryChanged = (e) => setCountry(e.target.value)
  const onRegionChanged = (e) => setRegion(e.target.value)
  const onProvinceChanged = (e) => setProvince(e.target.value)
  const onCityChanged = (e) => setCity(e.target.value)
  const onBrgyChanged = (e) => setBrgy(e.target.value)
  const onmyUploadsChanged = (e) => setmyUploads(e.target.files)
  const onLatChanged = (e) => {
    setLat(e.target.value)
    setCoordinates([parseFloat(lng), parseFloat(e.target.value)])
  }
  const onLngChanged = (e) => {
    setLng(e.target.value)
    setCoordinates([parseFloat(e.target.value), parseFloat(lat)])
  }
  const onUserIdChanged = (e) => setUserId(e.target.value)
  const onReTypesChanged = (e) => setReType(e.target.value)

  const reverseGeoCoding = async (coordinates) => {
    // Here the coordinates are in LatLng Format
    // if you wish to use other formats you will have to change the lat and lng in the fetch URL
    const data = await (
      await fetch(GEOCODE_URL + `${coordinates.lng},${coordinates.lat}`)
    ).json()
    if (data.address !== undefined) {
      setBrgy(data.address.Neighborhood)
      setCity(data.address.City)
      setProvince(data.address.Subregion)
      setRegion(data.address.Region)
      setCountry(data.address.CntryName)
      setLat(coordinates?.lat)
      setLng(coordinates?.lng)
      setCoordinates([coordinates?.lng, coordinates?.lat])
    }
  }

  const canSave =
    [
      ownerName,
      country,
      region,
      province,
      city,
      brgy,
      lat,
      lng,
      userId,
    ].every(Boolean) && !isLoading

  const onSaveRenergyClicked = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append("user", userId)
    data.append("type", type)
    data.append("coordinates[]", lng)
    data.append("coordinates[]", lat)
    data.append("properties[ownerName]", ownerName)
    data.append("properties[retype]", retype)
    data.append("properties[address][country]", country)
    data.append("properties[address][region]", region)
    data.append("properties[address][province]", province)
    data.append("properties[address][city]", city)
    data.append("properties[address][brgy]", brgy)
    if (retype == "Solar Energy") {
      data.append("assessment[capacity]", solar.capacity)
      data.append("assessment[numbers]", solar.numbers)
      data.append("assessment[solarUsage]", JSON.stringify(solar.solarUsage))
      data.append("assessment[solarSystemTypes]", JSON.stringify(solar.solarSystemTypes))
      data.append("assessment[solarModuleType]", JSON.stringify(solar.solarModuleType))
      data.append("assessment[solarBatTypes]", JSON.stringify(solar.solarBatTypes))
      data.append("assessment[solarMountingLoc]", JSON.stringify(solar.solarMountingLoc))
      data.append("assessment[statusOfSolarPanel]", JSON.stringify(solar.statusOfSolarPanel))
      data.append("assessment[statusOfChargeController]", JSON.stringify(solar.statusOfChargeController))
      data.append("assessment[statusOfBattery]", JSON.stringify(solar.statusOfBattery))
      data.append("assessment[statusOfWirings]", JSON.stringify(solar.statusOfWirings))
    }
    if (retype == "Wind Energy") {
      data.append("assessment[capacity]", wind.capacity)
      data.append("assessment[numberOfRotors]", wind.numberOfRotors)
      data.append("assessment[windUsage]", JSON.stringify(wind.windUsage))
      data.append("assessment[windTurbine]", JSON.stringify(wind.windTurbine))
      data.append("assessment[windTower]", JSON.stringify(wind.windTower))
      data.append("assessment[windSystemTypes]", JSON.stringify(wind.windSystemTypes))
      data.append("assessment[windSystemStatus]", JSON.stringify(wind.windSystemStatus))
    }
    if (retype == "Biomass") {
      data.append("assessment[capacity]", biomass.capacity)
      data.append("assessment[source]", biomass.source)
      data.append("assessment[biomassPriUsage]", JSON.stringify(biomass.biomassPriUsage))
      data.append("assessment[biomassDigester]", JSON.stringify(biomass.biomassDigester))
      data.append("assessment[biomassMakeDigester]", JSON.stringify(biomass.biomassMakeDigester))
      data.append("assessment[biomassLoc]", JSON.stringify(biomass.biomassLoc))
      data.append("assessment[biomassSystemStatus]", JSON.stringify(biomass.biomassSystemStatus))
    }

    const files = e.target.myUploads.files
    if (files.length != 0) {
      for (const file of files) {
        data.append("myUploads", file)
      }
    }

    if (canSave) {
      await addNewRenergy(data)
      // await addNewRenergy({ type, coordinates, myUploads, properties: { user: userId, ownerName, retype, address:{country, region, province, city, brgy} } })
    }
  }


  // const errClass = isError ? "errmsg" : "offscreen"
  // const validOwnerNameClass = !ownerName
  //   ? "form__input--incomplete"
  //   : ""
  // const validCountryClass = !country ? "form__input--incomplete" : ""

  const content = (
    <>
      <p>{error?.data?.message}</p>
      <Container maxWidth="sm" sx={{ bgcolor: 'primary' }}>

        <form onSubmit={onSaveRenergyClicked}>
          <Box
            sx={{
              minHeight: "100vh",
              maxWidth: "100%",
              "& .MuiTextField-root": { my: 1 },
            }}
          >
            <Box
              sx={boxwrapstyle}
            >
              <Grid container>
                <Grid item xs>
                  <Typography component="h1" variant="h5">
                    Technical Assessment
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Owner Name"
                id="ownerName"
                name="properties.ownerName"
                type="text"
                value={ownerName}
                onChange={onOwnerNameChanged}
              />
              <TextField
                fullWidth
                id="retype"
                select
                name="properties.retype"
                label="Select Renewable Energy category"
                value={retype || ""}
                onChange={onReTypesChanged}
              >
                {Object.values(reCats).map((retype, index) => (
                  <MenuItem key={index} value={retype.contName}>
                    {retype.contName}
                  </MenuItem>
                ))}
              </TextField>
              <Box
                sx={{
                  display: "grid",
                  gap: 1,
                  gridTemplateColumns: "repeat(3, 1fr)",
                }}
              >
                <TextField
                  fullWidth
                  label="Longtitude"
                  id="lng"
                  name="lng"
                  type="tel"
                  value={lng}
                  onChange={onLngChanged}
                />
                <TextField
                  fullWidth
                  label="Latitude"
                  id="lat"
                  name="lat"
                  type="tel"
                  value={lat}
                  onChange={onLatChanged}
                />
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<MyLocationIcon />}
                  sx={{
                    my: 1,
                  }}
                  size="small"
                  onClick={handleOpen}
                >
                  Mark Location
                </Button>
              </Box>
              <TextField
                fullWidth
                label="Country"
                id="country"
                name="properties.address.country"
                type="text"
                value={country}
                onChange={onCountryChanged}
              />
              <TextField
                fullWidth
                label="Region"
                id="region"
                name="properties.address.region"
                type="text"
                value={region}
                onChange={onRegionChanged}
              />
              <TextField
                fullWidth
                label="Province"
                id="province"
                name="properties.address.province"
                type="text"
                value={province}
                onChange={onProvinceChanged}
              />
              <TextField
                fullWidth
                label="City/Municipality"
                id="city"
                name="properties.address.city"
                type="text"
                value={city}
                onChange={onCityChanged}
              />
              <TextField
                fullWidth
                label="Barangay"
                id="lng"
                name="properties.address.brgy"
                type="text"
                value={brgy}
                onChange={onBrgyChanged}
              />
              {isManager || isAdmin ?
                <TextField
                  fullWidth
                  id="user"
                  select
                  label="Assigned to:"
                  value={userId || ""}
                  onChange={onUserIdChanged}
                >
                  {allUsers.map((users) => (
                    <MenuItem key={users.id} value={users.id}>
                      {users.username}
                    </MenuItem>
                  ))}
                </TextField> : ""
              }

            </Box>
            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
              fullWidth
              maxWidth={'md'}
            >
              <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Select Location
              </BootstrapDialogTitle>
              <DialogContent dividers >
                <MapContainer
                  style={{ height: "50vh", width: "100%"}}
                  center={[12.512797, 122.395164]}
                  zoom={5}
                  scrollWheelZoom={true}
                  zoomControl={false}
                >
                  <LayersControl position="topleft">
                    <BaseLayer checked name="OpenStreetMap">
                      <TileLayer
                        attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                    </BaseLayer>
                    <BaseLayer name="Esri ArcGIS World Imagery">
                      <TileLayer
                        attribution="Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"
                        className="basemap"
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      />
                    </BaseLayer>
                    <BaseLayer name="NASA Gibs Blue Marble">
                      <TileLayer
                        url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
                        attribution="&copy NASA Blue Marble, image service by OpenGeo"
                        maxNativeZoom={8}
                      />
                    </BaseLayer>
                  </LayersControl>

                  <Control position="topright">
                    <MarkLocation setPosition={setPosition} position={position} setLoading={setLoading} />
                  </Control>

                  {position == null ? null : <Marker draggable={true} eventHandlers={markerEventHandler} position={position}></Marker>}
                  <Control position="topright">
                    {loading == true ? <FadeLoader
                      color={"#fffdd0"}
                      height={9}
                      margin={2}
                      radius={-153}
                      width={5}
                    /> : null}
                  </Control>
                  <ZoomControl position="bottomright" />
                </MapContainer>
                <Typography>
                  Location: {province == "" ? null : province + ", "}{city == "" ? null : city}{brgy == "" ? null : ", " + brgy}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button variant="outlined" sx = {{backgroundColor: "primary"}} onClick={handleClose} >
                  Save changes
                </Button>
              </DialogActions>
            </BootstrapDialog>

            {retype === null ? null : retype == 'Solar Energy' ? <Solar setSolar={setSolar} /> : retype == 'Wind Energy' ? <Wind setWind={setWind} /> : retype == 'Biomass' ? <Biomass setBiomass={setBiomass} /> : ''}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
              }}
            >
              <Button
                variant="contained"
                color="success"
                type="submit"
                sx={{ my: 1 }}
                disabled={!canSave}
              >
                Save
              </Button>

              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
                sx={{ m: 1 }}
              >
                Add Images
                <input
                  type="file"
                  id="myUploads"
                  name="myUploads"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={onmyUploadsChanged}
                />
              </Button>
            </Box>
          </Box>

          <input
            className={`form__input}`}
            id="coordinates"
            name="coordinates"
            value={coordinates}
            type="hidden"
          />
        </form>
      </Container>
    </>
  )
  return content
}

export default NewRenergyForm
