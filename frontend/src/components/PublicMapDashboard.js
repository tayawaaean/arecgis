import React, { useEffect, useState } from 'react'
import useTitle from '../hooks/useTitle'
import { useNavigate, useLocation } from 'react-router-dom'
import { selectAllPublicInventories } from '../features/inventories/publicInventoriesApiSlice'
import { MapContainer, TileLayer, GeoJSON, ZoomControl, LayersControl, Marker, useMap, FeatureGroup, Circle, Popup } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import Control from './CustomControl'
import { Button, Modal, Drawer, Box, Checkbox, FormControlLabel, FormGroup, Stack, Typography, IconButton, Divider, CssBaseline, FormControl, InputLabel, Select, OutlinedInput, ListItemText, MenuItem, Grid, Paper, TextField, Tooltip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { SnackBar } from './SnackBar'
import {
    FilterList as FilterListIcon,
    Close as CloseIcon,
    ClearAll as ClearAllIcon,
    ListAlt as ListAltIcon,
    Home as HomeIcon,
    Circle as CircleIcon,
    TroubleshootSharp,
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { reCats } from '../config/reCats'
import L from 'leaflet'
import { rawSolarUsage, rawBiomassPriUsage, rawWindUsage, Status } from '../config/techAssesment'
import { modalStyle, scrollbarStyle } from '../config/style'
import { useGetPublicInventoriesQuery } from '../features/inventories/publicInventoriesApiSlice'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

const contNames = reCats.map((type) => type.contName)

const { BaseLayer } = LayersControl

// Map controller component to access map instance
const MapController = ({ position, setActive, setProject, setPosition }) => {
    const map = useMap()
    
    useEffect(() => {
        if (position) {
            const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
            const duration = prefersReducedMotion ? 0 : 3
            map.flyTo([...position].reverse(), 14, { duration })
        }
    }, [position, map])
    
    return null
}

const LeafletDraw = () => {
    const [mapLayers, setMapLayers] = useState([])
    const onCreated = (e) => {
        console.log(e)

        const { layerType, layer } = e
        if (layerType === "polygon") {
            const { _leaflet_id } = layer

            setMapLayers((layers) => [
                ...layers,
                { id: _leaflet_id, latlngs: layer.getLatLngs()[0] },
            ])
        }
    }
    const onEdited = (e) => {
        console.log(e)
        const {
            layers: { _layers },
        } = e

        Object.values(_layers).map(({ _leaflet_id, editing }) => {
            setMapLayers((layers) =>
                layers.map((l) =>
                    l.id === _leaflet_id
                        ? { ...l, latlngs: { ...editing.latlngs[0] } }
                        : l
                )
            )
        })
    }
    const onDeleted = (e) => {
        console.log(e)
        const {
            layers: { _layers },
        } = e

        Object.values(_layers).map(({ _leaflet_id }) => {
            setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id))
        })
    }

    return (
        <FeatureGroup>
            <EditControl
                position='topright'
                onEdited={onEdited}
                onCreated={onCreated}
                onDeleted={onDeleted}
                draw={{
                    rectangle: false
                }}
            />
        </FeatureGroup>
    )
}

