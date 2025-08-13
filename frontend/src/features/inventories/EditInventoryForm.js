import React, { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Grid,
  Typography,
  Snackbar,
  Alert as MuiAlert,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  Tooltip,
  Backdrop,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Alert,
  Paper,
  Divider,
} from '@mui/material'
import {
  Upload as UploadFileIcon,
  MyLocation as MyLocationIcon,
  DeleteOutline as DeleteOutlineIcon,
  ArrowBack as ArrowBackIcon,
  LockOutlined as LockIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Help as HelpIcon,
} from '@mui/icons-material'
import { boxstyle } from '../../config/style'
import { reCats } from '../../config/reCats'
import { useDeleteImageInventoryMutation, useUpdateInventoryMutation, useDeleteInventoryMutation } from './inventoriesApiSlice'
import { useNavigate } from 'react-router-dom'
import { EditSolar } from '../categories/EditSolar'
import { EditWind } from '../categories/EditWind'
import { EditBiomass } from '../categories/EditBiomass'
import useAuth from '../../hooks/useAuth'
import { baseUrl } from '../../config/baseUrl'
import { Classification, mannerOfAcquisition } from '../../config/techAssesment'
import { Coordinates } from '../../components/Coordinates'
import { EditHydropower } from '../categories/EditHydropower'
import InventoryHelpModal from '../../components/InventoryHelpModal'

// Helper function to normalize MongoDB ObjectIDs for consistent comparison
const normalizeId = (id) => {
  if (!id) return null;
  // Extract the ID string from MongoDB ObjectID format if needed
  if (typeof id === 'object' && id.$oid) return id.$oid;
  if (typeof id === 'object' && id._id) return id._id;
  return String(id); // Convert to string for consistent comparison
};

