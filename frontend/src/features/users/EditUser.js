import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice'
import EditUserForm from './EditUserForm'
import SectionLoading from '../../components/SectionLoading'
import { CssBaseline, Grid } from '@mui/material'
import useTitle from '../../hooks/useTitle'

const EditUser = () => {
    useTitle('ArecGIS | Edit User')

    const { id } = useParams()

    const user = useSelector(state => selectUserById(state, id))

    // const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>

    if (!user) return <SectionLoading label="Loading user…" />

    const content = <EditUserForm user={user} />

    return content
}
export default EditUser