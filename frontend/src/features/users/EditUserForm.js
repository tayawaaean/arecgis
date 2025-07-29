import React, { useState, useEffect } from "react"
import { useTheme } from '@mui/material/styles'
import { useNavigate } from "react-router-dom"
import {
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material"
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    DeleteForever as DeleteForeverIcon
}
    from '@mui/icons-material/'
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { ROLES } from "../../config/roles"
import { boxmain, boxpaper } from '../../config/style'
import useAuth from "../../hooks/useAuth"

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

const EditUserForm = ({ user }) => {

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

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()
    const { id, isAdmin, isManager } = useAuth()
    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)
    const [delAlert, setDelAlert] = useState(false)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {

        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dashboard/users')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ id: user.id, username, password, roles, active, isAdmin, isManager })
        } else {
            await updateUser({ id: user.id, username, roles, active })
        }
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    let canSave
    if (password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    // const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    // const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
    // const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const openDelAlert = () => {
      setDelAlert(true)
  
    }
  
    const closeDelAlert = () => {
      setDelAlert(false)
    }

    const content = (
        <>
            <p className={errClass}>{errContent}</p>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={boxmain}
                >
                    <Box
                        sx={boxpaper}
                    >
                        <Paper elevate={3}>
                            <Grid container>
                                <Grid item xs>
                                    <Typography component="h1" variant="h5">
                                        Edit user
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={() => navigate(-1)}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Box sx={{ mt: 1 }}>
                                <form onSubmit={e => e.preventDefault()}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        value={username}
                                        onChange={onUsernameChanged}
                                    />
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={onPasswordChanged}
                                    />
                                    <Select
                                        sx={{ my: 2 }}
                                        label="Roles"
                                        multiple
                                        fullWidth
                                        value={roles}
                                        onChange={onRolesChange}
                                        input={<OutlinedInput id="select-multiple-chip" label="Roles" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} color="error" />
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
                                    <FormControlLabel
                                        control={<Checkbox id="user-active" checked={active} onChange={onActiveChanged} color="primary" />}
                                        label="Active"
                                    />
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row-reverse",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            sx = {{ my: 1 ,backgroundColor: "primary"}}
                                            onClick={onSaveUserClicked}
                                            disabled={!canSave}
                                        >
                                            <SaveIcon />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            sx={{ m: 1 }}
                                            onClick={openDelAlert}
                                        >
                                            <DeleteForeverIcon />
                                        </Button>
                                    </Box>
                                </form>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
                
            </Container>
            <Dialog
                open={delAlert}
                onClose={closeDelAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete warning"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDelAlert}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={onDeleteUserClicked}>Yes</Button>
                </DialogActions>
            </Dialog>
        </>
    )

    return content
}
export default EditUserForm