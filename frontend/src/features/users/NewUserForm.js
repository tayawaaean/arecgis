import { useState, useEffect } from 'react'
import { useAddNewUserMutation } from './usersApiSlice'
import { useGetAffiliationsQuery } from '../affiliations/affiliationsApiSlice'
import { useNavigate } from 'react-router-dom'
import { ROLES } from '../../config/roles'
import { DEFAULT_AFFILIATIONS } from '../../config/affiliations'
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
    Divider,
} from "@mui/material"
import {
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    Lock as LockIcon,
    Badge as BadgeIcon,
    Home as HomeIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
    Add as AddIcon,
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
    const [fullName, setFullName] = useState('')
    const [address, setAddress] = useState('')
    const [contactNumber, setContactNumber] = useState('')
    const [affiliation, setAffiliation] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [companyContactNumber, setCompanyContactNumber] = useState('')

    // Phone validations: must start with +63 and contain digits only
    const [validContactNumber, setValidContactNumber] = useState(true)
    const [validCompanyContactNumber, setValidCompanyContactNumber] = useState(true)

    const {
        data: affiliations,
        isLoading: affiliationsLoading,
        isError: affiliationsError
    } = useGetAffiliationsQuery()

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
            setFullName('')
            setAddress('')
            setContactNumber('')
            setAffiliation('')
            setCompanyName('')
            setCompanyContactNumber('')
            navigate('/dashboard/users')
        }
    }, [isSuccess, navigate])

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
        // Allow empty (optional). When provided, must match +63 followed by digits
        const ok = contactNumber === '' || /^\+63\d+$/.test(contactNumber)
        setValidContactNumber(ok)
    }, [contactNumber])

    useEffect(() => {
        const ok = companyContactNumber === '' || /^\+63\d+$/.test(companyContactNumber)
        setValidCompanyContactNumber(ok)
    }, [companyContactNumber])

    const companyContactOk = roles.includes('Installer') ? validCompanyContactNumber : true
    const canSave = [roles.length, validUsername, validPassword, validContactNumber, companyContactOk].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ 
                username, 
                password, 
                roles, 
                fullName, 
                address, 
                contactNumber, 
                affiliation,
                companyName,
                companyContactNumber
            })
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
            <Container maxWidth="md" sx={{ height: '100vh', py: 2 }}>
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
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Grid item xs>
                                <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>
                                    New User
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
                        
                        <form onSubmit={onSaveUserClicked}>
                            <Grid container spacing={3}>
                                {/* Left Column */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography sx={{ fontStyle: 'italic', fontWeight: 600, color: 'primary.main' }} component="h3" variant="subtitle1">
                                            Account Information
                                        </Typography>
                                    </Box>
                                    
                                    <Typography sx={{ fontStyle: 'italic', mb: 1, fontWeight: 500 }} component="h2" variant="subtitle2">
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
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    <Typography sx={{ fontStyle: 'italic', mb: 1, fontWeight: 500 }} component="h2" variant="subtitle2">
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
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    <Typography sx={{ fontStyle: 'italic', mb: 1, fontWeight: 500 }} component="h2" variant="subtitle2">
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
                                </Grid>
                                
                                {/* Right Column */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <BadgeIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography sx={{ fontStyle: 'italic', fontWeight: 600, color: 'primary.main' }} component="h3" variant="subtitle1">
                                            Personal Information
                                        </Typography>
                                    </Box>
                                    
                                    <Typography sx={{ fontStyle: 'italic', mb: 1, fontWeight: 500 }} component="h2" variant="subtitle2">
                                        Full Name:
                                    </Typography>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        id="fullName"
                                        value={fullName}
                                        onChange={onFullNameChanged}
                                        placeholder="Enter full name"
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    <Typography sx={{ fontStyle: 'italic', mb: 1, fontWeight: 500 }} component="h2" variant="subtitle2">
                                        Address:
                                    </Typography>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        multiline
                                        rows={2}
                                        id="address"
                                        value={address}
                                        onChange={onAddressChanged}
                                        placeholder="Enter address"
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    <Typography sx={{ fontStyle: 'italic', mb: 1, fontWeight: 500 }} component="h2" variant="subtitle2">
                                        Contact Number:
                                    </Typography>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        id="contactNumber"
                                        value={contactNumber}
                                        onChange={onContactNumberChanged}
                                        onFocus={onContactNumberFocus}
                                        placeholder="Enter contact number"
                                        error={!validContactNumber}
                                        helperText={!validContactNumber ? 'Format: +63 followed by digits only' : ' '}
                                        sx={{ mb: 2 }}
                                    />
                                    
                                    <Typography sx={{ fontStyle: 'italic', mb: 1, fontWeight: 500 }} component="h2" variant="subtitle2">
                                        Affiliation:
                                    </Typography>
                                    <Select
                                        size='small'
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
                                                        size='small'
                                                        fullWidth
                                                        id="companyName"
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
                                                        size='small'
                                                        fullWidth
                                                        id="companyContactNumber"
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
                                
                                {/* Submit Button */}
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            pt: 1
                                        }}
                                    >
                                        <Button
                                            variant="contained"
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
                                            disabled={!canSave}
                                            type="submit"
                                            startIcon={<AddIcon />}
                                        >
                                            Create New User
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Box>
            </Container>
        </>
    )

    return content
}
export default NewUserForm