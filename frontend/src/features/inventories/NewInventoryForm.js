import React, { useState, useEffect, useCallback, useRef } from "react"
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom"
import { useAddNewInventoryMutation } from "./inventoriesApiSlice"
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
  FormGroup,
  FormControlLabel,
  Input,
  InputAdornment,
  Checkbox,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Alert,
  Collapse,
  Tooltip,
} from "@mui/material"
import { boxstyle } from '../../config/style'
import useAuth from "../../hooks/useAuth"
import {
  Classification,
  mannerOfAcquisition,
}
  from "../../config/techAssesment"
import {
  Upload as UploadFileIcon,
  MyLocation as MyLocationIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material'
import { Coordinates } from "../../components/Coordinates"
import { Hydropower } from "../categories/Hydropower"
import exifr from "exifr";



const NewInventoryForm = ({ allUsers }) => {

  const [addNewInventory, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewInventoryMutation()

  const navigate = useNavigate()

  const { username, isManager, isAdmin, } = useAuth()
  const getUserId = allUsers.filter(user => user.username === username)
  const getFilteredID = Object.values(getUserId).map((user) => user.id).toString()

  useEffect(() => {
    if (!isManager || !isAdmin) {
      setUserId(getFilteredID)
    }
  }, [getFilteredID])


  const year = (new Date()).getFullYear();
  const years = Array.from(new Array(124),( val, index) => year - index);


  const GEOCODE_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location="

  const [openModal, setOpenModal] = useState(false)
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
  const [reClass, setReClass] = useState(["Non-Commercial"])
  const [reCat, setReCat] = useState(["Solar Energy"])
  const [acquisition, setAcquisition] = useState(mannerOfAcquisition[1].name)
  const [yearEst, setYearEst] = useState(years[0])
  const [myUploads, setmyUploads] = useState("")
  const [filesCount, setFilesCount] = useState(null)
  const [userId, setUserId] = useState("")
  const [solar, setSolar] = useState([])
  const [wind, setWind] = useState([])
  const [biomass, setBiomass] = useState([])
  const [hydropower, setHydropower] = useState([])

  //webcam start
  // const [x, setX] = useState('')
  // useEffect(() => {

  //   navigator.geolocation.watchPosition((position)=>{

  //     const neww = { 
  //       lat: position.coords.latitude,
  //       long: position.coords.longitude,
  //       accuracy: position.coords.accuracy,
  //       altitudeAccuracy: position.coords.altitudeAccuracy,
  //       altitude: position.coords.altitude,
  //     }
  //     setX(neww)
  //   })
  // })


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
      setReCat([])
      setReClass([])
      setYearEst("")
      setAcquisition([])
      setUserId("")
      setSolar([])
      navigate("/dashboard/inventories")
    }
  }, [isSuccess, navigate])

  const onOwnerNameChanged = (e) => setOwnerName(e.target.value)
  const onCountryChanged = (e) => setCountry(e.target.value)
  const onRegionChanged = (e) => setRegion(e.target.value)
  const onProvinceChanged = (e) => setProvince(e.target.value)
  const onCityChanged = (e) => setCity(e.target.value)
  const onBrgyChanged = (e) => setBrgy(e.target.value)
  const onmyUploadsChanged = (e) => {
    setmyUploads(e.target.files)
    setFilesCount(e.target.files.length)
    
  }
  const onLatChanged = (e) => {
    setLat(e.target.value)
    setCoordinates([parseFloat(lng), parseFloat(e.target.value)])
  }
  const onLngChanged = (e) => {
    setLng(e.target.value)
    setCoordinates([parseFloat(e.target.value), parseFloat(lat)])
  }
  const onUserIdChanged = (e) => setUserId(e.target.value)
  const onReClassChanged = (e) => setReClass(e.target.value)
  const onReCatChanged = (e) => setReCat(e.target.value)
  const onAquisitionChanged = (e) => setAcquisition(e.target.value)
  const onYearEstChanged = (e) => setYearEst(e.target.value)

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
      // brgy,
      lat,
      lng,
      userId,
    ].every(Boolean) && !isLoading  && filesCount<=3


  const onSaveInventoryClicked = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append("user", userId)
    data.append("type", type)
    data.append("coordinates[]", lng)
    data.append("coordinates[]", lat)
    data.append("properties[ownerName]", ownerName)
    data.append("properties[reCat]", reCat)
    data.append("properties[reClass]", reClass)
    data.append("properties[yearEst]", yearEst)
    data.append("properties[acquisition]", acquisition)
    data.append("properties[address][country]", country)
    data.append("properties[address][region]", region)
    data.append("properties[address][province]", province)
    data.append("properties[address][city]", city)
    data.append("properties[address][brgy]", brgy)
    if (reCat == "Solar Energy") {
      if (solar?.solarUsage === "Solar Street Lights") {
        const items = solar?.solarStreetLights
        for (let i = 0; i < items.length; i++) {
          const obj = items[i]
          data.append(`assessment[solarStreetLights][${i}][capacity]`, obj.capacity)
          data.append(`assessment[solarStreetLights][${i}][pcs]`, obj.pcs)
        }
      }
      if (solar?.solarUsage === "Solar Pump") {
        data.append("assessment[flowRate]", solar.flowRate)
        data.append("assessment[serviceArea]", solar.serviceArea)
        data.append("assessment[capacity]", solar.capacity)
      }
      if (solar?.solarUsage === "Power Generation") {
        data.append("assessment[solarSystemTypes]", solar.solarSystemTypes)
        data.append("assessment[capacity]", solar.capacity)
      }
      data.append("assessment[remarks]", solar.remarks)
      data.append("assessment[status]", solar.status)
      data.append("assessment[solarUsage]", solar.solarUsage)
    }
    if (reCat == "Wind Energy") {
      if (wind?.windUsage === 'Water pump') {
        data.append("assessment[serviceArea]", wind.serviceArea)
      }
      data.append("assessment[capacity]", wind.capacity)
      data.append("assessment[windUsage]", wind.windUsage)
      data.append("assessment[remarks]", wind.remarks)
      data.append("assessment[status]", wind.status)
    }
    if (reCat == "Biomass") {
      if (biomass?.biomassPriUsage === 'Biogas' || biomass?.biomassPriUsage === 'Gasification') {
        data.append("assessment[bioUsage]", biomass.bioUsage)
      }
      data.append("assessment[capacity]", biomass.capacity)
      data.append("assessment[biomassPriUsage]", biomass.biomassPriUsage)
      data.append("assessment[remarks]", biomass.remarks)
      data.append("assessment[status]", biomass.status)
    }
    if (reCat == "Hydropower") {
      data.append("assessment[capacity]", hydropower.capacity)
      data.append("assessment[status]", hydropower.status)
      data.append("assessment[remarks]", hydropower.remarks)
    }

    // console.log(e.target.myUploads.files[0])
    // const file = e.target.myUploads.files[0]
    // data.append("myUploads", file)
    const files = e.target.myUploads.files
    if (files.length != 0) {
      for (const file of files) {
        data.append("myUploads", file)
      }
    }

    if (canSave) {
      await addNewInventory(data)
      // await addNewInventory({ type, coordinates, myUploads, properties: { user: userId, ownerName, reCat, address:{country, region, province, city, brgy} } })
    }
  }
  //webcam start
  // const webcamRef = useRef(null);
  // const [imgSrc, setImgSrc] = useState(null);
  // const [screenshot, setScreenshot] = useState(null);

  // const capture = () => {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   setScreenshot(imageSrc);
  // };
  useEffect(() => {
    window.scrollTo(0, 0)
    const validLat = !lat ? false : true
    const validLng = !lng ? false : true
    const validOwnerName = !ownerName ? false : true
    const validReCat = !reCat ? false : true
    const validReClass = !reClass ? false : true
    const validYearEst = !yearEst ? false : true
    const validAcquisition = !acquisition ? false : true
    const validCountry = !country ? false : true
    const validRegion = !region ? false : true
    const validProvince = !province ? false : true
    const validCity = !city ? false : true
    const validBarangay = !brgy ? false : true
  }, [isError])
  // const errClass = isError ? "errmsg" : "offscreen"
  // const validOwnerNameClass = !ownerName
  //   ? "form__input--incomplete"
  //   : ""
  // const validCountryClass = !country ? "form__input--incomplete" : ""

  const content = (
    <>
      <Container  sx={{maxWidth:{lg:'md'}}} >
        <form onSubmit={onSaveInventoryClicked}>
          <Box
            sx={{
              minHeight: "100vh",
              maxWidth: "100%",
              "& .MuiTextField-root": { my: 1 },
            }}
          >
            <Box
              sx={boxstyle}
            >
              <Collapse timeout={{ exit: 1 }} in={isError} >
                <Alert severity="error" >
                  {error?.data?.message}
                </Alert>
              </Collapse>
              {/* lat: {x.lat}
              <br></br>
              lng: {x.long}
              <br></br>
              accuracy: {x.accuracy}
              <br></br>
              altitude: {x.altitude}
              <br></br>
              altitudeAccuracy: {x.altitudeAccuracy}
              <br></br> */}
              {/* <Card>
                    <div>
                      <CardContent>
                        <div style={{ position: 'relative' }} >
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        forceScreenshotSourceSize
                        location={x.lat}
                      >

                      </Webcam>
                      <button onClick={capture}>Capture photo</button>
                          <div style={{
                          position: 'absolute', 
                          color: 'white', 
                          top: 8, 
                          left: '50%', 
                          transform: 'translateX(-50%)'
                        }} >Your text</div>
                          
                        </div>
                      </CardContent>
                    </div>
                  </Card>

              
              {screenshot && (
                <>
                  <Card>
                    <div>
                      <CardContent>
                        <div style={{ position: 'relative' }} >
                          <CardMedia
                            component="img"
                            image={screenshot}
                          />
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </>
                
              )} */}

              <Grid container>
                <Grid item xs key="1">
                  <Typography component="h1" variant="h5">
                    New Inventory
                  </Typography>
                </Grid>
                <Grid item key="2">
                  <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <TextField
                fullWidth
                size="small"
                id="reCat"
                select
                name="properties.reCat"
                label="Select RE Category"
                value={reCat || ""}
                onChange={onReCatChanged}
              >
                {Object.values(reCats).map((reCat, index) => (
                  <MenuItem key={index} value={reCat.contName}>
                    {reCat.contName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                size="small"
                id="reclass"
                select
                label="Select RE Classification:"
                value={reClass || ""}
                onChange={onReClassChanged}
              >
                {Classification.map((type, index) => (
                  <MenuItem key={index} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                size="small"
                id="acquisition"
                select
                label="Manner of Acquisition:"
                value={acquisition || ""}
                onChange={onAquisitionChanged}
              >
                {mannerOfAcquisition.map((type, index) => (
                  <MenuItem key={index} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                size="small"
                label="Owner/ Company/ Cooperative/ Association Name"
                id="ownerName"
                name="properties.ownerName"
                type="text"
                value={ownerName}
                onChange={onOwnerNameChanged}
              />
              <TextField
                fullWidth
                size="small"
                id="yearEst"
                select
                name="properties.yearEst"
                label="Year Established"
                value={yearEst || ""}
                onChange={onYearEstChanged}
              >
                {years.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              {isManager || isAdmin ?
                <TextField
                  fullWidth
                  size="small"
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
            <Box
              sx={boxstyle}
            >
              <Typography sx={{ fontStyle: "italic" }} component="h1" variant="subtitle2">
                Coordinates
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gap: 1,
                  gridTemplateColumns: "repeat(3, 1fr)",
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Longitude"
                  id="lng"
                  name="lng"
                  type="number"
                  value={lng}
                  onChange={onLngChanged}
                />
                <TextField
                  // error={validLat}
                  fullWidth
                  size="small"
                  label="Latitude"
                  id="lat"
                  name="lat"
                  type="number"
                  value={lat}
                  onChange={onLatChanged}
                  // helperText={validLat ? 'this is an error txt' : ''}
                />
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<MyLocationIcon />}
                  sx={{
                    my: 1,
                  }}
                  size="small"
                  onClick={() => setOpenModal(true)}
                >
                  Select on Map
                </Button>
              </Box>
              <Coordinates openModal={openModal} setOpenModal={setOpenModal} reverseGeoCoding={reverseGeoCoding} setLat={setLat} setLng={setLng} />

            </Box>
            <Box
              sx={boxstyle}
            >
              <Typography sx={{ fontStyle: "italic" }} component="h1" variant="subtitle2">
                Address
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="Country"
                id="country"
                name="properties.address.country"
                type="text"
                value={country}
                onChange={onCountryChanged}
              />
              <TextField
                fullWidth
                size="small"
                label="Region"
                id="region"
                name="properties.address.region"
                type="text"
                value={region}
                onChange={onRegionChanged}
              />
              <TextField
                fullWidth
                size="small"
                label="Province"
                id="province"
                name="properties.address.province"
                type="text"
                value={province}
                onChange={onProvinceChanged}
              />
              <TextField
                fullWidth
                size="small"
                label="City/Municipality"
                id="city"
                name="properties.address.city"
                type="text"
                value={city}
                onChange={onCityChanged}
              />
              <TextField
                fullWidth
                size="small"
                label="Barangay"
                id="lng"
                name="properties.address.brgy"
                type="text"
                value={brgy}
                onChange={onBrgyChanged}
              />
            </Box>

            {reCat === null ? null :
              reCat == 'Solar Energy' ? <Solar setSolar={setSolar} /> :
                reCat == 'Wind Energy' ? <Wind setWind={setWind} /> :
                  reCat == 'Biomass' ? <Biomass setBiomass={setBiomass} /> :
                    reCat == 'Hydropower' ? <Hydropower setHydropower={setHydropower} /> : ''}

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
              <Tooltip title="3 maximum images">
              <Button
                component="label"
                variant="contained"
                startIcon={<UploadFileIcon />}
                sx={{ m: 1 }}
              >
                Add Images {filesCount>=4 ? "| no. of file exceeded" : filesCount ?"| "+filesCount+" selected": null}
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
              </Tooltip>
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

export default NewInventoryForm
