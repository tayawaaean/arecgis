import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Container, 
  Button, 
  Box, 
  Paper, 
  Grid, 
  Typography, 
  IconButton,
  Chip,
  Avatar,
  Alert,
  CircularProgress
} from '@mui/material'
import { 
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  SolarPower as SolarIcon,
  Air as WindIcon,
  Grass as BiomassIcon,
  Opacity as HydroIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import useAuth from "../../hooks/useAuth"
import useTitle from '../../hooks/useTitle'
import { useGetInventoryListQuery } from './inventoryListApiSlice'

import EditIcon from '@mui/icons-material/Edit';

// Helper function to normalize MongoDB ObjectIDs for consistent comparison
const normalizeId = (id) => {
  if (!id) return null;
  if (typeof id === 'object' && id.$oid) return id.$oid;
  if (typeof id === 'object' && id._id) return id._id;
  return String(id);
};

const InventoriesList = () => {
    useTitle('ArecGIS | RE List')

    const { username, isManager, isAdmin, userId } = useAuth() // Make sure userId is included in useAuth
    // Set hardcoded datetime as requested
    const [currentDateTime, setCurrentDateTime] = useState('2025-08-07 05:36:40');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })
    const [filterModel, setFilterModel] = useState({
      items: [],
      quickFilterValues: [],
    })
    
    // Extract filter values from filterModel into a simpler object for the API
    // Find this code block in your file and update it