const RElist = (props) => {
    const [project, setProject] = useState('')
    const [active, setActive] = useState(false)
    const [position, setPosition] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const inventories = useSelector(selectAllPublicInventories)
    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)
    const [REClass, setREClass] = useState("Non-Commercial")
    const handleREClass = (e) => setREClass(e.target.value)

    // Use displayData from parent component
    const displayInventories = props.displayData || inventories

    //counter
    const [solarStTotal, setSolarStTotal] = useState(0)
    const [solarPumpTotal, setSolarPumpTotal] = useState(0)
    const [solarPowerGenTotal, setSolarPowerGenTotal] = useState(0)

    const [solarStTotalCap, setSolarStTotalCap] = useState(0)
    const [solarPumpTotalCap, setSolarPumpTotalCap] = useState(0)
    const [solarPowerGenTotalCap, setSolarPowerGenTotalCap] = useState(0)

    const [solarStTotalUnit, setSolarStTotalUnit] = useState(0)
    const [solarPumpTotalUnit, setSolarPumpTotalUnit] = useState(0)
    const [solarPowerGenTotalUnit, setSolarPowerGenTotalUnit] = useState(0)

    const dateNow = new Date()
    const oneDay = 1000 * 60 * 60 * 24
    const sunHour = 4.7

    const getAddress = (params) => {
        const filtered = Object.values(params.row.properties?.address || {}).filter(function (x) { return x !== 'Philippines' })
        return `${filtered[0]}, ${filtered[1]}`
    }

    useEffect(() => {
        setPosition(null)
        props.setClearVal(false)
    }, [props.clearVal])

    const renderLocateButton = (params) => {
        return (
            <Button
                variant="contained"
                sx={{ backgroundColor: "primary" }}
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
            field: 'properties.reCat',
            headerName: 'RE Category',
            width: 150,
            valueGetter: (params) => params.row.properties?.reCat || 'N/A'
        },
        {
            field: 'properties.address',
            headerName: 'Address',
            width: 200,
            valueGetter: getAddress
        },
        {
            field: 'assessment.status',
            headerName: 'Status',
            width: 120,
            valueGetter: (params) => params.row.assessment?.status || 'N/A'
        },
        {
            field: 'assessment.solarUsage',
            headerName: 'Solar Usage',
            width: 150,
            valueGetter: (params) => params.row.assessment?.solarUsage || 'N/A'
        },
        {
            field: 'assessment.biomassPriUsage',
            headerName: 'Biomass Usage',
            width: 150,
            valueGetter: (params) => params.row.assessment?.biomassPriUsage || 'N/A'
        },
        {
            field: 'assessment.windUsage',
            headerName: 'Wind Usage',
            width: 150,
            valueGetter: (params) => params.row.assessment?.windUsage || 'N/A'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: renderLocateButton
        }
    ]

    // available when component nested inside MapContainer
    const fly = (params) => {
        setProject(params?.row)
        setOpenModal(false)
        const locate = params?.row?.coordinates
        setPosition(locate)
        // Note: map.flyTo will be handled by the parent component
        // This component just sets the position state
    }

    return (
        <>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...scrollbarStyle, ...modalStyle }}>
                    <FormControl variant="standard" sx={{ minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">Filter</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={REClass}
                            label="Filter"
                            onChange={handleREClass}
                        >
                            <MenuItem value={"Non-Commercial"}>Non-Commercial</MenuItem>
                            <MenuItem value={"Commercial"} >Commercial</MenuItem>
                            <MenuItem value={"gencompany"} >Generating Company</MenuItem>
                        </Select>
                    </FormControl>
                    <DataGrid
                        onStateChange={(state) => {
                            const solarSt = displayInventories.filter((inventory) => {
                                return inventory.properties?.reCat === 'Solar Energy' && inventory.assessment?.solarUsage === 'Solar Street Lights' && inventory.assessment?.status === REClass
                            })
                            const solarPump = displayInventories.filter((inventory) => {
                                return inventory.properties?.reCat === 'Solar Energy' && inventory.assessment?.solarUsage === 'Solar Pump' && inventory.assessment?.status === REClass
                            })
                            const solarPowerGen = displayInventories.filter((inventory) => {
                                return inventory.properties?.reCat === 'Solar Energy' && inventory.assessment?.solarUsage === 'Power Generation' && inventory.assessment?.status === REClass
                            })

                            const solarSttotal = solarSt.reduce((total, inventory) => total + (inventory.properties?.capacity || 0), 0)
                            const solarPumpTotal = solarPump.reduce((total, inventory) => total + (inventory.properties?.capacity || 0), 0)
                            const powerGenTotal = solarPowerGen.reduce((total, inventory) => total + (inventory.properties?.capacity || 0), 0)

                            const solarStCaptotal = solarSt.reduce((total, inventory) => total + (inventory.properties?.capacity || 0), 0)
                            const solarPumpCapTotal = solarPump.reduce((total, inventory) => total + (inventory.properties?.capacity || 0), 0)
                            const powerGenCapTotal = solarPowerGen.reduce((total, inventory) => total + (inventory.properties?.capacity || 0), 0)

                            const solarStUnitTotal = solarSt.length
                            const solarPumpUnits = solarPump.length
                            const rawSolarPowerGenUnits = solarPowerGen

                            setSolarStTotalUnit(solarStUnitTotal)
                            setSolarPowerGenTotalUnit(rawSolarPowerGenUnits.length)
                            setSolarPumpTotalUnit(solarPumpUnits.length)

                            setSolarStTotalCap(solarStCaptotal / 1000)
                            setSolarPowerGenTotalCap(powerGenCapTotal / 1000)
                            setSolarPumpTotalCap(solarPumpCapTotal / 1000)

                            setSolarStTotal(solarSttotal)
                            setSolarPowerGenTotal(powerGenTotal)
                            setSolarPumpTotal(solarPumpTotal)
                        }}
                        rows={displayInventories}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        density="compact"
                        pageSizeOptions={[100]}
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
        </>
    )
}

