import { useGetUsersQuery } from "./usersApiSlice"
import User from './User'
import { 
    Container, 
    CssBaseline, 
    Box, 
    IconButton, 
    Typography, 
    Grid, 
    Paper,
    Button,
    Alert,
    CircularProgress
} from "@mui/material"
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material'
import { useNavigate } from "react-router-dom"
import useTitle from '../../hooks/useTitle'
const UsersList = () => {
    useTitle('ArecGIS | Users list')
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const navigate = useNavigate()
    let content

    if (isLoading) content = (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
            </Box>
        </Container>
    )

    if (isError) {
        content = (
            <Container maxWidth="lg">
                <Box sx={{ mt: 4 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Error loading users: {error?.data?.message || 'Unknown error'}
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
    }

    if (isSuccess) {
        
        const { ids } = users

        const tableContent = ids?.length
            ? <User />
            : null

        content = (
            <Container maxWidth="lg">
                <Box sx={{ mt: 4, mb: 4 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                            <Grid item xs>
                                <Typography component="h1" variant="h4" gutterBottom>
                                    Users Management
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Manage system users, roles, and affiliations
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
                                    onClick={() => navigate('/dashboard/users/new')}
                                    sx={{ mr: 1 }}
                                >
                                    Add User
                                </Button>
                                <IconButton 
                                    onClick={() => window.location.reload()}
                                    title="Refresh"
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        
                        {ids?.length === 0 ? (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                No users found. 
                                <Button 
                                    variant="outlined" 
                                    size="small" 
                                    sx={{ ml: 2 }}
                                    onClick={() => navigate('/dashboard/users/new')}
                                >
                                    Create First User
                                </Button>
                            </Alert>
                        ) : (
                            <Box sx={{ mt: 2 }}>
                                {tableContent}
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Container>
        )
    }

    return content
}
export default UsersList