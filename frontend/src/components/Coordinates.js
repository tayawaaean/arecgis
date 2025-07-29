import 'leaflet-geosearch/dist/geosearch.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import Control from "react-leaflet-custom-control"
import { FadeLoader } from "react-spinners"
import PropTypes from "prop-types"
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
        props.setPosition(e.marker._latlng)
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
                map.flyTo(e.latlng, 18)
                props.setPosition(e.latlng)
                props.reverseGeoCoding(e.latlng)

            },
        })
        return (
            <>
                <button className="leaflet-control-layers controlStyle" aria-label="find-icon" onClick={fly}>
                    <MyLocationIcon fontSize="small"/>
                </button>
            </>
        )
    }

    const ClickLocation = (props) => {

        const tap = () => {
            setPosition(map.getCenter())
        }
        const map = useMapEvents({
            locationfound(e) {
                props.setLoading(false)
                map.flyTo(e.latlng, 18)
                props.setPosition(e.latlng)
                props.reverseGeoCoding(e.latlng)

            }
        })

        
        return (
            <>
                <button className="leaflet-control-layers controlStyle" aria-label="place-icon" onClick={tap}>
                    <PlaceIcon fontSize="small"/>
                </button>
            </>
        )
    }
    
    const handleCloseModal = () => props.setOpenModal(false)
    const [position, setPosition] = useState(props.coordinates ? [props?.coordinates[1], props?.coordinates[0]] : null)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
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
        props.setLat(ddmLatValue?.pos === 'N' ? parseFloat(ddmLatValue?.deg + (ddmLatValue?.decmin / 60)) : parseFloat(-(ddmLatValue?.deg + (ddmLatValue?.decmin / 60))))
        props.setLng(ddmLngValue?.pos === 'E' ? parseFloat(ddmLngValue?.deg + (ddmLngValue?.decmin / 60)) : parseFloat(-(ddmLngValue?.deg + (ddmLngValue?.decmin / 60))))
        setPosition({ lat: parseFloat(ddmLatValue?.deg + (ddmLatValue?.decmin / 60)), lng: parseFloat(ddmLngValue?.deg + (ddmLngValue?.decmin / 60)) })
        props.reverseGeoCoding({ lat: parseFloat(ddmLatValue?.deg + (ddmLatValue?.decmin / 60)), lng: parseFloat(ddmLngValue?.deg + (ddmLngValue?.decmin / 60)) })
    } 

    //conversion state----end

    const markerEventHandler = useMemo(
        () => ({
            dragend(e) {
                setPosition(e.target.getLatLng())
                props.reverseGeoCoding(e.target.getLatLng())
            },
        }),
        []
    )

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false);
                setOpen(true)
            }, 10000);
        }
    }, [loading]);
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
                        center={position === null ? [12.512797, 122.395164] : position}
                        zoom={position === null ? 5 : 13}
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
                        <SearchField position="topright" reverseGeoCoding={props.reverseGeoCoding} setPosition={setPosition}/>
                        <Control position="topright">
                            <MarkLocation setLoading={setLoading} setPosition={setPosition} reverseGeoCoding={props.reverseGeoCoding} />
                        </Control>
                        <Control position="topright">
                            <ClickLocation setLoading={setLoading} setPosition={setPosition} reverseGeoCoding={props.reverseGeoCoding} />
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
                        {position === null ? null : <Marker draggable={true} eventHandlers={markerEventHandler} position={position}></Marker>}
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
