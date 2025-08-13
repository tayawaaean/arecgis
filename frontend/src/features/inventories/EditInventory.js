import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectInventoryById } from './inventoriesApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import EditInventoryForm from './EditInventoryForm'
import useAuth from '../../hooks/useAuth'
import { Alert, CssBaseline, Grid } from '@mui/material'
import SectionLoading from '../../components/SectionLoading'
import useTitle from '../../hooks/useTitle'
import { useEffect, useState } from 'react'

const EditInventory = () => {
    useTitle('ArecGIS | Edit')
    const { id } = useParams()

    let [loading, setLoading] = useState(true)

    const { username, isManager, isAdmin } = useAuth()

    const reItems = useSelector(state => selectInventoryById(state, id))
    const allUsers = useSelector(selectAllUsers)

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false);
            }, 10000);
        }
    }, [loading]);

    if (!reItems || !allUsers?.length) return <SectionLoading label="Loading inventory…" />

    if (!isManager && !isAdmin) {
        if (reItems.username !== username) {
            return (
                <>
                    <CssBaseline />
                    <Alert severity="warning">No access</Alert>
                </>
            )

        }
    }

    const content = <EditInventoryForm reItems={reItems} allUsers={allUsers} />

    return content
}

export default EditInventory