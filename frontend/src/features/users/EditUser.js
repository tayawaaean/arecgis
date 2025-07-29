import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice'
import EditUserForm from './EditUserForm'
import MoonLoader from 'react-spinners/MoonLoader'
import { CssBaseline, Grid } from '@mui/material'
import useTitle from '../../hooks/useTitle'

const EditUser = () => {
    useTitle('ArecGIS | Edit User')

    const { id } = useParams()

    const user = useSelector(state => selectUserById(state, id))

    // const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>

    if (!user) return (
        <>
            <CssBaseline />
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

    const content = <EditUserForm user={user} />

    return content
}
export default EditUser