const extractedFilters = useMemo(() => {
  const filters = {}
  
  // Process column filters
  filterModel.items.forEach(item => {
    if (item.value !== undefined && item.value !== '') {
      filters[item.field] = item.value
    }
  })
  
  // Add quick filter values if they exist
  if (filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0) {
    filters.quickSearch = filterModel.quickFilterValues[0]
  }
  
  
  return filters
}, [filterModel])

    // Protected, paginated API call with filters
    const { data, isLoading, isError, error } = useGetInventoryListQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        username: username,
        isAdmin: isAdmin || isManager,
        filters: extractedFilters // Pass filters to the API
    });

    // Reset to page 1 when filters change
    useEffect(() => {
      if (filterModel.items.length > 0) {
        setPaginationModel(prev => ({ ...prev, page: 0 }))
      }
    }, [filterModel])

    // Process inventory data and add relevant flags
    const inventories = useMemo(() => {
        if (!data?.data) return []
        return data.data.map(row => {
          // More robust check for previous owner status with normalized ID comparison
          let isPreviousOwner = false;
          
          // Normalize the current user ID
          const normalizedUserId = normalizeId(userId);
          
          // Check previousUsernames array if it exists
          if (row.previousUsernames && Array.isArray(row.previousUsernames)) {
            if (row.previousUsernames.includes(username)) {
              isPreviousOwner = true;
            }
          }
          
          // Check previousUsers array if it exists (contains user IDs)
          if (!isPreviousOwner && row.previousUsers && Array.isArray(row.previousUsers)) {
            // Check with normalized IDs
            isPreviousOwner = row.previousUsers.some(prevUser => {
              const prevUserId = normalizeId(prevUser);
              return prevUserId === normalizedUserId;
            });
          }
          
          // Check direct previousUser field if it exists
          if (!isPreviousOwner && row.previousUser) {
            const prevUserId = normalizeId(row.previousUser);
            if (prevUserId === normalizedUserId) {
              isPreviousOwner = true;
            }
          }
          

          
          return { 
            ...row, 
            id: row._id,
            isCurrentOwner: row.isCurrentOwner !== undefined ? row.isCurrentOwner : (row.username === username || row.user === userId),
            isPreviousOwner: row.isPreviousOwner !== undefined ? row.isPreviousOwner : isPreviousOwner,
          };
        });
    }, [data, username, userId]);

    const meta = data?.meta || { page: 1, total: 0, limit: paginationModel.pageSize, totalPages: 1 }

    const navigate = useNavigate()
    const oneDay = 1000 * 60 * 60 * 24
    const sunHour = 4.7

    const filteredAddress = (params) => {
        const region = params.row.properties.address.region
        const province = params.row.properties.address.province
        const city = params.row.properties.address.city
        const brgy = params.row.properties.address.brgy
        return (
            `${region}, ${province}, ${city}, ${brgy}`
        )
    }

    // Pass correct ownership information to EditInventoryForm
    const handleEdit = (params) => {
        const isCurrentOwner = params.row.isCurrentOwner;
        const isPreviousOwner = params.row.isPreviousOwner;
        
        // For previous owners, we need to pass a special flag to ensure they get proper access
        const isPreviousOwnerAccess = isPreviousOwner === true;
        
        // Only set readOnly true if the user is neither current owner, previous owner, nor admin/manager
        const readOnly = !(isCurrentOwner || isPreviousOwnerAccess || isAdmin || isManager);
        

        
        navigate(`/dashboard/inventories/${params.id}`, {
            state: { 
                isCurrentOwner,
                isPreviousOwner: isPreviousOwnerAccess,
                readOnly
            }
        });
    }
    


    // Render buttons for actions column with proper access control
    const renderActionButtons = (params) => {
        const isCurrentOwner = params.row.isCurrentOwner;
        const isPreviousOwner = params.row.isPreviousOwner;
        
        // Admin/managers can always edit
        if (isAdmin || isManager) {
            return (
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(params)}
                    sx={{
                        minWidth: '80px',
                        maxWidth: '100px',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        }
                    }}
                >
                    Edit
                </Button>
            )
        }
        
        // Current owners can edit
        if (isCurrentOwner) {
            return (
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(params)}
                    sx={{
                        minWidth: '80px',
                        maxWidth: '100px',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        }
                    }}
                >
                    Edit
                </Button>
            )
        }
        
        // Previous owners see disabled edit button - they can only view
        if (isPreviousOwner) {
            return (
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    disabled
                    onClick={() => handleEdit(params)}
                    sx={{ 
                        minWidth: '80px',
                        maxWidth: '100px'
                    }}
                >
                    Edit
                </Button>
            )
        }
        
        // Default case - view-only edit button
        return (
            <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => handleEdit(params)}
                sx={{
                    minWidth: '80px',
                    maxWidth: '100px',
                    '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                    }
                }}
            >
                View
                </Button>
        )
    }

        const columns = [
        {
            field: 'action',
            headerName: 'Actions',
            headerAlign: 'center',
            width: 120,
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: renderActionButtons,
            cellClassName: 'actions-cell',
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
            valueGetter: (inventories) => inventories.row.properties.reCat,
            renderCell: (params) => {
                const getIcon = (category) => {
                    switch (category) {
                        case 'Solar Energy': return <SolarIcon fontSize="small" />;
                        case 'Wind Energy': return <WindIcon fontSize="small" />;
                        case 'Biomass': return <BiomassIcon fontSize="small" />;
                        case 'Hydropower': return <HydroIcon fontSize="small" />;
                        default: return null;
                    }
                };
                
                const getColor = (category) => {
                    switch (category) {
                        case 'Solar Energy': return 'warning';
                        case 'Wind Energy': return 'info';
                        case 'Biomass': return 'success';
                        case 'Hydropower': return 'primary';
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
            field: 'reClass',
            headerName: 'RE Class',
            width: 150,
            type: 'singleSelect',
            filterable: true,
            valueOptions: ['Commercial', 'Non-Commercial'],
            valueGetter: (params) => params.row.properties?.reClass || 'Non-Commercial',
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    color={params.value === 'Commercial' ? 'success' : 'default'}
                    variant={params.value === 'Commercial' ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 'medium' }}
                />
            ),
            disableClickEventBubbling: true,
        },
        {
            field: 'reUsage',
            headerName: 'RE Usage',
            width: 150,
            valueGetter: (inventories) => {
                if (inventories.row.properties.reCat === 'Solar Energy') {
                    return inventories.row.assessment.solarUsage || "n/a"
                }
                if (inventories.row.properties.reCat === 'Biomass') {
                    return inventories.row.assessment.biomassPriUsage || "n/a"
                }
                if (inventories.row.properties.reCat === 'Wind Energy') {
                    return inventories.row.assessment.windUsage || "n/a"
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
                    ? row.row.assessment.solarSystemTypes || 'n/a'
                    : 'n/a',
            disableClickEventBubbling: true,
        },
        // FIT fields - now showing "n/a" for Non-Commercial entries
        {
            field: 'fitEligible',
            headerName: 'FIT Eligible',
            width: 130,
            filterable: true,
            type: 'singleSelect',
            valueOptions: ['Yes', 'No', 'n/a'],
            renderCell: (params) => {
                if (params.row.properties.reClass !== 'Commercial') {
                    return (
                        <Chip label="n/a" size="small" color="default" variant="outlined" />
                    );
                }
                
                const eligible = params.row.properties?.fit?.eligible;
                const value = eligible === true || eligible === "true" ? "Yes" : 
                             eligible === false || eligible === "false" ? "No" : "n/a";
                
                return (
                    <Chip 
                        label={value} 
                        size="small" 
                        color={value === "Yes" ? "success" : value === "No" ? "error" : "default"}
                        variant="filled"
                    />
                );
            },
            valueGetter: (params) => {
                if (params.row.properties.reClass !== 'Commercial') {
                    return "n/a";
                }
                
                const eligible = params.row.properties?.fit?.eligible;
                return eligible === true || eligible === "true" ? "Yes" : 
                      eligible === false || eligible === "false" ? "No" : "n/a";
            },
            disableClickEventBubbling: true,
        },
        {
            field: 'fitPhase',
            headerName: 'FIT Phase',
            width: 120,
            filterable: true,
            type: 'singleSelect',
            valueOptions: ['FIT1', 'FIT2', 'Non-FIT', 'n/a'],
            renderCell: (params) => {
                if (params.row.properties.reClass !== 'Commercial') {
                    return "n/a";
                }
                
                const phase = params.row.properties?.fit?.phase;
                return phase && phase !== '' ? phase : 'n/a';
            },
            valueGetter: (params) => {
                if (params.row.properties.reClass !== 'Commercial') {
                    return "n/a";
                }
                
                const phase = params.row.properties?.fit?.phase;
                return phase && phase !== '' ? phase : 'n/a';
            },
            disableClickEventBubbling: true,
        },
        {
            field: 'isNetMetered',
            headerName: 'Net Metered',
            width: 130,
            filterable: true,
            type: 'singleSelect',
            valueOptions: ['Yes', 'No', 'n/a'],
            valueGetter: (inventories) => {
                const value = inventories.row?.properties?.isNetMetered;
                return value === true || value === "true" ? "Yes" :
                       value === false || value === "false" ? "No" : "n/a";
            },
            renderCell: (params) => {
                const value = params.value;
                return (
                    <Chip 
                        label={value} 
                        size="small" 
                        color={value === "Yes" ? "success" : value === "No" ? "error" : "default"}
                        variant={value === "n/a" ? "outlined" : "filled"}
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
                return value === true || value === "true" ? "Yes" :
                       value === false || value === "false" ? "No" : "n/a";
            },
            renderCell: (params) => {
                const value = params.value;
                return (
                    <Chip 
                        label={value} 
                        size="small" 
                        color={value === "Yes" ? "success" : value === "No" ? "error" : "default"}
                        variant={value === "n/a" ? "outlined" : "filled"}
                    />
                );
            },
            disableClickEventBubbling: true,
        },
        {
            field: 'capacity',
            headerName: 'Capacity',
            width: 120,
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
                return "n/a"
            },
            renderCell: (params) => {
                if (params.value === "n/a") {
                    return (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            {params.value}
                        </Typography>
                    );
                }
                return (
                    <Typography variant="body2" fontWeight="medium" color="primary.main">
                        {params.value}
                    </Typography>
                );
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
                        : 'n/a';
                }
                return 'n/a';
            },
            disableClickEventBubbling: true,
        },
        {
            field: 'yearEst',
            headerName: 'Year est.',
            width: 80,
            type: 'number',
            valueGetter: (inventories) => inventories.row.properties.yearEst || 'n/a',
            disableClickEventBubbling: true,
        },
        {
            field: 'totalGen',
            headerName: 'Total Gen. (if operational)',
            width: 230,
            valueGetter: (inventories) => {
                const noOfYear = parseInt(inventories.row.properties.yearEst)
                if (isNaN(noOfYear)) return "n/a";
                
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
            width: 350,
            valueGetter: filteredAddress,
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
            valueGetter: (inventories) => inventories.row.assessment.status || 'n/a',
            renderCell: (params) => {
                const getStatusColor = (status) => {
                    if (!status || status === 'n/a') return 'default';
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
                        label={params.value}
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
            valueGetter: (inventories) => {
                const value = inventories.row.coordinates[1];
                return value !== undefined && value !== null ? value : 'n/a';
            },
            disableClickEventBubbling: true,
        },
        {
            field: 'long',
            headerName: 'Longitude',
            width: 100,
            valueGetter: (inventories) => {
                const value = inventories.row.coordinates[0];
                return value !== undefined && value !== null ? value : 'n/a';
            },
            disableClickEventBubbling: true,
        },
        {
            field: 'username',
            headerName: 'Current Uploader',
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
        {
            field: 'previousUsernames',
            headerName: 'Previous Uploaders',
            width: 200,
            valueGetter: (params) => {
                if (!params.row.previousUsernames || params.row.previousUsernames.length === 0) {
                    return 'None';
                }
                return params.row.previousUsernames.join(', ');
            },
            disableClickEventBubbling: true,
            hide: true, // Hidden by default, can be shown by user
        }
    ];

    // Create a filtered columns array that dynamically shows/hides the FIT columns
    const filteredColumns = useMemo(() => {
        // Check if any inventory is Commercial
        const hasCommercial = inventories.some(inv => inv.properties.reClass === 'Commercial');
        
        if (!hasCommercial) {
            // Remove FIT columns for non-commercial only data
            return columns.filter(column => 
                column.field !== 'fitEligible' && column.field !== 'fitPhase'
            );
        }
        
        return columns;
    }, [inventories]);

    if (isLoading) return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
            </Box>
        </Container>
    )
    
    if (isError) return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error loading inventories: {error?.data?.message || 'Unknown error'}
                </Alert>
                <Button 
                    variant="outlined" 
                    onClick={() => navigate(-1)}
                    startIcon={<ArrowBackIcon />}
                >
                    Go Back
                </Button>
            </Box>
        </Container>
    )

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Grid item xs>
                            <Typography component="h1" variant="h4" gutterBottom>
                                Renewable Energy Inventories
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Manage and view all renewable energy system inventories
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate(-1)}
                                sx={{ mr: 2 }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/dashboard/inventories/new')}
                                sx={{ mr: 1 }}
                            >
                                Add Inventory
                            </Button>
                            <IconButton 
                                onClick={() => window.location.reload()}
                                title="Refresh"
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                    
                    {inventories?.length === 0 ? (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            No inventories found. 
                            <Button 
                                variant="outlined" 
                                size="small" 
                                sx={{ ml: 2 }}
                                onClick={() => navigate('/dashboard/inventories/new')}
                            >
                                Create First Inventory
                            </Button>
                        </Alert>
                    ) : (
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ height: '70vh', width: '100%' }}>
                                <DataGrid
                                    aria-label="Inventories table"
                                    rows={inventories}
                                    columns={filteredColumns}
                                    pagination
                                    paginationMode="server"
                                    rowCount={data?.meta?.total || 0}
                                    paginationModel={paginationModel}
                                    onPaginationModelChange={setPaginationModel}
                                    pageSizeOptions={[15, 20, 50, 100]}
                                    density="compact"
                                    disableRowSelectionOnClick
                                    filterMode="server"
                                    filterModel={filterModel}
                                    onFilterModelChange={setFilterModel}
                                    slots={{ toolbar: GridToolbar, noRowsOverlay: () => (
                                        <Box role="status" aria-live="polite" sx={{ p: 3, textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">No inventories to display.</Typography>
                                        </Box>
                                    ) }}
                                    slotProps={{
                                        toolbar: {
                                            printOptions: { disableToolbarButton: true },
                                            showQuickFilter: true,
                                            quickFilterProps: { debounceMs: 500 },
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
                                        '& .actions-cell': {
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Container>
    )
}

export default InventoriesList