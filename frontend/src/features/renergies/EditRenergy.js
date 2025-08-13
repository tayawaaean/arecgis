import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectRenergyById } from './renergiesApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import EditRenergyForm from './EditRenergyForm'
import useAuth from '../../hooks/useAuth'
import { Alert, CssBaseline, Grid } from '@mui/material'
import SectionLoading from '../../components/SectionLoading'
import useTitle from '../../hooks/useTitle'
import { useEffect, useState } from 'react'

const EditRenergy = () => {
    useTitle('ArecGIS | Edit')
    const { id } = useParams()

    let [loading, setLoading] = useState(true)

    const { username, isManager, isAdmin } = useAuth()

    const reItems = useSelector(state => selectRenergyById(state, id))
    const users = useSelector(selectAllUsers)

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false);
            }, 10000);
        }
    }, [loading]);


    if (!reItems || !users?.length) return <SectionLoading label="Loading item…" />

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

    const content = <EditRenergyForm reItems={reItems} users={users} />

    return content
}

export default EditRenergy