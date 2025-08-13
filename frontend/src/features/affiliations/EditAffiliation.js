import { useState } from 'react'
import { useUpdateAffiliationMutation, useDeleteAffiliationMutation } from './affiliationsApiSlice'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    IconButton,
    Typography,
    Switch,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid
} from '@mui/material'
import {
    Save as SaveIcon,
    Delete as DeleteIcon
} from '@mui/icons-material'

const EditAffiliation = ({ affiliation }) => {
    const [updateAffiliation, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateAffiliationMutation()

    const [deleteAffiliation, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteAffiliationMutation()

    const navigate = useNavigate()

    const [name, setName] = useState(affiliation.name)
    const [code, setCode] = useState(affiliation.code)
    const [active, setActive] = useState(affiliation.active)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const onNameChanged = e => setName(e.target.value)
    const onCodeChanged = e => setCode(e.target.value)
    const onActiveChanged = e => setActive(e.target.checked)

    const canSave = [name, code].every(Boolean) && !isLoading

    const onSaveAffiliationClicked = async () => {
        if (canSave) {
            await updateAffiliation({ id: affiliation.id, name, code, active })
        }
    }

    const onDeleteAffiliationClicked = async () => {
        await deleteAffiliation({ id: affiliation.id })
        setDeleteDialogOpen(false)
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    return (
        <>
            <p className={errClass}>{errContent}</p>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <TextField
                                size="small"
                                fullWidth
                                label="Affiliation Name"
                                value={name}
                                onChange={onNameChanged}
                                placeholder="Enter affiliation name"
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                size="small"
                                fullWidth
                                label="Code"
                                value={code}
                                onChange={onCodeChanged}
                                placeholder="CODE"
                                inputProps={{ style: { textTransform: 'uppercase' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={active}
                                        onChange={onActiveChanged}
                                        color="primary"
                                    />
                                }
                                label="Active"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box display="flex" gap={1}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={onSaveAffiliationClicked}
                                    disabled={!canSave}
                                    size="small"
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => setDeleteDialogOpen(true)}
                                    size="small"
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Affiliation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete "{affiliation.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={onDeleteAffiliationClicked} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default EditAffiliation;

