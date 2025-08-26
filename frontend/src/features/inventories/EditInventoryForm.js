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
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
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
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
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
import { getAllRegionNames, getProvincesForRegion } from '../../config/regions'

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
  const GEOCODE_URL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&outFields=*&returnIntersection=false&location='
  
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
  const [successContent, setSuccessContent] = useState(null)
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
  const [assignedUserId, setAssignedUserId] = useState("")

  // Simple user selection - same as NewInventoryForm
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
  const [isDer, setIsDer] = useState(
    reItems?.properties?.isDer === "Yes" ? "Yes" : "No"
  )
  const [establishmentType, setEstablishmentType] = useState(
    reItems?.properties?.establishmentType || ""
  )

  // --- Duplicate detection states ---
  const [potentialDuplicates, setPotentialDuplicates] = useState([])
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(false)
  const [lastFormData, setLastFormData] = useState(null)
  const [originalCoordinates, setOriginalCoordinates] = useState(null)

  // HELP MODAL STATE
  const [openHelpModal, setOpenHelpModal] = useState(false)

  // Helper function to check if coordinates have changed
  const haveCoordinatesChanged = () => {
    if (!originalCoordinates) return false;
    
    // Ensure we have valid numbers
    const currentLng = parseFloat(lng);
    const currentLat = parseFloat(lat);
    
    if (isNaN(currentLng) || isNaN(currentLat)) {
      return false;
    }
    
    const currentCoords = [currentLng, currentLat];
    return (
      Math.abs(currentCoords[0] - originalCoordinates[0]) > 0.000001 || // ~1 meter precision
      Math.abs(currentCoords[1] - originalCoordinates[1]) > 0.000001
    );
  };



  // Handle assignedUserId initialization and updates
  useEffect(() => {
    // First, try to get the user from reItems if available
    if (reItems?.user && !assignedUserId) {
      const normalized = normalizeId(reItems.user);
      setAssignedUserId(normalized);
    }
    
    // For non-admin/manager, default to current user if not already set
    if (!isManager && !isAdmin && !assignedUserId) {
      setAssignedUserId(userId);
    }
  }, [reItems?.user, isManager, isAdmin, assignedUserId, userId]);



  // Sync lat/lng/coordinates when reItems changes
  useEffect(() => {
    // Only initialize once on mount, not on every reItems change
    // This prevents overriding user edits when the cache updates
    if (reItems?.coordinates && !coordinates.length) {
    let coords = [];
      if (reItems.coordinates.coordinates) {
      coords = reItems.coordinates.coordinates;
      } else if (reItems.coordinates) {
      coords = reItems.coordinates;
    }
      
      console.log('Initializing coordinates from reItems:', {
        reItemsCoords: reItems?.coordinates,
        extractedCoords: coords,
        hasValidCoords: coords && coords[0] !== undefined && coords[1] !== undefined
      });
      
    if (
      coords &&
      coords[0] !== undefined &&
      coords[1] !== undefined
    ) {
      setLng(String(coords[0]));
      setLat(String(coords[1]));
      setCoordinates([coords[0], coords[1]]);
      
      // Store original coordinates for duplicate detection comparison
      if (!originalCoordinates) {
        setOriginalCoordinates([coords[0], coords[1]]);
          console.log('Set original coordinates:', [coords[0], coords[1]]);
      }
    }
    }
  }, [reItems, coordinates.length, originalCoordinates]);

  // Auto-reset original coordinates when user manually changes back to original values
  useEffect(() => {
    if (originalCoordinates) {
      // Only reset if coordinates are exactly the same (not just close)
      const currentLng = parseFloat(lng);
      const currentLat = parseFloat(lat);
      
      if (!isNaN(currentLng) && !isNaN(currentLat)) {
        const exactMatch = (
          Math.abs(currentLng - originalCoordinates[0]) < 0.0000001 && // Very precise match
          Math.abs(currentLat - originalCoordinates[1]) < 0.0000001
        );
        
        if (exactMatch) {
          setOriginalCoordinates([currentLng, currentLat]);
        }
      }
    }
  }, [lng, lat, originalCoordinates]);

  // Debug: Monitor coordinate state changes
  useEffect(() => {
    console.log('Coordinate state changed:', {
      lng: lng,
      lat: lat,
      coordinates: coordinates,
      originalCoordinates: originalCoordinates
    });
  }, [lng, lat, coordinates, originalCoordinates]);
  
  // Reset province when region changes
  useEffect(() => {
    if (region) {
      setProvince(''); // Reset province when region changes
    }
  }, [region]);

  // Sync form state with reItems changes (e.g., after successful update)
  useEffect(() => {
    // Only sync on initial mount, not on every reItems.coordinates change
    // This prevents overriding user edits when the cache updates
    if (reItems?.coordinates && !originalCoordinates) {
      let coords = [];
      if (reItems.coordinates.coordinates) {
        coords = reItems.coordinates.coordinates;
      } else if (reItems.coordinates) {
        coords = reItems.coordinates;
      }
      
      if (coords && coords[0] !== undefined && coords[1] !== undefined) {
        console.log('Initial sync of form state with reItems coordinates:', coords);
        setLng(String(coords[0]));
        setLat(String(coords[1]));
        setCoordinates([coords[0], coords[1]]);
        
        // Update original coordinates to new values after successful update
        setOriginalCoordinates([coords[0], coords[1]]);
      }
    }
  }, [reItems?.coordinates, originalCoordinates]);

  // Conditional logic for DER and Own Use based on net metering
  useEffect(() => {
    if (reClass === "Non-Commercial") {
      if (isNetMetered === "Yes") {
        // If net metered is Yes, disable DER and Own Use, set them to No
        setIsDer("No");
        setIsOwnUse("No");
        setEstablishmentType("");
      }
      // If net metered is No, DER will be enabled
    }
  }, [isNetMetered, reClass]);

  // Handle DER selection effect on Own Use
  useEffect(() => {
    if (reClass === "Non-Commercial" && isNetMetered === "No") {
      if (isDer === "Yes") {
        // If DER is Yes, disable Own Use and set to No
        setIsOwnUse("No");
        setEstablishmentType("");
      }
      // If DER is No, Own Use will be enabled
    }
  }, [isDer, reClass, isNetMetered]);


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

  // Clear establishment type when solar power generation is selected to prevent conflicts
  useEffect(() => {
    if (reCat === "Solar Energy" && establishmentType) {
      setEstablishmentType("");
    }
  }, [reCat, establishmentType]);

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
      setIsDer("No");
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
    
    console.log('=== REVERSE GEOCODING STARTED ===');
    console.log('reverseGeoCoding called with:', coordinates);
    console.log('GEOCODE_URL:', GEOCODE_URL);
    
    // Ensure we have valid coordinates
    if (!coordinates || (coordinates.lat === undefined && coordinates.lng === undefined)) {
      console.error('Invalid coordinates received:', coordinates);
      return;
    }
    
    // Always update lat/lng/coordinates even if geocoding fails
    const newLat = coordinates.lat;
    const newLng = coordinates.lng;
    
    console.log('Setting new coordinates:', { lat: newLat, lng: newLng });
    
    setLat(String(newLat));
    setLng(String(newLng));
    setCoordinates([newLng, newLat]);
    
    try {
      const fullUrl = GEOCODE_URL + `${newLng},${newLat}`;
      console.log('Making geocoding request to:', fullUrl);
      console.log('Coordinates being sent - Longitude:', newLng, 'Latitude:', newLat);
      console.log('Coordinate format check - newLng type:', typeof newLng, 'newLat type:', typeof newLat);
      
      const resp = await fetch(fullUrl);
      console.log('Geocoding response status:', resp.status);
      console.log('Geocoding response headers:', resp.headers);
      
      if (!resp.ok) {
        console.error('Geocoding request failed:', resp.status, resp.statusText);
        console.log('Trying fallback geocoding service...');
        
        // Try OpenStreetMap Nominatim as fallback
        const fallbackUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`;
        console.log('Trying fallback URL:', fallbackUrl);
        
        try {
          const fallbackResp = await fetch(fallbackUrl);
          if (fallbackResp.ok) {
            const fallbackData = await fallbackResp.json();
            console.log('Fallback geocoding response:', fallbackData);
            
            if (fallbackData && fallbackData.address) {
              // Map OpenStreetMap fields to our expected format
              const fallbackCity = fallbackData.address.city || 
                                  fallbackData.address.town || 
                                  fallbackData.address.municipality ||
                                  fallbackData.address.village ||
                                  '';
              
              const fallbackBarangay = fallbackData.address.suburb || 
                                      fallbackData.address.neighbourhood ||
                                      fallbackData.address.district ||
                                      '';
              
              const fallbackRegion = fallbackData.address.state || 
                                    fallbackData.address.province ||
                                    '';
              
              if (fallbackCity) {
                setCity(fallbackCity);
                console.log('City set from fallback service:', fallbackCity);
              }
              if (fallbackBarangay) {
                setBrgy(fallbackBarangay);
                console.log('Barangay set from fallback service:', fallbackBarangay);
              }
              if (fallbackRegion) {
                // Try to match with our predefined regions
                const allRegions = getAllRegionNames();
                const matchedRegion = allRegions.find(region => 
                  region.toLowerCase().includes(fallbackRegion.toLowerCase()) ||
                  fallbackRegion.toLowerCase().includes(region.toLowerCase())
                );
                
                if (matchedRegion) {
                  setRegion(matchedRegion);
                  console.log('Region set from fallback service:', matchedRegion);
                  setProvince('');
                }
              }
              
              setCountry(fallbackData.address.country || 'Philippines');
              console.log('Country set from fallback service:', fallbackData.address.country || 'Philippines');
              
              console.log('=== FALLBACK GEOCODING COMPLETED SUCCESSFULLY ===');
              return; // Exit early since we got data from fallback
            }
          }
        } catch (fallbackError) {
          console.error('Fallback geocoding also failed:', fallbackError);
        }
        
        return;
      }
      
      const data = await resp.json();
      console.log('Geocoding response data:', data);
      
      if (data && data.address) {
        console.log('Address data received:', data.address);
        console.log('All available address fields:', Object.keys(data.address));
        console.log('Full address object:', JSON.stringify(data.address, null, 2));
        
        // Try multiple possible field names for barangay/neighborhood
        const barangay = data.address.Neighborhood || 
                        data.address.SubNeighborhood || 
                        data.address.District || 
                        data.address.Area || 
                        data.address.Locality ||
                        data.address.Barangay ||
                        data.address.Community ||
                        '';
        
        // Try multiple possible field names for city/municipality
        const city = data.address.City || 
                    data.address.Municipality || 
                    data.address.Locality || 
                    data.address.PlaceName ||
                    data.address.MetroArea ||
                    data.address.UrbanArea ||
                    '';
        
        // Additional fallback: try to extract from other fields
        if (!city && data.address.LongLabel) {
          // Sometimes the full address is in LongLabel
          const longLabel = data.address.LongLabel;
          console.log('Trying to extract city from LongLabel:', longLabel);
          
          // Look for common city indicators in the long label
          if (longLabel.includes(', ')) {
            const parts = longLabel.split(', ');
            // Usually city is the second or third part
            if (parts.length >= 2) {
              const potentialCity = parts[1] || parts[0];
              if (potentialCity && !potentialCity.includes('Region') && !potentialCity.includes('Province')) {
                console.log('Extracted city from LongLabel:', potentialCity);
                setCity(potentialCity);
              }
            }
          }
        }
        
        console.log('Extracted barangay:', barangay);
        console.log('Extracted city:', city);
        
        // Set barangay and city if we found them
        if (barangay) {
          setBrgy(barangay);
          console.log('Barangay set to:', barangay);
        }
        if (city) {
          setCity(city);
          console.log('City set to:', city);
        }
        
        // Map geocoded region to our predefined regions
        const geocodedRegion = data.address.Subregion;
        if (geocodedRegion) {
          const allRegions = getAllRegionNames();
          const matchedRegion = allRegions.find(region => 
            region.toLowerCase().includes(geocodedRegion.toLowerCase()) ||
            geocodedRegion.toLowerCase().includes(region.toLowerCase())
          );
          
          if (matchedRegion) {
            setRegion(matchedRegion);
            console.log('Region set to:', matchedRegion);
            // Reset province when region changes
            setProvince('');
          } else {
            // If no match found, try to set a default based on coordinates
            // For now, we'll leave it as is and let user select manually
            console.log('No region match found for:', geocodedRegion);
          }
        }
        
        setCountry(data.address.CntryName);
        console.log('Country set to:', data.address.CntryName);
        
        console.log('=== REVERSE GEOCODING COMPLETED SUCCESSFULLY ===');
      } else {
        console.log('No address data in response:', data);
      }
    } catch (e) {
      console.error('=== REVERSE GEOCODING FAILED ===');
      console.error('Geocoding error:', e);
      console.error('Error details:', {
        message: e.message,
        stack: e.stack,
        name: e.name
      });
      // ignore geocode errors; coords already set
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
      isDer,
      ownUse: isOwnUse,
      address: {
        country,
        region,
        province,
        city,
        brgy,
      }
    };

    // Add establishment type if available
    if (establishmentType) {
      propertiesObj.establishmentType = establishmentType;
    }

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

    const data = new FormData();
    data.append('id', reItems.id)
    // FIXED: Updated to use assignedUserId
    data.append('user', assignedUserId)
    data.append('type', 'Point');
    
    // Debug: Log the coordinates being sent
    const coordsToSend = [parseFloat(lng), parseFloat(lat)];
    console.log('Saving coordinates:', {
      lng: lng,
      lat: lat,
      parsed: coordsToSend,
      isValid: !isNaN(coordsToSend[0]) && !isNaN(coordsToSend[1])
    });
    
    // Validate coordinates before sending
    if (isNaN(coordsToSend[0]) || isNaN(coordsToSend[1])) {
      setErrContent("Invalid coordinates. Please select a valid location on the map.");
      return;
    }
    
    // Send coordinates as a simple array string for backend extraction
    data.append('coordinates', JSON.stringify(coordsToSend));
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

    // Check if coordinates have changed from original values
    const coordsChanged = haveCoordinatesChanged();
    console.log('Duplicate detection debug:', {
      coordsChanged,
      currentCoords: [parseFloat(lng), parseFloat(lat)],
      originalCoords: originalCoordinates,
      forceUpdate
    });
    
    if (!coordsChanged && !forceUpdate) {
      console.log('Coordinates unchanged, duplicate detection will be skipped');
    }

    if (canSave) {
      try {
        const result = await updateInventory(data).unwrap();
        setForceUpdate(false)
        setShowDuplicateModal(false)
        
        // Check if coordinates were actually changed
        const coordsChanged = haveCoordinatesChanged();
        if (coordsChanged) {
          setSuccessContent("Inventory updated successfully! Coordinates and all changes have been saved.");
        } else {
          setSuccessContent("Inventory updated successfully! (No coordinate changes detected)");
        }
              setTimeout(() => setSuccessContent(null), 3000);
        
        // Update local coordinate state with the saved values
        if (result?.updatedInventory?.coordinates) {
          const savedCoords = result.updatedInventory.coordinates;
          console.log('Updating local state with saved coordinates:', savedCoords);
          setLng(String(savedCoords[0]));
          setLat(String(savedCoords[1]));
          setCoordinates([savedCoords[0], savedCoords[1]]);
          setOriginalCoordinates([savedCoords[0], savedCoords[1]]);
        }
      } catch (err) {
        console.log('Update error received:', {
          status: err?.status,
          message: err?.data?.message,
          duplicates: err?.data?.duplicates,
          error: err
        });
        
        // Handle duplicate detection by showing the modal
        if (err?.status === 409 && err?.data?.duplicates) {
          console.log('Duplicate detected, showing modal with:', err.data.duplicates);
          setPotentialDuplicates(err.data.duplicates);
          setShowDuplicateModal(true);
          setErrContent(null); // Clear any previous error
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
    setErrContent(null) // Clear any error messages
    
    if (lastFormData) {
      lastFormData.append("forceUpdate", true)
      try {
        const result = await updateInventory(lastFormData).unwrap()
        setForceUpdate(false)
        
        // Check if coordinates were actually changed
        const coordsChanged = haveCoordinatesChanged();
        if (coordsChanged) {
          setSuccessContent("Inventory updated successfully! Coordinates and all changes have been saved.");
        } else {
          setSuccessContent("Inventory updated successfully! (No coordinate changes detected)");
        }
        setTimeout(() => setSuccessContent(null), 3000);
        
        // Update local coordinate state with the saved values
        if (result?.updatedInventory?.coordinates) {
          const savedCoords = result.updatedInventory.coordinates;
          console.log('Updating local state with saved coordinates (proceed anyway):', savedCoords);
          setLng(String(savedCoords[0]));
          setLat(String(savedCoords[1]));
          setCoordinates([savedCoords[0], savedCoords[1]]);
          setOriginalCoordinates([savedCoords[0], savedCoords[1]]);
        }
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
              {successContent !== null ?
                <Snackbar open={true} autoHideDuration={3000} onClose={() => setSuccessContent(null)} >
                  <Alert onClose={() => setSuccessContent(null)} severity='success' sx={{ width: '100%' }}>
                    {successContent}
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
              {isManager || isAdmin ? (
                <TextField
                  fullWidth
                  size="small"
                  id="user"
                  select
                  label="Assigned to:"
                  value={assignedUserId || ""}
                  onChange={onUserIdChanged}
                  disabled={isReadOnly}
                  helperText="Select the user assigned to this inventory"
                >
                  {allUsers?.map((user) => {
                    console.log('User in dropdown:', user);
                    return (
                      <MenuItem key={user.id} value={user.id}>
                        {user.fullName || user.username} ({user.username})
                      </MenuItem>
                    );
                  })}
                  {/* Fallback if assignedUserId is not in allUsers */}
                  {assignedUserId && !allUsers?.find(u => u.id === assignedUserId) && (
                    <MenuItem value={assignedUserId} disabled>
                      Current: {assignedUserId} (User not found in list)
                    </MenuItem>
                  )}

                  {/* Show current user if no assignedUserId */}
                  {!assignedUserId && userId && (
                    <MenuItem value={userId} disabled>
                      Current User: {userId}
                    </MenuItem>
                  )}
                </TextField>
              ) : (
                ""
              )}

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

                {/* DER Field - Only for Non-Commercial, appears after Net Metered */}
                {reClass === "Non-Commercial" && (
                  <>
                    <Typography sx={{ fontWeight: 700, mb: 1 }} component="label">
                      Is DER (Distributed Energy Resource)?
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isDer === "Yes"}
                            onChange={() => {
                              if (isReadOnly) return;
                              setIsDer("Yes");
                            }}
                            color="primary"
                            disabled={isNetMetered === "Yes" || isReadOnly} // Disable when net metered is Yes or read-only
                          />
                        }
                        label="Yes"
                        sx={{ mr: 2, ml: 1 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isDer === "No"}
                            onChange={() => {
                              if (isReadOnly) return;
                              setIsDer("No");
                            }}
                            color="primary"
                            disabled={isNetMetered === "Yes" || isReadOnly} // Disable when net metered is Yes or read-only
                          />
                        }
                        label="No"
                        sx={{ ml: 2 }}
                      />
                    </Box>
                    {isNetMetered === "Yes" && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        DER is automatically set to "No" when net metered is "Yes".
                      </Alert>
                    )}
                  </>
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
                        disabled={reClass === "Commercial" || isReadOnly || (reClass === "Non-Commercial" && isNetMetered === "Yes") || (reClass === "Non-Commercial" && isDer === "Yes")} // Disable when Commercial, read-only, or when net metered is Yes, or when DER is Yes
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
                        disabled={reClass === "Commercial" || isReadOnly || (reClass === "Non-Commercial" && isNetMetered === "Yes") || (reClass === "Non-Commercial" && isDer === "Yes")} // Disable when Commercial, read-only, or when net metered is Yes, or when DER is Yes
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
                {(reClass === "Non-Commercial" && isNetMetered === "Yes") && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Own Use is automatically set to "No" when net metered is "Yes".
                  </Alert>
                )}
                {(reClass === "Non-Commercial" && isDer === "Yes") && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Own Use is automatically set to "No" when DER is "Yes".
                  </Alert>
                )}

                {/* Establishment Type - Only when Own Use is Yes and DER is No, but NOT for Solar Power Generation */}
                {reClass === "Non-Commercial" && isOwnUse === true && isDer === false && reCat !== "Solar Energy" && (
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontStyle: 'italic', mb: 2 }} component="h1" variant="subtitle2">
                      Establishment Type
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel id="establishmentType-label">Select Establishment Type</InputLabel>
                      <Select
                        id="establishmentType"
                        name="establishmentType"
                        label="Select Establishment Type"
                        value={establishmentType || ""}
                        onChange={(e) => setEstablishmentType(e.target.value)}
                      >
                        <MuiMenuItem value="Residential Establishment">Residential Establishment</MuiMenuItem>
                        <MuiMenuItem value="Commercial Establishment">Commercial Establishment</MuiMenuItem>
                        <MuiMenuItem value="Industrial Establishment">Industrial Establishment</MuiMenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                )}
                
                {/* Info message for Solar Power Generation - Establishment Type is handled by subcategories */}
                {reClass === "Non-Commercial" && isOwnUse === true && isDer === false && reCat === "Solar Energy" && (
                  <Box sx={{ mb: 3 }}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Note:</strong> For Solar Power Generation systems, establishment type information is captured through the detailed subcategories (Residential/Commercial/Industrial rooftop, etc.) rather than a separate establishment type field.
                      </Typography>
                    </Alert>
                  </Box>
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
              {/* Coordinate change indicator */}
              {originalCoordinates && haveCoordinatesChanged() && (
                <Alert 
                  severity="info" 
                  sx={{ mb: 2, fontSize: '0.875rem' }}
                  icon={<InfoIcon />}
                >
                  Coordinates have been modified from original values. Duplicate detection will be active.
                </Alert>
              )}
              {originalCoordinates && !haveCoordinatesChanged() && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 2, fontSize: '0.875rem' }}
                  icon={<CheckCircleIcon />}
                >
                  Coordinates unchanged. Duplicate detection will be skipped.
                </Alert>
              )}
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
                select
                value={region}
                onChange={onRegionChanged}
                disabled={isReadOnly}
              >
                <MenuItem value="">
                  <em>Select Region</em>
                </MenuItem>
                {getAllRegionNames().map((regionName) => (
                  <MenuItem key={regionName} value={regionName}>
                    {regionName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label='Province'
                id='province'
                name='properties.address.province'
                select
                value={province}
                onChange={onProvinceChanged}
                disabled={isReadOnly || !region}
                helperText={!region ? 'Please select a region first' : ''}
              >
                <MenuItem value="">
                  <em>Select Province</em>
                </MenuItem>
                {region && getProvincesForRegion(region).map((provinceName) => (
                  <MenuItem key={provinceName} value={provinceName}>
                    {provinceName}
                  </MenuItem>
                ))}
              </TextField>
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
              reCat === 'Solar Energy' ? <EditSolar setEditSolar={setEditSolar} reItems={reItems} allUsers={allUsers} reClass={reClass} readOnly={isReadOnly} isNetMetered={isNetMetered} isDer={isDer} isOwnUse={isOwnUse} /> :
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
          <Dialog 
            open={showDuplicateModal} 
            onClose={handleCancelDuplicate}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ 
              backgroundColor: 'warning.light', 
              color: 'warning.contrastText',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              ⚠️ Potential Duplicate Detected
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <MuiAlert 
                severity="warning" 
                sx={{ 
                  mb: 3,
                  fontSize: '1rem',
                  '& .MuiAlert-message': {
                    fontWeight: 500
                  }
                }}
              >
                There is/are technical assessment(s) within 100 meters of this location.
                <br />
                <strong>Is this the same RE System as any of the following?</strong>
              </MuiAlert>
              <List sx={{ mb: 2 }}>
                {potentialDuplicates.map((dup, idx) => (
                  <ListItem 
                    key={dup._id || idx}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      backgroundColor: 'background.paper'
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                          {dup.properties?.ownerName || "Unknown"}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>RE Category:</strong> {dup.properties?.reCat}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>RE Class:</strong> {dup.properties?.reClass}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Year Established:</strong> {dup.properties?.yearEst}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Address:</strong> {dup.properties?.address?.city}, {dup.properties?.address?.province}, {dup.properties?.address?.region}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Coordinates:</strong> {dup.coordinates?.coordinates?.[1]}, {dup.coordinates?.coordinates?.[0]}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <MuiAlert 
                severity="info" 
                sx={{ 
                  mt: 3,
                  mb: 1,
                  fontSize: '1rem',
                  '& .MuiAlert-message': {
                    fontWeight: 500
                  }
                }}
              >
                <strong>Warning:</strong> Updating this inventory may cause data conflicts with nearby systems. 
                Consider canceling if this affects the same system, or proceed only if you're certain this is appropriate.
              </MuiAlert>
            </DialogContent>
            <DialogActions sx={{ gap: 2, p: 2, flexDirection: 'row-reverse' }}>
              <Button 
                onClick={handleCancelDuplicate} 
                color="error" 
                variant="contained"
                size="large"
                sx={{
                  minWidth: 140,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  py: 1.5,
                  px: 3,
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-1px)',
                    backgroundColor: 'error.dark'
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleProceedAnyway} 
                color="success" 
                variant="outlined"
                size="medium"
                sx={{
                  minWidth: 120,
                  fontWeight: 'normal',
                  fontSize: '0.9rem',
                  py: 1,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'success.light',
                    color: 'success.contrastText'
                  }
                }}
              >
                Proceed Anyway
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