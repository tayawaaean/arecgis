import { CssBaseline, Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import SectionLoading from '../../components/SectionLoading'
import { selectAllUsers } from '../users/usersApiSlice'
import NewInventoryForm from './NewInventoryForm'
import useTitle from '../../hooks/useTitle'
import useAuth from "../../hooks/useAuth"
import { useGetUsersQuery } from "../users/usersApiSlice"
import FeatureErrorBoundary from '../../components/FeatureErrorBoundary'

const NewInventory = () => {
    useTitle('ArecGIS | New Inventory')
    const { username, isManager, isAdmin,  } = useAuth()
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
        const { ids, entities } = users

        content = allUsers ? (
            <FeatureErrorBoundary featureName="Inventory Form">
                <NewInventoryForm allUsers={allUsers} />
            </FeatureErrorBoundary>
        ) : (
            <SectionLoading label="Preparing form…" />
        )
    }


    // if (!filteredUsers?.length) return <p>Not Currently Available</p>
    
   

    return content
}
export default NewInventory