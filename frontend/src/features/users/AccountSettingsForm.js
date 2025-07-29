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
    Alert,
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
import { useSendLogoutMutation } from "../auth/authApiSlice"
import { MoonLoader } from "react-spinners"

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

const AccountSettingsForm = ({ user }) => {

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()


    const navigate = useNavigate()
    const { id, isAdmin, isManager } = useAuth()
    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [currPW, setCurrPW] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)
    const [infoAlert, setInfoAlert] = useState(false)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    const [sendLogout, {
        isLoading: isLogoutLoading,
        isSuccess: isLogoutSuccess,
        isError: isLogoutError,
        error: logouterror
      }] = useSendLogoutMutation()

      useEffect(() => {
        if (isLogoutSuccess) {
          // setAnchorEl(null)
          navigate('/')
        }
    
      }, [isLogoutSuccess, navigate])
    


    useEffect(() => {

        if (isSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            setInfoAlert(true)
        }if(isError){
            setCurrPW('')
            setPassword('')
            setErrMsg(error?.data?.message)
        }


    }, [isSuccess, isError, navigate])


    if (isLogoutLoading) return (
        <>
          <CssBaseline />
          <Grid
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
          >
            <Grid item >
              <MoonLoader color={"#fffdd0"} />
            </Grid>
          </Grid>
        </>
      )
    
    
      if (isLogoutError) return <p>Error: {logouterror?.data?.message}</p>

    const onUsernameChanged = e => setUsername(e.target.value)
    const onCurrChanged = e => setCurrPW(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ id: user.id, username, password, roles, active, currPW, isAdmin, isManager })
        } else {
            await updateUser({ id: user.id, username, roles, active })
        }
    }

    let canSave
    if (password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    // const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    // const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
    // const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''


    const content = (
        <>

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
                                        Account Settings
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={() => navigate(-1)}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            {errMsg ? <Alert onClose={() => setErrMsg(null)} severity="error">{errMsg}</Alert> : null}
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
                                        name="currPW"
                                        label="Current Password"
                                        type="password"
                                        id="currPW"
                                        value={currPW}
                                        onChange={onCurrChanged}
                                    />
                                                                        <TextField
                                        margin="normal"
                                        fullWidth
                                        name="newpassword"
                                        label="New Password"
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={onPasswordChanged}
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
                                        
                                    </Box>
                                </form>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
                
            </Container>
            <Dialog
                open={infoAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Settings updated!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Account settings has changed. Please log in again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="success" onClick={sendLogout}>Ok</Button>
                </DialogActions>
            </Dialog>
        </>
    )

    return content
}
export default AccountSettingsForm