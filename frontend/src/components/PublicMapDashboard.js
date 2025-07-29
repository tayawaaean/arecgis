import React, { useEffect, useState } from 'react'
import useTitle from '../hooks/useTitle'
import { useNavigate, useLocation } from 'react-router-dom'
// import { selectAllInventories } from '../features/inventories/inventoriesApiSlice'
import { selectAllPublicInventories } from '../features/inventories/publicInventoriesApiSlice'
import { MapContainer, TileLayer, GeoJSON, ZoomControl, LayersControl, Marker, useMap, FeatureGroup, Circle } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import Control from 'react-leaflet-custom-control'
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


const contNames = reCats.map((type) => type.contName)


const { BaseLayer } = LayersControl



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

    //counter
    // const [total, setTotal] = useState(0)
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
        const filtered = Object.values(params.row.properties.address).filter(function (x) { return x !== 'Philippines' })
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


    // let yearNow = date.getFullYear();

    // console.log(date2.getTime())
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
        // {
        //     field: 'ownerName',
        //     headerName: 'Owner',
        //     width: 150,
        //     valueGetter: (inventories) => inventories.row.properties.ownerName,
        //     disableClickEventBubbling: true,
        // },
        {
            field: 'reCat',
            headerName: 'RE Category',
            width: 150,
            valueGetter: (inventories) => inventories.row.properties.reCat,
            disableClickEventBubbling: true,
        },
        {
            field: 'reUsage',
            headerName: 'RE Usage',
            width: 150,
            valueGetter: (inventories) => {
                if (inventories.row.properties.reCat === 'Solar Energy') {
                    return inventories.row.assessment.solarUsage
                }
                if (inventories.row.properties.reCat === 'Biomass') {
                    return inventories.row.assessment.biomassPriUsage
                }
                if (inventories.row.properties.reCat === 'Wind Energy') {
                    return inventories.row.assessment.windUsage
                }
                return "n/a"
            },
            disableClickEventBubbling: true,
        },
        {
            field: 'capacity',
            headerName: 'Capacity',
            width: 100,
            type: 'number',
            valueGetter: (inventories) => {

                if (inventories.row.assessment.solarStreetLights) {
                    const rawSolarItems = inventories.row.assessment.solarStreetLights
                    const product = rawSolarItems.map((solar => solar.capacity * solar.pcs))
                    const initialValue = 0;
                    const rawSolarStreet = product.reduce((accumulator, currentValue) =>
                        accumulator + currentValue, initialValue
                    )
                    return `${rawSolarStreet / 1000} kWp`
                }
                if (inventories.row.properties.reCat === 'Solar Energy') {
                    return `${inventories.row.assessment.capacity / 1000} kWp`
                }

                if (inventories.row.properties.reCat === 'Biomass') {
                    return `${inventories.row.assessment.capacity} m³`
                }
                if (inventories.row.properties.reCat === 'Wind Energy') {
                    return `${inventories.row.assessment.capacity / 1000} kWp`
                }

            },
            disableClickEventBubbling: true,
        },
        {
            field: 'yearEst',
            headerName: 'Year est.',
            width: 80,
            type: 'number',
            valueGetter: (inventories) => inventories.row.properties.yearEst,
            disableClickEventBubbling: true,
        },
        {
            field: 'totalGen',
            headerName: 'Total Gen.',
            width: 230,
            valueGetter: (inventories) => {

                const noOfYear = parseInt(inventories.row.properties.yearEst)
                let dateEst = new Date(`1/1/${noOfYear}`);
                let dateCreated = new Date(inventories.row.createdAt)
                const dateCreatedConv = dateCreated.toLocaleDateString()
                const diffInTime = dateCreated.getTime() - dateEst.getTime();
                const noOfDays = Math.round(diffInTime / oneDay);

                if (inventories.row.assessment.solarStreetLights) {
                    const rawSolarItems = inventories.row.assessment.solarStreetLights
                    const product = rawSolarItems.map((solar => solar.capacity * solar.pcs))
                    const initialValue = 0;
                    const rawSolarStreet = product.reduce((accumulator, currentValue) =>
                        accumulator + currentValue, initialValue
                    )
                    return `${Math.round((rawSolarStreet / 1000) * sunHour * noOfDays)} kWh as of ${dateCreatedConv}`
                }
                if (inventories.row.properties.reCat === 'Solar Energy') {
                    return `${Math.round((inventories.row.assessment.capacity / 1000) * sunHour * noOfDays)} kWh as of ${dateCreatedConv}`
                }
                return "n/a"
            },
            disableClickEventBubbling: true,
        },
        {
            field: 'address',
            headerName: 'Location',
            width: 230,
            valueGetter: getAddress,
            disableClickEventBubbling: true,
        },
        // {
        //   field: 'username',
        //   headerName: 'Uploader',
        //   width: 130,
        //   disableClickEventBubbling: true,
        // },
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
                    <Box sx={{ height: '60vh', width: '100%', display: REClass === "Non-Commercial" ? 'block' : 'none' }}>
                        <DataGrid
                            onStateChange={(state) => {

                                let rawSolarPowerGen = []
                                let rawSolarValue = []
                                let rawSolarPumpValue = []

                                let rawSolarPowerGenCap = []
                                let rawSolarValueCap = []
                                let rawSolarPumpValueCap = []

                                let rawSolarPowerGenUnits = []
                                let rawSolarStUnits = []
                                let rawSolarPumpUnits = []

                                const visibleRows = state.filter.visibleRowsLookup;
                                let visibleItems = []
                                for (const [id, value] of Object.entries(visibleRows)) {
                                    if (value === true) {
                                        visibleItems.push(id)
                                    }
                                }
                                const result = inventories.filter((item) => visibleItems.includes(item.id));
                                const solarStVal = (result.map((inventory, index) => {
                                    const noOfYear = parseInt(inventory.properties.yearEst)
                                    let dateEst = new Date(`1/1/${noOfYear}`);
                                    let dateCreated = new Date(inventory?.createdAt)
                                    const diffInTime = dateCreated.getTime() - dateEst.getTime();
                                    const noOfDays = Math.round(diffInTime / oneDay);

                                    if (inventory.assessment.solarStreetLights) {
                                        const rawSolarItems = inventory.assessment.solarStreetLights
                                        const product = rawSolarItems.map((solar => solar.capacity * solar.pcs))
                                        const units = rawSolarItems.map((solar => parseInt(solar.pcs)))
                                        const initialValue = 0;
                                        const initialUnitValue = 0;
                                        const rawSolarStreet = product.reduce((accumulator, currentValue) =>
                                            accumulator + currentValue, initialValue
                                        )


                                        const rawSolarStUnt = units.reduce((accumulator, currentValue) =>
                                            accumulator + currentValue, initialUnitValue
                                        )
                                        const rawGen = Math.round((rawSolarStreet / 1000) * sunHour * noOfDays)
                                        rawSolarValue = [...rawSolarValue, rawGen]
                                        rawSolarValueCap = [...rawSolarValueCap, rawSolarStreet]
                                        rawSolarStUnits = [...rawSolarStUnits, rawSolarStUnt]
                                    }

                                    if (inventory.assessment.solarUsage === 'Power Generation' && inventory.properties.reClass === 'Non-Commercial') {
                                        const rawGen = Math.round((inventory.assessment.capacity / 1000) * sunHour * noOfDays)
                                        rawSolarPowerGen = [...rawSolarPowerGen, rawGen]
                                        rawSolarPowerGenCap = [...rawSolarPowerGenCap, Math.round(inventory.assessment.capacity)]
                                        rawSolarPowerGenUnits = [...rawSolarPowerGenUnits, inventory.assessment.solarUsage]
                                    }
                                    if (inventory.assessment.solarUsage === 'Solar Pump') {
                                        const rawGen = Math.round((inventory.assessment.capacity / 1000) * sunHour * noOfDays)
                                        rawSolarPumpValue = [...rawSolarPumpValue, rawGen]
                                        rawSolarPumpValueCap = [...rawSolarPumpValueCap, Math.round(inventory.assessment.capacity)]
                                        rawSolarPumpUnits = [...rawSolarPumpUnits, inventory.assessment.solarUsage]
                                    }

                                }))
                                // setTotal(solarStVal);
                                const solarStCaptotal = rawSolarValueCap.reduce((a, b) => a + b, 0)
                                const powerGenCapTotal = rawSolarPowerGenCap.reduce((a, b) => a + b, 0)
                                const solarPumpCapTotal = rawSolarPumpValueCap.reduce((a, b) => a + b, 0)

                                const solarSttotal = rawSolarValue.reduce((a, b) => a + b, 0)
                                const powerGenTotal = rawSolarPowerGen.reduce((a, b) => a + b, 0)
                                const solarPumpTotal = rawSolarPumpValue.reduce((a, b) => a + b, 0)

                                const solarStUnitTotal = rawSolarStUnits.reduce((a, b) => a + b, 0)

                                setSolarStTotalUnit(solarStUnitTotal)
                                setSolarPowerGenTotalUnit(rawSolarPowerGenUnits.length)
                                setSolarPumpTotalUnit(rawSolarPumpUnits.length)

                                setSolarStTotalCap(solarStCaptotal / 1000)
                                setSolarPowerGenTotalCap(powerGenCapTotal / 1000)
                                setSolarPumpTotalCap(solarPumpCapTotal / 1000)

                                setSolarStTotal(solarSttotal)
                                setSolarPowerGenTotal(powerGenTotal)
                                setSolarPumpTotal(solarPumpTotal)
                                // setTotal(solarSttotal)
                            }}
                            rows={inventories}
                            columns={columns}
                            initialSnackBar={{
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
                    <Box sx={{ height: '60vh', width: '100%', display: REClass === "Commercial" ? 'block' : 'none' }}>
            {REClass === "Commercial" ? <DataGrid

              onStateChange={(state) => {

                let rawSolarPowerGen = []
                let rawSolarValue = []
                let rawSolarPumpValue = []

                let rawSolarPowerGenCap = []
                let rawSolarValueCap = []
                let rawSolarPumpValueCap = []

                let rawSolarPowerGenUnits = []
                let rawSolarStUnits = []
                let rawSolarPumpUnits = []

                const visibleRows = state.filter.visibleRowsLookup;
                let visibleItems = []
                for (const [id, value] of Object.entries(visibleRows)) {
                  if (value === true) {
                    visibleItems.push(id)
                  }
                }

                const result = inventories.filter((item) => visibleItems.includes(item.id));
                const solarStVal = (result.map((inventory, index) => {
                  const noOfYear = parseInt(inventory.properties.yearEst)
                  let dateEst = new Date(`1/1/${noOfYear}`);
                  let dateCreated = new Date(inventory?.createdAt)
                  const diffInTime = dateCreated.getTime() - dateEst.getTime();
                  const noOfDays = Math.round(diffInTime / oneDay);

                  if (inventory.assessment.solarStreetLights) {
                    const rawSolarItems = inventory.assessment.solarStreetLights
                    const product = rawSolarItems.map((solar => solar.capacity * solar.pcs))
                    const units = rawSolarItems.map((solar => parseInt(solar.pcs)))
                    const initialValue = 0;
                    const initialUnitValue = 0;
                    const rawSolarStreet = product.reduce((accumulator, currentValue) =>
                      accumulator + currentValue, initialValue
                    )


                    const rawSolarStUnt = units.reduce((accumulator, currentValue) =>
                      accumulator + currentValue, initialUnitValue
                    )
                    const rawGen = Math.round((rawSolarStreet / 1000) * sunHour * noOfDays)
                    rawSolarValue = [...rawSolarValue, rawGen]
                    rawSolarValueCap = [...rawSolarValueCap, rawSolarStreet]
                    rawSolarStUnits = [...rawSolarStUnits, rawSolarStUnt]
                  }

                  if (inventory.assessment.solarUsage === 'Power Generation') {
                    const rawGen = Math.round((inventory.assessment.capacity / 1000) * sunHour * noOfDays)
                    rawSolarPowerGen = [...rawSolarPowerGen, rawGen]
                    rawSolarPowerGenCap = [...rawSolarPowerGenCap, Math.round(inventory.assessment.capacity)]
                    rawSolarPowerGenUnits = [...rawSolarPowerGenUnits, inventory.assessment.solarUsage]
                  }
                  if (inventory.assessment.solarUsage === 'Solar Pump') {
                    const rawGen = Math.round((inventory.assessment.capacity / 1000) * sunHour * noOfDays)
                    rawSolarPumpValue = [...rawSolarPumpValue, rawGen]
                    rawSolarPumpValueCap = [...rawSolarPumpValueCap, Math.round(inventory.assessment.capacity)]
                    rawSolarPumpUnits = [...rawSolarPumpUnits, inventory.assessment.solarUsage]
                  }

                }))
                // setTotal(solarStVal);

                const solarStCaptotal = rawSolarValueCap.reduce((a, b) => a + b, 0)
                const powerGenCapTotal = rawSolarPowerGenCap.reduce((a, b) => a + b, 0)
                const solarPumpCapTotal = rawSolarPumpValueCap.reduce((a, b) => a + b, 0)

                const solarSttotal = rawSolarValue.reduce((a, b) => a + b, 0)
                const powerGenTotal = rawSolarPowerGen.reduce((a, b) => a + b, 0)
                const solarPumpTotal = rawSolarPumpValue.reduce((a, b) => a + b, 0)

                const solarStUnitTotal = rawSolarStUnits.reduce((a, b) => a + b, 0)

                setSolarStTotalUnit(solarStUnitTotal)
                setSolarPowerGenTotalUnit(rawSolarPowerGenUnits.length)
                setSolarPumpTotalUnit(rawSolarPumpUnits.length)

                setSolarStTotalCap(solarStCaptotal / 1000)
                setSolarPowerGenTotalCap(powerGenCapTotal / 1000)
                setSolarPumpTotalCap(solarPumpCapTotal / 1000)

                setSolarStTotal(solarSttotal)
                setSolarPowerGenTotal(powerGenTotal)
                setSolarPumpTotal(solarPumpTotal)
                // setTotal(solarSttotal)
              }}
              rows={inventories.filter((items) => items.properties.reClass === "Commercial")}
              columns={columns}
              initialSnackBar={{
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
            /> : null}

          </Box>
                    {/* <Stack direction={{ md: 'row', sm: 'column' }} spacing={{ xs: 2, sm: 2, md: 4 }} sx={{ marginTop: 4 }}>
            <SolarInformation inventories={inventories} solarUsageFilter={solarUsageFilter} solarProvFilter={solarProvFilter} />
            <BiomassInformation inventories={inventories} biomassUsageFilter={biomassUsageFilter} bioProvFilter={bioProvFilter} />
            <WindInformation inventories={inventories} windUsageFilter={windUsageFilter} windProvFilter={windProvFilter} />
          </Stack> */}
  {REClass === "Commercial" || REClass === "Non-Commercial" ?
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormControl variant="standard" sx={{ minWidth: 120 }} size="small">
                      <InputLabel id="demo-select-small-label">Summary<small>(by usage)</small></InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={"solar"}
                        label="types"
                      // onChange={handleChange}
                      >
                        <MenuItem value={"solar"}>Solar Energy</MenuItem>
                        <MenuItem value={"wind"} disabled>Wind Energy</MenuItem>
                        <MenuItem value={"biomass"} disabled>Biomass</MenuItem>
                        <MenuItem value={"hydropower"} disabled>Hydropower</MenuItem>
                      </Select>
                    </FormControl></TableCell>
                  <TableCell align="right">No. of units</TableCell>
                  <TableCell align="right">est. Generation<small>(from year installed)</small></TableCell>
                  <TableCell align="right">tot. Capacity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Solar streetlights/lights
                  </TableCell>
                  <TableCell align="right">{solarStTotalUnit}</TableCell>
                  <TableCell align="right">{Math.ceil(Math.log10(solarStTotal + 1)) >= 4 ? <><b>{(solarStTotal / 1000).toFixed(2)}</b> MWh</> : <><b>{(solarStTotal).toFixed(2)}</b> kWh</>}</TableCell>
                  <TableCell align="right">{Math.ceil(Math.log10(solarStTotalCap + 1)) >= 4 ? <><b>{(solarStTotalCap / 1000).toFixed(2)}</b> MW</> : <><b>{(solarStTotalCap).toFixed(2)}</b> kW</>}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    For power generation
                  </TableCell>
                  <TableCell align="right">{solarPowerGenTotalUnit}</TableCell>
                  <TableCell align="right">{Math.ceil(Math.log10(solarPowerGenTotal + 1)) >= 4 ? <><b>{(solarPowerGenTotal / 1000).toFixed(2)}</b> MWh</> : <><b>{(solarPowerGenTotal).toFixed(2)}</b> kWh</>}</TableCell>
                  <TableCell align="right">{Math.ceil(Math.log10(solarPowerGenTotalCap + 1)) >= 4 ? <><b>{(solarPowerGenTotalCap / 1000).toFixed(2)}</b> MW</> : <><b>{(solarPowerGenTotalCap).toFixed(2)}</b> kW</>}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Solar Pumps
                  </TableCell>
                  <TableCell align="right">{solarPumpTotalUnit}</TableCell>
                  <TableCell align="right">{Math.ceil(Math.log10(solarPumpTotal + 1)) >= 4 ? <><b>{(solarPumpTotal / 1000).toFixed(2)}</b> MWh</> : <><b>{solarPumpTotal.toFixed(2)}</b> kWh</>} </TableCell>
                  <TableCell align="right">{Math.ceil(Math.log10(solarPumpTotalCap + 1)) >= 4 ? <><b>{(solarPumpTotalCap / 1000).toFixed(2)}</b> MW</> : <><b>{solarPumpTotalCap.toFixed(2)}</b> kW</>}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                  <b>TOTAL</b>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">{Math.ceil(Math.log10((solarStTotal+solarPowerGenTotal+solarPumpTotal)+ 1)) >= 4 ? <><b>{Math.round((solarStTotal+solarPowerGenTotal+solarPumpTotal) / 1000)}</b> MWh</> : <><b>{solarStTotal+solarPowerGenTotal+solarPumpTotal}</b> kWh</>} </TableCell>
                  <TableCell align="right">{Math.ceil(Math.log10((solarStTotalCap+solarPowerGenTotalCap+solarPumpTotalCap) + 1)) >= 4 ? <><b>{((solarStTotalCap+solarPowerGenTotalCap+solarPumpTotalCap) / 1000).toFixed(2)}</b> MW</> : <><b>{solarStTotalCap+solarPowerGenTotalCap+solarPumpTotalCap}</b> kW</>}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
 : null}


                </Box>

            </Modal>
            <SnackBar setActive={setActive} active={active} project={project} />
            <Tooltip title="Renewable Energy list" placement="left-start">
                <button className="leaflet-control-layers controlStyle" aria-label="place-icon" onClick={handleOpenModal}>
                    <ListAltIcon fontSize="small" />
                </button>
            </Tooltip>
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

const PublicMapDashboard = () => {

    useTitle('ArecGIS | Map Dashboard')

    const [category, setCategory] = useState([])

    const [clearVal, setClearVal] = useState(false)
    const [project, setProject] = useState('')
    const [active, setActive] = useState(false)
    const inventories = useSelector(selectAllPublicInventories)

    //filter search
    const [query, setQuery] = useState("");
    const [searchParam] = useState(["city", "province"]);
    const data = Object.values(inventories);
    const search = (inventories) => {
        return inventories.filter((item) => {
            return searchParam.some((newItem) => {
                const address = item.properties.address
                return (
                    address[newItem]
                        .toString()
                        .toLowerCase()
                        .indexOf(query.toLowerCase()) > -1
                )
            })
        })
    }

    const navigate = useNavigate()
    const location = useLocation()
    const [position, setPosition] = useState(null)

    const [solarProvFilter, setSolarProvFilter] = useState([])
    const [bioProvFilter, setBioProvFilter] = useState([])
    const [windProvFilter, setWindProvFilter] = useState([])
    const [solarUsageFilter, setSolarUsageFilter] = useState(rawSolarUsage.map(item => item.name))
    const [statusFilter, setStatusFilter] = useState(Status.map(item => item.name))
    const [biomassUsageFilter, setBiomassUsageFilter] = useState(rawBiomassPriUsage.map(item => item.name))
    const [windUsageFilter, setWindUsageFilter] = useState(rawWindUsage.map(item => item.name))


    let solarEnergy = []
    let biomassEnergy = []
    let windEnergy = []

    const provinceRaw = inventories.map((inventory) => {
        if (inventory.properties.reCat === 'Solar Energy') {
            solarEnergy = [...solarEnergy, inventory.properties.address.city]
        }
        if (inventory.properties.reCat === 'Biomass') {
            biomassEnergy = [...biomassEnergy, inventory.properties.address.city]
        }
        if (inventory.properties.reCat === 'Wind Energy') {
            windEnergy = [...windEnergy, inventory.properties.address.city]
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
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const onChangeSolarProv = (event) => {
        const {
            target: { value },
        } = event;
        setSolarProvFilter(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const onChangeBioProv = (event) => {
        const {
            target: { value },
        } = event;
        setBioProvFilter(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }
    const onChangeWindProv = (event) => {
        const {
            target: { value },
        } = event;
        setWindProvFilter(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }


    const onSolarChecked = (event) => {
        const {
            target: { value },
        } = event;
        setSolarUsageFilter(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }
    const onBiomassChecked = (event) => {
        const {
            target: { value },
        } = event;
        setBiomassUsageFilter(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }
    const onWindChecked = (event) => {
        const {
            target: { value },
        } = event;
        setWindUsageFilter(
            // On autofill we get a stringified value.
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


    const [filters, setFilters] = useState({ contNames })
    const [openDrawer, setDrawer] = useState(false)

    const handleDrawerOpen = () => {
        setDrawer(true)
        // if (solarProvFilter.length === 0) {
        //     setSolarProvFilter(solarProvince)
        // }
        // if (bioProvFilter.length === 0) {
        //     setBioProvFilter(biomassProvince)
        // }
        // if (windProvFilter.length === 0) {
        //     setWindProvFilter(windProvince)
        // }
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
    // drawer end

    //geojson start
    const onEachRE = (feature, layer) => {
        if (feature.properties?.reCat === 'Solar Energy') {
            layer.setStyle({ radius: 5, className: 'solarEnergy' })
        }
        if (feature.properties?.reCat === 'Biomass') {
            layer.setStyle({ radius: 5, className: 'biomassEnergy' })
        }
        if (feature.properties?.reCat === 'Wind Energy') {
            layer.setStyle({ radius: 5, className: 'windEnergy' })
        }
        if (feature.properties?.reCat === 'Hydropower') {
            layer.setStyle({ radius: 5, className: 'hydroPower' })
        }
        if (feature.properties) {
            layer.bindPopup(
                feature.properties.reCat
                // popupContent
            )
        }

    }
    const pointToLayer = (feature, latlng) => {
        return L.circleMarker(latlng, {
            // className: 'button', // Assign a unique CSS class for each feature
        });
    }
    //geojson end
    const FilterRE = () => {
        return (
            <>
                <Tooltip title="Filter settings" placement="left-start" >
                    <button className="leaflet-control-layers controlStyle" aria-label="place-icon" onClick={handleDrawerOpen}>
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
                    <button className="leaflet-control-layers controlStyle" aria-label="place-icon" onClick={() => navigate('/')}>
                        <HomeIcon fontSize="small" />
                    </button>
                </Tooltip>
            </>
        )
    }

    if (inventories.length!==0) {

        // const handleEdit = () => navigate(`/dashboard/inventory/${inventoryId}`)
        return (
            <>
                {/* <Box sx={{ margin:4 }}> */}
                <Grid container rowSpacing={4} columnSpacing={{ xs: 2, sm: 2, md: 4 }}>
                    <Grid item md={12} xs={12}>
                        <MapContainer
                            style={{ height: "100vh" }}
                            center={[12.512797, 122.395164]}
                            zoom={5}
                            scrollWheelZoom={true}
                            zoomControl={false}
                            doubleClickZoom={false}

                        >
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

                            {search(data).map((inventory, index) => {
                                if (!filters.contNames.includes(inventory.properties.reCat)) {
                                    if (solarUsageFilter.includes(inventory.assessment.solarUsage) || biomassUsageFilter.includes(inventory.assessment.biomassPriUsage) || windUsageFilter.includes(inventory.assessment.windUsage)) {
                                        if (statusFilter.includes(inventory.assessment.status)) {
                                            // if (solarProvFilter.includes(inventory.properties.address.city) || bioProvFilter.includes(inventory.properties.address.city) || windProvFilter.includes(inventory.properties.address.city)) {
                                            return (
                                                <GeoJSON
                                                    key={Math.random()}
                                                    data={inventory}
                                                    onEachFeature={onEachRE}
                                                    pointToLayer={pointToLayer}
                                                    eventHandlers={{
                                                        click: () => {
                                                            setActive(true)
                                                            setProject(inventory)
                                                            setPosition(inventory.coordinates)
                                                        },
                                                    }}
                                                />
                                            )
                                        }

                                    }

                                }
                                return null
                            })}
                            {/* <Control position="bottomleft"> */}
                            {/* {!filters.contNames.includes('Solar Energy') ? <SolarInformation inventories={inventories} solarUsageFilter={solarUsageFilter} solarProvFilter={solarProvFilter} />
              : null}
            {!filters.contNames.includes('Biomass') ? <BiomassInformation inventories={inventories} biomassUsageFilter={biomassUsageFilter} bioProvFilter={bioProvFilter} />
              : null} */}

                            {/* </Control> */}
                            <Control position="topright">
                                <FilterRE />
                                {/* <Drawer
                                    slotProps={{ backdrop: { invisible: true } }}
                                    anchor="right"
                                    open={openDrawer}
                                    onClose={handleDrawerClose}
                                >
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
                                        <Typography variant="h6" sx={{ ml: 1 }}>
                                            Filters
                                        </Typography>
                                        <IconButton onClick={handleDrawerClose}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Stack>

                                    <Divider />
                                    <Stack spacing={3} sx={{ p: 3 }}>
                                        <div>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Filter by City/Municipality"
                                                variant="outlined"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                            />
                                            <Typography variant="h6" gutterBottom>
                                                RE categories
                                            </Typography>
                                            <FormGroup>
                                            {category.map((type, index) => (
                        <div key={index}>
                          <FormControlLabel
                            label={<div style={{
                              display: 'flex',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                          }}>
                              <CircleIcon fontSize='small' style={type.contName === "Solar Energy" ? {
                                stroke: '#000',
                                color: '#FFBF00',
                                marginRight: '5px'
                              } : type.contName === "Biomass" ? {
                                stroke: '#000',
                                color: '#947b4f',
                                marginRight: '5px'
                              } : type.contName === "Wind Energy" ? {
                                stroke: '#000',
                                color: '#f3ebe8',
                                marginRight: '5px'
                              } : type.contName === "Hydropower" ? {
                                stroke: '#000',
                                color: '#1e2f97',
                                marginRight: '5px'
                              } : null} />
                              <span>{type.contName}</span>
                          </div>  }
                            key={index}
                            control={
                              <Checkbox
                                checked={type.checked}
                                indeterminate={type.contName === 'Solar Energy' ? (rawSolarUsage.map(item => solarUsageFilter.indexOf(item.name)).includes(-1)) || (solarProvince.map(item => solarProvFilter.indexOf(item)).includes(-1)) :
                                  type.contName === 'Biomass' ? (rawBiomassPriUsage.map(item => biomassUsageFilter.indexOf(item.name)).includes(-1)) || (biomassProvince.map(item => bioProvFilter.indexOf(item)).includes(-1)) :
                                    type.contName === 'Wind Energy' ? (rawWindUsage.map(item => windUsageFilter.indexOf(item.name)).includes(-1)) || (windProvince.map(item => windProvFilter.indexOf(item)).includes(-1)) : false}
                                onChange={handleChange(type.contName, index)}
                              />
                            }
                          />

                          {!filters.contNames.includes(type.contName) ?
                            <div>

                              <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel id="multiple-checkbox-label">Select Usage</InputLabel>
                                {type.contName === 'Solar Energy' ? <Select
                                  size="small"
                                  id="multiple-checkbox"
                                  multiple
                                  value={solarUsageFilter}
                                  onChange={onSolarChecked}
                                  input={<OutlinedInput label="Select Usage" />}
                                  renderValue={(selected) => selected.join(', ')}
                                  MenuProps={MenuProps}
                                >
                                  {rawSolarUsage.map((value, index) => (
                                    <MenuItem key={index} value={value.name}>
                                      <Checkbox checked={solarUsageFilter.indexOf(value.name) > -1} />
                                      <ListItemText primary={value.name} />
                                    </MenuItem>
                                  ))}
                                </Select> : type.contName === 'Biomass' ? <Select
                                  size="small"
                                  id="multiple-checkbox"
                                  multiple
                                  value={biomassUsageFilter}
                                  onChange={onBiomassChecked}
                                  input={<OutlinedInput label="Select Usage" />}
                                  renderValue={(selected) => selected.join(', ')}
                                  MenuProps={MenuProps}
                                >
                                  {rawBiomassPriUsage.map((value, index) => (
                                    <MenuItem key={index} value={value.name}>
                                      <Checkbox checked={biomassUsageFilter.indexOf(value.name) > -1} />
                                      <ListItemText primary={value.name} />
                                    </MenuItem>
                                  ))}
                                </Select> : type.contName === 'Wind Energy' ? <Select
                                  size="small"
                                  id="multiple-checkbox"
                                  multiple
                                  value={windUsageFilter}
                                  onChange={onWindChecked}
                                  input={<OutlinedInput label="Select Usage" />}
                                  renderValue={(selected) => selected.join(', ')}
                                  MenuProps={MenuProps}
                                >
                                  {rawWindUsage.map((value, index) => (
                                    <MenuItem key={index} value={value.name}>
                                      <Checkbox checked={windUsageFilter.indexOf(value.name) > -1} />
                                      <ListItemText primary={value.name} />
                                    </MenuItem>
                                  ))}
                                </Select> : type.contName === 'Hydropower' ? <Select
                                  size="small"
                                  id="multiple-checkbox"
                                  multiple
                                  value={['not availble']}
                                  onChange={onWindChecked}
                                  input={<OutlinedInput label="Not yet available" />}
                                  renderValue={(selected) => selected.join(', ')}
                                  MenuProps={MenuProps}
                                >
                                  <MenuItem key={Math.random()} value={['not available']}>
                                    <Checkbox checked={true} />
                                    <ListItemText primary={['not available']} />
                                  </MenuItem>
                                </Select> : ''}


                                <FormControl sx={{ marginTop: 2, width: 300 }}>
                                  <InputLabel id="multiple-checkbox-label">Status</InputLabel>
                                  <Select
                                    size="small"
                                    id="multiple-checkbox"
                                    multiple
                                    value={statusFilter}
                                    onChange={onStatusFilterChanged}
                                    input={<OutlinedInput label="Status" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                  >
                                    {Status.map((value, index) => (
                                      <MenuItem key={index} value={value.name}>
                                        <Checkbox checked={statusFilter.indexOf(value.name) > -1} />
                                        <ListItemText primary={value.name} />
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>

                              </FormControl>
                            </div>
                            : null}
                        </div>
                      ))}
                                            </FormGroup>
                                        </div>

                                    </Stack>

                                    <Box sx={{ p: 3 }}>
                                        <Button
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            color="inherit"
                                            variant="outlined"
                                            startIcon={<ClearAllIcon />}
                                            onClick={clearAll}
                                        >
                                            Clear All
                                        </Button>
                                    </Box>
                                </Drawer> */}
                            </Control>
                            <Control position="topright">
                                <RElist clearVal={clearVal} setClearVal={setClearVal} />
                            </Control>
                            <Control position="topright">
                                <HomeButton />
                            </Control>

                            <ZoomControl position="bottomright" />
                            {/* This control will be below the default zoom control. Note the wrapping Stack component */}

                            {/* <SnackBar setActive={setActive} active={active} project={project} /> */}

                        </MapContainer>

                    </Grid>
                    {/* <Grid item md={12} xs={12}>
            <Stack direction={{ md: 'row', sm: 'column' }} spacing={4}>
              <SnackBar setActive={setActive} active={active} project={project} />
            </Stack>
          </Grid> */}
                </Grid>
                <SnackBar setActive={setActive} active={active} project={project} />
                {/* <Stack direction={{ md: 'row', sm: 'column' }} spacing={{ xs: 4, sm: 4, md: 4 }} sx={{ marginTop: 4 }}>
                        <SolarInformation inventories={inventories} solarUsageFilter={solarUsageFilter} solarProvFilter={solarProvFilter} />
                        <BiomassInformation inventories={inventories} biomassUsageFilter={biomassUsageFilter} bioProvFilter={bioProvFilter} />
                        <WindInformation inventories={inventories} windUsageFilter={windUsageFilter} windProvFilter={windProvFilter} />
                    </Stack> */}
                {/* </Box> */}
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
    } else return (<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>)

}
export default PublicMapDashboard