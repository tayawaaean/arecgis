import { useParams } from 'react-router-dom'
import { useGetUserByIdQuery } from './usersApiSlice'
import UserProfileForm from './UserProfileForm'
import SectionLoading from '../../components/SectionLoading'
import { CssBaseline, Grid } from '@mui/material'
import useTitle from '../../hooks/useTitle'
import useAuth from '../../hooks/useAuth'

const UserProfile = () => {
    useTitle('ArecGIS | User Profile')

    const { userId } = useAuth()
    const { id } = useParams()
    
    // Use userId from auth if no id in params (for current user profile)
    const targetUserId = id || userId

    // Don't make the query if we don't have a valid user ID
    const { 
        data: user, 
        isLoading, 
        isError, 
        error 
    } = useGetUserByIdQuery(targetUserId, {
        skip: !targetUserId
    })

    if (!targetUserId) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3>User ID Required</h3>
                <p>Please provide a valid user ID to view the profile.</p>
            </div>
        )
    }

    if (isLoading) return <SectionLoading label="Loading profile…" />
    
    if (isError) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3>Error loading profile</h3>
                <p>{error?.data?.message || 'Failed to load user profile'}</p>
            </div>
        )
    }

    if (!user) return <SectionLoading label="Profile not found…" />

    const content = <UserProfileForm user={user} />

    return content
}

export default UserProfile;

