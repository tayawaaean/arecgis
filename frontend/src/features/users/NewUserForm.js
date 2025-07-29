import { useState, useEffect } from 'react'
import { useAddNewUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import { ROLES } from '../../config/roles'
import { boxmain, boxpaper } from '../../config/style'
import { useTheme } from '@mui/material/styles'
import {
    Button,
    CssBaseline,
    TextField,
    Box,
    Typography,
    Container,
    MenuItem,
    OutlinedInput,
    Select,
    Chip,
    IconButton,
    Paper,
    Grid,
} from "@mui/material"
import {
    ArrowBack as ArrowBackIcon,
}
    from '@mui/icons-material/'
import useTitle from "../../hooks/useTitle"
const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}
const getRoleStyles = (name, roles, theme) => {
    return {
        fontWeight:
            roles.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    }
}

const NewUserForm = () => {
    useTitle('ArecGIS | New User')

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(["Employee"])

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dashboard/users')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ username, password, roles })
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"
    // const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    // const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    // const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const theme = useTheme()

    const onRolesChange = (event) => {
        const {
            target: { value },
        } = event
        setRoles(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <Container maxWidth="sm">
                <Box
                    sx={boxmain}
                >
                    <Box
                        sx={boxpaper}
                    >
                        <Paper elevation={3}  >
                            <Grid container>
                                <Grid item xs>
                                    <Typography component="h1" variant="h5">
                                        New user
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={() => navigate(-1)}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Box sx={{ mt: 1 }}>
                                <form onSubmit={onSaveUserClicked}>
                                    <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
                                        Username:
                                    </Typography>
                                    <TextField
                                        size='small'
                                        required
                                        fullWidth
                                        id="username"
                                        value={username}
                                        onChange={onUsernameChanged}
                                        helperText="[3-20 letters]"
                                    />
                                    <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
                                        Password:
                                    </Typography>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        name="password"
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={onPasswordChanged}
                                        helperText="[4-12 characters incl. !@#$%]"
                                    />
                                    <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
                                        Select role(s):
                                    </Typography>
                                    <Select
                                        size='small'
                                        multiple
                                        fullWidth
                                        value={roles}
                                        onChange={onRolesChange}
                                        input={<OutlinedInput id="select-multiple-chip" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} color='error' />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {Object.values(ROLES).map((name) => (
                                            <MenuItem
                                                key={name}
                                                value={name}
                                                style={getRoleStyles(name, roles, theme)}
                                            >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row-reverse",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            sx = {{ my: 1 ,backgroundColor: "primary"}}
                                            disabled={!canSave}
                                            type="submit"
                                        >
                                            Create new user
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
export default NewUserForm