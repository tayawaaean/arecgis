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
    
    // Powerlines data state
    const [powerlinesData, setPowerlinesData] = useState(null)
    const [powerlinesError, setPowerlinesError] = useState(false)
    const [region2Data, setRegion2Data] = useState(null)
    const [region2Error, setRegion2Error] = useState(false)
    const [carData, setCarData] = useState(null)
    const [carError, setCarError] = useState(false)
    const [region3Data, setRegion3Data] = useState(null)
    const [region3Error, setRegion3Error] = useState(false)
    const [ncrData, setNcrData] = useState(null)
    const [ncrError, setNcrError] = useState(false)
    const [region4aData, setRegion4aData] = useState(null)
    const [region4aError, setRegion4aError] = useState(false)
    const [region5Data, setRegion5Data] = useState(null)
    const [region5Error, setRegion5Error] = useState(false)
    const [region6Data, setRegion6Data] = useState(null)
    const [region6Error, setRegion6Error] = useState(false)
    const [region7Data, setRegion7Data] = useState(null)
    const [region7Error, setRegion7Error] = useState(false)
    const [region8Data, setRegion8Data] = useState(null)
    const [region8Error, setRegion8Error] = useState(false)
    const [region9Data, setRegion9Data] = useState(null)
    const [region9Error, setRegion9Error] = useState(false)
    const [region10Data, setRegion10Data] = useState(null)
    const [region10Error, setRegion10Error] = useState(false)
    const [region11Data, setRegion11Data] = useState(null)
    const [region11Error, setRegion11Error] = useState(false)
    const [region12Data, setRegion12Data] = useState(null)
    const [region12Error, setRegion12Error] = useState(false)
    const [region13Data, setRegion13Data] = useState(null)
    const [region13Error, setRegion13Error] = useState(false)
    const [barmmData, setBarmmData] = useState(null)
    const [barmmError, setBarmmError] = useState(false)
    const [mimaropaData, setMimaropaData] = useState(null)
    const [mimaropaError, setMimaropaError] = useState(false)
    const [powerplantsData, setPowerplantsData] = useState(null)
    const [powerplantsError, setPowerplantsError] = useState(false)
    const [substationsData, setSubstationsData] = useState(null)
    const [substationsError, setSubstationsError] = useState(false)
    const [showSubstations, setShowSubstations] = useState(true)

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

    // Load powerlines data
    useEffect(() => {
        const loadPowerlines = async () => {
            try {
                // Load region1
                const response1 = await fetch('/region1.geojson');
                if (response1.ok) {
                    const data1 = await response1.json();
                    setPowerlinesData(data1);
                } else {
                    console.warn('Could not load region1 powerlines data');
                    setPowerlinesError(true);
                }
                
                // Load region2
                const response2 = await fetch('/region2.geojson');
                if (response2.ok) {
                    const data2 = await response2.json();
                    setRegion2Data(data2);
                } else {
                    console.warn('Could not load region2 powerlines data');
                    setRegion2Error(true);
                }
                
                // Load car.geojson
                const response3 = await fetch('/car.geojson');
                if (response3.ok) {
                    const data3 = await response3.json();
                    setCarData(data3);
                } else {
                    console.warn('Could not load car powerlines data');
                    setCarError(true);
                }
                
                // Load region3.geojson
                const response4 = await fetch('/region3.geojson');
                if (response4.ok) {
                    const data4 = await response4.json();
                    setRegion3Data(data4);
                } else {
                    console.warn('Could not load region3 powerlines data');
                    setRegion3Error(true);
                }
                
                // Load ncr.geojson
                const response5 = await fetch('/ncr.geojson');
                if (response5.ok) {
                    const data5 = await response5.json();
                    setNcrData(data5);
                } else {
                    console.warn('Could not load NCR powerlines data');
                    setNcrError(true);
                }
                
                // Load region4a.geojson
                const response6 = await fetch('/region4a.geojson');
                if (response6.ok) {
                    const data6 = await response6.json();
                    setRegion4aData(data6);
                } else {
                    console.warn('Could not load region4a powerlines data');
                    setRegion4aError(true);
                }
                
                // Load region5.geojson
                const response7 = await fetch('/region5.geojson');
                if (response7.ok) {
                    const data7 = await response7.json();
                    setRegion5Data(data7);
                } else {
                    console.warn('Could not load region5 powerlines data');
                    setRegion5Error(true);
                }
                
                // Load region6.geojson
                const response8 = await fetch('/region6.geojson');
                if (response8.ok) {
                    const data8 = await response8.json();
                    setRegion6Data(data8);
                } else {
                    console.warn('Could not load region6 powerlines data');
                    setRegion6Error(true);
                }
                
                // Load region7.geojson
                const response9 = await fetch('/region7.geojson');
                if (response9.ok) {
                    const data9 = await response9.json();
                    setRegion7Data(data9);
                } else {
                    console.warn('Could not load region7 powerlines data');
                    setRegion7Error(true);
                }
                
                // Load region8.geojson
                const response10 = await fetch('/region8.geojson');
                if (response10.ok) {
                    const data10 = await response10.json();
                    setRegion8Data(data10);
                } else {
                    console.warn('Could not load region8 powerlines data');
                    setRegion8Error(true);
                }
                
                // Load region9.geojson
                const response11 = await fetch('/region9.geojson');
                if (response11.ok) {
                    const data11 = await response11.json();
                    setRegion9Data(data11);
                } else {
                    console.warn('Could not load region9 powerlines data');
                    setRegion9Error(true);
                }
                
                // Load region10.geojson
                const response12 = await fetch('/region10.geojson');
                if (response12.ok) {
                    const data12 = await response12.json();
                    setRegion10Data(data12);
                } else {
                    console.warn('Could not load region10 powerlines data');
                    setRegion10Error(true);
                }
                
                // Load region11.geojson
                const response13 = await fetch('/region11.geojson');
                if (response13.ok) {
                    const data13 = await response13.json();
                    setRegion11Data(data13);
                } else {
                    console.warn('Could not load region11 powerlines data');
                    setRegion11Error(true);
                }
                
                // Load region12.geojson
                const response14 = await fetch('/region12.geojson');
                if (response14.ok) {
                    const data14 = await response14.json();
                    setRegion12Data(data14);
                } else {
                    console.warn('Could not load region12 powerlines data');
                    setRegion12Error(true);
                }
                
                // Load region13.geojson
                const response15 = await fetch('/region13.geojson');
                if (response15.ok) {
                    const data15 = await response15.json();
                    setRegion13Data(data15);
                } else {
                    console.warn('Could not load region13 powerlines data');
                    setRegion13Error(true);
                }
                
                // Load barmm.geojson
                const response16 = await fetch('/barmm.geojson');
                if (response16.ok) {
                    const data16 = await response16.json();
                    setBarmmData(data16);
                } else {
                    console.warn('Could not load BARMM powerlines data');
                    setBarmmError(true);
                }
                
                // Load mimaropa.geojson
                const response17 = await fetch('/mimaropa.geojson');
                if (response17.ok) {
                    const data17 = await response17.json();
                    setMimaropaData(data17);
                } else {
                    console.warn('Could not load MIMAROPA powerlines data');
                    setMimaropaError(true);
                }
                
                // Load powerplants.geojson
                const response18 = await fetch('/powerplants.geojson');
                if (response18.ok) {
                    const data18 = await response18.json();
                    setPowerplantsData(data18);
                } else {
                    console.warn('Could not load powerplants data');
                    setPowerplantsError(true);
                }

                // Load substations.geojson
                const response19 = await fetch('/substations.geojson');
                if (response19.ok) {
                    const data19 = await response19.json();
                    setSubstationsData(data19);
                } else {
                    console.warn('Could not load substations data');
                    setSubstationsError(true);
                }
            } catch (error) {
                console.warn('Error loading powerlines data:', error);
                setPowerlinesError(true);
                setRegion2Error(true);
                setCarError(true);
                setRegion3Error(true);
                setNcrError(true);
                setRegion4aError(true);
                setRegion5Error(true);
                setRegion6Error(true);
                setRegion7Error(true);
                setRegion8Error(true);
                setRegion9Error(true);
                setRegion10Error(true);
                setRegion11Error(true);
                setRegion12Error(true);
                setRegion13Error(true);
                setBarmmError(true);
                setMimaropaError(true);
                setPowerplantsError(true);
                setSubstationsError(true);
            }
        };
        
        loadPowerlines();
    }, []);

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
    
    const onEachPowerline = (feature, layer) => {
        // Style powerlines based on voltage
        const voltage = feature.properties?.voltage;
        let color = '#FF6B35'; // Default color
        let weight = 2; // Default weight
        
        if (voltage) {
            const voltageNum = parseInt(voltage);
            if (voltageNum >= 500000) {
                color = '#FF0000'; // Red for ultra-high voltage (500kV+)
                weight = 4;
            } else if (voltageNum >= 230000) {
                color = '#FF6B35'; // Orange for high voltage (230kV)
                weight = 3;
            } else if (voltageNum >= 69000) {
                color = '#FFA500'; // Orange for medium voltage (69kV)
                weight = 2;
            } else {
                color = '#FFFF00'; // Yellow for low voltage
                weight = 1;
            }
        }
        
        layer.setStyle({
            color: color,
            weight: weight,
            opacity: 0.8,
            fillOpacity: 0.3
        });
        
        // Add popup with powerline information
        if (feature.properties) {
            const popupContent = `
                <div style="min-width: 200px;">
                    <h4 style="margin: 0 0 8px 0; color: #333;">${feature.properties.name || 'Power Line'}</h4>
                    ${feature.properties.voltage ? `<p><strong>Voltage:</strong> ${parseInt(feature.properties.voltage).toLocaleString()} V</p>` : ''}
                    ${feature.properties.operator ? `<p><strong>Operator:</strong> ${feature.properties.operator}</p>` : ''}
                    ${feature.properties.circuits ? `<p><strong>Circuits:</strong> ${feature.properties.circuits}</p>` : ''}
                    ${feature.properties.frequency ? `<p><strong>Frequency:</strong> ${feature.properties.frequency} Hz</p>` : ''}
                </div>
            `;
            layer.bindPopup(popupContent);
        }
        };

    // Function to handle power plant styling and popups
    const onEachPowerplant = (feature, layer) => {
        // Style power plants based on source type
        const source = feature.properties?.plant?.source || feature.properties?.['plant:source'];
        let color = '#FF6B35'; // Default color
        let radius = 8; // Smaller default radius
        let weight = 2; // Slightly thinner border
        
        if (source) {
            const sourceLower = source.toLowerCase();
            if (sourceLower.includes('hydro') || sourceLower.includes('water')) {
                color = '#2196F3'; // Blue for hydro
                radius = 12;
                weight = 3;
            } else if (sourceLower.includes('solar')) {
                color = '#FFC107'; // Yellow for solar
                radius = 10;
                weight = 2;
            } else if (sourceLower.includes('wind')) {
                color = '#4CAF50'; // Green for wind
                radius = 10;
                weight = 2;
            } else if (sourceLower.includes('coal')) {
                color = '#795548'; // Brown for coal
                radius = 12;
                weight = 3;
            } else if (sourceLower.includes('gas') || sourceLower.includes('natural')) {
                color = '#FF9800'; // Orange for gas
                radius = 10;
                weight = 2;
            } else if (sourceLower.includes('diesel')) {
                color = '#F44336'; // Red for diesel
                radius = 9;
                weight = 2;
            } else if (sourceLower.includes('nuclear')) {
                color = '#9C27B0'; // Purple for nuclear
                radius = 14;
                weight = 3;
            } else if (sourceLower.includes('geothermal')) {
                color = '#E91E63'; // Pink for geothermal
                radius = 10;
                weight = 2;
            } else if (sourceLower.includes('biomass') || sourceLower.includes('bio')) {
                color = '#8BC34A'; // Light green for biomass
                radius = 9;
                weight = 2;
            } else if (sourceLower.includes('oil')) {
                color = '#607D8B'; // Blue grey for oil
                radius = 9;
                weight = 2;
            } else if (sourceLower.includes('waste')) {
                color = '#795548'; // Brown for waste
                radius = 8;
                weight = 2;
            } else if (sourceLower.includes('battery')) {
                color = '#00BCD4'; // Cyan for battery storage
                radius = 9;
                weight = 2;
            }
        }
        
        layer.setStyle({
            color: '#FFFFFF', // White border for contrast
            fillColor: color,
            weight: weight,
            opacity: 1,
            fillOpacity: 0.85,
            radius: radius
        });
        
        // Add popup with power plant information
        if (feature.properties) {
            const name = feature.properties.name || 'Unnamed Power Plant';
            const source = feature.properties.plant?.source || feature.properties['plant:source'] || 'Unknown';
            const method = feature.properties.plant?.method || feature.properties['plant:method'] || 'Unknown';
            const output = feature.properties.plant?.output?.electricity || feature.properties['plant:output:electricity'] || 'Unknown';
            const operator = feature.properties.operator || 'Unknown';
            const startDate = feature.properties.start_date || feature.properties['start_date'] || 'Unknown';
            
            // Per-feature OSM timestamp if available
            const rawTimestamp = feature.properties['@timestamp'];
            let formattedTimestamp = '';
            if (rawTimestamp) {
                const d = new Date(rawTimestamp);
                formattedTimestamp = isNaN(d) ? String(rawTimestamp) : d.toLocaleString();
            }

            const popupContent = `
                <div style="min-width: 250px;">
                    <h4 style="margin: 0 0 8px 0; color: #333;">${name}</h4>
                    <p><strong>Source:</strong> ${source}</p>
                    <p><strong>Method:</strong> ${method}</p>
                    ${output !== 'Unknown' ? `<p><strong>Output:</strong> ${output}</p>` : ''}
                    ${operator !== 'Unknown' ? `<p><strong>Operator:</strong> ${operator}</p>` : ''}
                    ${startDate !== 'Unknown' ? `<p><strong>Start Date:</strong> ${startDate}</p>` : ''}
                    ${formattedTimestamp ? `<p style="margin-top:8px;color:#666;font-size:12px;"><em>OSM timestamp: ${formattedTimestamp}</em></p>` : ''}
                </div>
            `;
            layer.bindPopup(popupContent);
        }
    };

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
    
    const SubstationsToggle = () => (
        <Tooltip title={substationsError ? "Substations data unavailable" : "Toggle substations"} placement="left-start">
            <button 
                className={`leaflet-control-layers controlStyle substations-toggle ${showSubstations ? 'active' : ''}`} 
                aria-label="toggle substations" 
                onClick={() => setShowSubstations(!showSubstations)}
                disabled={substationsError}
                style={{ 
                    backgroundColor: substationsError ? '#ccc' : (showSubstations ? '#3F51B5' : '#f5f5f5'),
                    color: substationsError ? '#666' : (showSubstations ? 'white' : '#333'),
                    cursor: substationsError ? 'not-allowed' : 'pointer'
                }}
            >
                {substationsError ? '❌' : '🏬'}
            </button>
        </Tooltip>
    )
    
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
                            
                            {/* Powerlines Overlay - Region 1 */}
                            <LayersControl.Overlay name="Powerlines - Region 1" checked={!powerlinesError}>
                                {powerlinesData && !powerlinesError && (
                                    <GeoJSON
                                        data={powerlinesData}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#FF6B35',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Region1 powerlines GeoJSON error:', e);
                                                setPowerlinesError(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - Region 2 */}
                            <LayersControl.Overlay name="Powerlines - Region 2" checked={!region2Error}>
                                {region2Data && !region2Error && (
                                    <GeoJSON
                                        data={region2Data}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#4CAF50',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Region2 powerlines GeoJSON error:', e);
                                                setRegion2Error(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - Car */}
                            <LayersControl.Overlay name="Powerlines - Car" checked={!carError}>
                                {carData && !carError && (
                                    <GeoJSON
                                        data={carData}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#9C27B0',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Car powerlines GeoJSON error:', e);
                                                setCarError(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - Region 3 */}
                            <LayersControl.Overlay name="Powerlines - Region 3" checked={!region3Error}>
                                {region3Data && !region3Error && (
                                    <GeoJSON
                                        data={region3Data}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#FF5722',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Region3 powerlines GeoJSON error:', e);
                                                setRegion3Error(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - NCR */}
                            <LayersControl.Overlay name="Powerlines - NCR" checked={!ncrError}>
                                {ncrData && !ncrError && (
                                    <GeoJSON
                                        data={ncrData}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#3F51B5',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('NCR powerlines GeoJSON error:', e);
                                                setNcrError(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - Region 4A */}
                            <LayersControl.Overlay name="Powerlines - Region 4A" checked={!region4aError}>
                                {region4aData && !region4aError && (
                                    <GeoJSON
                                        data={region4aData}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#E91E63',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Region4a powerlines GeoJSON error:', e);
                                                setRegion4aError(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - Region 5 */}
                            <LayersControl.Overlay name="Powerlines - Region 5" checked={!region5Error}>
                                {region5Data && !region5Error && (
                                    <GeoJSON
                                        data={region5Data}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#795548',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Region5 powerlines GeoJSON error:', e);
                                                setRegion5Error(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - Region 6 */}
                            <LayersControl.Overlay name="Powerlines - Region 6" checked={!region6Error}>
                                {region6Data && !region6Error && (
                                    <GeoJSON
                                        data={region6Data}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#607D8B',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Region6 powerlines GeoJSON error:', e);
                                                setRegion6Error(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - Region 7 */}
                            <LayersControl.Overlay name="Powerlines - Region 7" checked={!region7Error}>
                                {region7Data && !region7Error && (
                                    <GeoJSON
                                        data={region7Data}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#00BCD4',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Region7 powerlines GeoJSON error:', e);
                                                setRegion7Error(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - Region 8 */}
                            <LayersControl.Overlay name="Powerlines - Region 8" checked={!region8Error}>
                                {region8Data && !region8Error && (
                                    <GeoJSON
                                        data={region8Data}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#8BC34A',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Region8 powerlines GeoJSON error:', e);
                                                setRegion8Error(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - Region 9 */}
                            <LayersControl.Overlay name="Powerlines - Region 9" checked={!region9Error}>
                                {region9Data && !region9Error && (
                                    <GeoJSON
                                        data={region9Data}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#FF9800',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Region9 powerlines GeoJSON error:', e);
                                                setRegion9Error(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - Region 10 */}
                            <LayersControl.Overlay name="Powerlines - Region 10" checked={!region10Error}>
                                {region10Data && !region10Error && (
                                    <GeoJSON
                                        data={region10Data}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#9C27B0',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Region10 powerlines GeoJSON error:', e);
                                                setRegion10Error(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - Region 11 */}
                            <LayersControl.Overlay name="Powerlines - Region 11" checked={!region11Error}>
                                {region11Data && !region11Error && (
                                    <GeoJSON
                                        data={region11Data}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#F44336',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Region11 powerlines GeoJSON error:', e);
                                                setRegion11Error(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - Region 12 */}
                            <LayersControl.Overlay name="Powerlines - Region 12" checked={!region12Error}>
                                {region12Data && !region12Error && (
                                    <GeoJSON
                                        data={region12Data}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#673AB7',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Region12 powerlines GeoJSON error:', e);
                                                setRegion12Error(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - Region 13 */}
                            <LayersControl.Overlay name="Powerlines - Region 13" checked={!region13Error}>
                                {region13Data && !region13Error && (
                                    <GeoJSON
                                        data={region13Data}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#009688',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Region13 powerlines GeoJSON error:', e);
                                                setRegion13Error(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - BARMM */}
                            <LayersControl.Overlay name="Powerlines - BARMM" checked={!barmmError}>
                                {barmmData && !barmmError && (
                                    <GeoJSON
                                        data={barmmData}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#FFC107',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('BARMM powerlines GeoJSON error:', e);
                                                setBarmmError(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Powerlines Overlay - MIMAROPA */}
                            <LayersControl.Overlay name="Powerlines - MIMAROPA" checked={!mimaropaError}>
                                {mimaropaData && !mimaropaError && (
                                    <GeoJSON
                                        data={mimaropaData}
                                        onEachFeature={onEachPowerline}
                                        style={{
                                            color: '#00BCD4',
                                            weight: 2,
                                            opacity: 0.8
                                        }}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('MIMAROPA powerlines GeoJSON error:', e);
                                                setMimaropaError(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
                            
                            {/* Power Plants Overlay */}
                            <LayersControl.Overlay name="Power Plants" checked={!powerplantsError}>
                                {powerplantsData && !powerplantsError && (
                                    <GeoJSON
                                        data={powerplantsData}
                                        onEachFeature={onEachPowerplant}
                                        pointToLayer={(feature, latlng) => L.circleMarker(latlng, {})}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Power plants GeoJSON error:', e);
                                                setPowerplantsError(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>

                            {/* Substations Overlay */}
                            <LayersControl.Overlay name="Substations" checked={!substationsError}>
                                {substationsData && !substationsError && (
                                    <GeoJSON
                                        data={substationsData}
                                        onEachFeature={(feature, layer) => {
                                            const voltage = feature.properties?.voltage || feature.properties?.['substation:voltage'];
                                            const name = feature.properties?.name || 'Substation';
                                            const popupContent = `
                                                <div style=\"min-width: 220px;\">\n                                                  <h4 style=\"margin:0 0 8px 0;color:#333;\">${name}</h4>\n                                                  ${voltage ? `<p><strong>Voltage:</strong> ${voltage}</p>` : ''}\n                                                  ${feature.properties?.operator ? `<p><strong>Operator:</strong> ${feature.properties.operator}</p>` : ''}\n                                                </div>
                                            `;
                                            layer.bindPopup(popupContent);
                                        }}
                                        pointToLayer={(feature, latlng) => L.marker(latlng, {
                                            icon: L.divIcon({
                                                className: 'substation-box',
                                                iconSize: [12, 12],
                                                iconAnchor: [6, 6],
                                                html: '<div class="substation-box-inner"></div>'
                                            })
                                        })}
                                        eventHandlers={{
                                            error: (e) => {
                                                console.error('Substations GeoJSON error:', e);
                                                setSubstationsError(true);
                                            }
                                        }}
                                    />
                                )}
                            </LayersControl.Overlay>
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
                            <SubstationsToggle />
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
