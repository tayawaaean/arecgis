import React, { useState, useEffect } from "react"
import { useTheme } from '@mui/material/styles'
import { useNavigate } from "react-router-dom"
import {
    Button,
    CssBaseline,
    TextField,
    Box,
    Typography,
    Container,
    MenuItem,
    Select,
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
    Lock as LockIcon
} from '@mui/icons-material/'
import { useUpdateUserMutation, useUpdateOwnProfileMutation } from "./usersApiSlice"
import { useGetAffiliationsQuery } from '../affiliations/affiliationsApiSlice'
import { DEFAULT_AFFILIATIONS } from '../../config/affiliations'
import { boxmain, boxpaper } from '../../config/style'
import useAuth from "../../hooks/useAuth"
import { MoonLoader } from "react-spinners"

const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const UserProfileForm = ({ user }) => {
    const theme = useTheme()
    const navigate = useNavigate()
    const { userId: currentUserId, isAdmin, isManager } = useAuth()

    const [updateUser, {
        isLoading: updateUserLoading,
        isSuccess: updateUserSuccess,
        isError: updateUserError,
        error: updateUserErrorData
    }] = useUpdateUserMutation()

    const [updateOwnProfile, {
        isLoading: updateProfileLoading,
        isSuccess: updateProfileSuccess,
        isError: updateProfileError,
        error: updateProfileErrorData
    }] = useUpdateOwnProfileMutation()

    // Use the appropriate loading and error states
    const isLoading = updateUserLoading || updateProfileLoading
    const isSuccess = updateUserSuccess || updateProfileSuccess
    const isError = updateUserError || updateProfileError
    const error = updateUserErrorData || updateProfileErrorData

    const {
        data: affiliations,
        isLoading: affiliationsLoading,
        isError: affiliationsError
    } = useGetAffiliationsQuery()

    // Form state
    const [fullName, setFullName] = useState(user.fullName || '')
    const [address, setAddress] = useState(user.address || '')
    const [contactNumber, setContactNumber] = useState(user.contactNumber || '')
    const [affiliation, setAffiliation] = useState(user.affiliation || '')
    const [companyName, setCompanyName] = useState(user.companyName || '')
    const [companyContactNumber, setCompanyContactNumber] = useState(user.companyContactNumber || '')

    // Phone validations: must start with +63 and contain digits only
    const [validContactNumber, setValidContactNumber] = useState(true)
    const [validCompanyContactNumber, setValidCompanyContactNumber] = useState(true)

    // Password change state
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [validNewPassword, setValidNewPassword] = useState(false)
    const [passwordsMatch, setPasswordsMatch] = useState(false)

    // Edit mode
    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        setValidNewPassword(PWD_REGEX.test(newPassword))
    }, [newPassword])

    useEffect(() => {
        // Allow empty (optional). When provided, must match +63 followed by at least one digit
        const ok = contactNumber === '' || /^\+63\d+$/.test(contactNumber)
        setValidContactNumber(ok)
    }, [contactNumber])

    useEffect(() => {
        const ok = companyContactNumber === '' || /^\+63\d+$/.test(companyContactNumber)
        setValidCompanyContactNumber(ok)
    }, [companyContactNumber])

    useEffect(() => {
        setPasswordsMatch(newPassword === confirmPassword && newPassword !== '')
    }, [newPassword, confirmPassword])

    useEffect(() => {
        if (isSuccess) {
            setEditMode(false)
            setShowPasswordDialog(false)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        }
    }, [isSuccess])

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

    const companyContactOk = user.roles.includes('Installer') ? validCompanyContactNumber : true
    const canSaveProfile = !isLoading && validContactNumber && companyContactOk
    const canSavePassword = [validNewPassword, passwordsMatch, currentPassword].every(Boolean) && !isLoading

    const onSaveProfileClicked = async (e) => {
        e.preventDefault()
        if (canSaveProfile) {
            // If user is updating their own profile, use updateOwnProfile
            if (currentUserId === user.id) {
                await updateOwnProfile({
                    fullName,
                    address,
                    contactNumber,
                    affiliation,
                    companyName,
                    companyContactNumber
                })
            } else {
                // If admin/manager is updating someone else's profile, use updateUser
                await updateUser({
                    id: user.id,
                    username: user.username,
                    roles: user.roles,
                    active: user.active,
                    fullName,
                    address,
                    contactNumber,
                    affiliation,
                    companyName,
                    companyContactNumber,
                    isAdmin,
                    isManager
                })
            }
        }
    }

    const onChangePasswordClicked = async (e) => {
        e.preventDefault()
        if (canSavePassword) {
            // If user is changing their own password, use updateOwnProfile
            if (currentUserId === user.id) {
                await updateOwnProfile({
                    password: newPassword,
                    currPW: currentPassword
                })
            } else {
                // If admin/manager is changing someone else's password, use updateUser
                await updateUser({
                    id: user.id,
                    username: user.username,
                    roles: user.roles,
                    active: user.active,
                    password: newPassword,
                    currPW: currentPassword,
                    isAdmin,
                    isManager
                })
            }
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"

    // Check if current user can edit this profile
    const canEdit = currentUserId === user.id || isAdmin || isManager

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <Container maxWidth="md">
                <Box sx={boxmain}>
                    <Box sx={boxpaper}>
                        <Paper elevation={3}>
                            <Grid container>
                                <Grid item xs>
                                    <Typography component="h1" variant="h5">
                                        User Profile
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={() => navigate(-1)}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 3 }}>
                                {/* Basic Info Section */}
                                <Typography variant="h6" gutterBottom>
                                    Basic Information
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Username
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            {user.username}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Roles
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            {user.roles.join(', ')}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                {/* Profile Information Section */}
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6">
                                        Profile Information
                                    </Typography>
                                    {canEdit && !editMode && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() => setEditMode(true)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </Box>

                                <form onSubmit={onSaveProfileClicked}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography sx={{ fontStyle: 'italic' }} component="h2" variant="subtitle2">
                                                Full Name:
                                            </Typography>
                                            <TextField
                                                size='small'
                                                fullWidth
                                                id="fullName"
                                                value={fullName}
                                                onChange={onFullNameChanged}
                                                placeholder="Enter full name"
                                                disabled={!editMode}
                                            />
                                        </Grid>
                                        
                                        <Grid item xs={12}>
                                            <Typography sx={{ fontStyle: 'italic' }} component="h2" variant="subtitle2">
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
                                                disabled={!editMode}
                                            />
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={6}>
                                            <Typography sx={{ fontStyle: 'italic' }} component="h2" variant="subtitle2">
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
                                                disabled={!editMode}
                                                error={editMode && !validContactNumber}
                                                helperText={editMode && !validContactNumber ? 'Format: +63 followed by digits only' : ' '}
                                            />
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={6}>
                                            <Typography sx={{ fontStyle: 'italic' }} component="h2" variant="subtitle2">
                                                Affiliation:
                                            </Typography>
                                            <Select
                                                size='small'
                                                fullWidth
                                                value={affiliation}
                                                onChange={onAffiliationChanged}
                                                disabled={!editMode}
                                                displayEmpty
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

                                        {/* Company fields - Only show when user has Installer role */}
                                        {user.roles.includes('Installer') && (
                                            <>
                                                <Grid item xs={12}>
                                                    <Divider sx={{ my: 2 }} />
                                                    <Box sx={{ 
                                                        p: 2, 
                                                        backgroundColor: 'grey.50', 
                                                        borderRadius: 2,
                                                        border: '1px solid',
                                                        borderColor: 'primary.light'
                                                    }}>
                                                        <Typography sx={{ fontStyle: 'italic', mb: 2, fontWeight: 600, color: 'primary.main' }} component="h3" variant="subtitle1">
                                                            Company Information
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontStyle: 'italic' }} component="h2" variant="subtitle2">
                                                                    Company Name:
                                                                </Typography>
                                                                <TextField
                                                                    size='small'
                                                                    fullWidth
                                                                    id="companyName"
                                                                    value={companyName}
                                                                    onChange={onCompanyNameChanged}
                                                                    placeholder="Enter company name"
                                                                    disabled={!editMode}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography sx={{ fontStyle: 'italic' }} component="h2" variant="subtitle2">
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
                                                                    disabled={!editMode}
                                                                    error={editMode && !validCompanyContactNumber}
                                                                    helperText={editMode && !validCompanyContactNumber ? 'Format: +63 followed by digits only' : ' '}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>

                                    {editMode && (
                                        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => {
                                                    setEditMode(false)
                                                    // Reset form values
                                                    setFullName(user.fullName || '')
                                                    setAddress(user.address || '')
                                                    setContactNumber(user.contactNumber || '')
                                                    setAffiliation(user.affiliation || '')
                                                    setCompanyName(user.companyName || '')
                                                    setCompanyContactNumber(user.companyContactNumber || '')
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<SaveIcon />}
                                                disabled={!canSaveProfile}
                                                type="submit"
                                            >
                                                Save Changes
                                            </Button>
                                        </Box>
                                    )}
                                </form>

                                {/* Read-only display when not in edit mode */}
                                {!editMode && (
                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="textSecondary">
                                                Full Name
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                {fullName || 'Not provided'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="textSecondary">
                                                Contact Number
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                {contactNumber || 'Not provided'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="textSecondary">
                                                Address
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                {address || 'Not provided'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="textSecondary">
                                                Affiliation
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                {affiliation || 'Not affiliated'}
                                            </Typography>
                                        </Grid>
                                        {user.roles.includes('Installer') && (
                                            <>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Company Name
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        {companyName || 'Not provided'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Company Contact Number
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        {companyContactNumber || 'Not provided'}
                                                    </Typography>
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                )}

                                <Divider sx={{ my: 3 }} />

                                {/* Password Section */}
                                {canEdit && (
                                    <Box>
                                        <Typography variant="h6" gutterBottom>
                                            Security
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<LockIcon />}
                                            onClick={() => setShowPasswordDialog(true)}
                                        >
                                            Change Password
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Container>

            {/* Password Change Dialog */}
            <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Change Password</DialogTitle>
                <form onSubmit={onChangePasswordClicked}>
                    <DialogContent>
                        <DialogContentText>
                            Enter your current password and choose a new password.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Current Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="New Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            helperText="[4-12 characters including !@#$%]"
                            error={newPassword && !validNewPassword}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={confirmPassword && !passwordsMatch}
                            helperText={confirmPassword && !passwordsMatch ? "Passwords don't match" : ""}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setShowPasswordDialog(false)
                            setCurrentPassword('')
                            setNewPassword('')
                            setConfirmPassword('')
                        }}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            variant="contained"
                            disabled={!canSavePassword}
                        >
                            {isLoading ? <MoonLoader size={20} color="#fff" /> : 'Update Password'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )

    return content
}

export default UserProfileForm;
