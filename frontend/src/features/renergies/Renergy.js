import React, { useEffect, useState, memo } from 'react'
import { useNavigate, useLocation  } from 'react-router-dom'
import { selectAllRenergies } from './renergiesApiSlice'
import { MapContainer, TileLayer, GeoJSON, ZoomControl, LayersControl, Marker, useMap } from 'react-leaflet'
import Control from 'react-leaflet-custom-control'
import { Button, Modal, Drawer, Box, Checkbox, FormControlLabel, FormGroup} from '@mui/material'
import { reCats } from '../../config/reCats'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { SnackBar } from '../../components/SnackBar'
import {
    Add as AddIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    FilterAlt as FilterAltIcon,
    ListAlt as ListAltIcon,
} from '@mui/icons-material'
import { useSelector } from 'react-redux'


// import { selectRenergyById } from './renergiesApiSlice'
const contNames = reCats.map((type)=>type.contName)

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  height: 500, 
  width: '90vw',
}


const { BaseLayer } = LayersControl

const RElist = () => {
  const [project, setProject]= useState('')
  const [active, setActive] = useState(false)
  const [position, setPosition] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const energies = useSelector(selectAllRenergies)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)
  const getAddress = (params) => {
    return Object.values(params.row.properties.address).filter(function (x) { return x !== 'Philippines' })
  }
  const renderLocateButton = (params) => {
    
    return (
      <Button
        variant="contained"
        color="success"
        size="small"
        style={{ margin: 'auto' }}
        onClick={() => { fly(params) }}
      >
        Locate
      </Button>
    )
  }
  const columns = [
    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      width: 130,
      sortable: false,
      renderCell: renderLocateButton,
      disableClickEventBubbling: true,
    },
    {
      field: 'ownerName',
      headerName: 'Owner',
      width: 150,
      valueGetter: (energies) => energies.row.properties.ownerName,
      disableClickEventBubbling: true,
    },
    {
      field: 'reCat',
      headerName: 'RE TYPE',
      width: 130,
      valueGetter: (energies) => energies.row.properties.reCat,
      disableClickEventBubbling: true,
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      width: 100,
      valueGetter: (energies) => energies.row.assessment.capacity,
      disableClickEventBubbling: true,
    },
    {
      field: 'address',
      headerName: 'Location',
      width: 400,
      valueGetter: getAddress,
      disableClickEventBubbling: true,
    },
    {
      field: 'username',
      headerName: 'Uploader',
      width: 130,
      disableClickEventBubbling: true,
    },

  ]
  const map = useMap(); // available when component nested inside MapContainer
  const fly = (params) => {
    setProject(params?.row)
    setOpenModal(false)
    const locate = params?.row?.coordinates
    setPosition(locate)
    map.flyTo([...locate].reverse(), 14, { duration: 3 })
  }

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <DataGrid
            rows={energies}
            columns={columns}
            initialSnackBar={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[100]}
            disableColumnSelector
            disableColumnFilter
            disableDensitySelector
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                csvOptions: { disableToolbarButton: true },
                printOptions: { disableToolbarButton: true },
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            disableRowSelectionOnClick
          />
        </Box>
      </Modal>
      <SnackBar setActive={setActive} active={active} project={project} />
      {/* <Button variant="contained" color="white" sx={{ color: 'primary.main' }} onClick={fly}>
        <NearMeIcon />
      </Button> */}
      <Button variant="contained" color="white" sx={{ color: 'primary.main' }} onClick={handleOpenModal}>
        <ListAltIcon />
      </Button>
      {position == null ? null : 
        <Marker position={[...position].reverse()}
          eventHandlers={{
            click: () => {
              setActive(true)
              
              // setSnackBar({ openSnackbar: true })
            },
          }}
        >
        </Marker>}
      
    </>
  )
}

const Renergy = () => {
  const [project, setProject]= useState('')
  const [active, setActive] = useState(false)
  const energies = useSelector(selectAllRenergies)
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    reCats.map((type)=>type.checked = false)
  }, [location])
  const onAddClicked = () => navigate("/dashboard/renergies/new")

  const [filters, setFilters] = useState({ contNames })
  const [openDrawer, setDrawer] = useState(false)

  const handleDrawerOpen = () => {
    setDrawer(true)
  }
  const handleDrawerClose = () => {
    setDrawer(false)
  }

  const handleChange = (type, index) => (e) => {
    reCats[index].checked = !reCats[index].checked
    if (filters.contNames.includes(type)) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        contNames: prevFilters.contNames.filter((f) => f !== type),
      }))
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        contNames: [...prevFilters.contNames, type],
      }))
    }
  }
  // drawer end

  //geojson start
  const onEachRE = (feature, layer) => {
    if (feature.properties) {
      layer.bindPopup(
        feature.properties.reCat[0]
        // popupContent
      )
    }
  }
  //geojson end

  if (energies) {
    
      // const handleEdit = () => navigate(`/dashboard/renergies/${renergyId}`)
    return (
      <>
        <MapContainer
          style={{ height: "100vh" }}
          center={[12.512797, 122.395164]}
          zoom={5}
          scrollWheelZoom={true}
          zoomControl={false}
          doubleClickZoom={false}
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



          {energies.map((energy, index) => {
            if (!filters.contNames.includes(energy.properties.reCat[0])) {
              return (
                <GeoJSON
                  key={index}
                  data={energy}
                  onEachFeature={onEachRE}
                  eventHandlers={{
                    click: () => {
                      setActive(true)
                      setProject(energy)
                    },
                  }}
                />
              )
            }
            return null
          })}
          <Control position="topright">
            <RElist />
          </Control>
          <Control prepend position="topright">
            <Button
              variant="contained"
              color= "white"
              onClick={handleDrawerOpen}
              sx={{ color: 'primary.main'}}
            >
              <FilterAltIcon />
            </Button>
            <Drawer anchor={"right"} open={openDrawer} onClose={handleDrawerClose}>
              <Box sx={{ width: 250 }} role="presentation">
                <FormGroup>
                  {reCats.map((type, index) => (
                    <FormControlLabel
                      key={index}
                      sx={{ ml: 2 }}
                      control={
                        <Checkbox
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<CheckCircleOutlineIcon />}
                          onChange={handleChange(type.contName, index)}
                          checked={type.checked}
                        />
                      }
                      label={type.contName}
                    />
                  ))}
                </FormGroup>
              </Box>
            </Drawer>
          </Control>

          <ZoomControl position="bottomright" />
          {/* This control will be below the default zoom control. Note the wrapping Stack component */}
          <Control position="topright">
            <Button variant="contained" color= "white" sx={{ color: 'primary.main'}} onClick={onAddClicked}>
              <AddIcon />
            </Button>
          </Control>

          {/* <Control position="topright">
            <Button variant="contained" color= "white" sx={{ color: 'primary.main'}} onClick={handleOpenModal}>
              <ListAltIcon/>
            </Button>
          </Control> */}
          <SnackBar setActive={setActive} active={active} project={project} />
          {/* {energy == null ? null : (

          )} */}
        </MapContainer>
      </>
    )
  } else return null
}
const memoizedRenergy = memo(Renergy)
export default memoizedRenergy