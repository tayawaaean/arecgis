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
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Input,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material'
import {
  Upload as UploadFileIcon,
  MyLocation as MyLocationIcon,
  DeleteOutline as DeleteOutlineIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material'
import { boxstyle } from '../../config/style'
import { reCats } from '../../config/reCats'
import { useDeleteImageBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation } from './blogsApiSlice'
import { useNavigate } from 'react-router-dom'
import { EditSolar } from '../categories/EditSolar'
import { EditWind } from '../categories/EditWind'
import { EditBiomass } from '../categories/EditBiomass'
import useAuth from '../../hooks/useAuth'
import { baseUrl } from '../../config/baseUrl'
import { Classification, mannerOfAcquisition } from '../../config/techAssesment'
import { Coordinates } from '../../components/Coordinates'
const EditBlogForm = ({ reItems, allUsers }) => {
  const { username, isManager, isAdmin, } = useAuth()
  const GEOCODE_URL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location='

  const [updateBlog, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateBlogMutation()

  const [deleteImageBlog, {
    isLoading: isImageLoading,
    isSuccess: isImageDelSuccess,
    isError: isImageError,
    error: imageError,
  }] = useDeleteImageBlogMutation()

  const [deleteBlog, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delerror
  }] = useDeleteBlogMutation()

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)

  const navigate = useNavigate()
  const [errContent, setErrContent] = useState(null)
  const [ownerName, setOwnerName] = useState(reItems.properties.ownerName)
  const [country, setCountry] = useState(reItems.properties.address.country)
  const [region, setRegion] = useState(reItems.properties.address.region)
  const [province, setProvince] = useState(reItems.properties.address.province)
  const [city, setCity] = useState(reItems.properties.address.city)
  const [brgy, setBrgy] = useState(reItems.properties.address.brgy)
  const [type, setType] = useState(reItems.type)
  const [coordinates, setCoordinates] = useState(reItems.coordinates)
  const [lat, setLat] = useState(reItems.coordinates[1])
  const [lng, setLng] = useState(reItems.coordinates[0])

  const [reClass, setReClass] = useState([reItems.properties.reClass])
  const [reCat, setReCat] = useState([reItems.properties.reCat])
  const [acquisition, setAcquisition] = useState(JSON.parse(reItems.properties.acquisition))
  const [yearEst, setYearEst] = useState(reItems.properties.yearEst)

  const [myUploads, setmyUploads] = useState('')
  const [userId, setUserId] = useState(reItems.user)
  const [solar, setEditSolar] = useState([])
  const [wind, setEditWind] = useState([])
  const [biomass, setEditBiomass] = useState([])

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
      setType([])
      setReCat([])
      setUserId("")
      navigate("/dashboard/renergies/list")
    }

  }, [isDelSuccess, navigate])

  useEffect(() => {

    if (isImageDelSuccess) {
      navigate(0)
    }
  }, [ isImageDelSuccess, navigate])

  useEffect(() => {
    if (delerror || error) {
      setErrContent((error?.data?.message || delerror?.data?.message))
    }
  }, [delerror, error])

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
  const onReClassChanged = (e) => setReClass(e.target.value)
  const onReCatChanged = (e) => setReCat(e.target.value)

  const onAquisitionChanged = (index) => (e) => {
    if (mannerOfAcquisition[index].name === 'Other' && e.target.value !== 'on' && e.target.value !== '') {
      setAcquisition({ ...acquisition, index: index, otherVal: e.target.value })
    }
    else if (index === acquisition?.index) {
      setAcquisition({ index: '', value: '', otherVal: '' })
    }
    else {
      setAcquisition({ index: index, value: mannerOfAcquisition[index].name, otherVal: '' })
    }
  }
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

  const onSaveBlogClicked = async (e) => {
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
    data.append('properties[acquisition]', JSON.stringify(acquisition))
    data.append('properties[address][country]', country)
    data.append('properties[address][region]', region)
    data.append('properties[address][province]', province)
    data.append('properties[address][city]', city)
    data.append('properties[address][brgy]', brgy)
    if (reCat == 'Solar Energy') {
      data.append('assessment[capacity]', solar.capacity)
      data.append('assessment[numbers]', solar.numbers)
      data.append('assessment[solarUsage]', JSON.stringify(solar.solarUsage))
      data.append('assessment[solarSystemTypes]', JSON.stringify(solar.solarSystemTypes))
      data.append('assessment[solarModuleType]', JSON.stringify(solar.solarModuleType))
      data.append('assessment[solarBatTypes]', JSON.stringify(solar.solarBatTypes))
      data.append('assessment[solarMountingLoc]', JSON.stringify(solar.solarMountingLoc))
      data.append('assessment[statusOfSolarPanel]', JSON.stringify(solar.statusOfSolarPanel))
      data.append('assessment[statusOfChargeController]', JSON.stringify(solar.statusOfChargeController))
      data.append('assessment[statusOfBattery]', JSON.stringify(solar.statusOfBattery))
      data.append('assessment[statusOfWirings]', JSON.stringify(solar.statusOfWirings))
    }
    if (reCat == 'Wind Energy') {
      data.append('assessment[capacity]', wind.capacity)
      data.append('assessment[numberOfRotors]', wind.numberOfRotors)
      data.append('assessment[windUsage]', JSON.stringify(wind.windUsage))
      data.append('assessment[windTurbine]', JSON.stringify(wind.windTurbine))
      data.append('assessment[windTower]', JSON.stringify(wind.windTower))
      data.append('assessment[windSystemTypes]', JSON.stringify(wind.windSystemTypes))
      data.append('assessment[windSystemStatus]', JSON.stringify(wind.windSystemStatus))
    }
    if (reCat == 'Biomass') {
      data.append('assessment[capacity]', biomass.capacity)
      data.append('assessment[source]', biomass.source)
      data.append('assessment[biomassUsage]', JSON.stringify(biomass.biomassUsage))
      data.append('assessment[biomassDigester]', JSON.stringify(biomass.biomassDigester))
      data.append('assessment[biomassMakeDigester]', JSON.stringify(biomass.biomassMakeDigester))
      data.append('assessment[biomassLoc]', JSON.stringify(biomass.biomassLoc))
      data.append('assessment[biomassSystemStatus]', JSON.stringify(biomass.biomassSystemStatus))
    }

    if (myUploads.length != 0) {
      for (const file of myUploads) {
        data.append('myUploads', file)
      }
    }

    if (canSave) {
      await updateBlog(data)
      // await addNewBlog({ type, coordinates, myUploads, properties: { user: userId, ownerName, reCat, address:{country, region, province, city, brgy} } })
    }
  }

  // const onSaveBlogClicked = async (e) => {
  //     if (canSave) {
  //         await updateBlog({ id: reItems.id, user: userId, type, ownerName })
  //     }
  // }

  const onDeleteBlogClicked = async () => {
    await deleteBlog({ id: reItems.id })
  }

  const deleteImage = async (index) => {
    await deleteImageBlog({ id: reItems.id, images: index })
    // await deleteBlog({ image: reItems.id })
  }



  // const validTypeClass = !type ? 'form__input--incomplete' : ''
  // const validOwnerNameClass = !ownerName ? 'form__input--incomplete' : ''

  const content = (
    <>

      <Container maxWidth='sm'>

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
                    Edit Blog
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => navigate('/dashboard')}>
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label='Owner/ Company/ Cooperative/ Association Name'
                id='ownerName'
                name='properties.ownerName'
                type='text'
                value={ownerName}
                onChange={onOwnerNameChanged}
              />
              <TextField
                fullWidth
                id='reCat'
                select
                name='properties.reCat'
                label='Select RE Category'
                value={reCat || ''}
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
                id='reclass'
                select
                label='Select RE Classification:'
                value={reClass || ''}
                onChange={onReClassChanged}
              >
                {Classification.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                id='yearEst'
                name='properties.yearEst'
                label='Year Established'
                type='number'
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
            <Box
              sx={boxstyle}
            >
              <Typography sx={{ fontStyle: 'italic' }} component='h1' variant='subtitle2'>
                Manner of Aquisition
              </Typography>
              {mannerOfAcquisition.map((type, index) => (
                <FormGroup key={index}>
                  <FormControlLabel
                    key={index}
                    sx={{ ml: 2 }}
                    control={
                      <Checkbox
                        onChange={onAquisitionChanged(index)}
                        checked={type.id === acquisition?.index}
                      />
                    }
                    label={type.name === 'Other' ? <Input
                      onChange={onAquisitionChanged(index)}
                      disabled={type.id !== acquisition?.index}
                      value={acquisition?.otherVal}
                      startAdornment={<InputAdornment position='start'>Other:</InputAdornment>}
                    /> : type.name}
                  />

                </FormGroup>
              ))}
            </Box>

            {reItems.images.length == 0 ? '' : <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
              {reItems.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={`${baseUrl + image}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${baseUrl + image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    // alt={item.title}
                    alt={reItems.properties.reCat[0]}
                    loading='lazy'
                  />
                  <ImageListItemBar
                    sx={{
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                    }}
                    position='top'
                    actionIcon={
                      <IconButton onClick={() => deleteImage(index)}
                      >
                        <DeleteOutlineIcon sx={{ color: 'white.main' }} />
                      </IconButton>
                    }
                    actionPosition='left'
                  />
                </ImageListItem>
              ))}
            </ImageList>}

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
                  label='Longtitude'
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
              <Coordinates openModal={openModal} setOpenModal={setOpenModal} reverseGeoCoding={reverseGeoCoding} setLat={setLat} setLng={setLng} />

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
                  reCat == 'Biomass' ? <EditBiomass setEditBiomass={setEditBiomass} reItems={reItems} allUsers={allUsers} /> : ''}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row-reverse',
              }}
            >

              <Button
                variant='contained'
                sx = {{ my: 1, backgroundColor: "primary"}}
                disabled={!canSave}
                onClick={onSaveBlogClicked}
              >
                Save
              </Button>
              <Button
                variant='contained'
                sx={{ m: 1, backgroundColor: 'custom.error'  }}
                onClick={onDeleteBlogClicked}
              >
                Delete
              </Button>
              <Button
                component='label'
                variant='outlined'
                startIcon={<UploadFileIcon />}
                sx={{ my: 1 }}
              >
                Add Images
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

export default EditBlogForm