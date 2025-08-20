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
    Divider,
} from "@mui/material"
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Edit as EditIcon,
    Lock as LockIcon,
    Person as PersonIcon,
    Badge as BadgeIcon,
    Business as BusinessIcon,
    DeleteForever as DeleteForeverIcon
}
    from '@mui/icons-material/'
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useGetAffiliationsQuery } from '../affiliations/affiliationsApiSlice'
import { ROLES } from "../../config/roles"
import { DEFAULT_AFFILIATIONS } from '../../config/affiliations'
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

    const {
        data: affiliations,
        isLoading: affiliationsLoading,
        isError: affiliationsError
    } = useGetAffiliationsQuery()

    const navigate = useNavigate()
    const { id, isAdmin, isManager } = useAuth()
    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)
    const [fullName, setFullName] = useState(user.fullName || '')
    const [address, setAddress] = useState(user.address || '')
    const [contactNumber, setContactNumber] = useState(user.contactNumber || '')
    const [affiliation, setAffiliation] = useState(user.affiliation || '')
    const [companyName, setCompanyName] = useState(user.companyName || '')
    const [companyContactNumber, setCompanyContactNumber] = useState(user.companyContactNumber || '')
    const [delAlert, setDelAlert] = useState(false)

    // Phone validations: must start with +63 and contain digits only
    const [validContactNumber, setValidContactNumber] = useState(true)
    const [validCompanyContactNumber, setValidCompanyContactNumber] = useState(true)

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
            setFullName('')
            setAddress('')
            setContactNumber('')
            setAffiliation('')
            setCompanyName('')
            setCompanyContactNumber('')
            navigate('/dashboard/users')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onFullNameChanged = e => setFullName(e.target.value)
    const onAddressChanged = e => setAddress(e.target.value)
    const onContactNumberChanged = e => {
        const value = e.target.value
        // Allow empty string or +63 followed by digits
        if (value === '' || (value.startsWith('+63') && /^\+63\d*$/.test(value))) {
            setContactNumber(value)
        }
    }
    const onAffiliationChanged = e => setAffiliation(e.target.value)
    const onCompanyNameChanged = e => setCompanyName(e.target.value)
    const onCompanyContactNumberChanged = e => {
        const value = e.target.value
        // Allow empty string or +63 followed by digits
        if (value === '' || (value.startsWith('+63') && /^\+63\d*$/.test(value))) {
            setCompanyContactNumber(value)
        }
    }

    const onContactNumberFocus = () => {
        if (!contactNumber.startsWith('+63')) {
            setContactNumber('+63')
        }
    }

    const onCompanyContactNumberFocus = () => {
        if (!companyContactNumber.startsWith('+63')) {
            setCompanyContactNumber('+63')
        }
    }

    useEffect(() => {
        const ok = contactNumber === '' || /^\+63\d+$/.test(contactNumber)
        setValidContactNumber(ok)
    }, [contactNumber])

    useEffect(() => {
        const ok = companyContactNumber === '' || /^\+63\d+$/.test(companyContactNumber)
        setValidCompanyContactNumber(ok)
    }, [companyContactNumber])

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ 
                id: user.id, 
                username, 
                password, 
                roles, 
                active, 
                fullName, 
                address, 
                contactNumber, 
                affiliation,
                companyName,
                companyContactNumber,
                isAdmin, 
                isManager 
            })
        } else {
            await updateUser({ 
                id: user.id, 
                username, 
                roles, 
                active, 
                fullName, 
                address, 
                contactNumber, 
                affiliation,
                companyName,
                companyContactNumber
            })
        }
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    let canSave
    if (password) {
        const companyContactOk = roles.includes('Installer') ? validCompanyContactNumber : true
        canSave = [roles.length, validUsername, validPassword, validContactNumber, companyContactOk].every(Boolean) && !isLoading
    } else {
        const companyContactOk = roles.includes('Installer') ? validCompanyContactNumber : true
        canSave = [roles.length, validUsername, validContactNumber, companyContactOk].every(Boolean) && !isLoading
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
            <Container component="main" maxWidth="md" sx={{ height: '100vh', py: 2 }}>
                <CssBaseline />
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 3,
                            height: 'fit-content',
                            maxHeight: '95vh',
                            overflow: 'hidden'
                        }}
                    >
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                            <Grid item xs>
                                <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>
                                    Edit User
                                </Typography>
                            </Grid>
                            <Grid item>
                                <IconButton 
                                    onClick={() => navigate(-1)}
                                    sx={{ 
                                        color: 'primary.main',
                                        '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                                    }}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        
                        <form onSubmit={e => e.preventDefault()}>
                            <Grid container spacing={3}>
                                {/* Left Column - Basic Info */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <LockIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography sx={{ fontStyle: 'italic', mb: 0, fontWeight: 600, color: 'primary.main' }} component="h3" variant="subtitle1">
                                            Account Settings
                                        </Typography>
                                    </Box>
                                    
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        value={username}
                                        onChange={onUsernameChanged}
                                        size="small"
                                        sx={{ mb: 2 }}
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
                                        size="small"
                                        sx={{ mb: 2 }}
                                        helperText="Leave blank to keep current password"
                                    />
                                    
                                    <Typography sx={{ fontStyle: 'italic', mb: 1, fontWeight: 500 }} component="h2" variant="subtitle2">
                                        Select role(s):
                                    </Typography>
                                    <Select
                                        size="small"
                                        multiple
                                        fullWidth
                                        value={roles}
                                        onChange={onRolesChange}
                                        input={<OutlinedInput id="select-multiple-chip" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} color="error" />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                        sx={{ mb: 2 }}
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
                                        sx={{ mt: 1 }}
                                    />
                                </Grid>
                                
                                {/* Right Column - Profile Info */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <BadgeIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography sx={{ fontStyle: 'italic', mb: 0, fontWeight: 600, color: 'primary.main' }} component="h3" variant="subtitle1">
                                            Profile Information
                                        </Typography>
                                    </Box>
                                    
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        id="fullName"
                                        label="Full Name"
                                        value={fullName}
                                        onChange={onFullNameChanged}
                                        placeholder="Enter full name"
                                        size="small"
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        id="address"
                                        label="Address"
                                        value={address}
                                        onChange={onAddressChanged}
                                        placeholder="Enter address"
                                        size="small"
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        id="contactNumber"
                                        label="Contact Number"
                                        value={contactNumber}
                                        onChange={onContactNumberChanged}
                                        onFocus={onContactNumberFocus}
                                        placeholder="Enter contact number"
                                        error={!validContactNumber}
                                        helperText={!validContactNumber ? 'Format: +63 followed by digits only' : ' '}
                                        size="small"
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    <Typography sx={{ fontStyle: 'italic', mb: 1, fontWeight: 500 }} component="h2" variant="subtitle2">
                                        Affiliation:
                                    </Typography>
                                    <Select
                                        size="small"
                                        fullWidth
                                        value={affiliation}
                                        onChange={onAffiliationChanged}
                                        displayEmpty
                                        sx={{ mb: 2 }}
                                    >
                                        <MenuItem value="">
                                            <em>Not Affiliated</em>
                                        </MenuItem>
                                        {affiliationsLoading ? (
                                            DEFAULT_AFFILIATIONS.map((affil) => (
                                                <MenuItem key={affil.code} value={affil.code}>
                                                    {affil.name} ({affil.code})
                                                </MenuItem>
                                            ))
                                        ) : affiliations?.ids?.length ? (
                                            affiliations.ids.map((id) => {
                                                const affil = affiliations.entities[id];
                                                return (
                                                    <MenuItem key={affil.code} value={affil.code}>
                                                        {affil.name} ({affil.code})
                                                    </MenuItem>
                                                );
                                            })
                                        ) : (
                                            DEFAULT_AFFILIATIONS.map((affil) => (
                                                <MenuItem key={affil.code} value={affil.code}>
                                                    {affil.name} ({affil.code})
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </Grid>
                                
                                {/* Company fields - Full width when Installer role is selected */}
                                {roles.includes('Installer') && (
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ 
                                            p: 3, 
                                            backgroundColor: 'grey.50', 
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: 'primary.light',
                                            boxShadow: 1
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                <Typography sx={{ fontStyle: 'italic', fontWeight: 600, color: 'primary.main' }} component="h3" variant="subtitle1">
                                                    Company Information
                                                </Typography>
                                            </Box>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Typography sx={{ fontStyle: 'italic', mb: 1, fontWeight: 500 }} component="h2" variant="subtitle2">
                                                        Company Name:
                                                    </Typography>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        id="companyName"
                                                        label="Company Name"
                                                        value={companyName}
                                                        onChange={onCompanyNameChanged}
                                                        placeholder="Enter company name"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Typography sx={{ fontStyle: 'italic', mb: 1, fontWeight: 500 }} component="h2" variant="subtitle2">
                                                        Company Contact Number:
                                                    </Typography>
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        id="companyContactNumber"
                                                        label="Company Contact Number"
                                                        value={companyContactNumber}
                                                        onChange={onCompanyContactNumberChanged}
                                                        onFocus={onCompanyContactNumberFocus}
                                                        placeholder="Enter company contact number"
                                                        error={roles.includes('Installer') && !validCompanyContactNumber}
                                                        helperText={roles.includes('Installer') && !validCompanyContactNumber ? 'Format: +63 followed by digits only' : ' '}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                )}
                                
                                {/* Action Buttons */}
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            gap: 2,
                                            pt: 1
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={openDelAlert}
                                            sx={{ 
                                                px: 3,
                                                py: 1.5,
                                                fontWeight: 600,
                                                borderRadius: 2,
                                                boxShadow: 2,
                                                '&:hover': {
                                                    boxShadow: 4,
                                                    transform: 'translateY(-1px)'
                                                }
                                            }}
                                        >
                                            <DeleteForeverIcon sx={{ mr: 1 }} />
                                            Delete User
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={onSaveUserClicked}
                                            disabled={!canSave}
                                            sx={{ 
                                                px: 4,
                                                py: 1.5,
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                borderRadius: 2,
                                                boxShadow: 2,
                                                '&:hover': {
                                                    boxShadow: 4,
                                                    transform: 'translateY(-1px)'
                                                }
                                            }}
                                        >
                                            <SaveIcon sx={{ mr: 1 }} />
                                            Save Changes
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
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