import React, { useState, useEffect, useMemo } from "react"
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
} from "react-leaflet"
import {
  Box,
  Modal,
  Button,
  TextField,
  MenuItem,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Grid,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material"
import {
  Upload as UploadFileIcon,
  MyLocation as MyLocationIcon,
  DeleteOutline as DeleteOutlineIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material"

import { reCats } from "../../config/reCats"

import { useDeleteImageRenergyMutation, useUpdateRenergyMutation, useDeleteRenergyMutation } from "./renergiesApiSlice"
import { useNavigate } from "react-router-dom"
import { EditSolar } from "../categories/EditSolar"
import { EditWind } from "../categories/EditWind"
import { EditBiomass } from "../categories/EditBiomass"
import useAuth from "../../hooks/useAuth"
import { baseUrl } from "../../config/baseUrl"
import { boxwrapstyle, style } from "../../config/style"

const EditRenergyForm = ({ reItems, users }) => {
  const { isManager, isAdmin } = useAuth()
  const GEOCODE_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location="

  const HandleClickFindSelfMap = () => {
    const map = useMapEvents({
      click(e) {
        setLat(e.latlng.lat)
        setLng(e.latlng.lng)
        const { lng, lat } = e.latlng
        setCoordinates([lng, lat])
        setPosition(e.latlng)
        reverseGeoCoding(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
    })

    const eventHandlers = useMemo(
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

    return position == null ? null : (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
      ></Marker>
    )
  }

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [updateRenergy, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateRenergyMutation()

  const [deleteImageRenergy, {
    isLoading: isImageLoading,
    isSuccess: isImageDelSuccess,
    isError:  isImageError,
    error: imageError,
  }] = useDeleteImageRenergyMutation()

  const [deleteRenergy, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delerror
  }] = useDeleteRenergyMutation()

  const navigate = useNavigate()

  const [position, setPosition] = useState([0, 0])
  const [ownerName, setOwnerName] = useState("")
  const [country, setCountry] = useState("")
  const [region, setRegion] = useState("")
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [brgy, setBrgy] = useState("")
  const [type, setType] = useState("")
  const [coordinates, setCoordinates] = useState([0,0])
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [reCat, setReType] = useState("")
  const [myUploads, setmyUploads] = useState("")
  const [userId, setUserId] = useState("")
  const [solar, setEditSolar] = useState([])
  const [wind, setEditWind] = useState([])
  const [biomass, setEditBiomass] = useState([])

  // --- NetMetered and OwnUse State (as "Yes"/"No" strings for radio buttons) ---
  const [isNetMetered, setIsNetMetered] = useState("No")
  const [isOwnUse, setIsOwnUse] = useState("No")
  // ---

  // Debug: Log on every render
  console.log("isNetMetered:", isNetMetered)
  console.log("isOwnUse:", isOwnUse)

  // Optional: Log when reItems changes
  useEffect(() => {
    console.log("reItems:", reItems)
  }, [reItems])

  // Optional: Log when values change
  useEffect(() => {
    console.log("Changed isNetMetered:", isNetMetered)
    console.log("Changed isOwnUse:", isOwnUse)
  }, [isNetMetered, isOwnUse])

  // Sync initial values from reItems
  useEffect(() => {
    if (reItems?.properties) {
      setOwnerName(reItems.properties.ownerName || "")
      setCountry(reItems.properties.address?.country || "")
      setRegion(reItems.properties.address?.region || "")
      setProvince(reItems.properties.address?.province || "")
      setCity(reItems.properties.address?.city || "")
      setBrgy(reItems.properties.address?.brgy || "")
      setType(reItems.type || "")
      setCoordinates(reItems.coordinates || [0,0])
      setLat(reItems.coordinates?.[1] || "")
      setLng(reItems.coordinates?.[0] || "")
      setReType(reItems.properties.reCat || "")
      setUserId(reItems.user || "")
      setIsNetMetered(reItems.properties.isNetMetered === "Yes" ? "Yes" : "No")
      setIsOwnUse(reItems.properties.ownUse === "Yes" ? "Yes" : "No")
    }
  }, [reItems])

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
      setType("")
      setReType("")
      setUserId("")
      navigate(0)
    }
  }, [isSuccess, navigate])

  useEffect(() => {
    if ( isDelSuccess) {
      setOwnerName("")
      setCountry("")
      setRegion("")
      setProvince("")
      setCity("")
      setBrgy("")
      setLng("")
      setLat("")
      setCoordinates([])
      setType("")
      setReType("")
      setUserId("")
      navigate("/dashboard/renergies/list")
    }
  }, [isDelSuccess, navigate])

  useEffect(() => {
    if (isImageDelSuccess) {
      navigate(0)
    }
  }, [ isImageDelSuccess, navigate])

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
    const data = await (
      await fetch(GEOCODE_URL + `${coordinates.lng},${coordinates.lat}`)
    ).json()
    if (data.address !== undefined) {
      setBrgy(data.address.Neighborhood)
      setCity(data.address.City)
      setProvince(data.address.Subregion)
      setRegion(data.address.Region)
      setCountry(data.address.CntryName)
    }
  }
  const canSave = [type, ownerName, userId].every(Boolean) && !isLoading

  const onSaveRenergyClicked = async (e) => {
    e.preventDefault()
    // Log before submit
    console.log("Submitting isNetMetered:", isNetMetered)
    console.log("Submitting isOwnUse:", isOwnUse)

    const data = new FormData()
    data.append("id", reItems.id)
    data.append("user", userId)
    data.append("type", type)
    data.append("coordinates[]", lng)
    data.append("coordinates[]", lat)
    data.append("properties[ownerName]", ownerName)
    data.append("properties[reCat]", reCat)
    data.append("properties[address][country]", country)
    data.append("properties[address][region]", region)
    data.append("properties[address][province]", province)
    data.append("properties[address][city]", city)
    data.append("properties[address][brgy]", brgy)
    // --- NetMetered and OwnUse ---
    data.append("properties[isNetMetered]", isNetMetered)
    data.append("properties[ownUse]", isOwnUse)
    // ---

    if (reCat == "Solar Energy") {
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
    if (reCat == "Wind Energy") {
      data.append("assessment[capacity]", wind.capacity)
      data.append("assessment[numberOfRotors]", wind.numberOfRotors)
      data.append("assessment[windUsage]", JSON.stringify(wind.windUsage))
      data.append("assessment[windTurbine]", JSON.stringify(wind.windTurbine))
      data.append("assessment[windTower]", JSON.stringify(wind.windTower))
      data.append("assessment[windSystemTypes]", JSON.stringify(wind.windSystemTypes))
      data.append("assessment[windSystemStatus]", JSON.stringify(wind.windSystemStatus))
    }
    if (reCat == "Biomass") {
      data.append("assessment[capacity]", biomass.capacity)
      data.append("assessment[source]", biomass.source)
      data.append("assessment[biomassUsage]", JSON.stringify(biomass.biomassUsage))
      data.append("assessment[biomassDigester]", JSON.stringify(biomass.biomassDigester))
      data.append("assessment[biomassMakeDigester]", JSON.stringify(biomass.biomassMakeDigester))
      data.append("assessment[biomassLoc]", JSON.stringify(biomass.biomassLoc))
      data.append("assessment[biomassSystemStatus]", JSON.stringify(biomass.biomassSystemStatus))
    }

    if (myUploads.length != 0) {
      for (const file of myUploads) {
        data.append("myUploads", file)
      }
    }

    if (canSave) {
      await updateRenergy(data)
    }
  }

  const onDeleteRenergyClicked = async () => {
    await deleteRenergy({ id: reItems.id })
  }

  const deleteImage = async (index) => {
    await deleteImageRenergy({ id: reItems.id, images: index })
  }

  const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
  const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

  const content = (
    <>
      <p className={errClass}>{errContent}</p>
      <Container maxWidth="sm" sx={{ bgcolor: 'primary' }}>
        <form onSubmit={e => e.preventDefault()}>
          <Box
            sx={{
              minHeight: "100vh",
              maxWidth: "100%",
              "& .MuiTextField-root": { my: 1 },
            }}
          >
            <Box sx={boxwrapstyle}>
              <Grid container>
                <Grid item xs>
                  <Typography component="h1" variant="h5" sx={{ color: 'white' }}>
                    Edit Inventory
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
                label="Owner/ Company/ Cooperative/ Association Name"
                id="ownerName"
                name="properties.ownerName"
                type="text"
                value={ownerName}
                onChange={onOwnerNameChanged}
              />
              <TextField
                fullWidth
                id="reCat"
                select
                name="properties.reCat"
                label="Select RE Category"
                value={reCat || ""}
                onChange={onReTypesChanged}
              >
                {Object.values(reCats).map((reCat, index) => (
                  <MenuItem key={index} value={reCat.contName}>
                    {reCat.contName}
                  </MenuItem>
                ))}
              </TextField>
              <FormControl fullWidth margin="normal">
                <FormLabel>Is net-metered?</FormLabel>
                <RadioGroup
                  row
                  value={isNetMetered}
                  onChange={e => setIsNetMetered(e.target.value)}
                  name="isNetMetered"
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <FormLabel>Own use?</FormLabel>
                <RadioGroup
                  row
                  value={isOwnUse}
                  onChange={e => setIsOwnUse(e.target.value)}
                  name="ownUse"
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
              <Box
                sx={{
                  display: "grid",
                  gap: 1,
                  gridTemplateColumns: "repeat(3, 1fr)",
                }}
              >
                <TextField
                  fullWidth
                  label="Longitude"
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
                  Select on Map
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
                id="brgy"
                name="properties.address.brgy"
                type="text"
                value={brgy}
                onChange={onBrgyChanged}
              />
              <TextField
                fullWidth
                id="user"
                select
                name="user"
                label="Assigned to:"
                value={userId || ""}
                onChange={onUserIdChanged}
              >
                {users.map((users) => (
                  <MenuItem key={users.id} value={users.id}>
                    {users.username}
                  </MenuItem>
                ))}
              </TextField>
              {reItems.images.length === 0 ? "" : <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                {reItems.images.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={`${baseUrl + image}?w=164&h=164&fit=crop&auto=format`}
                      srcSet={`${baseUrl + image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      alt={reItems.properties.reCat[0]}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      sx={{
                        background:
                          'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                          'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                      }}
                      position="top"
                      actionIcon={
                        <IconButton onClick={() => deleteImage(index)}
                        >
                          <DeleteOutlineIcon sx={{ color: 'white.main' }} />
                        </IconButton>
                      }
                      actionPosition="left"
                    />
                  </ImageListItem>
                ))}
              </ImageList>}
            </Box>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <MapContainer
                  style={{ height: "80vh" }}
                  center={[12.512797, 122.395164]}
                  zoom={5}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <HandleClickFindSelfMap />
                </MapContainer>
              </Box>
            </Modal>
            {reCat === null ? null : 
            reCat === 'Solar Energy' ? <EditSolar setEditSolar={setEditSolar} reItems={reItems} users={users} /> : 
            reCat === 'Wind Energy' ? <EditWind setEditWind={setEditWind} reItems={reItems} users={users} /> : 
            reCat === 'Biomass' ? <EditBiomass setEditBiomass={setEditBiomass} reItems={reItems} users={users} /> : ''}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
              }}
            >
              <Button
                variant="contained"
                color="success"
                sx={{ my: 1 }}
                disabled={!canSave}
                onClick={onSaveRenergyClicked}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ m: 1 }}
                onClick={onDeleteRenergyClicked}
              >
                Delete
              </Button>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
                sx={{ my: 1 }}
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

export default EditRenergyForm