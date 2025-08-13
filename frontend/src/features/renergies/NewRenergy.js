import { CssBaseline, Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import SectionLoading from '../../components/SectionLoading'
import { selectAllUsers } from '../users/usersApiSlice'
import NewRenergyForm from './NewRenergyForm'
import useTitle from '../../hooks/useTitle'
import { useGetUsersQuery } from "../users/usersApiSlice"

const NewRenergy = () => {
    useTitle('ArecGIS | New Marker')
    const allUsers = useSelector(selectAllUsers)
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

    let content
    if (isLoading) content = <SectionLoading label="Loading users…" />

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

        content = allUsers ? <NewRenergyForm allUsers={allUsers} /> : (
            <SectionLoading label="Preparing form…" />
        )

        // console.log(users)
        
    }

    // if (!filteredUsers?.length) return <p>Not Currently Available</p>
    
    return content
}
export default NewRenergy