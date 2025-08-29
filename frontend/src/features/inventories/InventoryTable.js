import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAllInventories, useDeleteInventoryMutation } from './inventoriesApiSlice';
import { useGetInventoryListQuery, useGetInventoryListSummaryQuery } from './inventoryListApiSlice';
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
  Tooltip,
  Pagination,
  Chip,
  Avatar,
  Typography,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
  ListAlt as ListAltIcon,
  SolarPower as SolarIcon,
  Air as WindIcon,
  Grass as BiomassIcon,
  Opacity as HydroIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  MyLocation as LocateIcon,
  Search as SearchIcon,
  Thermostat as ThermostatIcon
} from '@mui/icons-material';
import { modalStyle, scrollbarStyle } from '../../config/style';
import useAuth from '../../hooks/useAuth';

const InventoryTable = ({ setClearVal, clearVal, onFlyTo }) => {
  const { isManager, isAdmin, username } = useAuth();
  const [project, setProject] = useState('');
  const [REClass, setREClass] = useState("All");
  const [summaryType, setSummaryType] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [multiDelete, setMultiDelete] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [quickSearchValue, setQuickSearchValue] = useState('');
  const navigate = useNavigate();
  
  // Build filters for API
  const filters = {
    reClass: REClass === "All" ? "All" : 
             REClass === "Commercial" ? "Commercial" : 
             REClass === "gencompany" ? "gencompany" : "Non-Commercial",
    quickSearch: quickSearchValue || undefined
  };
  
  // Use paginated API for table data
  const { 
    data: paginatedData, 
    isLoading: isLoadingPaginated,
    error: paginatedError 
  } = useGetInventoryListQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    username,
    isAdmin,
    filters
  });
  
  // Use summary API for calculations (all data)
  const { 
    data: summaryData = [], 
    isLoading: isLoadingSummary 
  } = useGetInventoryListSummaryQuery({
    username,
    isAdmin,
    filters
  });
  
  const inventories = paginatedData?.data || [];
  const meta = paginatedData?.meta || { page: 1, total: 0, limit: 20, totalPages: 0 };
  const allInventories = summaryData; // For calculations
  
  // Debug: Check if summary data is being filtered correctly
  console.log('InventoryTable - API data check:', {
    paginatedDataCount: inventories.length,
    summaryDataCount: allInventories?.length || 0,
    reClassFilter: REClass,
    filters: filters,
    summaryDataSample: allInventories?.slice(0, 2).map(inv => ({
      id: inv._id,
      reClass: inv.properties?.reClass,
      reCat: inv.properties?.reCat
    }))
  });
  
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
  
  // Other energy types stats
  const [windTotal, setWindTotal] = useState(0);
  const [windTotalCap, setWindTotalCap] = useState(0);
  const [windTotalUnit, setWindTotalUnit] = useState(0);
  const [biomassTotal, setBiomassTotal] = useState(0);
  const [biomassTotalCap, setBiomassTotalCap] = useState(0);
  const [biomassTotalUnit, setBiomassTotalUnit] = useState(0);
  const [hydropowerTotal, setHydropowerTotal] = useState(0);
  const [hydropowerTotalCap, setHydropowerTotalCap] = useState(0);
  const [hydropowerTotalUnit, setHydropowerTotalUnit] = useState(0);
  
  const [totalAnnualEnergyProduction, setTotalAnnualEnergyProduction] = useState(0);
  const [position, setPosition] = useState(null);

  const [deleteInventory, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delerror
  }] = useDeleteInventoryMutation();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleREClass = (e) => {
    setREClass(e.target.value);
    // Reset pagination when filter changes
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  };

  const handleSummaryType = (e) => {
    setSummaryType(e.target.value);
  };

  const handleQuickSearchChange = (searchValue) => {
    setQuickSearchValue(searchValue);
    // Reset pagination when search changes
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      // The search will trigger automatically when quickSearchValue changes
      // due to the filters dependency in the API call
    }, 500);
    
    return () => clearTimeout(timer);
  }, [quickSearchValue]);
  
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

  // Calculate summary statistics from all inventories
  useEffect(() => {
    if (!allInventories || allInventories.length === 0) return;
    
    // Additional safety check: Ensure allInventories is a valid array
    if (!Array.isArray(allInventories)) {
      console.log('InventoryTable - allInventories is not an array:', typeof allInventories);
      return;
    }
    
    // Debug logging
    console.log('InventoryTable - Data received:', {
      totalInventories: allInventories.length,
      reClassFilter: REClass,
      filters: filters,
      sampleInventories: allInventories.slice(0, 3).map(inv => ({
        id: inv._id,
        reClass: inv.properties?.reClass,
        reCat: inv.properties?.reCat,
        capacity: inv.assessment?.capacity
      }))
    });
    
    // Debug: Count inventories by classification
    const classificationCounts = allInventories.reduce((acc, inv) => {
      const reClass = inv.properties?.reClass || 'Unknown';
      acc[reClass] = (acc[reClass] || 0) + 1;
      return acc;
    }, {});
    console.log('InventoryTable - Classification counts:', classificationCounts);
    
    // Debug: Show some capacity values by classification
    const capacityByClass = allInventories.reduce((acc, inv) => {
      const reClass = inv.properties?.reClass || 'Unknown';
      const reCat = inv.properties?.reCat;
      let capacity = 0;
      
      if (reCat === 'Solar Energy') {
        if (inv.assessment?.solarStreetLights) {
          capacity = inv.assessment.solarStreetLights.reduce((sum, solar) => {
            const cap = (parseFloat(solar.capacity) || 0) / 1000; // Convert W to kW
            const pcs = parseInt(solar.pcs, 10) || 0;
            return sum + (cap * pcs);
          }, 0);
        } else if (inv.assessment?.solarUsage === 'Power Generation') {
          capacity = (parseFloat(inv.assessment.capacity) || 0) / 1000; // Convert W to kW
        } else if (inv.assessment?.solarUsage === 'Solar Pump') {
          capacity = (parseFloat(inv.assessment.capacity) || 0) / 1000; // Convert W to kW
        }
      } else if (reCat === 'Wind Energy') {
        capacity = (parseFloat(inv.assessment?.capacity) || 0) / 1000; // Convert W to kW
      } else if (reCat === 'Biomass') {
        capacity = (parseFloat(inv.assessment?.capacity) || 0) / 1000; // Convert W to kW
      } else if (reCat === 'Hydropower') {
        capacity = (parseFloat(inv.assessment?.capacity) || 0) / 1000; // Convert W to kW
      }
      
      if (!acc[reClass]) acc[reClass] = [];
      acc[reClass].push({ reCat, capacity, id: inv._id });
      return acc;
    }, {});
    console.log('InventoryTable - Capacity by classification:', capacityByClass);

    let rawSolarPowerGen = [];
    let rawSolarValue = [];
    let rawSolarPumpValue = [];

    let rawSolarPowerGenCap = [];
    let rawSolarValueCap = [];
    let rawSolarPumpValueCap = [];

    let rawSolarPowerGenUnits = [];
    let rawSolarStUnits = [];
    let rawSolarPumpUnits = [];
    
    // Raw arrays for other energy types
    let rawWindTotal = [];
    let rawWindTotalCap = [];
    let rawWindTotalUnit = [];
    let rawBiomassTotal = [];
    let rawBiomassTotalCap = [];
    let rawBiomassTotalUnit = [];
    let rawHydropowerTotal = [];
    let rawHydropowerTotalCap = [];
    let rawHydropowerTotalUnit = [];

    allInventories.forEach((inventory) => {
      const noOfYear = parseInt(inventory.properties.yearEst);
      let dateEst = new Date(`1/1/${noOfYear}`);
      let dateCreated = new Date(inventory?.createdAt);
      const diffInTime = dateCreated.getTime() - dateEst.getTime();
      const noOfDays = Math.round(diffInTime / oneDay);

      if (inventory.assessment.solarStreetLights) {
        const rawSolarItems = inventory.assessment.solarStreetLights;
        // Safe conversion for capacity and pcs - Convert W to kW
        const product = rawSolarItems.map(solar => {
          const cap = (parseFloat(solar.capacity) || 0) / 1000; // Convert W to kW
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
        const rawGen = Math.round(rawSolarStreet * sunHour * noOfDays); // rawSolarStreet is now in kW
        rawSolarValue.push(rawGen);
        rawSolarValueCap.push(rawSolarStreet);
        rawSolarStUnits.push(rawSolarStUnt);
      }

      if (inventory.assessment.solarUsage === 'Power Generation') {
        const capacityInKW = (inventory.assessment.capacity || 0) / 1000; // Convert W to kW
        const rawGen = Math.round(capacityInKW * sunHour * noOfDays);
        rawSolarPowerGen.push(rawGen);
        rawSolarPowerGenCap.push(Math.round(capacityInKW));
        rawSolarPowerGenUnits.push(inventory.assessment.solarUsage);
      }
      
      if (inventory.assessment.solarUsage === 'Solar Pump') {
        const capacityInKW = (inventory.assessment.capacity || 0) / 1000; // Convert W to kW
        const rawGen = Math.round(capacityInKW * sunHour * noOfDays);
        rawSolarPumpValue.push(rawGen);
        rawSolarPumpValueCap.push(Math.round(capacityInKW));
        rawSolarPumpUnits.push(inventory.assessment.solarUsage);
      }
      
      // Calculate Wind Energy
      if (inventory.properties.reCat === 'Wind Energy') {
        const windCap = (parseFloat(inventory.assessment.capacity) || 0) / 1000; // Convert W to kW
        const windGen = Math.round(windCap * 24 * 365 * 0.3); // Assuming 30% capacity factor
        rawWindTotal.push(windGen);
        rawWindTotalCap.push(windCap);
        rawWindTotalUnit.push(1);
      }
      
      // Calculate Biomass
      if (inventory.properties.reCat === 'Biomass') {
        const bioCap = (parseFloat(inventory.assessment.capacity) || 0) / 1000; // Convert W to kW
        const bioGen = Math.round((bioCap * 365 * 24 * 0.7)); // Assuming 70% capacity factor
        rawBiomassTotal.push(bioGen);
        rawBiomassTotalCap.push(bioCap);
        rawBiomassTotalUnit.push(1);
      }
      
      // Calculate Hydropower
      if (inventory.properties.reCat === 'Hydropower') {
        const hydroCap = (parseFloat(inventory.assessment.capacity) || 0) / 1000; // Convert W to kW
        const hydroGen = Math.round((hydroCap * 365 * 24 * 0.6)); // Assuming 60% capacity factor
        rawHydropowerTotal.push(hydroGen);
        rawHydropowerTotalCap.push(hydroCap);
        rawHydropowerTotalUnit.push(1);
      }
    });
    
    // Calculate annual energy production
    const totalAnnualEnergyProduction = allInventories.reduce((sum, inventory) => {
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

    // Calculate totals - Add safety checks for empty arrays
    const solarStCaptotal = rawSolarValueCap.length > 0 ? rawSolarValueCap.reduce((a, b) => a + b, 0) : 0;
    const powerGenCapTotal = rawSolarPowerGenCap.length > 0 ? rawSolarPowerGenCap.reduce((a, b) => a + b, 0) : 0;
    const solarPumpCapTotal = rawSolarPumpValueCap.length > 0 ? rawSolarPumpValueCap.reduce((a, b) => a + b, 0) : 0;

    const solarSttotal = rawSolarValue.length > 0 ? rawSolarValue.reduce((a, b) => a + b, 0) : 0;
    const powerGenTotal = rawSolarPowerGen.length > 0 ? rawSolarPowerGen.reduce((a, b) => a + b, 0) : 0;
    const solarPumpTotal = rawSolarPumpValue.length > 0 ? rawSolarPumpValue.reduce((a, b) => a + b, 0) : 0;

    const solarStUnitTotal = rawSolarStUnits.length > 0 ? rawSolarStUnits.reduce((a, b) => a + b, 0) : 0;

    setSolarStTotalUnit(solarStUnitTotal);
    setSolarPowerGenTotalUnit(rawSolarPowerGenUnits.length);
    setSolarPumpTotalUnit(rawSolarPumpUnits.length);

    setSolarStTotalCap(solarStCaptotal);
    setSolarPowerGenTotalCap(powerGenCapTotal);
    setSolarPumpTotalCap(solarPumpCapTotal);

    setSolarStTotal(solarSttotal);
    setSolarPowerGenTotal(powerGenTotal);
    setSolarPumpTotal(solarPumpTotal);
    
    // Set other energy type totals - Add safety checks for empty arrays
    setWindTotal(rawWindTotal.length > 0 ? rawWindTotal.reduce((a, b) => a + b, 0) : 0);
    setWindTotalCap(rawWindTotalCap.length > 0 ? rawWindTotalCap.reduce((a, b) => a + b, 0) : 0);
    setWindTotalUnit(rawWindTotalUnit.length > 0 ? rawWindTotalUnit.reduce((a, b) => a + b, 0) : 0);
    
    setBiomassTotal(rawBiomassTotal.length > 0 ? rawBiomassTotal.reduce((a, b) => a + b, 0) : 0);
    setBiomassTotalCap(rawBiomassTotalCap.length > 0 ? rawBiomassTotalCap.reduce((a, b) => a + b, 0) : 0);
    setBiomassTotalUnit(rawBiomassTotalUnit.length > 0 ? rawBiomassTotalUnit.reduce((a, b) => a + b, 0) : 0);
    
    setHydropowerTotal(rawHydropowerTotal.length > 0 ? rawHydropowerTotal.reduce((a, b) => a + b, 0) : 0);
    setHydropowerTotalCap(rawHydropowerTotalCap.length > 0 ? rawHydropowerTotalCap.reduce((a, b) => a + b, 0) : 0);
    setHydropowerTotalUnit(rawHydropowerTotalUnit.length > 0 ? rawHydropowerTotalUnit.reduce((a, b) => a + b, 0) : 0);
    
    // Debug logging for calculated totals
    console.log('InventoryTable - Calculated totals:', {
      solarStTotalCap: solarStCaptotal,
      solarPowerGenTotalCap: powerGenCapTotal,
      solarPumpTotalCap: solarPumpCapTotal,
      windTotalCap: rawWindTotalCap.length > 0 ? rawWindTotalCap.reduce((a, b) => a + b, 0) : 0,
      biomassTotalCap: rawBiomassTotalCap.length > 0 ? rawBiomassTotalCap.reduce((a, b) => a + b, 0) : 0,
      hydropowerTotalCap: rawHydropowerTotalCap.length > 0 ? rawHydropowerTotalCap.reduce((a, b) => a + b, 0) : 0,
      totalCapacity: (solarStCaptotal + powerGenCapTotal + solarPumpCapTotal + 
                     (rawWindTotalCap.length > 0 ? rawWindTotalCap.reduce((a, b) => a + b, 0) : 0) + 
                     (rawBiomassTotalCap.length > 0 ? rawBiomassTotalCap.reduce((a, b) => a + b, 0) : 0) + 
                     (rawHydropowerTotalCap.length > 0 ? rawHydropowerTotalCap.reduce((a, b) => a + b, 0) : 0))
    });
    
    // Debug: Show raw array contents
    console.log('InventoryTable - Raw arrays:', {
      rawSolarValueCap: rawSolarValueCap,
      rawSolarPowerGenCap: rawSolarPowerGenCap,
      rawSolarPumpValueCap: rawSolarPumpValueCap,
      rawWindTotalCap: rawWindTotalCap,
      rawBiomassTotalCap: rawBiomassTotalCap,
      rawHydropowerTotalCap: rawHydropowerTotalCap
    });
    
    // Debug: Simple capacity sum test
    const simpleCapacitySum = allInventories && allInventories.length > 0 ? allInventories.reduce((sum, inv) => {
      let capacity = 0;
      const reCat = inv.properties?.reCat;
      
      if (reCat === 'Solar Energy') {
        if (inv.assessment?.solarStreetLights) {
          capacity = inv.assessment.solarStreetLights.reduce((solarSum, solar) => {
            const cap = (parseFloat(solar.capacity) || 0) / 1000; // Convert W to kW
            const pcs = parseInt(solar.pcs, 10) || 0;
            return solarSum + (cap * pcs);
          }, 0);
        } else if (inv.assessment?.solarUsage === 'Power Generation') {
          capacity = (parseFloat(inv.assessment.capacity) || 0) / 1000; // Convert W to kW
        } else if (inv.assessment?.solarUsage === 'Solar Pump') {
          capacity = (parseFloat(inv.assessment.capacity) || 0) / 1000; // Convert W to kW
        }
      } else if (reCat === 'Wind Energy') {
        capacity = (parseFloat(inv.assessment?.capacity) || 0) / 1000; // Convert W to kW
      } else if (reCat === 'Biomass') {
        capacity = (parseFloat(inv.assessment?.capacity) || 0) / 1000; // Convert W to kW
      } else if (reCat === 'Hydropower') {
        capacity = (parseFloat(inv.assessment?.capacity) || 0) / 1000; // Convert W to kW
      }
      
      return sum + capacity;
    }, 0) : 0;
    
    console.log('InventoryTable - Simple capacity sum test:', {
      simpleCapacitySum: simpleCapacitySum, // Raw capacity in kW (converted from W)
      simpleCapacitySumMW: simpleCapacitySum / 1000, // Convert to MW
      simpleCapacitySumGW: simpleCapacitySum / 1000000, // Convert to GW
      expectedTotal: 151.90 + 0.2147, // Commercial + Non-Commercial in GW
      difference: (simpleCapacitySum / 1000000) - (151.90 + 0.2147),
      note: 'Capacity values converted from W to kW in database'
    });
  }, [allInventories, REClass]);

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
    
  // Logging removed in production
    
    // Ensure coordinates are in the correct format [longitude, latitude]
    if (locate && Array.isArray(locate) && locate.length === 2) {
      // Convert string coordinates to numbers if needed
      const coords = [
        parseFloat(locate[0]) || 0,
        parseFloat(locate[1]) || 0
      ];
      
      // Pass both the coordinates AND the project data
      onFlyTo(coords, params?.row);
    } else {
      console.warn('Invalid coordinates format:', locate);
    }
  };

  const renderLocateButton = (params) => {
    return (
      <Button
        variant="contained"
        size="small"
        startIcon={<LocateIcon />}
        onClick={() => { fly(params) }}
        sx={{
          minWidth: '80px',
          maxWidth: '100px',
          '&:hover': {
            backgroundColor: 'primary.dark',
          }
        }}
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
      width: 180,
      valueGetter: (inventories) => inventories.row.properties.ownerName,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
            <PersonIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {params.value || 'Not provided'}
          </Typography>
        </Box>
      ),
      disableClickEventBubbling: true,
    },
    {
      field: 'reCat',
      headerName: 'RE Category',
      width: 140,
      filterable: true,
      type: 'singleSelect',
      valueOptions: [
        'Solar Energy',
        'Wind Energy',
        'Hydropower',
        'Biomass'
      ],
      valueGetter: (inventories) => inventories.row.properties.reCat,
      renderCell: (params) => {
        const getIcon = (category) => {
          switch (category) {
            case 'Solar Energy': return <SolarIcon fontSize="small" />;
            case 'Wind Energy': return <WindIcon fontSize="small" />;
            case 'Biomass': return <BiomassIcon fontSize="small" />;
            case 'Hydropower': return <HydroIcon fontSize="small" />;
            case 'Geothermal Energy': return <ThermostatIcon fontSize="small" />;
            default: return null;
          }
        };
        
        const getColor = (category) => {
          switch (category) {
            case 'Solar Energy': return 'warning';
            case 'Wind Energy': return 'info';
            case 'Biomass': return 'success';
            case 'Hydropower': return 'primary';
            case 'Geothermal Energy': return 'default';
            default: return 'default';
          }
        };
        
        return (
          <Chip
            icon={getIcon(params.value)}
            label={params.value}
            size="small"
            color={getColor(params.value)}
            variant="filled"
            sx={{ fontWeight: 'medium' }}
          />
        );
      },
      disableClickEventBubbling: true,
    },
    {
      field: 'reUsage',
      headerName: 'RE Usage',
      width: 150,
      valueGetter: (inventories) => {
        const recat = inventories.row.properties?.reCat;
        const a = inventories.row.assessment || {};
        if (recat === 'Solar Energy') return a.solarUsage || 'n/a';
        if (recat === 'Biomass') return a.biomassUsage || a.biomassPriUsage || 'n/a';
        if (recat === 'Wind Energy') return a.windUsage || 'n/a';
        if (recat === 'Geothermal Energy') return a.geothermalUsage || 'n/a';
        if (recat === 'Hydropower') return a.hydroUsage || 'n/a';
        return 'n/a';
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
      width: 130,
      filterable: true,
      type: 'singleSelect',
      valueOptions: ['FIT1', 'FIT2', 'Non-FIT'],
      valueGetter: (inventories) => 
        inventories.row?.properties?.fit?.phase || 'Non-FIT',
      renderCell: (params) => {
        const value = params.value;
        return (
          <Chip 
            label={value} 
            size="small" 
            color={value === "FIT1" ? "success" : value === "FIT2" ? "warning" : "default"}
            variant="filled"
            sx={{ fontWeight: 'medium' }}
          />
        );
      },
      disableClickEventBubbling: true,
    }
  ];

  // Columns shown for Non-Commercial RE
  const nonCommercialSpecificColumns = [
    {
      field: 'isNetMetered',
      headerName: 'Net Metered',
      width: 130,
      filterable: true,
      type: 'singleSelect',
      valueOptions: ['Yes', 'No', 'n/a'],
      valueGetter: (inventories) => {
        const value = inventories.row?.properties?.isNetMetered;
        if (value === true || value === "true" || value === "Yes") return "Yes";
        if (value === false || value === "false" || value === "No") return "No";
        return "n/a";
      },
      renderCell: (params) => {
        const value = params.value;
        return (
          <Chip 
            label={value} 
            size="small" 
            color={value === "Yes" ? "success" : value === "No" ? "error" : "default"}
            variant={value === "n/a" ? "outlined" : "filled"}
            sx={{ fontWeight: 'medium' }}
          />
        );
      },
      disableClickEventBubbling: true,
    },
    {
      field: 'ownUse',
      headerName: 'Own Use',
      width: 130,
      filterable: true,
      type: 'singleSelect',
      valueOptions: ['Yes', 'No', 'n/a'],
      valueGetter: (inventories) => {
        const value = inventories.row?.properties?.ownUse;
        if (value === true || value === "true" || value === "Yes") return "Yes";
        if (value === false || value === "false" || value === "No") return "No";
        return "n/a";
      },
      renderCell: (params) => {
        const value = params.value;
        return (
          <Chip 
            label={value} 
            size="small" 
            color={value === "Yes" ? "success" : value === "No" ? "error" : "default"}
            variant={value === "n/a" ? "outlined" : "filled"}
            sx={{ fontWeight: 'medium' }}
          />
        );
      },
      disableClickEventBubbling: true,
    },
    {
      field: 'isDer',
      headerName: 'DER',
      width: 130,
      filterable: true,
      type: 'singleSelect',
      valueOptions: ['Yes', 'No'],
      valueGetter: (inventories) => inventories.row?.properties?.isDer || '',
      renderCell: (params) => {
        const value = params.value;
        if (!value) return (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Not specified
          </Typography>
        );
        return (
          <Chip 
            label={value} 
            size="small" 
            color={value === "Yes" ? "success" : "error"}
            variant="filled"
            sx={{ fontWeight: 'medium' }}
          />
        );
      },
      disableClickEventBubbling: true,
    },
    {
      field: 'establishmentType',
      headerName: 'Establishment Type',
      width: 200,
      filterable: true,
      type: 'singleSelect',
      valueOptions: ['Residential Establishment', 'Commercial Establishment', 'Industrial Establishment'],
      valueGetter: (inventories) => inventories.row?.properties?.establishmentType || '',
      renderCell: (params) => {
        const value = params.value;
        if (!value) return (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Not specified
          </Typography>
        );
        return (
          <Chip 
            label={value} 
            size="small" 
            color="primary"
            variant="filled"
            sx={{ fontWeight: 'medium' }}
          />
        );
      },
      disableClickEventBubbling: true,
    }
  ];

  // Enhanced formatting functions for large numbers
  const formatCapacity = (capacity) => {
    if (!capacity || capacity === 0) return '0 kW';
    
    // Handle extremely large values (GW range)
    if (capacity >= 1000000) {
      return `${(capacity / 1000000).toFixed(2)} GW`;
    }
    // Handle large values (MW range)
    if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)} MW`;
    }
    // Handle medium values (kW range)
    if (capacity >= 1) {
      return `${capacity.toFixed(1)} kW`;
    }
    // Handle very small values (W range)
    return `${(capacity * 1000).toFixed(0)} W`;
  };

  const formatEnergyProduction = (value) => {
    if (!value || value === 0) return '0 kWh';
    
    // Handle extremely large values (GWh range)
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} GWh`;
    }
    // Handle large values (MWh range)
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} MWh`;
    }
    // Handle medium values (kWh range)
    if (value >= 1) {
      return `${value.toFixed(1)} kWh`;
    }
    // Handle very small values (Wh range)
    return `${(value * 1000).toFixed(0)} Wh`;
  };

  const formatUnits = (units) => {
    if (!units || units === 0) return '0';
    
    // Handle extremely large values (millions)
    if (units >= 1000000) {
      return `${(units / 1000000).toFixed(2)}M`;
    }
    // Handle large values (thousands)
    if (units >= 1000) {
      return `${(units / 1000).toFixed(1)}K`;
    }
    // Handle medium values
    if (units >= 100) {
      return units.toFixed(0);
    }
    // Handle smaller values
    return units.toFixed(0);
  };

  // Common columns shown after type-specific columns
  const commonTrailingColumns = [
    {
      field: 'capacity',
      headerName: 'Capacity',
      width: 180, // Increased from 120 to accommodate larger numbers
      minWidth: 150, // Minimum width to prevent squashing
      flex: 1, // Allow column to grow if space available
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
        return "n/a";
      },
      renderCell: (params) => {
        if (!params.value || params.value === "n/a") {
          return (
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              n/a
            </Typography>
          );
        }
        
        // Use enhanced capacity formatting
        const formattedValue = formatCapacity(parseFloat(params.value.match(/^([\d,]+\.?\d*)/)?.[1]?.replace(/,/g, '') || 0));
        
        return (
          <Tooltip title={params.value} placement="top" arrow>
            <Typography 
              variant="body2" 
              fontWeight="medium" 
              color="primary.main"
              sx={{
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {formattedValue}
            </Typography>
          </Tooltip>
        );
      },
      disableClickEventBubbling: true,
    },
    {
      field: 'annualEnergyProduction',
      headerName: 'Annual Energy Prod.',
      width: 200, // Increased from 160
      minWidth: 180,
      flex: 1,
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
      renderCell: (params) => {
        if (!params.value) {
          return (
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              -
            </Typography>
          );
        }
        
        // Format large energy production numbers
        const formatEnergyNumber = (value) => {
          const match = value.match(/^([\d,]+\.?\d*)\s*(.+)$/);
          if (match) {
            const [_, number, unit] = match;
            const num = parseFloat(number.replace(/,/g, ''));
            
            if (num >= 1000000) {
              return `${(num / 1000000).toFixed(2)} M${unit}`;
            } else if (num >= 1000) {
              return `${(num / 1000).toFixed(2)} K${unit}`;
            } else if (num >= 100) {
              return `${num.toFixed(1)} ${unit}`;
            } else {
              return `${num.toFixed(0)} ${unit}`;
            }
          }
          return value;
        };
        
        const formattedValue = formatEnergyNumber(params.value);
        
        return (
          <Tooltip title={params.value} placement="top" arrow>
            <Typography 
              variant="body2" 
              fontWeight="medium"
              sx={{
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {formattedValue}
            </Typography>
          </Tooltip>
        );
      },
      disableClickEventBubbling: true,
    },
    {
      field: 'yearEst',
      headerName: 'Year est.',
      width: 100, // Increased from 80
      minWidth: 90,
      type: 'number',
      valueGetter: (inventories) => inventories.row.properties.yearEst,
      disableClickEventBubbling: true,
    },
    {
      field: 'totalGen',
      headerName: 'Total Gen. (if operational)',
      width: 280, // Increased from 230
      minWidth: 250,
      flex: 1,
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
      renderCell: (params) => {
        if (!params.value || params.value === "n/a") {
          return (
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              n/a
            </Typography>
          );
        }
        
        // Format large generation numbers
        const formatGenerationNumber = (value) => {
          const match = value.match(/^([\d,]+\.?\d*)\s*(.+)$/);
          if (match) {
            const [_, number, unit] = match;
            const num = parseFloat(number.replace(/,/g, ''));
            
            if (num >= 1000000) {
              return `${(num / 1000000).toFixed(2)} M${unit}`;
            } else if (num >= 1000) {
              return `${(num / 1000).toFixed(2)} K${unit}`;
            } else if (num >= 100) {
              return `${num.toFixed(1)} ${unit}`;
            } else {
              return `${num.toFixed(0)} ${unit}`;
            }
          }
          return value;
        };
        
        const formattedValue = formatGenerationNumber(params.value);
        
        return (
          <Tooltip title={params.value} placement="top" arrow>
            <Typography 
              variant="body2" 
              fontWeight="medium"
              sx={{
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {formattedValue}
            </Typography>
          </Tooltip>
        );
      },
      disableClickEventBubbling: true,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 350,
      valueGetter: getAddress,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ 
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {params.value || 'No address provided'}
          </Typography>
        </Box>
      ),
      disableClickEventBubbling: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      valueGetter: (inventories) => inventories.row.assessment.status,
      renderCell: (params) => {
        const getStatusColor = (status) => {
          if (!status) return 'default';
          switch (status.toLowerCase()) {
            case 'operational':
            case 'active':
            case 'running':
              return 'success';
            case 'maintenance':
            case 'repair':
              return 'warning';
            case 'inactive':
            case 'stopped':
            case 'broken':
              return 'error';
            default:
              return 'default';
          }
        };
        
        return (
          <Chip
            label={params.value || 'n/a'}
            size="small"
            color={getStatusColor(params.value)}
            variant="filled"
            sx={{ fontWeight: 'medium' }}
          />
        );
      },
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
      width: 180,
      valueGetter: (params) => params.row.username || 'n/a',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
            <PersonIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
        </Box>
      ),
      disableClickEventBubbling: true,
    },
  ];

  // Build columns based on selected class
  const columns = [
    ...baseColumns,
    ...(REClass === "Commercial" ? commercialSpecificColumns : nonCommercialSpecificColumns),
    ...commonTrailingColumns
  ];

  // Get filtered inventories based on class (already filtered by API)
  const getInventoriesByClass = () => {
    return inventories; // Data is already filtered by the API
  };

  return (
    <>
      <Tooltip title="Open renewable energy list" placement="left-start">
        <button className="leaflet-control-layers controlStyle" aria-label="open renewable energy list" onClick={handleOpenModal}>
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
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Renewable Energy Inventory Table
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              View and manage renewable energy inventories by classification
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <FormControl variant="outlined" sx={{ minWidth: 200 }} size="small">
                <InputLabel id="demo-select-small-label">Filter by Classification</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={REClass}
                  label="Filter by Classification"
                  onChange={handleREClass}
                >
                  <MenuItem value={"All"}>All</MenuItem>
                  <MenuItem value={"Non-Commercial"}>Non-Commercial</MenuItem>
                  <MenuItem value={"Commercial"}>Commercial</MenuItem>
                  <MenuItem value={"gencompany"}>Generating Company</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                size="small"
                placeholder="Search inventories..."
                value={quickSearchValue}
                onChange={(e) => handleQuickSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 250 }}
              />
              
              {isAdmin && (
                <Button
                  variant='contained'
                  color="error"
                  sx={{ 
                    display: multiDelete.length === 0 ? 'none' : 'inline-flex',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    }
                  }}
                  onClick={onDeleteInventoryClicked}
                >
                  Delete Selected ({multiDelete.length})
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ height: '70vh', width: '100%', display: REClass === "All" || REClass === "Non-Commercial" || REClass === "Commercial" || REClass === "gencompany" ? 'block' : 'none' }}>
            <DataGrid
              aria-label="Renewable energy inventory table"
              rows={getInventoriesByClass()}
              columns={columns}
              rowCount={meta.total}
              loading={isLoadingPaginated}
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[15, 20, 50, 100]}
              density="compact"
              getRowId={(row) => row.id || row._id}
              slots={{ toolbar: GridToolbar, noRowsOverlay: () => (
                <Box role="status" aria-live="polite" sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No inventories to display.</Typography>
                </Box>
              ) }}
              slotProps={{
                toolbar: {
                  csvOptions: { disableToolbarButton: !isAdmin },
                  printOptions: { disableToolbarButton: true },
                  showQuickFilter: false,
                },
              }}
              disableRowSelectionOnClick
              checkboxSelection={isAdmin}
              onRowSelectionModelChange={(ids) => {
                setMultiDelete(ids);
              }}
              filterMode="client"
              initialState={{
                filter: {
                  filterModel: {
                    items: [],
                  },
                },
              }}
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #e0e0e0',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  borderBottom: '2px solid #e0e0e0',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#f8f9fa',
                },
              }}
            />
          </Box>

          {(REClass === "All" || REClass === "Commercial" || REClass === "Non-Commercial") && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Summary Statistics
              </Typography>
              <TableContainer component={Paper} elevation={2}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>
                        <FormControl variant="outlined" sx={{ minWidth: 150 }} size="small">
                          <InputLabel id="summary-select-label">
                            Summary (by usage)
                          </InputLabel>
                          <Select
                            labelId="summary-select-label"
                            id="summary-select"
                            value={summaryType}
                            label="Summary (by usage)"
                            onChange={handleSummaryType}
                          >
                            <MenuItem value={"All"}>All</MenuItem>
                            <MenuItem value={"solar"}>Solar Energy</MenuItem>
                            <MenuItem value={"wind"}>
                              Wind Energy
                            </MenuItem>
                            <MenuItem value={"biomass"}>
                              Biomass
                            </MenuItem>
                            <MenuItem value={"hydropower"}>
                              Hydropower
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>No. of units</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        Est. Generation
                        <br />
                        <small>(from year installed)</small>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Capacity</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        Annual Energy Prod.
                        <br />
                        <small>(declared)</small>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                                     <TableBody>
                     {/* Solar Energy Rows - Only show when summaryType is "All" or "solar" */}
                     {(summaryType === "All" || summaryType === "solar") && (
                       <>
                         <TableRow>
                           <TableCell component="th" scope="row">
                             Solar streetlights/lights
                           </TableCell>
                           <TableCell align="right">
                           <Tooltip title={`${solarStTotalUnit.toLocaleString()} units`} placement="top" arrow>
                             <span style={{ cursor: 'help' }}>{formatUnits(solarStTotalUnit)}</span>
                           </Tooltip>
                         </TableCell>
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
                             <Tooltip title={`${solarStTotalCap.toLocaleString()} kW (full value)`} placement="top" arrow>
                               <b style={{ cursor: 'help' }}>{formatCapacity(solarStTotalCap)}</b>
                             </Tooltip>
                           </TableCell>
                           <TableCell align="right"></TableCell>
                         </TableRow>
                         <TableRow>
                           <TableCell component="th" scope="row">
                             For power generation
                           </TableCell>
                           <TableCell align="right">
                             <Tooltip title={`${solarPowerGenTotalUnit.toLocaleString()} units`} placement="top" arrow>
                               <span style={{ cursor: 'help' }}>{formatUnits(solarPowerGenTotalUnit)}</span>
                             </Tooltip>
                           </TableCell>
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
                             <Tooltip title={`${solarPowerGenTotalCap.toLocaleString()} kW (full value)`} placement="top" arrow>
                               <b style={{ cursor: 'help' }}>{formatCapacity(solarPowerGenTotalCap)}</b>
                             </Tooltip>
                           </TableCell>
                           <TableCell align="right">
                             <Tooltip title={`${totalAnnualEnergyProduction.toLocaleString()} kWh (full value)`} placement="top" arrow>
                               <b style={{ cursor: 'help' }}>{formatEnergyProduction(totalAnnualEnergyProduction)}</b>
                             </Tooltip>
                           </TableCell>
                         </TableRow>
                         <TableRow>
                           <TableCell component="th" scope="row">
                             Solar Pumps
                           </TableCell>
                           <TableCell align="right">{solarPumpTotalUnit}</TableCell>
                           <TableCell align="right">
                             <b>{formatEnergyProduction(solarPumpTotal)}</b>
                           </TableCell>
                           <TableCell align="right">
                             <b>{formatCapacity(solarPumpTotalCap)}</b>
                           </TableCell>
                           <TableCell align="right"></TableCell>
                         </TableRow>
                       </>
                     )}
                     
                     {/* Wind Energy Row - Only show when summaryType is "All" or "wind" */}
                     {(summaryType === "All" || summaryType === "wind") && (
                       <TableRow>
                         <TableCell component="th" scope="row">
                           Wind Energy
                         </TableCell>
                         <TableCell align="right">{windTotalUnit}</TableCell>
                                                    <TableCell align="right">
                             <b>{formatEnergyProduction(windTotal)}</b>
                           </TableCell>
                           <TableCell align="right">
                             <b>{formatCapacity(windTotalCap)}</b>
                           </TableCell>
                         <TableCell align="right"></TableCell>
                       </TableRow>
                     )}
                     
                     {/* Biomass Row - Only show when summaryType is "All" or "biomass" */}
                     {(summaryType === "All" || summaryType === "biomass") && (
                       <TableRow>
                         <TableCell component="th" scope="row">
                           Biomass
                         </TableCell>
                         <TableCell align="right">{biomassTotalUnit}</TableCell>
                                                    <TableCell align="right">
                             <b>{formatEnergyProduction(biomassTotal)}</b>
                           </TableCell>
                           <TableCell align="right">
                             <b>{formatCapacity(biomassTotalCap)}</b>
                           </TableCell>
                         <TableCell align="right"></TableCell>
                       </TableRow>
                     )}
                     
                     {/* Hydropower Row - Only show when summaryType is "All" or "hydropower" */}
                     {(summaryType === "All" || summaryType === "hydropower") && (
                       <TableRow>
                         <TableCell component="th" scope="row">
                           Hydropower
                         </TableCell>
                         <TableCell align="right">{hydropowerTotalUnit}</TableCell>
                         <TableCell align="right">
                           <b>{formatEnergyProduction(hydropowerTotal)}</b>
                         </TableCell>
                         <TableCell align="right">
                           <b>{formatCapacity(hydropowerTotalCap)}</b>
                         </TableCell>
                         <TableCell align="right"></TableCell>
                       </TableRow>
                     )}
                     
                     {/* TOTAL Row - Always show but calculate based on visible rows */}
                     <TableRow>
                       <TableCell component="th" scope="row">
                         <b>TOTAL</b>
                       </TableCell>
                       <TableCell align="right">
                         {(summaryType === "All" || summaryType === "solar" ? solarStTotalUnit + solarPowerGenTotalUnit + solarPumpTotalUnit : 0) +
                          (summaryType === "All" || summaryType === "wind" ? windTotalUnit : 0) +
                          (summaryType === "All" || summaryType === "biomass" ? biomassTotalUnit : 0) +
                          (summaryType === "All" || summaryType === "hydropower" ? hydropowerTotalUnit : 0)}
                       </TableCell>
                       <TableCell align="right">
                         {(() => {
                           const totalGen = (summaryType === "All" || summaryType === "solar" ? solarStTotal + solarPowerGenTotal + solarPumpTotal : 0) +
                                           (summaryType === "All" || summaryType === "wind" ? windTotal : 0) +
                                           (summaryType === "All" || summaryType === "biomass" ? biomassTotal : 0) +
                                           (summaryType === "All" || summaryType === "hydropower" ? hydropowerTotal : 0);
                           
                           return (
                             <Tooltip title={`${totalGen.toLocaleString()} kWh (full value)`} placement="top" arrow>
                               <b style={{ cursor: 'help' }}>{formatEnergyProduction(totalGen)}</b>
                             </Tooltip>
                           );
                         })()}
                       </TableCell>
                       <TableCell align="right">
                         {(() => {
                           const totalCap = (summaryType === "All" || summaryType === "solar" ? solarStTotalCap + solarPowerGenTotalCap + solarPumpTotalCap : 0) +
                                           (summaryType === "All" || summaryType === "wind" ? windTotalCap : 0) +
                                           (summaryType === "All" || summaryType === "biomass" ? biomassTotalCap : 0) +
                                           (summaryType === "All" || summaryType === "hydropower" ? hydropowerTotalCap : 0);
                           
                           return (
                             <Tooltip title={`${totalCap.toLocaleString()} kW (full value)`} placement="top" arrow>
                               <b style={{ cursor: 'help' }}>{formatCapacity(totalCap)}</b>
                             </Tooltip>
                           );
                         })()}
                       </TableCell>
                       <TableCell align="right">
                         {(summaryType === "All" || summaryType === "solar") && totalAnnualEnergyProduction > 0 ? (
                           <Tooltip title={`${totalAnnualEnergyProduction.toLocaleString()} kWh (full value)`} placement="top" arrow>
                             <b style={{ cursor: 'help' }}>{formatEnergyProduction(totalAnnualEnergyProduction)}</b>
                           </Tooltip>
                         ) : (
                           <b>-</b>
                         )}
                       </TableCell>
                     </TableRow>
                   </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default InventoryTable;