import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewInventoryMutation } from "./inventoriesApiSlice";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Container,
  Grid,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
  Collapse,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { boxstyle } from "../../config/style";
import useAuth from "../../hooks/useAuth";
import { reCats } from "../../config/reCats";
import { Classification, mannerOfAcquisition } from "../../config/techAssesment";
import { Upload as UploadFileIcon, MyLocation as MyLocationIcon, ArrowBack as ArrowBackIcon, Help as HelpIcon } from "@mui/icons-material";
import { Coordinates } from "../../components/Coordinates";
import { Solar } from "../categories/Solar";
import { Wind } from "../categories/Wind";
import { Biomass } from "../categories/Biomass";
import { Hydropower } from "../categories/Hydropower";
import InventoryHelpModal from "../../components/InventoryHelpModal";
import { getAllRegionNames, getProvincesForRegion } from '../../config/regions'

const DUPLICATE_RADIUS_METERS = 100; // Should match backend value!

const NewInventoryForm = ({ allUsers }) => {
  const [addNewInventory, { isLoading, isSuccess, isError, error }] = useAddNewInventoryMutation();
  const navigate = useNavigate();
  const { username, isManager, isAdmin } = useAuth();

  // USER
  const getUserId = allUsers.filter((user) => user.username === username);
  const getFilteredID = useMemo(() => Object.values(getUserId).map((user) => user.id).toString(), [getUserId]);

  // FORM STATES
  const year = new Date().getFullYear();
  const years = Array.from(new Array(124), (val, index) => year - index);

  const GEOCODE_URL =
    "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&outFields=*&returnIntersection=false&location=";

  const [openModal, setOpenModal] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [brgy, setBrgy] = useState("");
  const [type, setType] = useState("Point");
  const [coordinates, setCoordinates] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [reClass, setReClass] = useState("Non-Commercial");
  const [reCat, setReCat] = useState("Solar Energy");
  const [acquisition, setAcquisition] = useState(mannerOfAcquisition[1].name);
  const [yearEst, setYearEst] = useState(years[0]);
  const [myUploads, setmyUploads] = useState("");
  const [filesCount, setFilesCount] = useState(null);
  const [userId, setUserId] = useState("");
  const [solar, setSolar] = useState([]);
  const [wind, setWind] = useState([]);
  const [biomass, setBiomass] = useState([]);
  const [hydropower, setHydropower] = useState([]);
  const [isOwnUse, setIsOwnUse] = useState(null);
  const [isNetMetered, setIsNetMetered] = useState(null);
  const [isDer, setIsDer] = useState(null);
  const [establishmentType, setEstablishmentType] = useState("");

  // FIT-related states
  const [isFitEligible, setIsFitEligible] = useState(false);
  const [fitPhase, setFitPhase] = useState("Non-FIT");
  const [fitRate, setFitRate] = useState("");
  const [fitRef, setFitRef] = useState("");
  const [fitStatus, setFitStatus] = useState("");

  // DUPLICATE DETECTION STATES
  const [potentialDuplicates, setPotentialDuplicates] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [forceCreate, setForceCreate] = useState(false);
  const [lastFormData, setLastFormData] = useState(null);

  // HELP MODAL STATE
  const [openHelpModal, setOpenHelpModal] = useState(false);



  useEffect(() => {
    // For non-admin/manager, default Assigned to to current user (uploader)
    if (!isManager && !isAdmin) {
      setUserId(getFilteredID);
    }
  }, [getFilteredID, isAdmin, isManager]);

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
      setIsNetMetered(false);
      setIsOwnUse(false);
      setIsDer(false);
    }
  }, [reClass]);

  // Conditional logic for DER and Own Use based on net metering
  useEffect(() => {
    if (reClass === "Non-Commercial") {
      if (isNetMetered === true) {
        // If net metered is Yes, disable DER and Own Use, set them to No
        setIsDer(false);
        setIsOwnUse(false);
        setEstablishmentType("");
      }
      // If net metered is No, DER will be enabled
    }
  }, [isNetMetered, reClass]);

  // Handle DER selection effect on Own Use
  useEffect(() => {
    if (reClass === "Non-Commercial" && isNetMetered === false) {
      if (isDer === true) {
        // If DER is Yes, disable Own Use and set to No
        setIsOwnUse(false);
        setEstablishmentType("");
      }
      // If DER is No, Own Use will be enabled
    }
  }, [isDer, reClass, isNetMetered]);

  useEffect(() => {
    if (isSuccess) {
      setOwnerName("");
      setCountry("");
      setRegion("");
      setProvince("");
      setCity("");
      setBrgy("");
      setLng("");
      setLat("");
      setCoordinates([]);
      setType("Point");
      setReCat("Solar Energy");
      setReClass("Non-Commercial");
      setYearEst(years[0]);
      setAcquisition(mannerOfAcquisition[1].name);
      setUserId("");
      setSolar([]);
      setWind([]);
      setBiomass([]);
      setHydropower([]);
      setIsOwnUse(null);
      setIsNetMetered(null);
      setIsDer(null);
      setEstablishmentType("");
      setmyUploads("");
      setFilesCount(null);
      // Reset FIT fields
      setIsFitEligible(false);
      setFitPhase("Non-FIT");
      setFitRate("");
      setFitRef("");
      setFitStatus("");
      // Stay on the new inventory form instead of redirecting to map dashboard
      // navigate("/dashboard/inventories");
    }
  }, [isSuccess, years]);

  // Reset province when region changes
  useEffect(() => {
    if (region) {
      setProvince(''); // Reset province when region changes
    }
  }, [region]);

  const onOwnerNameChanged = (e) => setOwnerName(e.target.value);
  const onCountryChanged = (e) => setCountry(e.target.value);
  const onRegionChanged = (e) => setRegion(e.target.value);
  const onProvinceChanged = (e) => setProvince(e.target.value);
  const onCityChanged = (e) => setCity(e.target.value);
  const onBrgyChanged = (e) => setBrgy(e.target.value);
  const onmyUploadsChanged = (e) => {
    setmyUploads(e.target.files);
    setFilesCount(e.target.files.length);
  };
  const onLatChanged = (e) => {
    setLat(e.target.value);
    setCoordinates([parseFloat(lng), parseFloat(e.target.value)]);
  };
  const onLngChanged = (e) => {
    setLng(e.target.value);
    setCoordinates([parseFloat(e.target.value), parseFloat(lat)]);
  };
  const onUserIdChanged = (e) => setUserId(e.target.value);
  const onReClassChanged = (e) => {
    setReClass(e.target.value);
    
    if (e.target.value === "Commercial") {
      // Auto-select "No" for Net Metering and Own Use when Commercial is selected
      setIsNetMetered(false);
      setIsOwnUse(false);
    } else {
      // Reset FIT fields if changing away from Commercial
      setIsFitEligible(false);
      setFitPhase("Non-FIT");
      setFitRate("");
      setFitRef("");
      setFitStatus("");
    }
  };
  const onReCatChanged = (e) => setReCat(e.target.value);
  const onAquisitionChanged = (e) => setAcquisition(e.target.value);
  const onYearEstChanged = (e) => setYearEst(e.target.value);

  const reverseGeoCoding = async (coordinates) => {
    console.log('=== REVERSE GEOCODING STARTED ===');
    console.log('reverseGeoCoding called with:', coordinates);
    console.log('GEOCODE_URL:', GEOCODE_URL);
    
    // Optimistically set coords first to avoid flicker/revert
    setLat(coordinates?.lat);
    setLng(coordinates?.lng);
    setCoordinates([coordinates?.lng, coordinates?.lat]);
    
    try {
      const fullUrl = GEOCODE_URL + `${coordinates.lng},${coordinates.lat}`;
      console.log('Making geocoding request to:', fullUrl);
      console.log('Coordinates being sent - Longitude:', coordinates.lng, 'Latitude:', coordinates.lat);
      console.log('Coordinate format check - coordinates.lng type:', typeof coordinates.lng, 'coordinates.lat type:', typeof coordinates.lat);
      
      const resp = await fetch(fullUrl);
      console.log('Geocoding response status:', resp.status);
      console.log('Geocoding response headers:', resp.headers);
      
      if (!resp.ok) {
        console.error('Geocoding request failed:', resp.status, resp.statusText);
        console.log('Trying fallback geocoding service...');
        
        // Try OpenStreetMap Nominatim as fallback
        const fallbackUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}&zoom=18&addressdetails=1`;
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
  };

  const canSave =
    [
      ownerName,
      country,
      region,
      province,
      city,
      lat,
      lng,
      userId,
    ].every(Boolean) &&
    !isLoading &&
    filesCount <= 3 && 
    // If Commercial, require FIT fields
    !(reClass === "Commercial" && isFitEligible === null);

  // ----------- DUPLICATE DETECTION HANDLING -----------------
  const onSaveInventoryClicked = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("user", userId);
    data.append("type", type);
    // Send coordinates as GeoJSON for backend detection!
    // Send coordinates in a format the backend extracts reliably
    data.append("coordinates", JSON.stringify([parseFloat(lng), parseFloat(lat)]));
    data.append("properties[ownerName]", ownerName);
    data.append("properties[reCat]", reCat);
    data.append("properties[reClass]", reClass);
    data.append("properties[yearEst]", yearEst);
    data.append("properties[acquisition]", acquisition);
    data.append("properties[address][country]", country);
    data.append("properties[address][region]", region);
    data.append("properties[address][province]", province);
    data.append("properties[address][city]", city);
    data.append("properties[address][brgy]", brgy);
    if (isOwnUse !== null) data.append("properties[ownUse]", isOwnUse ? "Yes" : "No");
    if (isNetMetered !== null) data.append("properties[isNetMetered]", isNetMetered ? "Yes" : "No");
    if (isDer !== null) data.append("properties[isDer]", isDer ? "Yes" : "No");
    if (establishmentType) data.append("properties[establishmentType]", establishmentType);
    
    // Add FIT information when Commercial
    if (reClass === "Commercial") {
      data.append("properties[fit][eligible]", isFitEligible);
      data.append("properties[fit][phase]", fitPhase);
      if (fitRate) data.append("properties[fit][rate]", fitRate);
      if (fitRef) data.append("properties[fit][fitRef]", fitRef);
      if (fitStatus) data.append("properties[fit][fitStatus]", fitStatus);
    }
    
    if (reCat === "Solar Energy") {
      if (solar?.solarUsage === "Solar Street Lights") {
        const items = solar?.solarStreetLights;
        for (let i = 0; i < items?.length; i++) {
          const obj = items[i];
          data.append(`assessment[solarStreetLights][${i}][capacity]`, obj.capacity);
          data.append(`assessment[solarStreetLights][${i}][pcs]`, obj.pcs);
        }
      }
      if (solar?.solarUsage === "Solar Pump") {
        data.append("assessment[flowRate]", solar.flowRate);
        data.append("assessment[serviceArea]", solar.serviceArea);
        data.append("assessment[capacity]", solar.capacity);
      }
      if (solar?.solarUsage === "Power Generation") {
        data.append("assessment[solarSystemTypes]", solar.solarSystemTypes);
        data.append("assessment[capacity]", solar.capacity);
        // ---- Add annualEnergyProduction if provided ----
        if (
          solar.annualEnergyProduction !== undefined &&
          solar.annualEnergyProduction !== ""
        ) {
          data.append(
            "assessment[annualEnergyProduction]",
            solar.annualEnergyProduction
          );
        }
      }
      data.append("assessment[remarks]", solar.remarks);
      data.append("assessment[status]", solar.status);
      data.append("assessment[solarUsage]", solar.solarUsage);
    }
    if (reCat === "Wind Energy") {
      if (wind?.windUsage === "Water pump") {
        data.append("assessment[serviceArea]", wind.serviceArea);
      }
      data.append("assessment[capacity]", wind.capacity);
      data.append("assessment[windUsage]", wind.windUsage);
      data.append("assessment[remarks]", wind.remarks);
      data.append("assessment[status]", wind.status);
    }
    if (reCat === "Biomass") {
      if (
        biomass?.biomassPriUsage === "Biogas" ||
        biomass?.biomassPriUsage === "Gasification"
      ) {
        data.append("assessment[bioUsage]", biomass.bioUsage);
      }
      data.append("assessment[capacity]", biomass.capacity);
      data.append("assessment[biomassPriUsage]", biomass.biomassPriUsage);
      data.append("assessment[remarks]", biomass.remarks);
      data.append("assessment[status]", biomass.status);
    }
    if (reCat === "Hydropower") {
      data.append("assessment[capacity]", hydropower.capacity);
      data.append("assessment[status]", hydropower.status);
      data.append("assessment[remarks]", hydropower.remarks);
    }
    const files = e.target.myUploads.files;
    if (files.length !== 0) {
      for (const file of files) {
        data.append("myUploads", file);
      }
    }
    if (forceCreate) data.append("forceCreate", true);
    setLastFormData(data); // Save for potential retry

    try {
      await addNewInventory(data).unwrap();
      setForceCreate(false);
    } catch (err) {
      if (err?.status === 409 && err?.data?.duplicates) {
        setPotentialDuplicates(err.data.duplicates);
        setShowDuplicateModal(true);
      }
    }
  };

  // When user chooses to "Proceed Anyway" after duplicate warning
  const handleProceedAnyway = async () => {
    setShowDuplicateModal(false);
    setForceCreate(true);
    if (lastFormData) {
      lastFormData.append("forceCreate", true);
      try {
        await addNewInventory(lastFormData).unwrap();
        setForceCreate(false);
      } catch (err) {
        // Handle errors if needed
      }
    }
  };

  const handleCancel = () => {
    setShowDuplicateModal(false);
    setForceCreate(false);
    setPotentialDuplicates([]);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isError]);

  // --------------- RENDER -----------------------
  return (
    <Container sx={{ maxWidth: { lg: "md" } }}>
      <form onSubmit={onSaveInventoryClicked}>
        <Box sx={{
          minHeight: "100vh",
          maxWidth: "100%",
          "& .MuiTextField-root": { my: 1 },
        }}>
          <Box sx={boxstyle}>
            <Collapse timeout={{ exit: 1 }} in={isError}>
              <Alert severity="error">{error?.data?.message}</Alert>
            </Collapse>
            <Grid container>
              <Grid item xs key="1">
                <Typography component="h1" variant="h5" sx={{ color: 'white' }}>
                  New Inventory
                </Typography>
              </Grid>
              <Grid item key="2">
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
            />
            <TextField
              fullWidth
              size="small"
              id="yearEst"
              select
              name="properties.yearEst"
              label="Year Established"
              value={yearEst || ""}
              onChange={onYearEstChanged}
            >
              {years.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            {isManager || isAdmin ? (
              <TextField
                fullWidth
                size="small"
                id="user"
                select
                label="Assigned to:"
                value={userId || ""}
                onChange={onUserIdChanged}
              >
                {allUsers?.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fullName || user.username}
                  </MenuItem>
                ))}
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
                        onChange={() => setIsFitEligible(true)}
                        color="primary"
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
                          setIsFitEligible(false);
                          // Auto-select Non-FIT when not eligible
                          setFitPhase("Non-FIT");
                        }}
                        color="primary"
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
                  disabled={isFitEligible === false}
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
                  disabled={isFitEligible === false}
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
                  disabled={isFitEligible === false}
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
                  disabled={isFitEligible === false}
                  sx={{ mb: 1 }}
                />
              </Box>
            )}

            {/* Net Metered Yes/No checkboxes */}
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }} component="label">
                Is net-metered?
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isNetMetered === true}
                      onChange={() => setIsNetMetered(true)}
                      color="primary"
                      disabled={reClass === "Commercial"} // Disable when Commercial
                    />
                  }
                  label="Yes"
                  sx={{ mr: 2, ml: 1 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isNetMetered === false}
                      onChange={() => setIsNetMetered(false)}
                      color="primary"
                      disabled={reClass === "Commercial"} // Disable when Commercial
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isDer === true}
                          onChange={() => setIsDer(true)}
                          color="primary"
                          disabled={isNetMetered === true} // Disable when net metered is Yes
                        />
                      }
                      label="Yes"
                      sx={{ mr: 2, ml: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isDer === false}
                          onChange={() => setIsDer(false)}
                          color="primary"
                          disabled={isNetMetered === true} // Disable when net metered is Yes
                        />
                      }
                      label="No"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  {isNetMetered === true && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      DER is automatically set to "No" when net metered is "Yes".
                    </Alert>
                  )}
                </>
              )}

              <Typography sx={{ fontWeight: 700, mb: 1 }} component="label">
                Own use?
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isOwnUse === true}
                      onChange={() => setIsOwnUse(true)}
                      color="primary"
                      disabled={reClass === "Commercial" || (reClass === "Non-Commercial" && isNetMetered === true) || (reClass === "Non-Commercial" && isDer === true)} // Disable when Commercial, or when net metered is Yes, or when DER is Yes
                    />
                  }
                  label="Yes"
                  sx={{ mr: 2, ml: 1 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isOwnUse === false}
                      onChange={() => setIsOwnUse(false)}
                      color="primary"
                      disabled={reClass === "Commercial" || (reClass === "Non-Commercial" && isNetMetered === true) || (reClass === "Non-Commercial" && isDer === true)} // Disable when Commercial, or when net metered is Yes, or when DER is Yes
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
              {(reClass === "Non-Commercial" && isNetMetered === true) && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Own Use is automatically set to "No" when net metered is "Yes".
                </Alert>
              )}
              {(reClass === "Non-Commercial" && isDer === true) && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Own Use is automatically set to "No" when DER is "Yes".
                </Alert>
              )}

              {/* Establishment Type - Only when Own Use is Yes and DER is No */}
              {reClass === "Non-Commercial" && isOwnUse === true && isDer === false && (
                <>
                  <Typography sx={{ fontWeight: 700, mb: 1 }} component="label">
                    Establishment Type
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    id="establishmentType"
                    select
                    name="establishmentType"
                    label="Select Establishment Type"
                    value={establishmentType || ""}
                    onChange={(e) => setEstablishmentType(e.target.value)}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="Residential Establishment">Residential Establishment</MenuItem>
                    <MenuItem value="Commercial Establishment">Commercial Establishment</MenuItem>
                    <MenuItem value="Industrial Establishment">Industrial Establishment</MenuItem>
                  </TextField>
                </>
              )}
            </Box>
          </Box>
          <Box sx={boxstyle}>
            <Typography
              sx={{ fontStyle: "italic" }}
              component="h1"
              variant="subtitle2"
            >
              Coordinates
            </Typography>
            <Box
              sx={{
                display: "grid",
                gap: 1,
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="Longitude"
                id="lng"
                name="lng"
                type="number"
                value={lng}
                onChange={onLngChanged}
              />
              <TextField
                fullWidth
                size="small"
                label="Latitude"
                id="lat"
                name="lat"
                type="number"
                value={lat}
                onChange={onLatChanged}
              />
              <Button
                component="label"
                variant="outlined"
                startIcon={<MyLocationIcon />}
                sx={{ my: 1 }}
                size="small"
                onClick={() => setOpenModal(true)}
              >
                Select on Map
              </Button>
            </Box>
            <Coordinates
              openModal={openModal}
              setOpenModal={setOpenModal}
              reverseGeoCoding={reverseGeoCoding}
              setLat={setLat}
              setLng={setLng}
            />
          </Box>
          <Box sx={boxstyle}>
            <Typography
              sx={{ fontStyle: "italic" }}
              component="h1"
              variant="subtitle2"
            >
              Address
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Country"
              id="country"
              name="properties.address.country"
              type="text"
              value={country}
              onChange={onCountryChanged}
            />
            <TextField
              fullWidth
              size="small"
              label="Region"
              id="region"
              name="properties.address.region"
              select
              value={region}
              onChange={onRegionChanged}
            >
              <MenuItem value="">
                <em>Select Region</em>
              </MenuItem>
              {getAllRegionNames().map((reg, index) => (
                <MenuItem key={index} value={reg}>
                  {reg}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              size="small"
              label="Province"
              id="province"
              name="properties.address.province"
              select
              value={province}
              onChange={onProvinceChanged}
              disabled={!region}
              helperText={!region ? 'Please select a region first' : ''}
            >
              <MenuItem value="">
                <em>Select Province</em>
              </MenuItem>
              {region && getProvincesForRegion(region).map((prov, index) => (
                <MenuItem key={index} value={prov}>
                  {prov}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              size="small"
              label="City/Municipality"
              id="city"
              name="properties.address.city"
              type="text"
              value={city}
              onChange={onCityChanged}
            />
            <TextField
              fullWidth
              size="small"
              label="Barangay"
              id="brgy"
              name="properties.address.brgy"
              type="text"
              value={brgy}
              onChange={onBrgyChanged}
            />
          </Box>

          {/* Pass reClass prop to component */}
          {reCat === null ? null : reCat === "Solar Energy" ? (
            <Solar setSolar={setSolar} reClass={reClass} />
          ) : reCat === "Wind Energy" ? (
            <Wind setWind={setWind} reClass={reClass} />
          ) : reCat === "Biomass" ? (
            <Biomass setBiomass={setBiomass} />
          ) : reCat === "Hydropower" ? (
            <Hydropower setHydropower={setHydropower} />
          ) : (
            ""
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
            }}
          >
            <Button
              variant="contained"
              color="success"
              type="submit"
              sx={{ my: 1 }}
              disabled={!canSave}
            >
              Save
            </Button>
            <Tooltip title="3 maximum images">
              <Button
                component="label"
                variant="contained"
                startIcon={<UploadFileIcon />}
                sx={{ m: 1 }}
              >
                Add Images{" "}
                {filesCount >= 4
                  ? "| no. of file exceeded"
                  : filesCount
                  ? "| " + filesCount + " selected"
                  : null}
                <input
                  type="file"
                  id="myUploads"
                  name="myUploads"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={onmyUploadsChanged}
                />
              </Button>
            </Tooltip>
          </Box>
        </Box>
        <input
          className="form__input"
          id="coordinates"
          name="coordinates"
          value={coordinates}
          type="hidden"
        />

        {/* Duplicate detection modal */}
        <Dialog 
          open={showDuplicateModal} 
          onClose={handleCancel}
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
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3,
                fontSize: '1rem',
                '& .MuiAlert-message': {
                  fontWeight: 500
                }
              }}
            >
              There is/are technical assessment(s) within {DUPLICATE_RADIUS_METERS} meters of this location.
              <br />
              <strong>Is this the same RE System as any of the following?</strong>
            </Alert>
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
                          <strong>Coordinates:</strong> {dup.coordinates?.[1]}, {dup.coordinates?.[0]}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Alert 
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
              <strong>Warning:</strong> Creating a duplicate inventory may cause data conflicts. 
              Consider canceling if this is the same system, or proceed only if you're certain this is a different installation.
            </Alert>
          </DialogContent>
          <DialogActions sx={{ gap: 2, p: 2, flexDirection: 'row-reverse' }}>
            <Button 
              onClick={handleCancel} 
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

      {/* Help Modal */}
      <InventoryHelpModal
        open={openHelpModal}
        onClose={() => setOpenHelpModal(false)}
        formType="new"
      />
    </Container>
  );
};

export default NewInventoryForm;