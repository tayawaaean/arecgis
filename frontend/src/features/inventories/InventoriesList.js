import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Container, Button, Box, Paper, Grid, Typography, IconButton
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material/'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import useAuth from "../../hooks/useAuth"
import useTitle from '../../hooks/useTitle'
import { boxmain, boxpaper } from '../../config/style'
import { useGetInventoryListQuery } from './inventoryListApiSlice'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const InventoriesList = () => {
    useTitle('ArecGIS | RE List')

    const { username, isManager, isAdmin } = useAuth()
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })

    // Protected, paginated API call
    // Add explicit passing of username and role information
    const { data, isLoading, isError, error } = useGetInventoryListQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        username: username,
        isAdmin: isAdmin || isManager // Pass a boolean flag to indicate admin/manager status
    });

    // Remove the client-side filtering since we'll do it on the server
    const inventories = useMemo(() => {
        if (!data?.data) return []
        return data.data.map(row => ({ ...row, id: row._id }))
    }, [data])

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

    const handleEdit = (params) => navigate(`/dashboard/inventories/${params.id}`)
    
    // Updated to navigate to transfer form instead of opening modal
    const handleTransferClick = (params) => {
        navigate('/dashboard/transfers/new', { 
            state: { inventory: params.row } 
        });
    }

    // Render buttons for actions column - Edit and Transfer
    const renderActionButtons = (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
                variant="contained"
                size="small"
                onClick={() => handleEdit(params)}
            >
                Edit
            </Button>
            <Button
            variant="contained"
            startIcon={<SwapHorizIcon />}
            sx={{
                backgroundColor: '#1976d2',
                color: 'white',
                borderRadius: 2,
                paddingX: 2.5,
                paddingY: 1,
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                backgroundColor: '#1565c0',
                },
            }}
             onClick={() => handleTransferClick(params)}
            >
            Transfer
            </Button>

        </Box>
    )

    const columns = [
        {
            field: 'action',
            headerName: 'Actions',
            headerAlign: 'center',
            width: 200, // Increased width for two buttons
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: renderActionButtons,
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
            field: 'reClass',
            headerName: 'RE Class',
            width: 130,
            type: 'singleSelect',
            filterable: true,
            valueOptions: ['Commercial', 'Non-Commercial'],
            valueGetter: (params) => params.row.properties?.reClass || 'Non-Commercial',
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
        // Conditionally show different fields based on RE class
        {
            field: 'fitEligible',
            headerName: 'FIT Eligible',
            width: 120,
            filterable: true,
            type: 'singleSelect',
            valueOptions: ['Yes', 'No'],
            valueGetter: (params) => {
                if (params.row.properties.reClass === 'Commercial') {
                    const eligible = params.row.properties?.fit?.eligible;
                    return eligible === true || eligible === "true" ? "Yes" : "No";
                }
                return '';
            },
            hide: true, // Initially hidden, can be shown by user
            disableClickEventBubbling: true,
        },
        {
            field: 'fitPhase',
            headerName: 'FIT Phase',
            width: 120,
            filterable: true,
            type: 'singleSelect',
            valueOptions: ['FIT1', 'FIT2', 'Non-FIT'],
            valueGetter: (params) => 
                params.row.properties.reClass === 'Commercial' 
                    ? (params.row.properties?.fit?.phase || 'Non-FIT')
                    : '',
            hide: true, // Initially hidden, can be shown by user
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
            valueGetter: filteredAddress,
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

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {error?.data?.message || 'Unknown error'}</div>

    return (
        <Container maxWidth="lg">
            <Box sx={boxmain}>
                <Box sx={boxpaper}>
                    <Paper elevation={3}>
                        <Grid container>
                            <Grid item xs>
                                <Typography component="h1" variant="h5">
                                    RE list (uploads)
                                </Typography>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={() => navigate(-1)}>
                                    <ArrowBackIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Box sx={{ m: 1 }}>
                            <Box sx={{ height: '60vh', width: '100%' }}>
                                <DataGrid
                                  rows={inventories}
                                  columns={columns}
                                  pagination
                                  paginationMode="server"
                                  rowCount={meta.total}
                                  paginationModel={paginationModel}
                                  onPaginationModelChange={setPaginationModel}
                                  pageSizeOptions={[10, 20, 50, 100]}
                                  density="compact"
                                  disableRowSelectionOnClick
                                  slots={{ toolbar: GridToolbar }}
                                  slotProps={{
                                    toolbar: {
                                      printOptions: { disableToolbarButton: true },
                                      showQuickFilter: true,
                                      quickFilterProps: { debounceMs: 500 },
                                    },
                                  }}
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Container>
    )
}

export default InventoriesList