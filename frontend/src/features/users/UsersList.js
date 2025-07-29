import { useGetUsersQuery } from "./usersApiSlice"
import User from './User'
import { Container, CssBaseline, Box, IconButton, Typography, Grid, Paper } from "@mui/material"
import {
    ArrowBack as ArrowBackIcon,
}
    from '@mui/icons-material/'
import { useNavigate } from "react-router-dom"
import { MoonLoader } from 'react-spinners'
import { boxmain, boxpaper } from '../../config/style'
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

    if (isLoading) content = 
    (
        <>
            <CssBaseline/>
            <Grid
                container
                spacing={0}
                direction="row"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
            >
                <Grid item >
                    <MoonLoader color={"#fffdd0"} />
                </Grid>
            </Grid>
        </>
    )

    if (isError) {
        content =     
        (
            <>
                <CssBaseline/>
                <Grid
                    container
                    spacing={0}
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: '100vh' }}
                >
                    <Grid item >
                        <p>{error?.data?.message}</p>
                    </Grid>
                </Grid>
            </>
        )
    }

    if (isSuccess) {
        
        const { ids } = users

        const tableContent = ids?.length
            ? <User />
            : null

        content = (
            <Container maxWidth="sm">
                <Box sx={boxmain}>
                    <Box
                        sx={boxpaper}
                    >
                        <Paper elevation={3}  >
                            <Grid container>
                                <Grid item xs>
                                    <Typography component="h1" variant="h5">
                                        Users list
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={() => navigate(-1)}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Box sx={{ mt: 1 }}>
                                {tableContent}
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        )
    }

    return content
}
export default UsersList