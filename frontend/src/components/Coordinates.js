import 'leaflet-geosearch/dist/geosearch.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import Control from "./CustomControl"
import { FadeLoader } from "react-spinners"
import PropTypes from "prop-types"
import L from 'leaflet'
import {
    MapContainer,
    TileLayer,
    Marker,
    LayersControl,
    ZoomControl,
    useMap,
} from "react-leaflet"
import {
    Box,
    Button,
    TextField,
    MenuItem,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    styled,
    InputAdornment,
    Stack,
    Link,
    Alert,
    Collapse,
} from "@mui/material"
import {
    Place as PlaceIcon,
    Close as CloseIcon,
    MyLocation as MyLocationIcon,
} from "@mui/icons-material"
import { useEffect, useMemo, useState } from "react"
import { useMapEvents } from "react-leaflet"

// Fix Leaflet marker icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
const { BaseLayer } = LayersControl
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
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
 
const SearchField = (props) => {

    const provider = new OpenStreetMapProvider()

  
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'button',
      showMarker: false,
      showPopup: false,
    //   results,

    });

  
    const map = useMap();
    useEffect(() => {
      map.addControl(searchControl);
      return () => map.removeControl(searchControl);
    }, []);
    map.on('geosearch/showlocation', (e) => {
        // Convert to array format for consistency
        props.setPosition([e.marker._latlng.lat, e.marker._latlng.lng])
        props.reverseGeoCoding(e.marker._latlng)
    })

    return null;
  };

