import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice'
import AccountSettingsForm from './AccountSettingsForm'
import SectionLoading from '../../components/SectionLoading'
import { CssBaseline, Grid } from '@mui/material'
import useTitle from '../../hooks/useTitle'

const AccountSettings = () => {

    useTitle('ArecGIS | Account Settings')

    const { id } = useParams()

    const user = useSelector(state => selectUserById(state, id))

    // const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>

    if (!user) return <SectionLoading label="Loading account settings…" />

    const content = <AccountSettingsForm user={user} />

    return content
}
export default AccountSettings