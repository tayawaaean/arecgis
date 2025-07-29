import { selectAllInventories } from './inventoriesApiSlice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Container, Button, Box, CssBaseline, Paper, Grid, Typography, IconButton } from '@mui/material'
import {
    ArrowBack as ArrowBackIcon,
}
    from '@mui/icons-material/'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import useAuth from "../../hooks/useAuth"
import useTitle from '../../hooks/useTitle'
import { boxmain, boxpaper } from '../../config/style'

const InventoriesList = () => {

    useTitle('ArecGIS | RE List')

    const { username, isManager, isAdmin } = useAuth()
    const rawinventories = useSelector(selectAllInventories)

    const oneDay = 1000 * 60 * 60 * 24
    const sunHour = 4.7
    
    let inventories

    if (isManager || isAdmin) {
        inventories = [...rawinventories]
        
    } else {
        inventories = rawinventories.filter(user => user.username === username)
    }

    const navigate = useNavigate()
    if (inventories) {

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
        const renderEditButton = (params) => {

            return (
                <Button
                    variant="contained"
                    sx = {{ backgroundColor: "primary" }}
                    size="small"
                    style={{ margin: 'auto' }}
                    onClick={() => { handleEdit(params) }}

                >
                    Edit
                </Button>
            )
        }
        const columns = [
            {
                field: 'action',
                headerName: 'Action',
                headerAlign: 'center',
                width: 130,
                sortable: false,
                renderCell: renderEditButton,
                disableClickEventBubbling: true,

            },
            {
                field: 'ownerName',
                headerName: 'Owner',
                width: 150,
                valueGetter: (inventories) => inventories?.row?.properties?.ownerName,
                disableClickEventBubbling: true,
            },
            {
                field: 'retype',
                headerName: 'RE Category',
                width: 130,
                valueGetter: (inventories) => inventories?.row?.properties?.reCat,
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
                field: 'latitude',
                headerName: 'Latitude',
                width: 100,
                valueGetter: (inventories) => inventories?.row?.coordinates[1],
                disableClickEventBubbling: true,
            },
            {
                field: 'longitude',
                headerName: 'Longitude',
                width: 100,
                valueGetter: (inventories) => inventories?.row?.coordinates[0],
                disableClickEventBubbling: true,
            }, 
            // {
            //     field: 'username',
            //     headerName: 'Uploader',
            //     width: 100,
            //     disableClickEventBubbling: true,
            // },
        ]

            return (
                <>
                    <Container maxWidth="lg">
                        <Box sx={boxmain}>
                            <Box
                                sx={boxpaper}
                            >
                                <Paper elevation={3}  >
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
                                                initialSnackBar={{
                                                    pagination: {
                                                        paginationModel: {
                                                            pageSize: 10,
                                                        },
                                                    },
                                                }}
                                                density="compact"
                                                pageSizeOptions={[100]}
                                                // disableColumnSelector
                                                slots={{ toolbar: GridToolbar }}
                                                slotProps={{
                                                    toolbar: {
                                                        // csvOptions: { disableToolbarButton: false },
                                                        printOptions: { disableToolbarButton: true },
                                                        showQuickFilter: true,
                                                        quickFilterProps: { debounceMs: 500 },
                                                    },
                                                }}
                                                disableRowSelectionOnClick
                                            />
                                        </Box>
                                    </Box>
                                </Paper>
                            </Box>
                        </Box>
                    </Container>
                </>
            )

        } else return null

    }
    export default InventoriesList