export const Coordinates = (props) => {
    
    const MarkLocation = (props) => {

        const fly = () => {
            map.locate()
            props.setLoading(true)

        }
        const map = useMapEvents({
            locationfound(e) {
                props.setLoading(false)
                
                // Validate coordinates before using them
                if (e.latlng && typeof e.latlng.lat === 'number' && typeof e.latlng.lng === 'number' && 
                    !isNaN(e.latlng.lat) && !isNaN(e.latlng.lng)) {
                    
                    console.log('Location found with valid coordinates:', e.latlng);
                    map.flyTo(e.latlng, 18)
                    
                    // Convert to array format for consistency
                    const newPosition = [e.latlng.lat, e.latlng.lng];
                    safeSetPosition(newPosition)
                    
                    // Call reverseGeoCoding with validated coordinates
                    props.reverseGeoCoding(e.latlng)
                } else {
                    console.error('Invalid coordinates received from location:', e.latlng);
                    props.setLoading(false);
                }
            },
            locationerror(e) {
                console.error('Location error:', e);
                props.setLoading(false);
            }
        })
        return (
            <>
                <button className="leaflet-control-layers controlStyle" aria-label="center map to my location" onClick={fly}>
                    <MyLocationIcon fontSize="small"/>
                </button>
            </>
        )
    }

    const ClickLocation = (props) => {

        const tap = () => {
            const center = map.getCenter()
            
            // Validate center coordinates before using them
            if (center && typeof center.lat === 'number' && typeof center.lng === 'number' && 
                !isNaN(center.lat) && !isNaN(center.lng)) {
                
                console.log('Setting position at map center:', center);
                // Convert to array format for consistency
                const newPosition = [center.lat, center.lng];
                safeSetPosition(newPosition)
                props.reverseGeoCoding(center)
            } else {
                console.error('Invalid center coordinates:', center);
            }
        }
        
        const map = useMapEvents({
            click(e) {
                console.log('Map clicked at:', e.latlng);
                
                // Validate clicked coordinates
                if (e.latlng && typeof e.latlng.lat === 'number' && typeof e.latlng.lng === 'number' && 
                    !isNaN(e.latlng.lat) && !isNaN(e.latlng.lng)) {
                    
                    console.log('Setting position from map click:', e.latlng);
                    // Convert to array format for consistency
                    const newPosition = [e.latlng.lat, e.latlng.lng];
                    safeSetPosition(newPosition)
                    
                    // Call reverseGeoCoding with clicked coordinates
                    props.reverseGeoCoding(e.latlng)
                } else {
                    console.error('Invalid coordinates from map click:', e.latlng);
                }
            }
        })

        
        return (
            <>
                <button className="leaflet-control-layers controlStyle" aria-label="set marker at map center" onClick={tap}>
                    <PlaceIcon fontSize="small"/>
                </button>
            </>
        )
    }
    
    const handleCloseModal = () => {
        // Ensure parent state updates with current position before close
        if (position && Array.isArray(position) && position.length === 2) {
            let latlng;
            if (Array.isArray(position)) {
                // If position is an array [lat, lng], convert to {lat, lng} object
                latlng = { lat: position[0], lng: position[1] };
            } else if (position.lat !== undefined && position.lng !== undefined) {
                // If position is already a {lat, lng} object
                latlng = position;
            } else {
                // Fallback: try to extract from position object
                latlng = { lat: position.lat || position[1], lng: position.lng || position[0] };
            }
            
            // Ensure we have valid coordinates before calling reverseGeoCoding
            if (latlng.lat !== undefined && latlng.lng !== undefined && 
                typeof latlng.lat === 'number' && typeof latlng.lng === 'number' &&
                !isNaN(latlng.lat) && !isNaN(latlng.lng)) {
                console.log('Calling reverseGeoCoding with valid coordinates:', latlng);
                props.reverseGeoCoding(latlng);
            } else {
                console.error('Invalid coordinates in handleCloseModal:', latlng);
            }
        } else {
            console.log('No valid position to save in handleCloseModal:', position);
        }
        props.setOpenModal(false)
    }
    const [position, setPosition] = useState(() => {
        let initialPos = null;
        if (props.coordinates && Array.isArray(props.coordinates) && props.coordinates.length === 2) {
            const lat = props.coordinates[1];
            const lng = props.coordinates[0];
            if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
                initialPos = [lat, lng];
            }
        }
        console.log('Initial position state:', initialPos);
        return initialPos;
    })

    // Safe setPosition function that validates coordinates
    const safeSetPosition = (newPosition) => {
        console.log('safeSetPosition called with:', newPosition);
        if (newPosition && Array.isArray(newPosition) && newPosition.length === 2) {
            const lat = newPosition[0];
            const lng = newPosition[1];
            if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
                console.log('Setting valid position:', newPosition);
                setPosition(newPosition);
            } else {
                console.error('Invalid position coordinates:', newPosition);
            }
        } else {
            console.error('Invalid position format:', newPosition);
        }
    }
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    // Sync position state with updated coordinates from props, but only when not dragging
    useEffect(() => {
        console.log('Coordinates prop changed:', props.coordinates);
        console.log('reverseGeoCoding function available:', !!props.reverseGeoCoding);
        console.log('Is currently dragging:', isDragging);
        
        // Don't override position if user is currently dragging or if modal is open
        if (isDragging || props.openModal) {
            console.log('Skipping position update - user is dragging or modal is open');
            return;
        }
        
        if (props.coordinates && Array.isArray(props.coordinates) && props.coordinates.length === 2) {
            const newPosition = [props.coordinates[1], props.coordinates[0]];
            console.log('Updating position from props:', newPosition);
            console.log('Setting position state to:', newPosition);
            setPosition(newPosition);
        }
    }, [props.coordinates, props.reverseGeoCoding, isDragging]);
    //conversion state----start
    const [showConvert, setShowConvert] = useState('none')
    const [labelConvert, setLabelConvert] = useState('Other Format')
    const [ddmLatValue, setDDMLatValue] = useState({ pos: 'N', deg: '', decmin: '' })
    const [ddmLngValue, setDDMLngValue] = useState({ pos: 'E', deg: '', decmin: '' })

    const onShowConvertChange = () => {
       if (showConvert === 'none'){
        setShowConvert('block')
        setLabelConvert('Hide')
       }else{
        setShowConvert('none')
        setLabelConvert('Other Format')
       }
    }

    const onDDMLatPosChange = (e) => {
        setDDMLatValue({ ...ddmLatValue, pos: e.target.value })
    }
    const onDDMLatDegChange = (e) => {
        setDDMLatValue({ ...ddmLatValue, deg: parseFloat(e.target.value) })
    }
    const onDDMLatDecMinsChange = (e) => {
        setDDMLatValue({ ...ddmLatValue, decmin: parseFloat(e.target.value) })
    }

    const onDDMLngPosChange = (e) => {
        setDDMLngValue({ ...ddmLngValue, pos: e.target.value })
    }
    const onDDMLngDegChange = (e) => {
        setDDMLngValue({ ...ddmLngValue, deg: parseFloat(e.target.value) })
    }
    const onDDMLngDecMinsChange = (e) => {
        setDDMLngValue({ ...ddmLngValue, decmin: parseFloat(e.target.value) })
    }

    const convert = (e) => {
        const lat = ddmLatValue?.pos === 'N' ? parseFloat(ddmLatValue?.deg + (ddmLatValue?.decmin / 60)) : parseFloat(-(ddmLatValue?.deg + (ddmLatValue?.decmin / 60)));
        const lng = ddmLngValue?.pos === 'E' ? parseFloat(ddmLngValue?.deg + (ddmLngValue?.decmin / 60)) : parseFloat(-(ddmLngValue?.deg + (ddmLngValue?.decmin / 60)));
        
        // Validate coordinates before setting them
        if (!isNaN(lat) && !isNaN(lng)) {
            props.setLat(lat);
            props.setLng(lng);
            
            // Keep position as array format for consistency
            const newPosition = [lng, lat];
            safeSetPosition(newPosition);
            
            props.reverseGeoCoding({ lat, lng });
        } else {
            console.error('Invalid coordinates from conversion:', { lat, lng });
        }
    } 

    //conversion state----end

    const markerEventHandler = useMemo(
        () => ({
            dragstart(e) {
                console.log('Marker drag started');
                setIsDragging(true);
            },
            drag(e) {
                console.log('Marker dragging...');
            },
            dragend(e) {
                const newPosition = e.target.getLatLng();
                console.log('Marker dragged to:', newPosition);
                // Keep position as array format for consistency
                safeSetPosition([newPosition.lat, newPosition.lng]);
                if (props.reverseGeoCoding) {
                    props.reverseGeoCoding(newPosition);
                } else {
                    console.error('reverseGeoCoding function is not available');
                }
                // Keep dragging state true for a short time to prevent immediate override
                setTimeout(() => setIsDragging(false), 100);
            },
        }),
        [props.reverseGeoCoding]
    )

    // Alternative event handler without useMemo to ensure it's always available
    const simpleMarkerEventHandler = {
        dragstart(e) {
            console.log('Simple marker drag started');
            setIsDragging(true);
        },
        drag(e) {
            console.log('Simple marker dragging...');
        },
        dragend(e) {
            const newPosition = e.target.getLatLng();
            console.log('Simple marker dragged to:', newPosition);
            safeSetPosition([newPosition.lat, newPosition.lng]);
            if (props.reverseGeoCoding) {
                props.reverseGeoCoding(newPosition);
            }
            // Keep dragging state true for a short time to prevent immediate override
            setTimeout(() => setIsDragging(false), 100);
        },
    };

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false);
                setOpen(true)
            }, 10000);
        }
    }, [loading]);

    // Do not resync to external coordinates while editing to avoid reverting
    // const Eme = () => {
    //     const varss = 
    //     console.log(varss)
    // }

    return (
        <>
            <Box
            >
                <Link onClick={onShowConvertChange} component="button" underline="none">{labelConvert}</Link>
                {/* <Button onClick={onShowConvertChange} ></Button> */}
                <Box sx={{display: showConvert}}
                >
                    <Stack direction="row" alignItems="center" gap={1} sx={{ display: 'flex' }}>
                        <TextField
                            sx={{ width: '150px' }}
                            size="small"
                            id="latValue"
                            select
                            value={ddmLatValue?.pos || ""}
                            onChange={onDDMLatPosChange}
                        >
                            <MenuItem value={"N"}>N</MenuItem>
                            <MenuItem value={"S"}>S</MenuItem>
                        </TextField>

                        <TextField
                            size="small"
                            fullWidth
                            label="Degrees"
                            id="deg"
                            name="deg"
                            type="tel"
                            value={ddmLatValue?.deg}
                            onChange={onDDMLatDegChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">&#176;</InputAdornment>,
                            }}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            label="Decimal Minutes"
                            id="latDecMins"
                            name="latDecMins"
                            type="tel"
                            value={ddmLatValue?.decmin}
                            onChange={onDDMLatDecMinsChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">"</InputAdornment>,
                            }}
                        />
                    </Stack>
                    <Stack direction="row" alignItems="center" gap={1} sx={{ display: 'flex' }}>
                        <TextField
                            sx={{ width: '150px' }}
                            size="small"
                            id="lngValue"
                            select
                            value={ddmLngValue?.pos || ""}
                            onChange={onDDMLngPosChange}
                        >
                            <MenuItem value={"W"}>W</MenuItem>
                            <MenuItem value={"E"}>E</MenuItem>
                        </TextField>

                        <TextField
                            size="small"
                            fullWidth
                            label="Degrees"
                            id="deg"
                            name="deg"
                            type="tel"
                            value={ddmLngValue?.deg}
                            onChange={onDDMLngDegChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">&#176;</InputAdornment>,
                            }}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            label="Decimal Minutes"
                            id="lngDecMins"
                            name="lngDecMins"
                            type="tel"
                            value={ddmLngValue?.decmin}
                            onChange={onDDMLngDecMinsChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">"</InputAdornment>,
                            }}
                        />
                    </Stack>
                    <Button
                        component="label"
                        variant="contained"
                        sx={{
                            my: 1,
                        }}
                        size="small"
                        onClick={() => convert()}
                    >
                        Convert
                    </Button>
                </Box>
            </Box>
            <BootstrapDialog
                onClose={handleCloseModal}
                aria-labelledby="customized-dialog-title"
                open={props.openModal}
                fullWidth
                maxWidth={"md"}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseModal}>
                    Select Location
                </BootstrapDialogTitle>
                <DialogContent dividers >
                    <Collapse in={open}>
                        <Alert severity="error" onClose={() => { setOpen(false)}}>
                            Location not found — please try again.
                        </Alert>
                    </Collapse>
                    <MapContainer
                        style={{ height: "50vh", width: "100%" }}
                        center={position && Array.isArray(position) && position.length === 2 && 
                                typeof position[0] === 'number' && typeof position[1] === 'number' && 
                                !isNaN(position[0]) && !isNaN(position[1]) ? position : [12.512797, 122.395164]}
                        zoom={position && Array.isArray(position) && position.length === 2 ? 13 : 5}
                        scrollWheelZoom={true}
                        zoomControl={false}
                    >
                        <LayersControl position="bottomleft">
                            <BaseLayer checked name="OpenStreetMap">
                                <TileLayer
                                    attribution="&copy <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
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
                        <ZoomControl position="topleft" />
                        <SearchField position="topright" reverseGeoCoding={props.reverseGeoCoding} setPosition={safeSetPosition}/>
                        <Control position="topright">
                            <MarkLocation setLoading={setLoading} setPosition={(latlng)=>{ safeSetPosition([latlng.lat, latlng.lng]); props.reverseGeoCoding(latlng); }} reverseGeoCoding={props.reverseGeoCoding} />
                        </Control>
                        <Control position="topright">
                            <ClickLocation setLoading={setLoading} setPosition={(latlng)=>{ safeSetPosition([latlng.lat, latlng.lng]); props.reverseGeoCoding(latlng); }} reverseGeoCoding={props.reverseGeoCoding} />
                        </Control>
                        <Control position="topright">
                            {loading === true ?
                                <FadeLoader
                                    color={"#000066"}
                                    height={9}
                                    margin={2}
                                    radius={-153}
                                    width={5}
                                /> : null
                            }
                        </Control>
                        {position && Array.isArray(position) && position.length === 2 && 
                         typeof position[0] === 'number' && typeof position[1] === 'number' && 
                         !isNaN(position[0]) && !isNaN(position[1]) ? (
                          <>
                            {console.log('Rendering marker with position:', position, 'type:', typeof position, 'isArray:', Array.isArray(position))}
                            {console.log('Marker should be draggable:', true)}
                            <Marker 
                              draggable={true} 
                              eventHandlers={simpleMarkerEventHandler} 
                              position={{ lat: position[0], lng: position[1] }}
                            />
                          </>
                        ) : (
                          console.log('Skipping marker render - invalid position:', position)
                        )}
                    </MapContainer>
                    {/* <Typography>
                        Location: {province == "" ? null : province + ", "}{city == "" ? null : city}{brgy == "" ? null : ", " + brgy}
                    </Typography> */}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleCloseModal} sx ={{backgroundColor: "primary"}}>
                        Save changes
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )
}
