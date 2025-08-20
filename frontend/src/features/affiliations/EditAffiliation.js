import { useState } from 'react'
import { useUpdateAffiliationMutation } from './affiliationsApiSlice'
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
    Grid
} from '@mui/material'
import {
    Save as SaveIcon
} from '@mui/icons-material'

const EditAffiliation = ({ affiliation }) => {
    const [updateAffiliation, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateAffiliationMutation()



    const navigate = useNavigate()

    const [name, setName] = useState(affiliation.name)
    const [code, setCode] = useState(affiliation.code)
    const [active, setActive] = useState(affiliation.active)

    const onNameChanged = e => setName(e.target.value)
    const onCodeChanged = e => setCode(e.target.value)
    const onActiveChanged = e => setActive(e.target.checked)

    const canSave = [name, code].every(Boolean) && !isLoading

    const onSaveAffiliationClicked = async () => {
        if (canSave) {
            await updateAffiliation({ id: affiliation.id, name, code, active })
        }
    }



    const errClass = isError ? "errmsg" : "offscreen"
    const errContent = error?.data?.message ?? ''

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
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>


        </>
    )
}

export default EditAffiliation;

