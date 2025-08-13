import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice'
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

    const user = useSelector(state => selectUserById(state, targetUserId))

    if (!user) return <SectionLoading label="Loading profile…" />

    const content = <UserProfileForm user={user} />

    return content
}

export default UserProfile;

