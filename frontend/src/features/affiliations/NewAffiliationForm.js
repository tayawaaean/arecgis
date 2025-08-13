import { useState, useEffect } from 'react'
import { useAddNewAffiliationMutation } from './affiliationsApiSlice'
import { useNavigate } from 'react-router-dom'
import { boxmain, boxpaper } from '../../config/style'
import {
    Button,
    CssBaseline,
    TextField,
    Box,
    Typography,
    Container,
    IconButton,
    Paper,
    Grid,
} from "@mui/material"
import {
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material/'
import useTitle from "../../hooks/useTitle"

const NewAffiliationForm = () => {
    useTitle('ArecGIS | New Affiliation')

    const [addNewAffiliation, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewAffiliationMutation()

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [code, setCode] = useState('')

    useEffect(() => {
        if (isSuccess) {
            setName('')
            setCode('')
            navigate('/dashboard/affiliations')
        }
    }, [isSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onCodeChanged = e => setCode(e.target.value.toUpperCase())

    const canSave = [name, code].every(Boolean) && !isLoading

    const onSaveAffiliationClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewAffiliation({ name, code })
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <Container maxWidth="sm">
                <Box sx={boxmain}>
                    <Box sx={boxpaper}>
                        <Paper elevation={3}>
                            <Grid container>
                                <Grid item xs>
                                    <Typography component="h1" variant="h5" sx={{ color: 'white' }}>
                                        New Affiliation
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={() => navigate(-1)}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Box sx={{ mt: 1 }}>
                                <form onSubmit={onSaveAffiliationClicked}>
                                    <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
                                        Affiliation Name:
                                    </Typography>
                                    <TextField
                                        size='small'
                                        required
                                        fullWidth
                                        id="name"
                                        value={name}
                                        onChange={onNameChanged}
                                        placeholder="Enter affiliation name"
                                        sx={{ mb: 2 }}
                                    />
                                    <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
                                        Code:
                                    </Typography>
                                    <TextField
                                        size='small'
                                        required
                                        fullWidth
                                        id="code"
                                        value={code}
                                        onChange={onCodeChanged}
                                        placeholder="Enter code (e.g., MMSU)"
                                        inputProps={{ style: { textTransform: 'uppercase' } }}
                                        sx={{ mb: 2 }}
                                    />
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row-reverse",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            sx={{ my: 1, backgroundColor: "primary" }}
                                            disabled={!canSave}
                                            type="submit"
                                        >
                                            Create Affiliation
                                        </Button>
                                    </Box>
                                </form>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </>
    )

    return content
}

export default NewAffiliationForm;

