import { useState, useEffect } from 'react'
import { useGetAffiliationsQuery } from './affiliationsApiSlice'
import EditAffiliation from './EditAffiliation'
import NewAffiliationForm from './NewAffiliationForm'
import {
    Box,
    Typography,
    Container,
    Paper,
    Grid,
    Button,
    Divider,
    IconButton,
    Pagination
} from '@mui/material'
import {
    Add as AddIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { boxmain, boxpaper } from '../../config/style'
import SectionLoading from '../../components/SectionLoading'
import useTitle from '../../hooks/useTitle'

const AffiliationsManagement = () => {
    useTitle('ArecGIS | Affiliations Management')

    const navigate = useNavigate()
    const [showNewForm, setShowNewForm] = useState(false)
    const [page, setPage] = useState(1)
    const [limit] = useState(5)

    const {
        data: affiliations,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAffiliationsQuery({ page, limit }, {
        pollingInterval: 30000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    // Reset to page 1 when showing the new form
    useEffect(() => {
        if (showNewForm) {
            setPage(1)
        }
    }, [showNewForm])

    // Reset to page 1 if current page is beyond total pages after data changes
    useEffect(() => {
        if (affiliations?.meta && page > affiliations.meta.totalPages && affiliations.meta.totalPages > 0) {
            setPage(1)
        }
    }, [affiliations?.meta, page])

    if (isLoading) return <SectionLoading label="Loading affiliations…" />

    if (isError) {
        return <p className="errmsg">{error?.data?.message}</p>
    }

    const handlePageChange = (event, newPage) => {
        setPage(newPage)
    }

    const content = (
        <Container maxWidth="lg">
            <Box sx={boxmain}>
                <Box sx={boxpaper}>
                    <Paper elevation={3}>
                        <Grid container>
                            <Grid item xs>
                                <Typography component="h1" variant="h5">
                                    Affiliations Management
                                </Typography>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={() => navigate(-1)}>
                                    <ArrowBackIcon />
                                </IconButton>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3 }}>
                            {/* Add New Affiliation Section */}
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">
                                    Add New Affiliation
                                </Typography>
                                <Button
                                    variant={showNewForm ? "outlined" : "contained"}
                                    startIcon={<AddIcon />}
                                    onClick={() => setShowNewForm(!showNewForm)}
                                >
                                    {showNewForm ? 'Cancel' : 'Add New'}
                                </Button>
                            </Box>

                            {showNewForm && (
                                <Box mb={3}>
                                    <NewAffiliationForm />
                                </Box>
                            )}

                            <Divider sx={{ my: 3 }} />

                            {/* Existing Affiliations */}
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">
                                    Existing Affiliations
                                </Typography>
                                {isSuccess && affiliations?.meta && (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body2" color="textSecondary">
                                            Page {affiliations.meta.page} of {affiliations.meta.totalPages} 
                                            ({affiliations.meta.total} total)
                                        </Typography>
                                        {isLoading && (
                                            <Typography variant="caption" color="text.secondary">Refreshing…</Typography>
                                        )}
                                    </Box>
                                )}
                            </Box>

                            {isSuccess && affiliations?.ids?.length ? (
                                <Box>
                                    {affiliations.ids.map(affiliationId => {
                                        const affiliation = affiliations.entities[affiliationId];
                                        return (
                                            <EditAffiliation 
                                                key={affiliationId} 
                                                affiliation={affiliation} 
                                            />
                                        );
                                    })}
                                    
                                    {/* Pagination */}
                                    {affiliations?.meta?.totalPages > 1 && (
                                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                                            <Pagination
                                                count={affiliations.meta.totalPages}
                                                page={page}
                                                onChange={handlePageChange}
                                                color="primary"
                                                size="large"
                                                showFirstButton
                                                showLastButton
                                                disabled={isLoading}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            ) : (
                                <Typography variant="body1" color="textSecondary">
                                    No affiliations found. Add one using the form above.
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Container>
    )

    return content
}

export default AffiliationsManagement;