const EditInventoryForm = ({ reItems, allUsers }) => {
  const { username, isManager, isAdmin, userId } = useAuth()
  const GEOCODE_URL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location='
  
  // Get location state to check if we're in read-only mode
  const location = useLocation()
  
  // Use ownership flags from location state if available
  const isPreviousOwnerFromState = location.state?.isPreviousOwner === true
  
  // Current date and time in UTC (hardcoded as requested)
  const [currentDateTime, setCurrentDateTime] = useState('2025-08-07 05:33:22');
  
  // If it's a previous owner, we'll show a read-only notice banner
  const isPreviousOwner = useMemo(() => {
    // First check the flag from navigation state
    if (isPreviousOwnerFromState === true) {
      return true;
    }
    
    // Check in previousUsers array if it exists
    if (reItems.previousUsers && Array.isArray(reItems.previousUsers)) {
      // Normalize the current user ID for comparison
      const normalizedUserId = normalizeId(userId);
      
      // Check for the user ID in previousUsers array with normalized comparison
      const isInPreviousUsers = reItems.previousUsers.some(prevUser => {
        const prevUserId = normalizeId(prevUser);
        return prevUserId === normalizedUserId;
      });
      
      if (isInPreviousUsers) return true;
      
      // For populated objects with username property
      const hasUserObject = reItems.previousUsers.some(user => {
        if (typeof user === 'object' && user?.username) {
          return user.username === username;
        }
        return false;
      });
      
      if (hasUserObject) return true;
    }
    
    // Check direct previousUser field if it exists
    if (reItems.previousUser) {
      const prevUserId = normalizeId(reItems.previousUser);
      const normalizedUserId = normalizeId(userId);
      if (prevUserId === normalizedUserId) {
        return true;
      }
      
      if (typeof reItems.previousUser === 'object' && reItems.previousUser.username) {
        if (reItems.previousUser.username === username) {
          return true;
        }
      }
    }
    
    // Direct check in previousUsernames array if available
    if (reItems.previousUsernames && Array.isArray(reItems.previousUsernames)) {
      if (reItems.previousUsernames.includes(username)) {
        return true;
      }
    }
    
    // Add debugging with normalized IDs
    console.log('Previous owner check details:', {
      isPreviousOwnerFromState,
      username,
      userId,
      normalizedUserId: normalizeId(userId),
      previousUsers: reItems.previousUsers?.map(u => normalizeId(u)),
      previousUser: normalizeId(reItems.previousUser),
      previousUsernames: reItems.previousUsernames
    });
    
    return false;
  }, [reItems, username, userId, isPreviousOwnerFromState]);
  
  // IMPORTANT: Previous owners should have edit access, not read-only access
  const isReadOnly = location.state?.readOnly === true && !isPreviousOwner;
  
  const [updateInventory, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateInventoryMutation()

  const [deleteImageInventory, {
    isLoading: isImageLoading,
    isSuccess: isImageDelSuccess,
    isError: isImageError,
    error: imageError,
  }] = useDeleteImageInventoryMutation()

  const [deleteInventory, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delerror
  }] = useDeleteInventoryMutation()

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)

  const navigate = useNavigate()
  const [errContent, setErrContent] = useState(null)
  const [ownerName, setOwnerName] = useState(reItems?.properties.ownerName)
  const [country, setCountry] = useState(reItems?.properties?.address?.country)
  const [region, setRegion] = useState(reItems?.properties?.address?.region)
  const [province, setProvince] = useState(reItems?.properties?.address?.province)
  const [city, setCity] = useState(reItems?.properties?.address?.city)
  const [brgy, setBrgy] = useState(reItems?.properties?.address?.brgy)
  
  // Fixed: Use coordinates.type from database (GeoJSON type)
  const [type, setType] = useState(reItems?.coordinates?.type || 'Point')
  
  const [coordinates, setCoordinates] = useState(
    reItems?.coordinates?.coordinates
      ? reItems.coordinates.coordinates
      : reItems?.coordinates
  )
  // Ensure proper string conversion for input
  const [lat, setLat] = useState(
    reItems?.coordinates?.coordinates
      ? String(reItems.coordinates.coordinates[1])
      : (reItems?.coordinates && reItems.coordinates[1] !== undefined
          ? String(reItems.coordinates[1])
          : '')
  )
  const [lng, setLng] = useState(
    reItems?.coordinates?.coordinates
      ? String(reItems.coordinates.coordinates[0])
      : (reItems?.coordinates && reItems.coordinates[0] !== undefined
          ? String(reItems.coordinates[0])
          : '')
  )
  const [reClass, setReClass] = useState(reItems?.properties?.reClass)
  const [reCat, setReCat] = useState(reItems?.properties?.reCat)
  const [acquisition, setAcquisition] = useState(reItems?.properties?.acquisition)
  const [yearEst, setYearEst] = useState(reItems?.properties?.yearEst)
  
  // FIT-related states
  const [isFitEligible, setIsFitEligible] = useState(
    reItems?.properties?.fit?.eligible === true || 
    reItems?.properties?.fit?.eligible === "true"
  )
  const [fitPhase, setFitPhase] = useState(
    reItems?.properties?.fit?.phase || "Non-FIT"
  )
  const [fitRate, setFitRate] = useState(
    reItems?.properties?.fit?.rate || ""
  )
  const [fitRef, setFitRef] = useState(
    reItems?.properties?.fit?.fitRef || ""
  )
  const [fitStatus, setFitStatus] = useState(
    reItems?.properties?.fit?.fitStatus || ""
  )

  const [myUploads, setmyUploads] = useState('')
  const [filesCount, setFilesCount] = useState(null)
  // FIXED: Renamed userId to assignedUserId to avoid conflict with userId from useAuth
  const [assignedUserId, setAssignedUserId] = useState(() => normalizeId(reItems?.user))

  // Build installer and affiliation groupings similar to MapFilter
  const installersGroup = useMemo(() => {
    if (!allUsers || allUsers.length === 0) return [];
    return allUsers
      .filter(user => Array.isArray(user.roles) && user.roles.includes('Installer'))
      .map(user => ({
        id: user.id,
        username: user.username,
        fullName: user.fullName || user.username,
        companyName: user.companyName || '',
        displayName: user.companyName || user.fullName || user.username,
        displaySecondary: user.companyName ? `${user.fullName || user.username} (${user.username})` : user.username
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [allUsers]);

  const usersByAffiliation = useMemo(() => {
    if (!allUsers || allUsers.length === 0) return {};
    const grouped = {};
    allUsers.forEach(user => {
      const affiliation = user.affiliation || 'Not Affiliated';
      if (!grouped[affiliation]) grouped[affiliation] = [];
      grouped[affiliation].push({
        id: user.id,
        username: user.username,
        fullName: user.fullName || user.username,
        displayName: user.fullName || user.username,
        displaySecondary: user.username
      });
    });
    Object.keys(grouped).forEach(key => grouped[key].sort((a,b) => a.displayName.localeCompare(b.displayName)));
    return grouped;
  }, [allUsers]);

  const availableAffiliations = useMemo(() => Object.keys(usersByAffiliation).sort(), [usersByAffiliation]);
  const [solar, setEditSolar] = useState([])
  const [wind, setEditWind] = useState([])
  const [biomass, setEditBiomass] = useState([])
  const [hydropower, setEditHydropower] = useState([])

  const [delAlert, setDelAlert] = useState({ bool: false, value: null })
  const [loading, setLoading] = useState(false)

  // --- Net Metered and Own Use as Yes/No strings for consistency ---
  const [isNetMetered, setIsNetMetered] = useState(
    reItems?.properties?.isNetMetered === "Yes" ? "Yes" : "No"
  )
  const [isOwnUse, setIsOwnUse] = useState(
    reItems?.properties?.ownUse === "Yes" ? "Yes" : "No"
  )

  // --- Duplicate detection states ---
  const [potentialDuplicates, setPotentialDuplicates] = useState([])
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(false)
  const [lastFormData, setLastFormData] = useState(null)

  // HELP MODAL STATE
  const [openHelpModal, setOpenHelpModal] = useState(false)

  // Sync lat/lng/coordinates when reItems changes
  useEffect(() => {
    // Ensure "Assigned to" reflects current uploader on load/when reItems changes
    const normalized = normalizeId(reItems?.user)
    if (normalized && normalized !== assignedUserId) {
      setAssignedUserId(normalized)
    }

    let coords = [];
    if (reItems?.coordinates?.coordinates) {
      coords = reItems.coordinates.coordinates;
    } else if (reItems?.coordinates) {
      coords = reItems.coordinates;
    }
    if (
      coords &&
      coords[0] !== undefined &&
      coords[1] !== undefined
    ) {
      setLng(String(coords[0]));
      setLat(String(coords[1]));
      setCoordinates([coords[0], coords[1]]);
    }
  }, [reItems]);

  useEffect(() => {
    if (reItems?.properties) {
      setIsNetMetered(reItems.properties.isNetMetered === "Yes" ? "Yes" : "No")
      setIsOwnUse(reItems.properties.ownUse === "Yes" ? "Yes" : "No")
    }
  }, [reItems])

  // Keep FIT phase and eligibility in sync
  useEffect(() => {
    if (isFitEligible === false) {
      setFitPhase("Non-FIT");
    } else if (isFitEligible === true && fitPhase === "Non-FIT") {
      setFitPhase("FIT1"); // Default to FIT1 when becoming eligible
    }
  }, [isFitEligible]);

  // Auto-set Net Metered and Own Use to "No" when Commercial is selected
  useEffect(() => {
    if (reClass === "Commercial") {
      setIsNetMetered("No");
      setIsOwnUse("No");
    }
  }, [reClass]);

  const openDelAlert = (index) => {
    setDelAlert({ bool: true, value: index })
  }

  const closeDelAlert = () => {
    setDelAlert({ bool: false, value: null })
  }

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  })

  useEffect(() => {
    if (isSuccess) {
      setOwnerName("")
      setCountry("")
      setRegion("")
      setProvince("")
      setCity("")
      setBrgy("")
      setLng("")
      setLat("")
      setCoordinates([])
      setType("Point") // Reset to default GeoJSON type
      setReCat("")
      setAssignedUserId("") // FIXED: Updated variable name
      navigate(0)
    }
  }, [isSuccess, navigate])

  useEffect(() => {
    if (isLoading || isImageLoading) {
      setLoading(true)
    }
  }, [isLoading, isImageLoading])

  useEffect(() => {
    if (isDelSuccess) {
      setOwnerName("")
      setCountry("")
      setRegion("")
      setProvince("")
      setCity("")
      setBrgy("")
      setLng("")
      setLat("")
      setCoordinates([])
      setType("Point")
      setReCat("")
      setAssignedUserId("") // FIXED: Updated variable name
      navigate(-1)
    }
  }, [isDelSuccess, navigate])

  useEffect(() => {
    if (isImageDelSuccess) {
      navigate(0)
    }
  }, [isImageDelSuccess, navigate])

  useEffect(() => {
    if (delerror || error) {
      setErrContent((error?.data?.message || delerror?.data?.message))
      setLoading(false)
    }
  }, [delerror, error])

  const onOwnerNameChanged = (e) => setOwnerName(e.target.value)
  const onCountryChanged = (e) => setCountry(e.target.value)
  const onRegionChanged = (e) => setRegion(e.target.value)
  const onProvinceChanged = (e) => setProvince(e.target.value)
  const onCityChanged = (e) => setCity(e.target.value)
  const onBrgyChanged = (e) => setBrgy(e.target.value)
  const onmyUploadsChanged = (e) => {
    setmyUploads(e.target.files)
    setFilesCount(e.target.files.length)
  }
  const onLatChanged = (e) => {
    setLat(e.target.value)
    setCoordinates([parseFloat(lng), parseFloat(e.target.value)])
  }
  const onLngChanged = (e) => {
    setLng(e.target.value)
    setCoordinates([parseFloat(e.target.value), parseFloat(lat)])
  }
  // FIXED: Updated function to use new variable name
  const onUserIdChanged = (e) => setAssignedUserId(e.target.value)
  const onReClassChanged = (e) => {
    setReClass(e.target.value);
    
    if (e.target.value === "Commercial") {
      // Auto-select "No" for Net Metering and Own Use when Commercial is selected
      setIsNetMetered("No");
      setIsOwnUse("No");
    } else {
      // Reset FIT fields if changing away from Commercial
      setIsFitEligible(false);
      setFitPhase("Non-FIT");
      setFitRate("");
      setFitRef("");
      setFitStatus("");
    }
  }
  const onReCatChanged = (e) => setReCat(e.target.value)
  const onAquisitionChanged = (e) => setAcquisition(e.target.value)
  const onYearEstChanged = (e) => setYearEst(e.target.value)

  const reverseGeoCoding = async (coordinates) => {
    if (isReadOnly) return; // Don't allow in read-only mode
    
    const data = await (
      await fetch(GEOCODE_URL + `${coordinates.lng},${coordinates.lat}`)
    ).json()
    if (data.address !== undefined) {
      setBrgy(data.address.Neighborhood)
      setCity(data.address.City)
      setProvince(data.address.Subregion)
      setRegion(data.address.Region)
      setCountry(data.address.CntryName)
      setLat(coordinates?.lat)
      setLng(coordinates?.lng)
      setCoordinates([coordinates?.lng, coordinates?.lat])
    }
  }

  // FIXED: Updated to use new assignedUserId variable
  const canSave = [ownerName, assignedUserId].every(Boolean) && !isLoading && !isReadOnly

  // -- EDIT INVENTORY SUBMIT HANDLER --
  const onSaveInventoryClicked = async (e, isForce = false) => {
    e.preventDefault();
    
    // Don't allow saving in read-only mode
    if (isReadOnly) return;

    // Build properties object for correct backend parsing!
    const propertiesObj = {
      ownerName,
      reCat,
      reClass,
      yearEst,
      acquisition,
      isNetMetered,
      ownUse: isOwnUse,
      address: {
        country,
        region,
        province,
        city,
        brgy,
      }
    };

    // Add FIT information when Commercial
    if (reClass === "Commercial") {
      propertiesObj.fit = {
        eligible: isFitEligible,
        phase: fitPhase,
      };

      if (fitRate) propertiesObj.fit.rate = fitRate;
      if (fitRef) propertiesObj.fit.fitRef = fitRef;
      if (fitStatus) propertiesObj.fit.fitStatus = fitStatus;
    }

    // Build assessment object (customize per your logic)
    let assessmentObj = {};
    if (reCat === "Solar Energy" && solar) {
      Object.assign(assessmentObj, solar);
    }
    if (reCat === "Wind Energy" && wind) {
      Object.assign(assessmentObj, wind);
    }
    if (reCat === "Biomass" && biomass) {
      Object.assign(assessmentObj, biomass);
    }
    if (reCat === "Hydropower" && hydropower) {
      Object.assign(assessmentObj, hydropower);
    }

    // ---- CLEANUP: Remove empty or invalid solarStreetLights ----
    if (assessmentObj.solarStreetLights && Array.isArray(assessmentObj.solarStreetLights)) {
      assessmentObj.solarStreetLights = assessmentObj.solarStreetLights.filter(
        s =>
          (s.capacity !== "" && !isNaN(Number(s.capacity))) ||
          (s.pcs !== "" && !isNaN(Number(s.pcs)))
      );
      // If after filtering, array is empty, remove the key entirely
      if (assessmentObj.solarStreetLights.length === 0) {
        delete assessmentObj.solarStreetLights;
      }
    }

    // ---- CLEANUP: Convert capacity and annualEnergyProduction to numbers if possible ----
    if (assessmentObj.capacity !== undefined && assessmentObj.capacity !== '') {
      assessmentObj.capacity = Number(assessmentObj.capacity);
    }
    if (
      assessmentObj.annualEnergyProduction !== undefined &&
      assessmentObj.annualEnergyProduction !== ''
    ) {
      assessmentObj.annualEnergyProduction = Number(assessmentObj.annualEnergyProduction);
    }

    // Build coordinates object in GeoJSON format
    const coordinatesObj = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)]
    };

    const data = new FormData();
    data.append('id', reItems.id)
    // FIXED: Updated to use assignedUserId
    data.append('user', assignedUserId)
    data.append('type', 'Point');
    // Send coordinates as GeoJSON object
    data.append('coordinates', JSON.stringify(coordinatesObj));
    data.append('properties', JSON.stringify(propertiesObj));
    data.append('assessment', JSON.stringify(assessmentObj));

    // Add images if any
    if (myUploads && myUploads.length > 0) {
      for (const file of myUploads) {
        data.append('myUploads', file)
      }
    }
    if (isForce) data.append('forceUpdate', true)

    setLastFormData(data) // Save for retry

    if (canSave) {
      try {
        await updateInventory(data).unwrap();
        setForceUpdate(false)
        setShowDuplicateModal(false)
      } catch (err) {
        if (err?.status === 409 && err?.data?.duplicates) {
          setPotentialDuplicates(err.data.duplicates)
          setShowDuplicateModal(true)
        } else {
          setErrContent(err?.data?.message || "Unknown error");
        }
      }
    }
  }

  // When user chooses to "Proceed Anyway"
  const handleProceedAnyway = async () => {
    if (isReadOnly) return; // Don't allow in read-only mode
    
    setShowDuplicateModal(false)
    setForceUpdate(true)
    if (lastFormData) {
      lastFormData.append("forceUpdate", true)
      try {
        await updateInventory(lastFormData).unwrap()
        setForceUpdate(false)
      } catch (err) {
        setErrContent(err?.data?.message || "Unknown error")
      }
    }
  }

  const handleCancelDuplicate = () => {
    setShowDuplicateModal(false)
    setForceUpdate(false)
    setPotentialDuplicates([])
  }

  const onDeleteInventoryClicked = async () => {
    if (isReadOnly) return; // Don't allow in read-only mode
    await deleteInventory({ id: [reItems.id] })
  }

  const deleteImage = async (index) => {
    if (isReadOnly) return; // Don't allow in read-only mode
    await deleteImageInventory({ id: reItems.id, images: index })
  }

  // Add logging for debugging
  useEffect(() => {
    console.log('Access control debug:');
    console.log('Username:', username);
    console.log('Is Previous Owner:', isPreviousOwner);
    console.log('Is Read Only:', isReadOnly);
    console.log('Previous Users array:', reItems.previousUsers);
    console.log('Previous Usernames array:', reItems.previousUsernames);
  }, [username, isPreviousOwner, isReadOnly, reItems]);

  const content = (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container sx={{ maxWidth: { lg: 'md' } }}>
        <form onSubmit={e => e.preventDefault()}>
          <Box
            sx={{
              minHeight: '100vh',
              maxWidth: '100%',
              '& .MuiTextField-root': { my: 1 },
            }}
          >

            

            
            <Box sx={boxstyle}>
              {errContent !== null ?
                <Snackbar open={true} autoHideDuration={6000} onClose={() => setErrContent(null)} >
                  <Alert onClose={() => setErrContent(null)} severity='warning' sx={{ width: '100%' }}>
                    {errContent}
                  </Alert>
                </Snackbar>
                : null}

              <Grid container>
                <Grid item xs>
                  <Typography component='h1' variant='h5' sx={{ color: 'white' }}>
                    {isReadOnly ? "View Inventory" : "Edit Inventory"}
                  </Typography>
                </Grid>
                <Grid item>
                  <Tooltip title="Help & Guide" placement="top">
                    <IconButton 
                      onClick={() => setOpenHelpModal(true)}
                      sx={{ mr: 1 }}
                      color="primary"
                    >
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <TextField
                fullWidth
                size="small"
                id="reCat"
                select
                disabled
                name="properties.reCat"
                label="Select RE Category"
                value={reCat || ""}
                onChange={onReCatChanged}
              >
                {Object.values(reCats).map((reCat, index) => (
                  <MenuItem key={index} value={reCat.contName}>
                    {reCat.contName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                size="small"
                id="reclass"
                select
                label="Select RE Classification:"
                value={reClass || ""}
                onChange={onReClassChanged}
                disabled={isReadOnly}
              >
                {Classification.map((type, index) => (
                  <MenuItem key={index} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                size="small"
                id="acquisition"
                select
                label="Manner of Acquisition:"
                value={acquisition || ""}
                onChange={onAquisitionChanged}
                disabled={isReadOnly}
              >
                {mannerOfAcquisition.map((type, index) => (
                  <MenuItem key={index} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                size="small"
                label="Owner/ Company/ Cooperative/ Association Name"
                id="ownerName"
                name="properties.ownerName"
                type="text"
                value={ownerName}
                onChange={onOwnerNameChanged}
                disabled={isReadOnly}
              />
              <TextField
                fullWidth
                size="small"
                label="Year Established"
                id="yearEst"
                name="properties.yearEst"
                type="number"
                value={yearEst}
                onChange={onYearEstChanged}
                disabled={isReadOnly}
              />
              {isManager || isAdmin ?
                <TextField
                  fullWidth
                  id='user'
                  select
                  label='Assigned to:'
                  value={assignedUserId || ''}
                  onChange={onUserIdChanged}
                  disabled={isReadOnly}
                >
                  {installersGroup.length > 0 && (
                    <>
                      <MenuItem disabled key='installers-header' sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold', borderBottom: '1px solid #2196f3', color: '#1976d2' }}>
                        🏗️ Installers ({installersGroup.length} companies)
                      </MenuItem>
                      {installersGroup.map(u => (
                        <MenuItem key={`installer-${u.id}`} value={u.id} sx={{ pl: 3 }}>
                          <div>
                            <Typography variant="body2">{u.displayName}</Typography>
                            <Typography variant="caption" color="text.secondary">{u.displaySecondary}</Typography>
                          </div>
                        </MenuItem>
                      ))}
                      <Divider sx={{ my: 1 }} />
                    </>
                  )}
                  {availableAffiliations.map(aff => (
                    <React.Fragment key={`aff-${aff}`}>
                      <MenuItem disabled sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', borderBottom: '1px solid #e0e0e0', color: '#1976d2' }}>
                        {aff} ({usersByAffiliation[aff]?.length || 0} users)
                      </MenuItem>
                      {(usersByAffiliation[aff] || []).map(u => (
                        <MenuItem key={`aff-${aff}-${u.id}`} value={u.id} sx={{ pl: 3 }}>
                          <div>
                            <Typography variant="body2">{u.displayName}</Typography>
                            <Typography variant="caption" color="text.secondary">{u.displaySecondary}</Typography>
                          </div>
                        </MenuItem>
                      ))}
                    </React.Fragment>
                  ))}
                </TextField> : ''
              }

              {/* FIT Information Section - Only when Commercial */}
              {reClass === "Commercial" && (
                <Box sx={{ mt: 2, pb: 2, borderTop: '1px solid #eee', pt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    FIT Information
                  </Typography>
                  
                  {/* FIT Eligible */}
                  <Typography sx={{ fontWeight: 700, mb: 1 }} component="label">
                    Is FIT eligible?
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 2 }}>
                   <FormControlLabel
                      control={
                        <Checkbox
                          checked={isFitEligible === true}
                          onChange={() => {
                            if (isReadOnly) return;
                            setIsFitEligible(true);
                            // Auto-select FIT1 when eligible (since Non-FIT is no longer valid)
                            if (fitPhase === "Non-FIT") {
                              setFitPhase("FIT1");
                            }
                          }}
                          color="primary"
                          disabled={isReadOnly}
                        />
                      }
                      label="Yes"
                      sx={{ mr: 2, ml: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isFitEligible === false}
                          onChange={() => {
                            if (isReadOnly) return;
                            setIsFitEligible(false);
                            // Auto-select Non-FIT when not eligible
                            setFitPhase("Non-FIT");
                          }}
                          color="primary"
                          disabled={isReadOnly}
                        />
                      }
                      label="No"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  
                  {/* FIT Phase - Disabled when not eligible */}
                  <TextField
                      fullWidth
                      size="small"
                      id="fitPhase"
                      select
                      label="FIT Phase"
                      value={fitPhase}
                      onChange={(e) => setFitPhase(e.target.value)}
                      disabled={isFitEligible === false || isReadOnly}
                      sx={{ mb: 2 }}
                    >
                      <MenuItem value="FIT1">FIT1</MenuItem>
                      <MenuItem value="FIT2">FIT2</MenuItem>
                      {/* Only show Non-FIT option when not eligible */}
                      {!isFitEligible && <MenuItem value="Non-FIT">Non-FIT</MenuItem>}
                    </TextField>
                  
                  {/* Optional FIT Rate */}
                  <TextField
                    fullWidth
                    size="small"
                    label="FIT Rate (PHP/kWh, optional)"
                    id="fitRate"
                    name="fitRate"
                    type="number"
                    value={fitRate}
                    onChange={(e) => setFitRate(e.target.value)}
                    disabled={isFitEligible === false || isReadOnly}
                    sx={{ mb: 2 }}
                  />
                  
                  {/* Optional FIT Reference */}
                  <TextField
                    fullWidth
                    size="small"
                    label="FIT Reference Number (optional)"
                    id="fitRef"
                    name="fitRef"
                    value={fitRef}
                    onChange={(e) => setFitRef(e.target.value)}
                    disabled={isFitEligible === false || isReadOnly}
                    sx={{ mb: 2 }}
                  />
                  
                  {/* Optional FIT Status */}
                  <TextField
                    fullWidth
                    size="small"
                    label="FIT Status (e.g. active, expired - optional)"
                    id="fitStatus"
                    name="fitStatus"
                    value={fitStatus}
                    onChange={(e) => setFitStatus(e.target.value)}
                    disabled={isFitEligible === false || isReadOnly}
                    sx={{ mb: 1 }}
                  />
                </Box>
              )}

              {/* Net Metered and Own Use as radio-like checkboxes */}
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 700, mb: 1 }} component="label">
                  Is net-metered?
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isNetMetered === "Yes"}
                        onChange={() => {
                          if (isReadOnly) return;
                          setIsNetMetered("Yes");
                        }}
                        color="primary"
                        disabled={reClass === "Commercial" || isReadOnly} // Disable when Commercial or read-only
                      />
                    }
                    label="Yes"
                    sx={{ mr: 2, ml: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isNetMetered === "No"}
                        onChange={() => {
                          if (isReadOnly) return;
                          setIsNetMetered("No");
                        }}
                        color="primary"
                        disabled={reClass === "Commercial" || isReadOnly} // Disable when Commercial or read-only
                      />
                    }
                    label="No"
                    sx={{ ml: 2 }}
                  />
                </Box>
                {reClass === "Commercial" && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Commercial RE systems are automatically set as not net-metered.
                  </Alert>
                )}
                <Typography sx={{ fontWeight: 700, mb: 1 }} component="label">
                  Own use?
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isOwnUse === "Yes"}
                        onChange={() => {
                          if (isReadOnly) return;
                          setIsOwnUse("Yes");
                        }}
                        color="primary"
                        disabled={reClass === "Commercial" || isReadOnly} // Disable when Commercial or read-only
                      />
                    }
                    label="Yes"
                    sx={{ mr: 2, ml: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isOwnUse === "No"}
                        onChange={() => {
                          if (isReadOnly) return;
                          setIsOwnUse("No");
                        }}
                        color="primary"
                        disabled={reClass === "Commercial" || isReadOnly} // Disable when Commercial or read-only
                      />
                    }
                    label="No"
                    sx={{ ml: 2 }}
                  />
                </Box>
                {reClass === "Commercial" && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Commercial RE systems are automatically set as not for own use.
                  </Alert>
                )}
              </Box>
            </Box>

            {reItems.images.length == 0 ? '' : <ImageList sx={{ height: 250 }} cols={3} rowHeight={164}>
              {reItems.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={`${baseUrl + image}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${baseUrl + image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    loading='lazy'
                    alt={reItems.properties.reCat}
                  />
                  <ImageListItemBar
                    sx={{
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                    }}
                    position='top'
                    actionIcon={
                      !isReadOnly && (
                        <IconButton onClick={() => openDelAlert(index)}>
                          <DeleteOutlineIcon sx={{ color: 'white.main' }} />
                        </IconButton>
                      )
                    }
                    actionPosition='left'
                  />
                </ImageListItem>
              ))}
            </ImageList>}
            <Dialog
              open={delAlert.bool}
              onClose={closeDelAlert}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Delete warning"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this {delAlert.value === undefined ? "inventory" : "image"}?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDelAlert}>Cancel</Button>
                <Button variant="contained" color="error" onClick={delAlert.value === undefined ? onDeleteInventoryClicked : () => deleteImage(delAlert.value)}>Yes</Button>
              </DialogActions>
            </Dialog>
            <Box sx={boxstyle}>
              <Typography sx={{ fontStyle: 'italic' }} component='h1' variant='subtitle2'>
                Coordinates
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                }}
              >
                <TextField
                  fullWidth
                  label='Longitude'
                  id='lng'
                  name='lng'
                  type='tel'
                  value={lng}
                  onChange={onLngChanged}
                  disabled={isReadOnly}
                />
                <TextField
                  fullWidth
                  label='Latitude'
                  id='lat'
                  name='lat'
                  type='tel'
                  value={lat}
                  onChange={onLatChanged}
                  disabled={isReadOnly}
                />
                <Button
                  component='label'
                  variant='outlined'
                  startIcon={<MyLocationIcon />}
                  sx={{ my: 1 }}
                  size='small'
                  onClick={handleOpenModal}
                  disabled={isReadOnly}
                >
                  Select on Map
                </Button>
              </Box>
              <Coordinates openModal={openModal} setOpenModal={setOpenModal} reverseGeoCoding={reverseGeoCoding} setLat={setLat} setLng={setLng} coordinates={coordinates} />
            </Box>
            <Box sx={boxstyle}>
              <Typography sx={{ fontStyle: 'italic' }} component='h1' variant='subtitle2'>
                Address
              </Typography>
              <TextField
                fullWidth
                label='Country'
                id='country'
                name='properties.address.country'
                type='text'
                value={country}
                onChange={onCountryChanged}
                disabled={isReadOnly}
              />
              <TextField
                fullWidth
                label='Region'
                id='region'
                name='properties.address.region'
                type='text'
                value={region}
                onChange={onRegionChanged}
                disabled={isReadOnly}
              />
              <TextField
                fullWidth
                label='Province'
                id='province'
                name='properties.address.province'
                type='text'
                value={province}
                onChange={onProvinceChanged}
                disabled={isReadOnly}
              />
              <TextField
                fullWidth
                label='City/Municipality'
                id='city'
                name='properties.address.city'
                type='text'
                value={city}
                onChange={onCityChanged}
                disabled={isReadOnly}
              />
              <TextField
                fullWidth
                label='Barangay'
                id='lng'
                name='properties.address.brgy'
                type='text'
                value={brgy}
                onChange={onBrgyChanged}
                disabled={isReadOnly}
              />
            </Box>
            {reCat === null ? null :
              reCat === 'Solar Energy' ? <EditSolar setEditSolar={setEditSolar} reItems={reItems} allUsers={allUsers} reClass={reClass} readOnly={isReadOnly} /> :
                reCat === 'Wind Energy' ? <EditWind setEditWind={setEditWind} reItems={reItems} allUsers={allUsers} reClass={reClass} readOnly={isReadOnly} /> :
                  reCat === 'Biomass' ? <EditBiomass setEditBiomass={setEditBiomass} reItems={reItems} allUsers={allUsers} readOnly={isReadOnly} /> :
                    reCat === 'Hydropower' ? <EditHydropower setEditHydropower={setEditHydropower} reItems={reItems} allUsers={allUsers} readOnly={isReadOnly} /> : ''}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row-reverse',
              }}
            >
              <Button
                variant='contained'
                color="success"
                sx={{ my: 1 }}
                disabled={!canSave}
                onClick={(e) => onSaveInventoryClicked(e, false)}
              >
                Update
              </Button>
              <Button
                variant='contained'
                sx={{ m: 1, backgroundColor: 'custom.error' }}
                onClick={() => openDelAlert()}
                disabled={isReadOnly}
              >
                Delete
              </Button>
              {reItems.images.length === 3 ? null : <Tooltip title="3 maximum images">
                <Button
                  component='label'
                  variant='contained'
                  startIcon={<UploadFileIcon />}
                  sx={{ my: 1, backgroundColor: 'primary.main' }}
                  disabled={isReadOnly}
                >
                  Add Images {filesCount >= 4 ? "| no. of file exceeded" : filesCount ? "| " + filesCount + " selected" : null}
                  <input
                    type='file'
                    id='myUploads'
                    name='myUploads'
                    accept='image/*'
                    multiple
                    hidden
                    onChange={onmyUploadsChanged}
                    disabled={isReadOnly}
                  />
                </Button>
              </Tooltip>}
            </Box>
          </Box>
          <input
            className={`form__input}`}
            id='coordinates'
            name='coordinates'
            value={coordinates}
            type='hidden'
          />

          {/* Duplicate detection modal */}
          <Dialog open={showDuplicateModal} onClose={handleCancelDuplicate}>
            <DialogTitle>Potential Duplicate Detected</DialogTitle>
            <DialogContent>
              <MuiAlert severity="warning" sx={{ mb: 2 }}>
                There is/are technical assessment(s) within 100 meters of this location.
                <br />
                Is this the same RE System as any of the following?
              </MuiAlert>
              <List>
                {potentialDuplicates.map((dup, idx) => (
                  <ListItem key={dup._id || idx}>
                    <ListItemText
                      primary={dup.properties?.ownerName || "Unknown"}
                      secondary={
                        <>
                          <Typography variant="body2">
                            <b>RE Cat:</b> {dup.properties?.reCat}
                          </Typography>
                          <Typography variant="body2">
                            <b>RE Class:</b> {dup.properties?.reClass}
                          </Typography>
                          <Typography variant="body2">
                            <b>Year Est.:</b> {dup.properties?.yearEst}
                          </Typography>
                          <Typography variant="body2">
                            <b>Address:</b> {dup.properties?.address?.city}, {dup.properties?.address?.province}, {dup.properties?.address?.region}
                          </Typography>
                          <Typography variant="body2">
                            <b>Coordinates:</b> {dup.coordinates?.coordinates?.[1]}, {dup.coordinates?.coordinates?.[0]}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <MuiAlert severity="info" sx={{ mt: 2 }}>
                If you wish to proceed with updating this inventory at this location, click "Proceed Anyway".
              </MuiAlert>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleProceedAnyway} color="success" variant="contained">
                Proceed Anyway
              </Button>
              <Button onClick={handleCancelDuplicate} color="secondary" variant="outlined">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </Container>

      {/* Help Modal */}
      <InventoryHelpModal
        open={openHelpModal}
        onClose={() => setOpenHelpModal(false)}
        formType="edit"
      />
    </>
  )
  return content
}

export default EditInventoryForm