const PublicMapDashboard = () => {
    useTitle('ArecGIS | Map Dashboard')

    const [category, setCategory] = useState([])
    const [clearVal, setClearVal] = useState(false)
    const [project, setProject] = useState('')
    const [active, setActive] = useState(false)
    
    // Get data with proper error handling using RTK Query
    const { data: inventoriesData, isLoading, isError, error } = useGetPublicInventoriesQuery()
    
    // Ensure inventories is always an array
    const inventories = Array.isArray(inventoriesData) ? inventoriesData : []

    const navigate = useNavigate()
    const location = useLocation()
    const [position, setPosition] = useState(null)

    const [solarProvFilter, setSolarProvFilter] = useState([])
    const [bioProvFilter, setBioProvFilter] = useState([])
    const [windProvFilter, setWindProvFilter] = useState([])
    const [solarUsageFilter, setSolarUsageFilter] = useState([])
    const [statusFilter, setStatusFilter] = useState([])
    const [biomassUsageFilter, setBiomassUsageFilter] = useState([])
    const [windUsageFilter, setWindUsageFilter] = useState([])

    let solarEnergy = []
    let biomassEnergy = []
    let windEnergy = []

    const provinceRaw = inventories.map((inventory) => {
        if (inventory.properties?.reCat === 'Solar Energy') {
            solarEnergy = [...solarEnergy, inventory.properties.address?.city]
        }
        if (inventory.properties?.reCat === 'Biomass') {
            biomassEnergy = [...biomassEnergy, inventory.properties.address?.city]
        }
        if (inventory.properties?.reCat === 'Wind Energy') {
            windEnergy = [...windEnergy, inventory.properties.address?.city]
        }
    })

    const solarProvince = ([... new Set(solarEnergy)])
    const biomassProvince = ([... new Set(biomassEnergy)])
    const windProvince = ([... new Set(windEnergy)])

    const onStatusFilterChanged = (event) => {
        const {
            target: { value },
        } = event;
        setStatusFilter(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const onChangeSolarProv = (event) => {
        const {
            target: { value },
        } = event;
        setSolarProvFilter(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const onChangeBioProv = (event) => {
        const {
            target: { value },
        } = event;
        setBioProvFilter(
            typeof value === 'string' ? value.split(',') : value,
        );
    }
    
    const onChangeWindProv = (event) => {
        const {
            target: { value },
        } = event;
        setWindProvFilter(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const onSolarChecked = (event) => {
        const {
            target: { value },
        } = event;
        setSolarUsageFilter(
            typeof value === 'string' ? value.split(',') : value,
        );
    }
    
    const onBiomassChecked = (event) => {
        const {
            target: { value },
        } = event;
        setBiomassUsageFilter(
            typeof value === 'string' ? value.split(',') : value,
        );
    }
    
    const onWindChecked = (event) => {
        const {
            target: { value },
        } = event;
        setWindUsageFilter(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    useEffect(() => {
        reCats.map((type) => type.checked = false)
    }, [location, category])

    useEffect(() => {
        setCategory(reCats)
    }, [])

    const clearAll = () => {
        reCats.map((type) => type.checked = false)
        setClearVal(true)
        setFilters({ contNames: contNames })
        setCategory([...reCats])
        setPosition(null)
        setQuery("")
    }

    const [filters, setFilters] = useState({ contNames: [] })
    const [openDrawer, setDrawer] = useState(false)
    const [query, setQuery] = useState("")
    const [searchParam] = useState(["city", "province"])

    const handleDrawerOpen = () => {
        setDrawer(true)
    }
    
    const handleDrawerClose = () => {
        setDrawer(false)
    }

    const handleChange = (type, index) => (e) => {
        category[index].checked = !category[index].checked
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

    //geojson start
    const onEachRE = (feature, layer) => {
        // Set different styles for each energy type
        if (feature.properties?.reCat === 'Solar Energy') {
            layer.setStyle({ 
                radius: 8, 
                fillColor: '#FFBF00',
                color: '#FF8C00',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            })
        } else if (feature.properties?.reCat === 'Biomass') {
            layer.setStyle({ 
                radius: 8, 
                fillColor: '#8B4513',
                color: '#654321',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            })
        } else if (feature.properties?.reCat === 'Wind Energy') {
            layer.setStyle({ 
                radius: 8, 
                fillColor: '#87CEEB',
                color: '#4682B4',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            })
        } else if (feature.properties?.reCat === 'Hydropower') {
            layer.setStyle({ 
                radius: 8, 
                fillColor: '#1E90FF',
                color: '#000080',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            })
        } else {
            // Default style for unknown types
            layer.setStyle({ 
                radius: 6, 
                fillColor: '#808080',
                color: '#404040',
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.6
            })
        }

        // Bind popup with basic information
        if (feature.properties) {
            const popupContent = `
                <div style="min-width: 200px; padding: 8px;">
                    <h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">
                        ${feature.properties.reCat || 'Unknown Type'}
                    </h4>
                    <div style="font-size: 14px; line-height: 1.4;">
                        ${feature.properties.address ? `
                            <p style="margin: 4px 0;"><strong>📍 Location:</strong><br/>
                            ${feature.properties.address.city || ''}, ${feature.properties.address.province || ''}</p>
                        ` : ''}
                        ${feature.properties.capacity ? `
                            <p style="margin: 4px 0;"><strong>⚡ Capacity:</strong><br/>
                            ${feature.properties.capacity} kWp</p>
                        ` : ''}
                    </div>
                </div>
            `
            layer.bindPopup(popupContent, {
                maxWidth: 300
            })
        }
    }
    
    const pointToLayer = (feature, latlng) => {
        // Create custom markers with different colors and sizes
        let markerColor = '#808080' // default gray
        let markerSize = 8
        
        if (feature.properties?.reCat === 'Solar Energy') {
            markerColor = '#FFBF00'
            markerSize = 10
        } else if (feature.properties?.reCat === 'Biomass') {
            markerColor = '#8B4513'
            markerSize = 10
        } else if (feature.properties?.reCat === 'Wind Energy') {
            markerColor = '#87CEEB'
            markerSize = 10
        } else if (feature.properties?.reCat === 'Hydropower') {
            markerColor = '#1E90FF'
            markerSize = 10
        }
        
        return L.circleMarker(latlng, {
            radius: markerSize,
            fillColor: markerColor,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });
    }
    //geojson end
    
    const FilterRE = () => {
        return (
            <>
                <Tooltip title="Open map filters" placement="left-start" >
                    <button className="leaflet-control-layers controlStyle" aria-label="open map filters" onClick={handleDrawerOpen}>
                        <FilterListIcon fontSize="small" />
                    </button>
                </Tooltip>
            </>
        )
    }

    const HomeButton = () => {
        return (
            <>
                <Tooltip title="Go to home" placement="left-start">
                    <button className="leaflet-control-layers controlStyle" aria-label="go to home" onClick={() => navigate('/')}>
                        <HomeIcon fontSize="small" />
                    </button>
                </Tooltip>
            </>
        )
    }

    // Handle loading state
    if (isLoading) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    // Handle error state
    if (isError) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh',
                p: 3,
                textAlign: 'center'
            }}>
                <Typography variant="h4" color="error" gutterBottom>
                    🚨 Error Loading Map Data
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Error: {error?.message || 'Unknown error'}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Unable to load the map data. Please try refreshing the page or contact support if the problem persists.
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={() => window.location.reload()}
                    sx={{ mt: 2 }}
                >
                    🔄 Refresh Page
                </Button>
                <Button 
                    variant="outlined" 
                    onClick={() => navigate('/')}
                    sx={{ mt: 1 }}
                >
                    🏠 Go to Home
                </Button>
            </Box>
        )
    }

    // Render the map
    return (
        <>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 2, sm: 2, md: 4 }}>
                <Grid item md={12} xs={12}>
                    <MapContainer
                        style={{ height: "100vh" }}
                        center={[12.512797, 122.395164]} // Philippines center
                        zoom={5}
                        scrollWheelZoom={true}
                        zoomControl={false}
                        doubleClickZoom={false}
                    >
                        <MapController 
                            position={position}
                            setActive={setActive}
                            setProject={setProject}
                            setPosition={setPosition}
                        />
                        {position == null ? null :
                            <Marker position={[...position].reverse()}
                                eventHandlers={{
                                    click: () => {
                                        setActive(true)
                                    },
                                }}
                            >
                            </Marker>}
                        <LayersControl position="topleft">
                            <BaseLayer name="OpenStreetMap">
                                <TileLayer
                                    attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </BaseLayer>
                            <BaseLayer checked name="Esri ArcGIS World Imagery">
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

                        {/* Render inventory points */}
                        {inventories.map((inventory, index) => (
                            <GeoJSON
                                key={`${inventory._id || index}-${inventory.properties?.reCat}`}
                                data={inventory}
                                onEachFeature={onEachRE}
                                pointToLayer={pointToLayer}
                                eventHandlers={{
                                    click: () => {
                                        setActive(true)
                                        setProject(inventory)
                                        setPosition(inventory.geometry.coordinates)
                                    },
                                }}
                            />
                        ))}

                        <Control position="topright">
                            <FilterRE />
                        </Control>
                        <Control position="topright">
                            <RElist clearVal={clearVal} setClearVal={setClearVal} displayData={inventories} />
                        </Control>
                        <Control position="topright">
                            <HomeButton />
                        </Control>

                        <ZoomControl position="bottomright" />
                    </MapContainer>
                </Grid>
            </Grid>
            <SnackBar setActive={setActive} active={active} project={project} />
            <Dialog
                open={openDrawer}
                onClose={handleDrawerClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Not authorized"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please log in to access this feature.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDrawerClose}>Ok</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default PublicMapDashboard
