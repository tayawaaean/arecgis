import NewAffiliationForm from './NewAffiliationForm'
import useTitle from '../../hooks/useTitle'

const NewAffiliation = () => {
    useTitle('ArecGIS | New Affiliation')

    const content = <NewAffiliationForm />

    return content
}

export default NewAffiliation;

