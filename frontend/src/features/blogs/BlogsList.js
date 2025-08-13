import { selectAllBlogs } from './blogsApiSlice'
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

const BlogsList = () => {

    useTitle('ArecGIS | RE List')

    const { username, isManager, isAdmin } = useAuth()
    const rawblogs = useSelector(selectAllBlogs)
    let blogs

    if (isManager || isAdmin) {
        blogs = [...rawblogs]
    } else {
        blogs = rawblogs.filter(user => user.username === username)
    }

    const navigate = useNavigate()
    if (blogs) {

        const getAddress = (params) => {
            return Object.values(params.row.properties.address).filter(function (x) { return x !== 'Philippines' })
        }

        const handleEdit = (params) => navigate(`/dashboard/blogs/${params.id}`)
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
                valueGetter: (blogs) => blogs.row.properties.ownerName,
                disableClickEventBubbling: true,
            },
            {
                field: 'retype',
                headerName: 'RE TYPE',
                width: 130,
                valueGetter: (blogs) => blogs.row.properties.retype,
                disableClickEventBubbling: true,
            },
            {
                field: 'capacity',
                headerName: 'Capacity',
                width: 100,
                valueGetter: (blogs) => blogs.row.assessment.capacity,
                disableClickEventBubbling: true,
            },
            {
                field: 'address',
                headerName: 'Location',
                width: 400,
                valueGetter: getAddress,
                disableClickEventBubbling: true,
            },
            {
                field: 'username',
                headerName: 'Uploader',
                width: 130,
                disableClickEventBubbling: true,
            },
        ]



            return (
                <>
                    <Container component="main" maxWidth="md">
                        <CssBaseline />
                        <Box sx={boxmain}>
                            <Box
                                sx={boxpaper}
                            >
                                <Paper elevation={3}  >
                                    <Grid container>
                                        <Grid item xs>
                                            <Typography component="h1" variant="h5">
                                                RE list
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <IconButton onClick={() => navigate("/dashboard")}>
                                                <ArrowBackIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ mt: 1 }}>
                                        <Box sx={{ height: 400, width: '100%' }}>
                                            <DataGrid
                                                aria-label="Blogs list table"
                                                rows={blogs}
                                                columns={columns}
                                                initialState={{
                                                    pagination: {
                                                        paginationModel: {
                                                            pageSize: 10,
                                                        },
                                                    },
                                                }}
                                                // pageSizeOptions={[5]}
                                                disableColumnSelector
                                                slots={{ toolbar: GridToolbar, noRowsOverlay: () => (
                                                    <Box role="status" aria-live="polite" sx={{ p: 3, textAlign: 'center' }}>
                                                        <Typography variant="body2" color="text.secondary">No blogs to display.</Typography>
                                                    </Box>
                                                ) }}
                                                slotProps={{
                                                    toolbar: {
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
    export default BlogsList