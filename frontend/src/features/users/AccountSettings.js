import { useParams } from 'react-router-dom'
import { useGetUserByIdQuery } from './usersApiSlice'
import AccountSettingsForm from './AccountSettingsForm'
import SectionLoading from '../../components/SectionLoading'
import { CssBaseline, Grid } from '@mui/material'
import useTitle from '../../hooks/useTitle'

const AccountSettings = () => {

    useTitle('ArecGIS | Account Settings')

    const { id } = useParams()

    // Don't make the query if no ID is provided
    const { 
        data: user, 
        isLoading, 
        isError, 
        error 
    } = useGetUserByIdQuery(id, {
        skip: !id
    })

    if (!id) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3>User ID Required</h3>
                <p>Please provide a valid user ID to access account settings.</p>
            </div>
        )
    }

    if (isLoading) return <SectionLoading label="Loading account settings…" />
    
    if (isError) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3>Error loading account settings</h3>
                <p>{error?.data?.message || 'Failed to load user account settings'}</p>
            </div>
        )
    }

    if (!user) return <SectionLoading label="Account settings not found…" />

    const content = <AccountSettingsForm user={user} />

    return content
}
export default AccountSettings