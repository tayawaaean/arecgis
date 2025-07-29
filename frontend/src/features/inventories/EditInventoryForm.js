import React, { useState, useEffect } from 'react'
import {
  Box,
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
  Snackbar,
  Alert as MuiAlert,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  Tooltip,
  Backdrop,
  CircularProgress,
} from '@mui/material'
import {
  Upload as UploadFileIcon,
  MyLocation as MyLocationIcon,
  DeleteOutline as DeleteOutlineIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material'
import { boxstyle } from '../../config/style'
import { reCats } from '../../config/reCats'
import { useDeleteImageInventoryMutation, useUpdateInventoryMutation, useDeleteInventoryMutation } from './inventoriesApiSlice'
import { useNavigate } from 'react-router-dom'
import { EditSolar } from '../categories/EditSolar'
import { EditWind } from '../categories/EditWind'
import { EditBiomass } from '../categories/EditBiomass'
import useAuth from '../../hooks/useAuth'
import { baseUrl } from '../../config/baseUrl'
import { Classification, mannerOfAcquisition } from '../../config/techAssesment'
import { Coordinates } from '../../components/Coordinates'
import { EditHydropower } from '../categories/EditHydropower'
const EditInventoryForm = ({ reItems, allUsers }) => {
  const { username, isManager, isAdmin, } = useAuth()
  const GEOCODE_URL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location='

  const [updateInventory, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateInventoryMutation()

  const [deleteImageInventory, {
    isLoading: isImageLoading,
    isSuccess: isImageDelSuccess,
    isError: isImageError,
    error: imageError,
  }] = useDeleteImageInventoryMutation()

  const [deleteInventory, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delerror
  }] = useDeleteInventoryMutation()

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)

  const navigate = useNavigate()
  const [errContent, setErrContent] = useState(null)
  const [ownerName, setOwnerName] = useState(reItems?.properties.ownerName)
  const [country, setCountry] = useState(reItems?.properties?.address?.country)
  const [region, setRegion] = useState(reItems?.properties?.address?.region)
  const [province, setProvince] = useState(reItems?.properties?.address?.province)
  const [city, setCity] = useState(reItems?.properties?.address?.city)
  const [brgy, setBrgy] = useState(reItems?.properties?.address?.brgy)
  const [type, setType] = useState(reItems?.type)
  const [coordinates, setCoordinates] = useState(reItems?.coordinates)
  const [lat, setLat] = useState(reItems?.coordinates[1])
  const [lng, setLng] = useState(reItems?.coordinates[0])
  const [reClass, setReClass] = useState([reItems?.properties?.reClass])
  const [reCat, setReCat] = useState([reItems?.properties?.reCat])
  const [acquisition, setAcquisition] = useState([reItems?.properties?.acquisition])
  const [yearEst, setYearEst] = useState(reItems?.properties?.yearEst)

  const [myUploads, setmyUploads] = useState('')
  const [filesCount, setFilesCount] = useState(null)
  const [userId, setUserId] = useState(reItems?.user)
  const [solar, setEditSolar] = useState([])
  const [wind, setEditWind] = useState([])
  const [biomass, setEditBiomass] = useState([])
  const [hydropower, setEditHydropower] = useState([])

  const [delAlert, setDelAlert] = useState({bool: false, value: null});
  const [loading, setLoading] = useState(false)

  const openDelAlert = (index) => {
    setDelAlert({bool: true, value: index })

  }

  const closeDelAlert = () => {
    setDelAlert({bool: false, value: null})
  }
  
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  })
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
      setUserId("")
      navigate(0)
    }

  }, [isSuccess, navigate])

  useEffect(() => {

    if (isLoading ||isImageLoading) {
      setLoading(true)
    }

  }, [isLoading, isImageLoading])

  useEffect(() => {

    if (isDelSuccess) {
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
      setUserId("")
      navigate(-1)
    }

  }, [isDelSuccess, navigate])

  useEffect(() => {

    if (isImageDelSuccess) {
      navigate(0)
    }
  }, [isImageDelSuccess, navigate])

  useEffect(() => {
    if (delerror || error) {
      setErrContent((error?.data?.message || delerror?.data?.message))
      setLoading(false)
    }
  }, [delerror, error])

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

  
 
  const canSave = [type, ownerName, userId].every(Boolean) && !isLoading
  
  const onSaveInventoryClicked = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('id', reItems.id)
    data.append('user', userId)
    data.append('type', type)
    data.append('coordinates[]', lng)
    data.append('coordinates[]', lat)
    data.append('properties[ownerName]', ownerName)
    data.append('properties[reCat]', reCat)
    data.append('properties[reClass]', reClass)
    data.append('properties[yearEst]', yearEst)
    data.append('properties[acquisition]', acquisition)
    data.append('properties[address][country]', country)
    data.append('properties[address][region]', region)
    data.append('properties[address][province]', province)
    data.append('properties[address][city]', city)
    data.append('properties[address][brgy]', brgy)
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
        data.append("assessment[capacity]", solar.capacity)
        data.append("assessment[flowRate]", solar.flowRate)
        data.append("assessment[serviceArea]", solar.serviceArea)
      }
      if (solar?.solarUsage === "Power Generation") {
        data.append("assessment[solarSystemTypes]", solar.solarSystemTypes)
        data.append("assessment[capacity]", solar.capacity)
      }

      data.append("assessment[status]", solar.status)
      data.append("assessment[remarks]", solar.remarks)
      data.append("assessment[solarUsage]", solar.solarUsage)
    }
    if (reCat == "Wind Energy") {
      if (wind?.windUsage === 'Water pump') {
        data.append("assessment[serviceArea]", wind.serviceArea)
      }
      data.append("assessment[capacity]", wind.capacity)
      data.append("assessment[windUsage]", wind.windUsage)
      data.append("assessment[status]", wind.status)
      data.append("assessment[remarks]", wind.remarks)
    }
    if (reCat == "Biomass") {
      if (biomass?.biomassPriUsage === 'Biogas' || biomass?.biomassPriUsage === 'Gasification') {
        data.append("assessment[bioUsage]", biomass.bioUsage)
      }
      data.append("assessment[capacity]", biomass.capacity)
      data.append("assessment[biomassPriUsage]", biomass.biomassPriUsage)
      data.append("assessment[status]", biomass.status)
      data.append("assessment[remarks]", biomass.remarks)
    }
    if (reCat == "Hydropower") {
      data.append("assessment[capacity]", hydropower.capacity)
      data.append("assessment[status]", hydropower.status)
      data.append("assessment[remarks]", hydropower.remarks)
    }

    if (myUploads.length != 0) {
      for (const file of myUploads) {
        data.append('myUploads', file)
      }
    }

    if (canSave) {
      await updateInventory(data)
      // await addNewInventory({ type, coordinates, myUploads, properties: { user: userId, ownerName, reCat, address:{country, region, province, city, brgy} } })
    }
  }

  // const onSaveInventoryClicked = async (e) => {
  //     if (canSave) {
  //         await updateInventory({ id: reItems.id, user: userId, type, ownerName })
  //     }
  // }

  const onDeleteInventoryClicked = async () => {  
    await deleteInventory({ id: [reItems.id] })
  }

  const deleteImage = async (index) => {
    await deleteImageInventory({ id: reItems.id, images: index })
    // await deleteInventory({ image: reItems.id })
  }



  // const validTypeClass = !type ? 'form__input--incomplete' : ''
  // const validOwnerNameClass = !ownerName ? 'form__input--incomplete' : ''

  const content = (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container  sx={{maxWidth:{lg:'md'}}} >
        <form onSubmit={e => e.preventDefault()}>
          <Box
            sx={{
              minHeight: '100vh',
              maxWidth: '100%',
              '& .MuiTextField-root': { my: 1 },
            }}
          >
            <Box
              sx={boxstyle}
            >
              {errContent !== null ?
                <Snackbar open={true} autoHideDuration={6000} onClose={() => setErrContent(null)} >
                  <Alert onClose={() => setErrContent(null)} severity='warning' sx={{ width: '100%' }}>
                    {errContent}
                  </Alert>
                </Snackbar>
                : null}

              <Grid container>
                <Grid item xs>
                  <Typography component='h1' variant='h5'>
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
                size="small"
                id="reCat"
                select
                disabled
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
                name="properties.yearEst"
                label="Year Established"
                type="number"
                value={yearEst}
                onChange={onYearEstChanged}
              />
              {isManager || isAdmin ?
                <TextField
                  fullWidth
                  id='user'
                  select
                  label='Assigned to:'
                  value={userId || ''}
                  onChange={onUserIdChanged}
                >
                  {allUsers.map((users) => (
                    <MenuItem key={users.id} value={users.id}>
                      {users.username}
                    </MenuItem>
                  ))}
                </TextField> : ''
              }
            </Box>
            


            {/* <img
              src={`data:${reItems.img.contentType};base64, ${reItems.img.data.toString('base64')}`}
              // alt={item.title}
              alt={reItems.properties.reCat[0]}
              loading='lazy'
            /> */}
            {reItems.images.length == 0 ? '' : <ImageList sx={{ height: 250 }} cols={3} rowHeight={164}>
              {reItems.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img 
                    // src={`data:${image.contentType};base64, ${image.data.toString('base64')}`}
                    src={`${baseUrl + image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    loading='lazy'
                    // srcSet={`${baseUrl + image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    // alt={item.title}
                    alt={reItems.properties.reCat}
                  />
                  <ImageListItemBar
                    sx={{
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                    }}
                    position='top'
                    actionIcon={
                      // <IconButton onClick={() => deleteImage(index)}>
                      <IconButton onClick={()=>openDelAlert(index)}>
                        <DeleteOutlineIcon sx={{ color: 'white.main' }} />
                      </IconButton>
                    }
                    actionPosition='left'
                  />
                </ImageListItem>
              ))}
            </ImageList>}
            <Dialog
        open={delAlert.bool}
        onClose={closeDelAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
              <DialogTitle id="alert-dialog-title">
                {"Delete warning"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this {delAlert.value===undefined ? "inventory" : "image"}?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDelAlert}>Cancel</Button>
                <Button variant="contained" color="error" onClick={delAlert.value===undefined ? onDeleteInventoryClicked : ()=>deleteImage(delAlert.value)}>Yes</Button>
              </DialogActions>
            </Dialog>
            <Box
              sx={boxstyle}
            >
              <Typography sx={{ fontStyle: 'italic' }} component='h1' variant='subtitle2'>
                Coordinates
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                }}
              >
                <TextField
                  fullWidth
                  label='Longitude'
                  id='lng'
                  name='lng'
                  type='tel'
                  value={lng}
                  onChange={onLngChanged}
                />
                <TextField
                  fullWidth
                  label='Latitude'
                  id='lat'
                  name='lat'
                  type='tel'
                  value={lat}
                  onChange={onLatChanged}
                />
                <Button
                  component='label'
                  variant='outlined'
                  startIcon={<MyLocationIcon />}
                  sx={{
                    my: 1,
                  }}
                  size='small'
                  onClick={handleOpenModal}
                >
                  Select on Map
                </Button>
              </Box>
              <Coordinates openModal={openModal} setOpenModal={setOpenModal} reverseGeoCoding={reverseGeoCoding} setLat={setLat} setLng={setLng} coordinates={coordinates} />

            </Box>

            <Box
              sx={boxstyle}
            >
              <Typography sx={{ fontStyle: 'italic' }} component='h1' variant='subtitle2'>
                Address
              </Typography>
              <TextField
                fullWidth
                label='Country'
                id='country'
                name='properties.address.country'
                type='text'
                value={country}
                onChange={onCountryChanged}
              />
              <TextField
                fullWidth
                label='Region'
                id='region'
                name='properties.address.region'
                type='text'
                value={region}
                onChange={onRegionChanged}
              />
              <TextField
                fullWidth
                label='Province'
                id='province'
                name='properties.address.province'
                type='text'
                value={province}
                onChange={onProvinceChanged}
              />
              <TextField
                fullWidth
                label='City/Municipality'
                id='city'
                name='properties.address.city'
                type='text'
                value={city}
                onChange={onCityChanged}
              />
              <TextField
                fullWidth
                label='Barangay'
                id='lng'
                name='properties.address.brgy'
                type='text'
                value={brgy}
                onChange={onBrgyChanged}
              />
            </Box>

            {reCat === null ? null :
              reCat == 'Solar Energy' ? <EditSolar setEditSolar={setEditSolar} reItems={reItems} allUsers={allUsers} /> :
                reCat == 'Wind Energy' ? <EditWind setEditWind={setEditWind} reItems={reItems} allUsers={allUsers} /> :
                  reCat == 'Biomass' ? <EditBiomass setEditBiomass={setEditBiomass} reItems={reItems} allUsers={allUsers} /> :
                    reCat == 'Hydropower' ? <EditHydropower setEditHydropower={setEditHydropower} reItems={reItems} allUsers={allUsers} /> : ''}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row-reverse',
              }}
            >

              <Button
                variant='contained'
                color="success"
                sx={{ my: 1 }}
                disabled={!canSave}
                onClick={onSaveInventoryClicked}
              >
                Update
              </Button>
              <Button
                variant='contained'
                sx={{ m: 1, backgroundColor: 'custom.error' }}
                // onClick={onDeleteInventoryClicked}
                onClick={()=>openDelAlert()}
              >
                Delete
              </Button>
              {reItems.images.length===3 ? null : <Tooltip title="3 maximum images">
              <Button
                component='label'
                variant='contained'
                startIcon={<UploadFileIcon />}
                sx={{ my: 1, backgroundColor: 'primary.main' }}
              >
                  Add Images {filesCount>=4 ? "| no. of file exceeded" : filesCount ?"| "+filesCount+" selected": null}
                <input
                  type='file'
                  id='myUploads'
                  name='myUploads'
                  accept='image/*'
                  multiple
                  hidden
                  onChange={onmyUploadsChanged}
                />
              </Button>
              </Tooltip>}

            </Box>
          </Box>

          <input
            className={`form__input}`}
            id='coordinates'
            name='coordinates'
            value={coordinates}
            // onChange={onCoordinatesChanged}
            type='hidden'
          />
        </form>
      </Container>

    </>
  )
  return content
}

export default EditInventoryForm