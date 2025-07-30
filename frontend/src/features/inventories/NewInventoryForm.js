import React, { useState, useEffect } from "react";
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
import { Upload as UploadFileIcon, MyLocation as MyLocationIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Coordinates } from "../../components/Coordinates";
import { Solar } from "../categories/Solar";
import { Wind } from "../categories/Wind";
import { Biomass } from "../categories/Biomass";
import { Hydropower } from "../categories/Hydropower";

const DUPLICATE_RADIUS_METERS = 100; // Should match backend value!

const NewInventoryForm = ({ allUsers }) => {
  const [addNewInventory, { isLoading, isSuccess, isError, error }] = useAddNewInventoryMutation();
  const navigate = useNavigate();
  const { username, isManager, isAdmin } = useAuth();

  // USER
  const getUserId = allUsers.filter((user) => user.username === username);
  const getFilteredID = Object.values(getUserId).map((user) => user.id).toString();

  // FORM STATES
  const year = new Date().getFullYear();
  const years = Array.from(new Array(124), (val, index) => year - index);

  const GEOCODE_URL =
    "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=";

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
  const [reClass, setReClass] = useState(["Non-Commercial"]);
  const [reCat, setReCat] = useState(["Solar Energy"]);
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

  // DUPLICATE DETECTION STATES
  const [potentialDuplicates, setPotentialDuplicates] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [forceCreate, setForceCreate] = useState(false);
  const [lastFormData, setLastFormData] = useState(null);

  useEffect(() => {
    if (!isManager || !isAdmin) {
      setUserId(getFilteredID);
    }
  }, [getFilteredID]);

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
      setType([]);
      setReCat([]);
      setReClass([]);
      setYearEst("");
      setAcquisition([]);
      setUserId("");
      setSolar([]);
      setIsOwnUse(null);
      setIsNetMetered(null);
      navigate("/dashboard/inventories");
    }
  }, [isSuccess, navigate]);

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
  const onReClassChanged = (e) => setReClass(e.target.value);
  const onReCatChanged = (e) => setReCat(e.target.value);
  const onAquisitionChanged = (e) => setAcquisition(e.target.value);
  const onYearEstChanged = (e) => setYearEst(e.target.value);

  const reverseGeoCoding = async (coordinates) => {
    const data = await (
      await fetch(GEOCODE_URL + `${coordinates.lng},${coordinates.lat}`)
    ).json();
    if (data.address !== undefined) {
      setBrgy(data.address.Neighborhood);
      setCity(data.address.City);
      setProvince(data.address.Subregion);
      setRegion(data.address.Region);
      setCountry(data.address.CntryName);
      setLat(coordinates?.lat);
      setLng(coordinates?.lng);
      setCoordinates([coordinates?.lng, coordinates?.lat]);
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
    filesCount <= 3;

  // ----------- DUPLICATE DETECTION HANDLING -----------------
  const onSaveInventoryClicked = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("user", userId);
    data.append("type", type);
    // Send coordinates as GeoJSON for backend detection!
    data.append("coordinates[type]", "Point");
    data.append("coordinates[coordinates][]", lng);
    data.append("coordinates[coordinates][]", lat);
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
    if (reCat == "Solar Energy") {
      if (solar?.solarUsage === "Solar Street Lights") {
        const items = solar?.solarStreetLights;
        for (let i = 0; i < items.length; i++) {
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
      }
      data.append("assessment[remarks]", solar.remarks);
      data.append("assessment[status]", solar.status);
      data.append("assessment[solarUsage]", solar.solarUsage);
    }
    if (reCat == "Wind Energy") {
      if (wind?.windUsage === "Water pump") {
        data.append("assessment[serviceArea]", wind.serviceArea);
      }
      data.append("assessment[capacity]", wind.capacity);
      data.append("assessment[windUsage]", wind.windUsage);
      data.append("assessment[remarks]", wind.remarks);
      data.append("assessment[status]", wind.status);
    }
    if (reCat == "Biomass") {
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
    if (reCat == "Hydropower") {
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
                <Typography component="h1" variant="h5">
                  New Inventory
                </Typography>
              </Grid>
              <Grid item key="2">
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
                {allUsers.map((users) => (
                  <MenuItem key={users.id} value={users.id}>
                    {users.username}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              ""
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
                    />
                  }
                  label="No"
                  sx={{ ml: 2 }}
                />
              </Box>
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
                    />
                  }
                  label="No"
                  sx={{ ml: 2 }}
                />
              </Box>
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
              type="text"
              value={region}
              onChange={onRegionChanged}
            />
            <TextField
              fullWidth
              size="small"
              label="Province"
              id="province"
              name="properties.address.province"
              type="text"
              value={province}
              onChange={onProvinceChanged}
            />
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
              id="lng"
              name="properties.address.brgy"
              type="text"
              value={brgy}
              onChange={onBrgyChanged}
            />
          </Box>

          {reCat === null ? null : reCat == "Solar Energy" ? (
            <Solar setSolar={setSolar} />
          ) : reCat == "Wind Energy" ? (
            <Wind setWind={setWind} />
          ) : reCat == "Biomass" ? (
            <Biomass setBiomass={setBiomass} />
          ) : reCat == "Hydropower" ? (
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
          className={`form__input}`}
          id="coordinates"
          name="coordinates"
          value={coordinates}
          type="hidden"
        />

        {/* Duplicate detection modal */}
        <Dialog open={showDuplicateModal} onClose={handleCancel}>
          <DialogTitle>Potential Duplicate Detected</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              There is/are technical assessment(s) within {DUPLICATE_RADIUS_METERS} meters of this location.
              <br />
              Is this the same RE System as any of the following?
            </Alert>
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
            <Alert severity="info" sx={{ mt: 2 }}>
              If you wish to proceed with creating a new inventory at this location, click "Proceed Anyway".
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleProceedAnyway} color="success" variant="contained">
              Proceed Anyway
            </Button>
            <Button onClick={handleCancel} color="secondary" variant="outlined">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </Container>
  );
};

export default NewInventoryForm;