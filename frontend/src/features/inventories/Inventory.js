import React, { useEffect, useState, memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { selectAllInventories, useDeleteInventoryMutation } from './inventoriesApiSlice'
import { MapContainer, TileLayer, GeoJSON, ZoomControl, LayersControl, Marker, useMap, LayerGroup, useMapEvents, useMapEvent } from 'react-leaflet'
import Control from 'react-leaflet-custom-control'
import { Button, Modal, Drawer, Box, Checkbox, FormControlLabel, FormGroup, Stack, Typography, IconButton, Divider, CssBaseline, FormControl, InputLabel, Select, OutlinedInput, ListItemText, MenuItem, Grid, Paper, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, ListItem, List, TextField, Tooltip } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { SnackBar } from '../../components/SnackBar'
import {
  FilterList as FilterListIcon,
  Add as AddIcon,
  Close as CloseIcon,
  ClearAll as ClearAllIcon,
  ListAlt as ListAltIcon,
  Circle as CircleIcon,
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { reCats } from '../../config/reCats'
import { modalStyle, scrollbarStyle } from '../../config/style'
import L from 'leaflet'
// import { selectInventoryById } from './inventoryApiSlice'
import Scrollbar from '../../components/scrollbar';
import { rawSolarUsage, rawBiomassPriUsage, rawWindUsage, Status } from '../../config/techAssesment'
import { FadeLoader } from 'react-spinners'
import useAuth from '../../hooks/useAuth'

const contNames = reCats.map((type) => type.contName)


const { BaseLayer } = LayersControl

function toGeoJSONFeature(inventory) {
  if (inventory.type === "Feature" && inventory.geometry) return inventory;
  if (inventory.coordinates?.type === "Point") {
    return {
      type: "Feature",
      geometry: inventory.coordinates,
      properties: inventory.properties,
      id: inventory.id || inventory._id
    };
  }
  if (Array.isArray(inventory.coordinates)) {
    return {
      type: "Feature",
      geometry: { type: "Point", coordinates: inventory.coordinates },
      properties: inventory.properties,
      id: inventory.id || inventory._id
    };
  }
  return null;
}


const RElist = (props) => {
  const { isManager, isAdmin } = useAuth()
  const [project, setProject] = useState('')
  const [active, setActive] = useState(false)
  const [position, setPosition] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const inventories = useSelector(selectAllInventories)
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

  const [multiDelete, setMultiDelete] = useState([])
  const navigate = useNavigate()

  const [deleteInventory, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delerror
  }] = useDeleteInventoryMutation()

  const onDeleteInventoryClicked = async () => {  
    await deleteInventory({ id: multiDelete })
  }

  useEffect(() => {

    if (isDelSuccess) {

      navigate(0)
    }

  }, [isDelSuccess, navigate])

  const dateNow = new Date()
  const oneDay = 1000 * 60 * 60 * 24
  const sunHour = 4.7

  const getAddress = (params) => {
    const filtered = Object.values(params.row.properties.address).filter(function (x) { return x !== 'Philippines' })
    return `${filtered[0]}, ${filtered[1]}, ${filtered[2]}, ${filtered[3]}`

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
    {
      field: 'ownerName',
      headerName: 'Owner',
      width: 150,
      valueGetter: (inventories) => inventories.row.properties.ownerName,
      disableClickEventBubbling: true,
    },
    {
      field: 'reCat',
      headerName: 'RE Category',
      width: 100,
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
  field: 'solarSystemTypes',
  headerName: 'Solar System Types',
  width: 160,
  filterable: true,
  type: 'singleSelect',
  valueOptions: ['Off-grid', 'Grid-tied', 'Hybrid'],
  valueGetter: (row) =>
    row.row.properties.reCat === 'Solar Energy'
      ? row.row.assessment.solarSystemTypes || ''
      : '',
  disableClickEventBubbling: true,
},
    {
    field: 'isNetMetered',
    headerName: 'Net Metered',
    width: 120,
    filterable: true,
    type: 'singleSelect',
    valueOptions: ['Yes', 'No'],
    valueGetter: (inventories) => inventories.row?.properties?.isNetMetered || '',
    disableClickEventBubbling: true,
  },
  {
    field: 'ownUse',
    headerName: 'Own Use',
    width: 120,
    filterable: true,
    type: 'singleSelect',
    valueOptions: ['Yes', 'No'],
    valueGetter: (inventories) => inventories.row?.properties?.ownUse || '',
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
  field: 'annualEnergyProduction',
  headerName: 'Annual Energy Prod.',
  width: 160,
  type: 'number',
  valueGetter: (inventories) => {
    // Only show for Solar Energy and if Power Generation is selected
    if (
      inventories.row.properties.reCat === 'Solar Energy' &&
      inventories.row.assessment.solarUsage === 'Power Generation'
    ) {
      return inventories.row.assessment.annualEnergyProduction
        ? `${inventories.row.assessment.annualEnergyProduction} kWh`
        : '';
    }
    return '';
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
      headerName: 'Total Gen. (if operational)',
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
      headerName: 'Address',
      width: 400,
      valueGetter: getAddress,
      disableClickEventBubbling: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      valueGetter: (inventories) => inventories.row.assessment.status,
      disableClickEventBubbling: true,
    },
    {
      field: 'lat',
      headerName: 'Latitude',
      width: 100,
      valueGetter: (inventories) => inventories.row.coordinates[1],
      disableClickEventBubbling: true,
    },
    {
      field: 'long',
      headerName: 'Longitude',
      width: 100,
      valueGetter: (inventories) => inventories.row.coordinates[0],
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

  const [totalAnnualEnergyProduction, setTotalAnnualEnergyProduction] = useState(0);
  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={{ ...scrollbarStyle, ...modalStyle }}>
        <form onSubmit={e => e.preventDefault()}>
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
          <Button
                variant='contained'
                sx={{ m: 1, backgroundColor: 'custom.error', display: multiDelete.length == 0 ? 'none' : 'inline' }}
                onClick={onDeleteInventoryClicked}
                // onClick={()=>openDelAlert()}
              >
                Delete
              </Button>

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
                  const rawSolarItems = inventory.assessment.solarStreetLights;
                  // Safe conversion for capacity and pcs
                  const product = rawSolarItems.map(solar => {
                    const cap = parseFloat(solar.capacity);
                    const pcs = parseInt(solar.pcs, 10);
                    return (isNaN(cap) ? 0 : cap) * (isNaN(pcs) ? 0 : pcs);
                  });
                  const units = rawSolarItems.map(solar => {
                    const pcs = parseInt(solar.pcs, 10);
                    return isNaN(pcs) ? 0 : pcs;
                  });
                  const initialValue = 0;
                  const initialUnitValue = 0;
                  const rawSolarStreet = product.reduce((accumulator, currentValue) =>
                    accumulator + currentValue, initialValue
                  );
                  const rawSolarStUnt = units.reduce((accumulator, currentValue) =>
                    accumulator + currentValue, initialUnitValue
                  );
                  const rawGen = Math.round((rawSolarStreet / 1000) * sunHour * noOfDays);
                  rawSolarValue = [...rawSolarValue, rawGen];
                  rawSolarValueCap = [...rawSolarValueCap, rawSolarStreet];
                  rawSolarStUnits = [...rawSolarStUnits, rawSolarStUnt];
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
                const totalAnnualEnergyProduction = result.reduce((sum, inventory) => {
    if (
      inventory.assessment.solarUsage === "Power Generation" &&
      inventory.assessment.annualEnergyProduction &&
      !isNaN(Number(inventory.assessment.annualEnergyProduction))
    ) {
      return sum + Number(inventory.assessment.annualEnergyProduction);
    }
    return sum;
  }, 0);

  setTotalAnnualEnergyProduction(totalAnnualEnergyProduction);

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
                  csvOptions: { disableToolbarButton: !isAdmin },
                  printOptions: { disableToolbarButton: true },
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              disableRowSelectionOnClick
              checkboxSelection={isAdmin ? true : false}
              onRowSelectionModelChange = {(ids) => {
                setMultiDelete(ids)
              }}
            />
            
          </Box>
          </form>
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
                    const rawSolarItems = inventory.assessment.solarStreetLights;
                    // Safe conversion for capacity and pcs
                    const product = rawSolarItems.map(solar => {
                      const cap = parseFloat(solar.capacity);
                      const pcs = parseInt(solar.pcs, 10);
                      return (isNaN(cap) ? 0 : cap) * (isNaN(pcs) ? 0 : pcs);
                    });
                    const units = rawSolarItems.map(solar => {
                      const pcs = parseInt(solar.pcs, 10);
                      return isNaN(pcs) ? 0 : pcs;
                    });
                    const initialValue = 0;
                    const initialUnitValue = 0;
                    const rawSolarStreet = product.reduce((accumulator, currentValue) =>
                      accumulator + currentValue, initialValue
                    );
                    const rawSolarStUnt = units.reduce((accumulator, currentValue) =>
                      accumulator + currentValue, initialUnitValue
                    );
                    const rawGen = Math.round((rawSolarStreet / 1000) * sunHour * noOfDays);
                    rawSolarValue = [...rawSolarValue, rawGen];
                    rawSolarValueCap = [...rawSolarValueCap, rawSolarStreet];
                    rawSolarStUnits = [...rawSolarStUnits, rawSolarStUnt];
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
                  csvOptions: { disableToolbarButton: !isAdmin },
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
            <InputLabel id="demo-select-small-label">
              Summary<small>(by usage)</small>
            </InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={"solar"}
              label="types"
            >
              <MenuItem value={"solar"}>Solar Energy</MenuItem>
              <MenuItem value={"wind"} disabled>
                Wind Energy
              </MenuItem>
              <MenuItem value={"biomass"} disabled>
                Biomass
              </MenuItem>
              <MenuItem value={"hydropower"} disabled>
                Hydropower
              </MenuItem>
            </Select>
          </FormControl>
        </TableCell>
        <TableCell align="right">No. of units</TableCell>
        <TableCell align="right">
          est. Generation
          <small>(from year installed)</small>
        </TableCell>
        <TableCell align="right">tot. Capacity</TableCell>
        <TableCell align="right">
          <b>
            Annual Energy Prod.
            <br />
            (declared)
          </b>
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell component="th" scope="row">
          Solar streetlights/lights
        </TableCell>
        <TableCell align="right">{solarStTotalUnit}</TableCell>
        <TableCell align="right">
          {Math.ceil(Math.log10(solarStTotal + 1)) >= 4 ? (
            <>
              <b>{(solarStTotal / 1000).toFixed(2)}</b> MWh
            </>
          ) : (
            <>
              <b>{solarStTotal.toFixed(2)}</b> kWh
            </>
          )}
        </TableCell>
        <TableCell align="right">
          {Math.ceil(Math.log10(solarStTotalCap + 1)) >= 4 ? (
            <>
              <b>{(solarStTotalCap / 1000).toFixed(2)}</b> MW
            </>
          ) : (
            <>
              <b>{solarStTotalCap.toFixed(2)}</b> kW
            </>
          )}
        </TableCell>
        <TableCell align="right"></TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          For power generation
        </TableCell>
        <TableCell align="right">{solarPowerGenTotalUnit}</TableCell>
        <TableCell align="right">
          {Math.ceil(Math.log10(solarPowerGenTotal + 1)) >= 4 ? (
            <>
              <b>{(solarPowerGenTotal / 1000).toFixed(2)}</b> MWh
            </>
          ) : (
            <>
              <b>{solarPowerGenTotal.toFixed(2)}</b> kWh
            </>
          )}
        </TableCell>
        <TableCell align="right">
          {Math.ceil(Math.log10(solarPowerGenTotalCap + 1)) >= 4 ? (
            <>
              <b>{(solarPowerGenTotalCap / 1000).toFixed(2)}</b> MW
            </>
          ) : (
            <>
              <b>{solarPowerGenTotalCap.toFixed(2)}</b> kW
            </>
          )}
        </TableCell>
        <TableCell align="right">
          {totalAnnualEnergyProduction > 10000 ? (
            <b>{(totalAnnualEnergyProduction / 1000).toFixed(2)} MWh</b>
          ) : (
            <b>{totalAnnualEnergyProduction} kWh</b>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          Solar Pumps
        </TableCell>
        <TableCell align="right">{solarPumpTotalUnit}</TableCell>
        <TableCell align="right">
          {Math.ceil(Math.log10(solarPumpTotal + 1)) >= 4 ? (
            <>
              <b>{(solarPumpTotal / 1000).toFixed(2)}</b> MWh
            </>
          ) : (
            <>
              <b>{solarPumpTotal.toFixed(2)}</b> kWh
            </>
          )}
        </TableCell>
        <TableCell align="right">
          {Math.ceil(Math.log10(solarPumpTotalCap + 1)) >= 4 ? (
            <>
              <b>{(solarPumpTotalCap / 1000).toFixed(2)}</b> MW
            </>
          ) : (
            <>
              <b>{solarPumpTotalCap.toFixed(2)}</b> kW
            </>
          )}
        </TableCell>
        <TableCell align="right"></TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          <b>TOTAL</b>
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right">
          {Math.ceil(
            Math.log10(solarStTotal + solarPowerGenTotal + solarPumpTotal + 1)
          ) >= 4 ? (
            <>
              <b>
                {Math.round(
                  (solarStTotal + solarPowerGenTotal + solarPumpTotal) / 1000
                )}
              </b>{" "}
              MWh
            </>
          ) : (
            <>
              <b>
                {solarStTotal + solarPowerGenTotal + solarPumpTotal}
              </b>{" "}
              kWh
            </>
          )}
        </TableCell>
        <TableCell align="right">
          {Math.ceil(
            Math.log10(
              solarStTotalCap + solarPowerGenTotalCap + solarPumpTotalCap + 1
            )
          ) >= 4 ? (
            <>
              <b>
                {(
                  (solarStTotalCap +
                    solarPowerGenTotalCap +
                    solarPumpTotalCap) /
                  1000
                ).toFixed(2)}
              </b>{" "}
              MW
            </>
          ) : (
            <>
              <b>
                {solarStTotalCap +
                  solarPowerGenTotalCap +
                  solarPumpTotalCap}
              </b>{" "}
              kW
            </>
          )}
        </TableCell>
        <TableCell align="right">
          {totalAnnualEnergyProduction > 10000 ? (
            <b>{(totalAnnualEnergyProduction / 1000).toFixed(2)} MWh</b>
          ) : (
            <b>{totalAnnualEnergyProduction} kWh</b>
          )}
        </TableCell>
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

const Inventory = () => {
  const [category, setCategory] = useState([])
  const [clearVal, setClearVal] = useState(false)
  const [project, setProject] = useState('')
  const [active, setActive] = useState(false)
  const inventories = useSelector(selectAllInventories)
  const [query, setQuery] = useState("")
  const [searchParam] = useState(["city", "province"])
  const data = Object.values(inventories)
  // Uploader filter state
  const uploaderOptions = [...new Set(inventories.map(inv => inv.username).filter(Boolean))];
  const [uploaderFilter, setUploaderFilter] = useState([]);

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
  const [netMeteredFilter, setNetMeteredFilter] = useState([]);
  const [ownUseFilter, setOwnUseFilter] = useState([]);
  const [solarSystemTypeFilter, setSolarSystemTypeFilter] = useState(["Hybrid", "Off-grid", "Grid-tied"])
  const [loading, setLoading] = useState(false)
  const [loadingOv, setLoadingOv] = useState(false)

  let solarEnergy = []
  let biomassEnergy = []
  let windEnergy = []

  inventories.forEach((inventory) => {
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
    const { target: { value } } = event;
    setStatusFilter(typeof value === 'string' ? value.split(',') : value);
  }
  const onSolarChecked = (event) => {
    const { target: { value } } = event;
    setSolarUsageFilter(typeof value === 'string' ? value.split(',') : value);
  }
  const onSolarSystemTypeChecked = (event) => {
    const { target: { value } } = event;
    setSolarSystemTypeFilter(typeof value === 'string' ? value.split(',') : value);
  }
  const onBiomassChecked = (event) => {
    const { target: { value } } = event;
    setBiomassUsageFilter(typeof value === 'string' ? value.split(',') : value);
  }
  const onWindChecked = (event) => {
    const { target: { value } } = event;
    setWindUsageFilter(typeof value === 'string' ? value.split(',') : value);
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
    reCats.forEach((type) => type.checked = false)
  }, [location, category])

  useEffect(() => {
    setCategory(reCats)
  }, [])

  const clearAll = () => {
    reCats.forEach((type) => type.checked = false)
    setClearVal(true)
    setFilters({ contNames: contNames })
    setCategory([...reCats])
    setPosition(null)
    setQuery("")
    setUploaderFilter([]) // <--- CLEAR uploader filter too!
    setSolarUsageFilter(rawSolarUsage.map(item => item.name))
    setStatusFilter(Status.map(item => item.name))
    setBiomassUsageFilter(rawBiomassPriUsage.map(item => item.name))
    setWindUsageFilter(rawWindUsage.map(item => item.name))
    setNetMeteredFilter(['Yes', 'No'])
    setOwnUseFilter(['Yes', 'No'])
    setSolarSystemTypeFilter(["Hybrid", "Off-grid", "Grid-tied"])
  }
  const onAddClicked = () => navigate("/dashboard/inventories/new")

  const [filters, setFilters] = useState({ contNames })
  const [openDrawer, setDrawer] = useState(false)

  const handleDrawerOpen = () => {
    setDrawer(true)
    if (solarProvFilter.length === 0) setSolarProvFilter(solarProvince)
    if (bioProvFilter.length === 0) setBioProvFilter(biomassProvince)
    if (windProvFilter.length === 0) setWindProvFilter(windProvince)
  }
  const handleDrawerClose = () => setDrawer(false)

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

  useEffect(() => {
    if (filters.contNames.includes('Solar Energy')) {
      setSolarUsageFilter(rawSolarUsage.map(item => item.name))
      setSolarProvFilter(solarProvince)
      setSolarSystemTypeFilter(["Hybrid", "Off-grid", "Grid-tied"])
    }
    if (filters.contNames.includes('Biomass')) {
      setBiomassUsageFilter(rawBiomassPriUsage.map(item => item.name))
      setBioProvFilter(biomassProvince)
    }
    if (filters.contNames.includes('Wind Energy')) {
      setWindUsageFilter(rawWindUsage.map(item => item.name))
      setWindProvFilter(windProvince)
    }
  }, [filters])

  const onEachRE = (feature, layer) => {
    if (feature.properties?.reCat === 'Solar Energy') {
      layer.setStyle({ radius: 8, className: 'solarEnergy' })
    }
    if (feature.properties?.reCat === 'Biomass') {
      layer.setStyle({ radius: 8, className: 'biomassEnergy' })
    }
    if (feature.properties?.reCat === 'Wind Energy') {
      layer.setStyle({ radius: 8, className: 'windEnergy' })
    }
    if (feature.properties?.reCat === 'Hydropower') {
      layer.setStyle({ radius: 8, className: 'hydroPower' })
    }
    if (feature.properties) {
      layer.bindPopup(feature.properties.reCat)
    }
  }
  const pointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, {});
  };

  const FilterRE = () => (
    <Tooltip title="Filter settings" placement="left-start">
      <button className="leaflet-control-layers controlStyle" aria-label="place-icon" onClick={handleDrawerOpen}>
        <FilterListIcon fontSize="small" />
      </button>
    </Tooltip>
  )

  const AddRE = () => (
    <Tooltip title="Add Inventory" placement="left-start">
      <button className="leaflet-control-layers controlStyle" aria-label="place-icon" onClick={onAddClicked}>
        <AddIcon fontSize="small" />
      </button>
    </Tooltip>
  )

  const BaseLayerChange = () => {
    useMapEvents({
      overlayremove() {
        setLoadingOv(false)
      }
    })
    return null
  }

  // --- FILTER LOGIC UPDATE: now includes uploader filter ---
  const filteredInventories = search(data).filter((inventory) => {
    // Uploader filter
    if (uploaderFilter.length > 0 && !uploaderFilter.includes(inventory.username)) return false;

    if (filters.contNames.includes(inventory.properties.reCat)) return false

    if (inventory.properties.reCat === 'Solar Energy') {
      const isPowerGen = solarUsageFilter.includes("Power Generation")
      return (
        solarUsageFilter.includes(inventory.assessment.solarUsage) &&
        statusFilter.includes(inventory.assessment.status) &&
        (netMeteredFilter.length === 0 || netMeteredFilter.includes(inventory.properties.isNetMetered)) &&
        (ownUseFilter.length === 0 || ownUseFilter.includes(inventory.properties.ownUse)) &&
        (!isPowerGen ||
          (isPowerGen && (
            solarSystemTypeFilter.length === 0 || 
            solarSystemTypeFilter.includes(inventory.assessment.solarSystemTypes)
          ))
        )
      )
    }
    if (inventory.properties.reCat === 'Biomass') {
      return (
        biomassUsageFilter.includes(inventory.assessment.biomassPriUsage) &&
        statusFilter.includes(inventory.assessment.status)
      )
    }
    if (inventory.properties.reCat === 'Wind Energy') {
      return (
        windUsageFilter.includes(inventory.assessment.windUsage) &&
        statusFilter.includes(inventory.assessment.status)
      )
    }
    return false
  })

  if (inventories) {
    return (
      <>
        <Box style={{ height: "91vh" }}>
          <MapContainer
            style={{ height: "100%" }}
            center={[12.512797, 122.395164]}
            zoom={5}
            scrollWheelZoom={true}
            zoomControl={false}
            doubleClickZoom={false}
            minZoom={1}
          >
            {position == null ? null :
              <Marker position={[...position].reverse()}
                eventHandlers={{
                  click: () => {
                    setActive(true)
                  },
                }}
              />
            }
            <BaseLayerChange />
            <LayersControl position="topleft" >
              <LayersControl.BaseLayer name="OpenStreetMap">
                <TileLayer
                  eventHandlers={{ loading: () => setLoading(true), load: () => setLoading(false) }}
                  attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer checked name="Esri ArcGIS World Imagery">
                <TileLayer
                  eventHandlers={{ loading: () => setLoading(true), load: () => setLoading(false) }}
                  attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  className="basemap"
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>
              <LayersControl.Overlay name="Open Weather Map" >
                <LayerGroup>
                  <TileLayer
                    eventHandlers={{ loading: () => setLoadingOv(true), load: () => setLoadingOv(false) }}
                    url="https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=a30ee7b050677eb2e7e16b14dc7080a5"
                  />
                  <TileLayer
                    url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=a30ee7b050677eb2e7e16b14dc7080a5"
                  />
                  <TileLayer
                    url="https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=a30ee7b050677eb2e7e16b14dc7080a5"
                  />
                </LayerGroup>
              </LayersControl.Overlay>
              <LayersControl.Overlay name="OWM Temperature" >
                <TileLayer
                  eventHandlers={{ loading: () => setLoadingOv(true), load: () => setLoadingOv(false) }}
                  url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=a30ee7b050677eb2e7e16b14dc7080a5"
                />
              </LayersControl.Overlay>
            </LayersControl>
            {/* GeoJSON: always wrap as Feature */}
            {filteredInventories.map((inventory, index) => {
              const feature = toGeoJSONFeature(inventory)
              if (!feature) return null
              return (
                <GeoJSON
                  key={feature.id || index}
                  data={feature}
                  onEachFeature={onEachRE}
                  pointToLayer={pointToLayer}
                  eventHandlers={{
                    click: () => {
                      setActive(true)
                      setProject(inventory)
                      setPosition(Array.isArray(inventory.coordinates)
                        ? inventory.coordinates
                        : inventory.coordinates?.coordinates
                      )
                    },
                  }}
                />
              )
            })}
            <Control position="topright">
              <FilterRE />
              <Drawer
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
                    {/* --- Uploader filter UI --- */}
                    <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                      <InputLabel id="uploader-filter-label">Filter by Uploader</InputLabel>
                      <Select
                        labelId="uploader-filter-label"
                        id="uploader-filter"
                        multiple
                        value={uploaderFilter}
                        onChange={e =>
                          setUploaderFilter(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)
                        }
                        input={<OutlinedInput label="Filter by Uploader" />}
                        renderValue={selected => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {uploaderOptions.map((name, idx) => (
                          <MenuItem key={idx} value={name}>
                            <Checkbox checked={uploaderFilter.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/* --- End uploader filter UI --- */}
                    <Typography variant="h6" gutterBottom>
                      RE categories
                    </Typography>
                    <FormGroup>
                      {category.map((type, index) => (
                        <div key={index}>
                          <FormControlLabel
                            label={
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                              }}>
                                <CircleIcon fontSize='small' style={
                                  type.contName === "Solar Energy" ? { stroke: '#000', color: '#FFBF00', marginRight: '5px' } :
                                  type.contName === "Biomass" ? { stroke: '#000', color: '#947b4f', marginRight: '5px' } :
                                  type.contName === "Wind Energy" ? { stroke: '#000', color: '#f3ebe8', marginRight: '5px' } :
                                  type.contName === "Hydropower" ? { stroke: '#000', color: '#1e2f97', marginRight: '5px' } :
                                  null
                                } />
                                <span>{type.contName}</span>
                              </div>
                            }
                            key={index}
                            control={
                              <Checkbox
                                checked={type.checked}
                                indeterminate={
                                  type.contName === 'Solar Energy'
                                    ? (rawSolarUsage.map(item => solarUsageFilter.indexOf(item.name)).includes(-1)) ||
                                      (solarProvince.map(item => solarProvFilter.indexOf(item)).includes(-1))
                                    : type.contName === 'Biomass'
                                    ? (rawBiomassPriUsage.map(item => biomassUsageFilter.indexOf(item.name)).includes(-1)) ||
                                      (biomassProvince.map(item => bioProvFilter.indexOf(item)).includes(-1))
                                    : type.contName === 'Wind Energy'
                                    ? (rawWindUsage.map(item => windUsageFilter.indexOf(item.name)).includes(-1)) ||
                                      (windProvince.map(item => windProvFilter.indexOf(item)).includes(-1))
                                    : false
                                }
                                onChange={handleChange(type.contName, index)}
                              />
                            }
                          />
                          {!filters.contNames.includes(type.contName) && (
                            <div>
                              <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel id="multiple-checkbox-label">Select Usage</InputLabel>
                                {type.contName === 'Solar Energy' ? (
                                  <>
                                    <Select
                                      size="small"
                                      id="solar-usage-checkbox"
                                      multiple
                                      value={solarUsageFilter}
                                      onChange={onSolarChecked}
                                      input={<OutlinedInput label="Select Usage" />}
                                      renderValue={(selected) => selected.join(', ')}
                                      MenuProps={MenuProps}
                                    >
                                      {rawSolarUsage.map((value, idx) => (
                                        <MenuItem key={idx} value={value.name}>
                                          <Checkbox checked={solarUsageFilter.indexOf(value.name) > -1} />
                                          <ListItemText primary={value.name} />
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {/* Show Solar System Type filter only if "Power Generation" is selected */}
                                    {solarUsageFilter.includes("Power Generation") && (
                                    <FormControl sx={{ marginTop: 2, width: 300 }}>
                                      <InputLabel id="solar-system-type-label">Solar System Type</InputLabel>
                                      <Select
                                        size="small"
                                        labelId="solar-system-type-label"
                                        id="solar-system-type-checkbox"
                                        multiple
                                        value={solarSystemTypeFilter}
                                        onChange={onSolarSystemTypeChecked}
                                        input={<OutlinedInput label="Solar System Type" />}
                                        renderValue={selected => selected.join(', ')}
                                        MenuProps={MenuProps}
                                      >
                                        {["Hybrid", "Off-grid", "Grid-tied"].map(type => (
                                          <MenuItem key={type} value={type}>
                                            <Checkbox checked={solarSystemTypeFilter.indexOf(type) > -1} />
                                            <ListItemText primary={type} />
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  )}

                                    {/* Status */}
                                    <FormControl sx={{ marginTop: 2, width: 300 }}>
                                      <InputLabel id="status-label">Status</InputLabel>
                                      <Select
                                        size="small"
                                        labelId="status-label"
                                        id="status-select"
                                        multiple
                                        value={statusFilter}
                                        onChange={onStatusFilterChanged}
                                        input={<OutlinedInput label="Status" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                      >
                                        {Status.map((value, idx) => (
                                          <MenuItem key={idx} value={value.name}>
                                            <Checkbox checked={statusFilter.indexOf(value.name) > -1} />
                                            <ListItemText primary={value.name} />
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                    {/* Net Metered */}
                                    <FormControl sx={{ marginTop: 2, width: 300 }}>
                                      <InputLabel id="net-metered-label">Net Metered</InputLabel>
                                      <Select
                                        size="small"
                                        labelId="net-metered-label"
                                        id="net-metered-select"
                                        multiple
                                        value={netMeteredFilter}
                                        onChange={e =>
                                          setNetMeteredFilter(
                                            typeof e.target.value === 'string'
                                              ? e.target.value.split(',')
                                              : e.target.value
                                          )
                                        }
                                        input={<OutlinedInput label="Net Metered" />}
                                        renderValue={selected => selected.join(', ')}
                                        MenuProps={MenuProps}
                                      >
                                        <MenuItem value="Yes">
                                          <Checkbox checked={netMeteredFilter.indexOf('Yes') > -1} />
                                          <ListItemText primary="Yes" />
                                        </MenuItem>
                                        <MenuItem value="No">
                                          <Checkbox checked={netMeteredFilter.indexOf('No') > -1} />
                                          <ListItemText primary="No" />
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                    {/* Own Use */}
                                    <FormControl sx={{ marginTop: 2, width: 300 }}>
                                      <InputLabel id="own-use-label">Own Use</InputLabel>
                                      <Select
                                        size="small"
                                        labelId="own-use-label"
                                        id="own-use-select"
                                        multiple
                                        value={ownUseFilter}
                                        onChange={e =>
                                          setOwnUseFilter(
                                            typeof e.target.value === 'string'
                                              ? e.target.value.split(',')
                                              : e.target.value
                                          )
                                        }
                                        input={<OutlinedInput label="Own Use" />}
                                        renderValue={selected => selected.join(', ')}
                                        MenuProps={MenuProps}
                                      >
                                        <MenuItem value="Yes">
                                          <Checkbox checked={ownUseFilter.indexOf('Yes') > -1} />
                                          <ListItemText primary="Yes" />
                                        </MenuItem>
                                        <MenuItem value="No">
                                          <Checkbox checked={ownUseFilter.indexOf('No') > -1} />
                                          <ListItemText primary="No" />
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  </>
                                ) : type.contName === 'Biomass' ? (
                                  <Select
                                    size="small"
                                    id="biomass-usage-checkbox"
                                    multiple
                                    value={biomassUsageFilter}
                                    onChange={onBiomassChecked}
                                    input={<OutlinedInput label="Select Usage" />}
                                    renderValue={selected => selected.join(', ')}
                                    MenuProps={MenuProps}
                                  >
                                    {rawBiomassPriUsage.map((value, idx) => (
                                      <MenuItem key={idx} value={value.name}>
                                        <Checkbox checked={biomassUsageFilter.indexOf(value.name) > -1} />
                                        <ListItemText primary={value.name} />
                                      </MenuItem>
                                    ))}
                                  </Select>
                                ) : type.contName === 'Wind Energy' ? (
                                  <Select
                                    size="small"
                                    id="wind-usage-checkbox"
                                    multiple
                                    value={windUsageFilter}
                                    onChange={onWindChecked}
                                    input={<OutlinedInput label="Select Usage" />}
                                    renderValue={selected => selected.join(', ')}
                                    MenuProps={MenuProps}
                                  >
                                    {rawWindUsage.map((value, idx) => (
                                      <MenuItem key={idx} value={value.name}>
                                        <Checkbox checked={windUsageFilter.indexOf(value.name) > -1} />
                                        <ListItemText primary={value.name} />
                                      </MenuItem>
                                    ))}
                                  </Select>
                                ) : type.contName === 'Hydropower' ? (
                                  <Select
                                    size="small"
                                    id="hydro-usage-checkbox"
                                    multiple
                                    value={['not available']}
                                    onChange={onWindChecked}
                                    input={<OutlinedInput label="Not yet available" />}
                                    renderValue={selected => selected.join(', ')}
                                    MenuProps={MenuProps}
                                  >
                                    <MenuItem key="hydro" value={['not available']}>
                                      <Checkbox checked={true} />
                                      <ListItemText primary={['not available']} />
                                    </MenuItem>
                                  </Select>
                                ) : null}
                              </FormControl>
                            </div>
                          )}
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
              </Drawer>
            </Control>
            <Control position="topright">
            <RElist setClearVal={setClearVal} clearVal={clearVal} />
            </Control>
            <ZoomControl position="bottomright" />
            <Control position="topright">
              <AddRE />
            </Control>
            <Control position="topright">
              {(loading || loadingOv) &&
                <FadeLoader color={"#ffd15d"} />
              }
            </Control>
          </MapContainer>
          <SnackBar setActive={setActive} active={active} project={project} />
        </Box>
      </>
    )
  } else return null
}

const memoizedInventory = memo(Inventory)
export default memoizedInventory