import { useGetAffiliationsQuery } from './affiliationsApiSlice'
import Affiliation from './Affiliation'
import { CssBaseline, Grid } from '@mui/material'
import SectionLoading from '../../components/SectionLoading'
import useTitle from '../../hooks/useTitle'

const AffiliationsList = () => {
    useTitle('ArecGIS | Affiliations')

    const {
        data: affiliations,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAffiliationsQuery('affiliationsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <SectionLoading label="Loading affiliations…" />

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids } = affiliations

        const tableContent = ids?.length && ids.map(affiliationId => (
            <Affiliation key={affiliationId} affiliationId={affiliationId} />
        ))

        content = (
            <div>
                {tableContent}
            </div>
        )
    }

    return content
}

export default AffiliationsList;

