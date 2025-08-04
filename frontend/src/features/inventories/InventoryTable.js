import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAllInventories, useDeleteInventoryMutation } from './inventoriesApiSlice';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Modal, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Paper,
  Tooltip
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ListAlt as ListAltIcon } from '@mui/icons-material';
import { modalStyle, scrollbarStyle } from '../../config/style';
import useAuth from '../../hooks/useAuth';

const InventoryTable = ({ setClearVal, clearVal, onFlyTo }) => {
  const { isManager, isAdmin } = useAuth();
  const [project, setProject] = useState('');
  const [REClass, setREClass] = useState("Non-Commercial");
  const [openModal, setOpenModal] = useState(false);
  const [multiDelete, setMultiDelete] = useState([]);
  const navigate = useNavigate();
  const inventories = useSelector(selectAllInventories);
  
  // Summary stats
  const [solarStTotal, setSolarStTotal] = useState(0);
  const [solarPumpTotal, setSolarPumpTotal] = useState(0);
  const [solarPowerGenTotal, setSolarPowerGenTotal] = useState(0);
  const [solarStTotalCap, setSolarStTotalCap] = useState(0);
  const [solarPumpTotalCap, setSolarPumpTotalCap] = useState(0);
  const [solarPowerGenTotalCap, setSolarPowerGenTotalCap] = useState(0);
  const [solarStTotalUnit, setSolarStTotalUnit] = useState(0);
  const [solarPumpTotalUnit, setSolarPumpTotalUnit] = useState(0);
  const [solarPowerGenTotalUnit, setSolarPowerGenTotalUnit] = useState(0);
  const [totalAnnualEnergyProduction, setTotalAnnualEnergyProduction] = useState(0);
  const [position, setPosition] = useState(null);

  const [deleteInventory, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delerror
  }] = useDeleteInventoryMutation();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleREClass = (e) => setREClass(e.target.value);
  
  const onDeleteInventoryClicked = async () => {  
    await deleteInventory({ id: multiDelete });
  };

  useEffect(() => {
    if (isDelSuccess) {
      navigate(0);
    }
  }, [isDelSuccess, navigate]);

  useEffect(() => {
    setPosition(null);
    setClearVal(false);
  }, [clearVal, setClearVal]);

  const dateNow = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  const sunHour = 4.7;

  const getAddress = (params) => {
    const filtered = Object.values(params.row.properties.address).filter(function (x) { return x !== 'Philippines' });
    return `${filtered[0]}, ${filtered[1]}, ${filtered[2]}, ${filtered[3]}`;
  };

  const fly = (params) => {
    setProject(params?.row);
    setOpenModal(false);
    const locate = params?.row?.coordinates;
    setPosition(locate);
    onFlyTo(locate);
  };

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
    );
  };

  // Base columns that are always shown
  const baseColumns = [
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
          return inventories.row.assessment.solarUsage;
        }
        if (inventories.row.properties.reCat === 'Biomass') {
          return inventories.row.assessment.biomassPriUsage;
        }
        if (inventories.row.properties.reCat === 'Wind Energy') {
          return inventories.row.assessment.windUsage;
        }
        return "n/a";
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
    }
  ];

  // Columns shown for Commercial RE
  const commercialSpecificColumns = [
    {
      field: 'fitPhase',
      headerName: 'FIT Phase',
      width: 120,
      filterable: true,
      type: 'singleSelect',
      valueOptions: ['FIT1', 'FIT2', 'Non-FIT'],
      valueGetter: (inventories) => 
        inventories.row?.properties?.fit?.phase || 'Non-FIT',
      disableClickEventBubbling: true,
    }
  ];

  // Columns shown for Non-Commercial RE
  const nonCommercialSpecificColumns = [
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
    }
  ];

  // Common columns shown after type-specific columns
  const commonTrailingColumns = [
    {
      field: 'capacity',
      headerName: 'Capacity',
      width: 100,
      type: 'number',
      valueGetter: (inventories) => {
        if (inventories.row.assessment.solarStreetLights) {
          const rawSolarItems = inventories.row.assessment.solarStreetLights;
          const product = rawSolarItems.map((solar => solar.capacity * solar.pcs));
          const initialValue = 0;
          const rawSolarStreet = product.reduce((accumulator, currentValue) =>
            accumulator + currentValue, initialValue
          );
          return `${rawSolarStreet / 1000} kWp`;
        }
        if (inventories.row.properties.reCat === 'Solar Energy') {
          return `${inventories.row.assessment.capacity / 1000} kWp`;
        }
        if (inventories.row.properties.reCat === 'Biomass') {
          return `${inventories.row.assessment.capacity} m³`;
        }
        if (inventories.row.properties.reCat === 'Wind Energy') {
          return `${inventories.row.assessment.capacity / 1000} kWp`;
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
        const noOfYear = parseInt(inventories.row.properties.yearEst);
        let dateEst = new Date(`1/1/${noOfYear}`);
        let dateCreated = new Date(inventories.row.createdAt);
        const dateCreatedConv = dateCreated.toLocaleDateString();
        const diffInTime = dateCreated.getTime() - dateEst.getTime();
        const noOfDays = Math.round(diffInTime / oneDay);

        if (inventories.row.assessment.solarStreetLights) {
          const rawSolarItems = inventories.row.assessment.solarStreetLights;
          const product = rawSolarItems.map((solar => solar.capacity * solar.pcs));
          const initialValue = 0;
          const rawSolarStreet = product.reduce((accumulator, currentValue) =>
            accumulator + currentValue, initialValue
          );
          return `${Math.round((rawSolarStreet / 1000) * sunHour * noOfDays)} kWh as of ${dateCreatedConv}`;
        }
        if (inventories.row.properties.reCat === 'Solar Energy') {
          return `${Math.round((inventories.row.assessment.capacity / 1000) * sunHour * noOfDays)} kWh as of ${dateCreatedConv}`;
        }
        return "n/a";
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
  ];

  // Build columns based on selected class
  const columns = [
    ...baseColumns,
    ...(REClass === "Commercial" ? commercialSpecificColumns : nonCommercialSpecificColumns),
    ...commonTrailingColumns
  ];

  // Get filtered inventories based on class
  const getInventoriesByClass = () => {
    return REClass === "Commercial" 
      ? inventories.filter(item => item.properties.reClass === "Commercial")
      : REClass === "gencompany"
        ? inventories.filter(item => item.properties.reClass === "gencompany")
        : inventories.filter(item => !item.properties.reClass || item.properties.reClass === "Non-Commercial");
  };

  return (
    <>
      <Tooltip title="Renewable Energy list" placement="left-start">
        <button className="leaflet-control-layers controlStyle" aria-label="place-icon" onClick={handleOpenModal}>
          <ListAltIcon fontSize="small" />
        </button>
      </Tooltip>
      
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
                <MenuItem value={"Commercial"}>Commercial</MenuItem>
                <MenuItem value={"gencompany"}>Generating Company</MenuItem>
              </Select>
            </FormControl>
            
            {isAdmin && (
              <Button
                variant='contained'
                sx={{ m: 1, backgroundColor: 'custom.error', display: multiDelete.length === 0 ? 'none' : 'inline' }}
                onClick={onDeleteInventoryClicked}
              >
                Delete
              </Button>
            )}

            <Box sx={{ height: '60vh', width: '100%', display: REClass === "Non-Commercial" || REClass === "Commercial" || REClass === "gencompany" ? 'block' : 'none' }}>
              <DataGrid
                onStateChange={(state) => {
                  let rawSolarPowerGen = [];
                  let rawSolarValue = [];
                  let rawSolarPumpValue = [];

                  let rawSolarPowerGenCap = [];
                  let rawSolarValueCap = [];
                  let rawSolarPumpValueCap = [];

                  let rawSolarPowerGenUnits = [];
                  let rawSolarStUnits = [];
                  let rawSolarPumpUnits = [];

                  const visibleRows = state.filter.visibleRowsLookup;
                  let visibleItems = [];
                  for (const [id, value] of Object.entries(visibleRows)) {
                    if (value === true) {
                      visibleItems.push(id);
                    }
                  }
                  
                  const result = inventories.filter((item) => visibleItems.includes(item.id));
                  
                  result.forEach((inventory) => {
                    const noOfYear = parseInt(inventory.properties.yearEst);
                    let dateEst = new Date(`1/1/${noOfYear}`);
                    let dateCreated = new Date(inventory?.createdAt);
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
                      rawSolarValue.push(rawGen);
                      rawSolarValueCap.push(rawSolarStreet);
                      rawSolarStUnits.push(rawSolarStUnt);
                    }

                    if (inventory.assessment.solarUsage === 'Power Generation' && 
                        (REClass === "Commercial" ? inventory.properties.reClass === "Commercial" : 
                         REClass === "Non-Commercial" ? inventory.properties.reClass === "Non-Commercial" || !inventory.properties.reClass : 
                         true)) {
                      const rawGen = Math.round((inventory.assessment.capacity / 1000) * sunHour * noOfDays);
                      rawSolarPowerGen.push(rawGen);
                      rawSolarPowerGenCap.push(Math.round(inventory.assessment.capacity));
                      rawSolarPowerGenUnits.push(inventory.assessment.solarUsage);
                    }
                    
                    if (inventory.assessment.solarUsage === 'Solar Pump') {
                      const rawGen = Math.round((inventory.assessment.capacity / 1000) * sunHour * noOfDays);
                      rawSolarPumpValue.push(rawGen);
                      rawSolarPumpValueCap.push(Math.round(inventory.assessment.capacity));
                      rawSolarPumpUnits.push(inventory.assessment.solarUsage);
                    }
                  });
                  
                  // Calculate annual energy production
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

                  // Calculate totals
                  const solarStCaptotal = rawSolarValueCap.reduce((a, b) => a + b, 0);
                  const powerGenCapTotal = rawSolarPowerGenCap.reduce((a, b) => a + b, 0);
                  const solarPumpCapTotal = rawSolarPumpValueCap.reduce((a, b) => a + b, 0);

                  const solarSttotal = rawSolarValue.reduce((a, b) => a + b, 0);
                  const powerGenTotal = rawSolarPowerGen.reduce((a, b) => a + b, 0);
                  const solarPumpTotal = rawSolarPumpValue.reduce((a, b) => a + b, 0);

                  const solarStUnitTotal = rawSolarStUnits.reduce((a, b) => a + b, 0);

                  setSolarStTotalUnit(solarStUnitTotal);
                  setSolarPowerGenTotalUnit(rawSolarPowerGenUnits.length);
                  setSolarPumpTotalUnit(rawSolarPumpUnits.length);

                  setSolarStTotalCap(solarStCaptotal / 1000);
                  setSolarPowerGenTotalCap(powerGenCapTotal / 1000);
                  setSolarPumpTotalCap(solarPumpCapTotal / 1000);

                  setSolarStTotal(solarSttotal);
                  setSolarPowerGenTotal(powerGenTotal);
                  setSolarPumpTotal(solarPumpTotal);
                }}
                rows={getInventoriesByClass()}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 20,
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
                checkboxSelection={isAdmin}
                onRowSelectionModelChange={(ids) => {
                  setMultiDelete(ids);
                }}
              />
            </Box>
          </form>

          {REClass === "Commercial" || REClass === "Non-Commercial" ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <FormControl variant="standard" sx={{ minWidth: 120 }} size="small">
                        <InputLabel id="summary-select-label">
                          Summary<small>(by usage)</small>
                        </InputLabel>
                        <Select
                          labelId="summary-select-label"
                          id="summary-select"
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
          ) : null}
        </Box>
      </Modal>
    </>
  );
};

export default InventoryTable;