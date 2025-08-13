import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAllUsers } from './usersApiSlice'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Button, Box, Chip, Avatar, Typography } from '@mui/material'
import { memo } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import PersonIcon from '@mui/icons-material/Person'

const User = ({ userId }) => {

    const userS = useSelector(selectAllUsers)

    const navigate = useNavigate()

    if (userS) {
        const handleEdit = (params) => navigate(`/dashboard/users/${params.id}`)
        const renderEditButton = (params) => {
            return (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(params)}
                    startIcon={<EditIcon />}
                    sx={{
                        minWidth: '80px',
                        '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                        }
                    }}
                >
                    Edit
                </Button>
            )
        }
        const columns = [
            {
                field: 'username',
                headerName: 'Username',
                width: 150,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
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
                field: 'fullName',
                headerName: 'Full Name',
                width: 200,
                disableClickEventBubbling: true,
                valueGetter: (params) => params.row.fullName || 'Not provided',
                renderCell: (params) => (
                    <Typography 
                        variant="body2" 
                        color={params.value === 'Not provided' ? 'text.secondary' : 'text.primary'}
                        fontStyle={params.value === 'Not provided' ? 'italic' : 'normal'}
                    >
                        {params.value}
                    </Typography>
                )
            },
            {
                field: 'affiliation',
                headerName: 'Affiliation',
                width: 180,
                disableClickEventBubbling: true,
                valueGetter: (params) => params.row.affiliation || 'Not Affiliated',
                renderCell: (params) => (
                    <Chip
                        label={params.value}
                        size="small"
                        color={params.value === 'Not Affiliated' ? 'default' : 'primary'}
                        variant={params.value === 'Not Affiliated' ? 'outlined' : 'filled'}
                    />
                )
            },
            {
                field: 'roles',
                headerName: 'Roles',
                width: 250,
                disableClickEventBubbling: true,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {Array.isArray(params.value) ? params.value.map((role, index) => (
                            <Chip
                                key={index}
                                label={role}
                                size="small"
                                color={
                                    role === 'Admin' ? 'error' :
                                    role === 'Manager' ? 'warning' :
                                    role === 'Installer' ? 'info' :
                                    'default'
                                }
                                variant="outlined"
                            />
                        )) : (
                            <Chip label="No roles" size="small" color="default" variant="outlined" />
                        )}
                    </Box>
                )
            },
            {
                field: 'active',
                headerName: 'Status',
                width: 120,
                disableClickEventBubbling: true,
                renderCell: (params) => (
                    <Chip
                        label={params.value ? 'Active' : 'Inactive'}
                        size="small"
                        color={params.value ? 'success' : 'error'}
                        variant="filled"
                    />
                )
            },
            {
                field: 'action',
                headerName: 'Actions',
                headerAlign: 'center',
                width: 120,
                sortable: false,
                renderCell: renderEditButton,
                disableClickEventBubbling: true,
            },
          ];
        


        return (
            <Box sx={{ height: '70vh', width: '100%' }}>
                <DataGrid
                    aria-label="Users table"
                    rows={userS}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 15,
                            },
                        },
                        sorting: {
                            sortModel: [{ field: 'username', sort: 'asc' }],
                        },
                    }}
                    pageSizeOptions={[15, 20, 50, 100]}
                    density="compact"
                    disableRowSelectionOnClick
                    slots={{ toolbar: GridToolbar, noRowsOverlay: () => (
                        <Box role="status" aria-live="polite" sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">No users to display.</Typography>
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
                    }}
                />
            </Box>
        )

    } else return null
}
const memoizedUser = memo(User)

export default memoizedUser