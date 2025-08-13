import { useSelector } from 'react-redux'
import { selectAffiliationById } from './affiliationsApiSlice'
import EditAffiliation from './EditAffiliation'

const Affiliation = ({ affiliationId }) => {

    const affiliation = useSelector(state => selectAffiliationById(state, affiliationId))

    if (affiliation) {
        return <EditAffiliation affiliation={affiliation} />

    } else return null
}
export default Affiliation;

