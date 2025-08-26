import React, { useState } from 'react';
import { useInventoryFilter } from './inventoryFilterContext';
import { reCats } from '../../config/reCats';
import { rawSolarUsage, rawBiomassPriUsage, rawWindUsage, Status, rawSolarSysTypes } from '../../config/techAssesment';
import {
  Drawer,
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Button,
  TextField,
  Tooltip
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  ClearAll as ClearAllIcon,
  Circle as CircleIcon,
  Close as CloseIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectAllInventories } from './inventoriesApiSlice';
import { useTheme } from '@mui/material/styles';
import MapFilterHelpModal from '../../components/MapFilterHelpModal';

const InventoryMapFilter = () => {
  const [openDrawer, setDrawer] = useState(false);
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const inventories = useSelector(selectAllInventories);
  const theme = useTheme();
  
  // Get all filter state and functions from context
  const {
    category,
    query,
    filters,
    uploaderFilter,
    solarUsageFilter,
    statusFilter,
    biomassUsageFilter,
    windUsageFilter,
    netMeteredFilter,
    ownUseFilter,
    solarSystemTypeFilter,
    solarProvFilter,
    bioProvFilter,
    windProvFilter,
    usersByAffiliation,
    availableAffiliations,
    commercialFilter,
    capacityFilter,
    installersGroup,
    
    setQuery,
    setUploaderFilter,
    setSolarUsageFilter,
    setStatusFilter,
    setBiomassUsageFilter,
    setWindUsageFilter,
    setNetMeteredFilter,
    setOwnUseFilter,
    setSolarSystemTypeFilter,
    setSolarProvFilter,
    setBioProvFilter,
    setWindProvFilter,
    setCommercialFilter,
    setCapacityFilter,
    
    clearAllFilters,
    handleCategoryChange,
    contNames
  } = useInventoryFilter();

  // Extract unique uploader names from inventory data
  const uploaderOptions = React.useMemo(() => {
    if (!inventories || inventories.length === 0) return [];
    return [...new Set(inventories.map(inv => inv.username).filter(Boolean))];
  }, [inventories]);

  const handleDrawerOpen = () => {
    setDrawer(true);
  };
  
  const handleDrawerClose = () => {
    setDrawer(false);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const onSolarChecked = (event) => {
    const { target: { value } } = event;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    
    // Filter out "all" value since we handle it in the onClick
    const filteredValue = newValue.filter(v => v !== "all");
    setSolarUsageFilter(filteredValue);
  };
  
  const onSolarSystemTypeChecked = (event) => {
    const { target: { value } } = event;
    setSolarSystemTypeFilter(typeof value === 'string' ? value.split(',') : value);
  };
  
  const onBiomassChecked = (event) => {
    const { target: { value } } = event;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    
    // Filter out "all" value since we handle it in the onClick
    const filteredValue = newValue.filter(v => v !== "all");
    setBiomassUsageFilter(filteredValue);
  };
  
  const onWindChecked = (event) => {
    const { target: { value } } = event;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    
    // Filter out "all" value since we handle it in the onClick
    const filteredValue = newValue.filter(v => v !== "all");
    setWindUsageFilter(filteredValue);
  };
  
  const onStatusFilterChanged = (event) => {
    const { target: { value } } = event;
    setStatusFilter(typeof value === 'string' ? value.split(',') : value);
  };

  // Helper function to handle affiliation selection
  const handleAffiliationSelect = (affiliation) => {
    const usersInAffiliation = usersByAffiliation[affiliation] || [];
    const usernames = usersInAffiliation.map(user => user.username);
    
    // Check if all users in this affiliation are already selected
    const allSelected = usernames.every(username => uploaderFilter.includes(username));
    
    if (allSelected) {
      // Remove all users from this affiliation
      const newFilter = uploaderFilter.filter(username => !usernames.includes(username));
      setUploaderFilter(newFilter);
    } else {
      // Add all users from this affiliation
      const newFilter = [...new Set([...uploaderFilter, ...usernames])];
      setUploaderFilter(newFilter);
    }
  };

  // Helper function to check if entire affiliation is selected
  const isAffiliationSelected = (affiliation) => {
    const usersInAffiliation = usersByAffiliation[affiliation] || [];
    const usernames = usersInAffiliation.map(user => user.username);
    const result = usernames.length > 0 && usernames.every(username => uploaderFilter.includes(username));
    return result;
  };

  // Helper function to check if affiliation is partially selected
  const isAffiliationPartiallySelected = (affiliation) => {
    const usersInAffiliation = usersByAffiliation[affiliation] || [];
    const usernames = usersInAffiliation.map(user => user.username);
    const result = usernames.some(username => uploaderFilter.includes(username)) && 
           !usernames.every(username => uploaderFilter.includes(username));
    return result;
  };

  // Helper function to handle installer selection
  const handleInstallersSelect = () => {
    const usernames = installersGroup.map(user => user.username);
    
    // Check if all installers are already selected
    const allSelected = usernames.every(username => uploaderFilter.includes(username));
    
    if (allSelected) {
      // Remove all installers
      const newFilter = uploaderFilter.filter(username => !usernames.includes(username));
      setUploaderFilter(newFilter);
    } else {
      // Add all installers
      const newFilter = [...new Set([...uploaderFilter, ...usernames])];
      setUploaderFilter(newFilter);
    }
  };

  // Helper function to check if all installers are selected
  const isInstallersSelected = () => {
    const usernames = installersGroup.map(user => user.username);
    const result = usernames.length > 0 && usernames.every(username => uploaderFilter.includes(username));
    return result;
  };

  // Helper function to check if installers are partially selected
  const isInstallersPartiallySelected = () => {
    const usernames = installersGroup.map(user => user.username);
    const result = usernames.some(username => uploaderFilter.includes(username)) && 
           !usernames.every(username => uploaderFilter.includes(username));
    return result;
  };
  
  return (
    <>
      <Tooltip title="Open map filters" placement="left-start">
        <button className="leaflet-control-layers controlStyle" aria-label="open map filters" onClick={handleDrawerOpen}>
          <FilterListIcon fontSize="small" />
        </button>
      </Tooltip>
      
      <Drawer
        slotProps={{ backdrop: { invisible: true } }}
        anchor="right"
        open={openDrawer}
        onClose={handleDrawerClose}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="h6" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <Box display="flex" alignItems="center">
            <Tooltip title="Help with map filters" placement="top" arrow>
              <IconButton 
                onClick={() => setOpenHelpModal(true)}
                size="small"
                sx={{ mr: 1 }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ p: 3 }}>
          <TextField
            size="small"
            label="Filter by City/Municipality"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ width: 250 }}
          />
          {/* Uploader Filter */}
          <FormControl size="small" sx={{ width: 350 }}>
              <Tooltip 
                title="Filter data by specific uploaders or user affiliations" 
                placement="top" 
                arrow
              >
                <InputLabel id="uploader-filter-label">👤 Filter by Uploader</InputLabel>
              </Tooltip>
              <Select
                labelId="uploader-filter-label"
                id="uploader-filter"
                multiple
                value={uploaderFilter}
                onChange={e => {
                  const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                  // onChange handled
                  
                  // Don't handle "all" here since we're handling it in the checkbox onClick
                  // Just filter out "all" and set the filter
                  const filteredValue = value.filter(v => v !== "all");
                  setUploaderFilter(filteredValue);
                }}
                input={<OutlinedInput 
                  label="👤 Filter by Uploader" 
                  sx={{ 
                    borderRadius: 2,
                    "&:hover": { borderColor: theme.palette.primary.main }
                  }}
                />}
                renderValue={selected => {
                  if (selected.includes("all")) {
                    return "All Uploaders";
                  } else if (selected.length === 0) {
                    return "Select Uploaders";
                  } else {
                    return `${selected.length} users selected`;
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 400,
                      width: 400,
                    },
                  },
                }}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
                  }
                }}
              >
                {/* All Uploaders Option */}
                <MenuItem value="all">
                  <Checkbox 
                    checked={uploaderFilter.includes("all")} 
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (uploaderFilter.includes("all")) {
                        setUploaderFilter([]);
                      } else {
                        setUploaderFilter(["all"]);
                      }
                    }}
                  />
                  <ListItemText primary="All Uploaders" />
                </MenuItem>
                
                {/* Divider between All Uploaders and sections */}
                <Divider sx={{ my: 1, borderColor: '#e0e0e0' }} />
                
                {/* Installers Section - Show first for easy access */}
                {installersGroup.length > 0 && [
                  /* Installers header - NOT selectable, just for grouping */
                  <MenuItem 
                    key="installers-header" 
                    sx={{ 
                      backgroundColor: '#e3f2fd', 
                      fontWeight: 'bold',
                      borderBottom: '1px solid #2196f3',
                      color: '#1976d2',
                      cursor: 'default',
                      '&:hover': { backgroundColor: '#e3f2fd' }
                    }}
                  >
                    <Checkbox 
                      checked={isInstallersSelected()}
                      indeterminate={isInstallersPartiallySelected()}
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInstallersSelect();
                      }}
                    />
                    <ListItemText 
                      primary={`🏗️ Installers (${installersGroup.length} companies)`}
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                  </MenuItem>,
                  /* Individual installers */
                  ...installersGroup.map((user) => (
                    <MenuItem 
                      key={`installer-${user.username}`} 
                      value={user.username}
                      sx={{ pl: 4, backgroundColor: '#f8f9fa' }}
                    >
                      <Checkbox 
                        checked={uploaderFilter.includes("all") || uploaderFilter.includes(user.username)} 
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (uploaderFilter.includes(user.username)) {
                            setUploaderFilter(prev => prev.filter(u => u !== user.username));
                          } else {
                            setUploaderFilter(prev => [...prev, user.username]);
                          }
                        }}
                      />
                      <ListItemText 
                        primary={user.displayName || user.fullName}
                        secondary={user.displaySecondary || user.username}
                      />
                    </MenuItem>
                  )),
                  /* Divider between installers and affiliations */
                  <Divider key="installers-divider" sx={{ my: 1, borderColor: '#e0e0e0' }} />
                ]}
                
                {/* Affiliations Section */}
                {availableAffiliations.flatMap((affiliation) => {
                  const usersInAffiliation = usersByAffiliation[affiliation] || [];
                  const affiliationSelected = isAffiliationSelected(affiliation);
                  const affiliationPartiallySelected = isAffiliationPartiallySelected(affiliation);
                  
                  const affiliationHeader = (
                    <MenuItem 
                      key={`affiliation-${affiliation}`} 
                      sx={{ 
                        backgroundColor: '#f5f5f5', 
                        fontWeight: 'bold',
                        borderBottom: '1px solid #e0e0e0',
                        color: '#1976d2',
                        cursor: 'default',
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                    >
                      <Checkbox 
                        checked={affiliationSelected}
                        indeterminate={affiliationPartiallySelected}
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAffiliationSelect(affiliation);
                        }}
                      />
                      <ListItemText 
                        primary={`${affiliation} (${usersInAffiliation.length} users)`}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </MenuItem>
                  );
                  
                  const affiliationUsers = usersInAffiliation.map((user) => (
                    <MenuItem 
                      key={user.username} 
                      value={user.username}
                      sx={{ pl: 4 }}
                    >
                      <Checkbox 
                        checked={uploaderFilter.includes("all") || uploaderFilter.includes(user.username)} 
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (uploaderFilter.includes(user.username)) {
                            setUploaderFilter(prev => prev.filter(u => u !== user.username));
                          } else {
                            setUploaderFilter(prev => [...prev, user.username]);
                          }
                        }}
                      />
                      <ListItemText 
                        primary={user.displayName || user.fullName}
                        secondary={user.displaySecondary || user.username}
                      />
                    </MenuItem>
                  ));
                  
                  return [affiliationHeader, ...affiliationUsers];
                })}
              </Select>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  mt: 0.5, 
                  display: 'block',
                  fontSize: '0.7rem',
                  fontStyle: 'italic'
                }}
              >
                👥 Filter by specific users or entire affiliations
              </Typography>
            </FormControl>
            
            {/* Commercial Filter */}
            <FormControl size="small" sx={{ width: 350 }}>
              <Tooltip 
                title="Filter by commercial or non-commercial classification" 
                placement="top" 
                arrow
              >
                <InputLabel id="commercial-filter-label">🏢 Classification</InputLabel>
              </Tooltip>
              <Select
                labelId="commercial-filter-label"
                id="commercial-filter"
                value={commercialFilter}
                onChange={(e) => setCommercialFilter(e.target.value)}
                input={<OutlinedInput 
                  label="🏢 Classification" 
                  sx={{ 
                    borderRadius: 2,
                    "&:hover": { borderColor: theme.palette.primary.main }
                  }}
                />}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: theme.palette.primary.main },
                    "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                  }
                }}
              >
                <MenuItem value="All">🌍 All</MenuItem>
                <MenuItem value="Commercial">💼 Commercial</MenuItem>
                <MenuItem value="Non-Commercial">🏠 Non-Commercial</MenuItem>
              </Select>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  mt: 0.5, 
                  display: 'block',
                  fontSize: '0.7rem',
                  fontStyle: 'italic'
                }}
              >
                🏗️ Filter by facility classification type
              </Typography>
            </FormControl>
            
            {/* Capacity Filter */}
            <FormControl size="small" sx={{ width: 350 }}>
              <Tooltip 
                title="Filter by system capacity range in kilowatts (kW)" 
                placement="top" 
                arrow
              >
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  ⚡ Capacity Range (kW)
                </Typography>
              </Tooltip>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  size="small"
                  label="Min Capacity"
                  type="number"
                  variant="outlined"
                  value={capacityFilter.min}
                  onChange={(e) => setCapacityFilter(prev => ({ ...prev, min: e.target.value }))}
                  inputProps={{ 
                    min: 0, 
                    step: 0.1,
                    placeholder: "0.0"
                  }}
                  sx={{ 
                    width: 150,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: theme.palette.primary.main },
                      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                    }
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  to
                </Typography>
                <TextField
                  size="small"
                  label="Max Capacity"
                  type="number"
                  variant="outlined"
                  value={capacityFilter.max}
                  onChange={(e) => setCapacityFilter(prev => ({ ...prev, max: e.target.value }))}
                  inputProps={{ 
                    min: 0, 
                    step: 0.1,
                    placeholder: "1000.0"
                  }}
                  sx={{ 
                    width: 150,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: theme.palette.primary.main },
                      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                    }
                  }}
                />
              </Box>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  mt: 0.5, 
                  display: 'block',
                  fontSize: '0.7rem',
                  fontStyle: 'italic'
                }}
              >
                ⚡ Filter by system capacity range (leave empty for no limit)
              </Typography>
              <Typography 
                variant="caption" 
                color="warning.main" 
                sx={{ 
                  mt: 0.5, 
                  display: 'block',
                  fontSize: '0.7rem',
                  fontStyle: 'italic',
                  fontWeight: 'medium'
                }}
              >
                ⚠️ Note: Capacity filter only applies to Solar Energy systems used for Power Generation
              </Typography>
            </FormControl>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              RE categories
            </Typography>
            
            <FormGroup>
              {category.map((type, index) => (
                <div key={index}>
                  <FormControlLabel
                    label={
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}>
                        <CircleIcon fontSize='small' style={
                          type.contName === "Solar Energy" ? { stroke: '#000', color: '#FFBF00', marginRight: '5px' } :
                          type.contName === "Biomass" ? { stroke: '#000', color: '#947b4f', marginRight: '5px' } :
                          type.contName === "Wind Energy" ? { stroke: '#000', color: '#f3ebe8', marginRight: '5px' } :
                          type.contName === "Hydropower" ? { stroke: '#000', color: '#1e2f97', marginRight: '5px' } :
                          null
                        } />
                        <span>{type.contName}</span>
                      </div>
                    }
                    key={index}
                    control={
                      <Checkbox
                        checked={type.checked}
                        indeterminate={false}
                        onChange={() => handleCategoryChange(type.contName, index)}
                      />
                    }
                  />
                  {filters.contNames.includes(type.contName) && (
                    <div>
                      <FormControl sx={{ m: 1, width: 250 }}>
                        <InputLabel id="multiple-checkbox-label"></InputLabel>
                        {type.contName === 'Solar Energy' ? (
                          <>
                            <FormControl sx={{ marginTop: 2, width: 250 }}>
                            <Tooltip 
                              title="Filter by solar energy usage type" 
                              placement="top" 
                              arrow
                            >
                              <InputLabel id="solar-usage-label">☀️ Select Usage</InputLabel>
                            </Tooltip>
                            <Select
                              size="small"
                              id="solar-usage-checkbox"
                              multiple
                              value={solarUsageFilter}
                              onChange={onSolarChecked}
                              input={<OutlinedInput 
                                label="☀️ Select Usage" 
                                sx={{ 
                                  borderRadius: 2,
                                  "&:hover": { borderColor: theme.palette.primary.main }
                                }}
                              />}
                              renderValue={selected => {
                                if (selected.length === rawSolarUsage.length) {
                                  return "All Usage Types";
                                } else if (selected.length === 0) {
                                  return "Select Usage Types";
                                } else {
                                  return `${selected.length} types selected`;
                                }
                              }}
                              MenuProps={{
                                ...MenuProps,
                                PaperProps: {
                                  style: {
                                    maxHeight: 300,
                                    width: 250,
                                  },
                                },
                              }}
                              sx={{
                                borderRadius: 2,
                                "& .MuiOutlinedInput-root": {
                                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                                }
                              }}
                            >
                              {/* All Usage Types Option */}
                              <MenuItem value="all">
                                <Checkbox 
                                  checked={solarUsageFilter.length === rawSolarUsage.length} 
                                  indeterminate={solarUsageFilter.length > 0 && solarUsageFilter.length < rawSolarUsage.length}
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (solarUsageFilter.length === rawSolarUsage.length) {
                                      setSolarUsageFilter([]);
                                    } else {
                                      setSolarUsageFilter(rawSolarUsage.map(item => item.name));
                                    }
                                  }}
                                />
                                <ListItemText primary="All Usage Types" />
                              </MenuItem>
                              
                              {/* Divider */}
                              <Divider sx={{ my: 1, borderColor: '#e0e0e0' }} />
                              
                              {/* Individual Usage Types */}
                              {rawSolarUsage.map((value, idx) => (
                                <MenuItem key={idx} value={value.name}>
                                  <Checkbox checked={solarUsageFilter.indexOf(value.name) > -1} color="primary" />
                                  <ListItemText primary={value.name} />
                                </MenuItem>
                              ))}
                            </Select>
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                mt: 0.5, 
                                display: 'block',
                                fontSize: '0.7rem',
                                fontStyle: 'italic'
                              }}
                            >
                              ☀️ Filter by solar energy usage type
                            </Typography>
                          </FormControl>

                          {/* Solar System Type Filter */}
                          <FormControl sx={{ marginTop: 2, width: 250 }}>
                            <Tooltip 
                              title="Filter by solar system type" 
                              placement="top" 
                              arrow
                            >
                              <InputLabel id="solar-system-type-label">🔧 System Type</InputLabel>
                            </Tooltip>
                            <Select
                              size="small"
                              id="solar-system-type-checkbox"
                              multiple
                              value={solarSystemTypeFilter}
                              onChange={e => {
                                const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                                const filteredValue = value.filter(v => v !== "all");
                                setSolarSystemTypeFilter(filteredValue);
                              }}
                              input={<OutlinedInput 
                                label="🔧 System Type" 
                                sx={{ 
                                  borderRadius: 2,
                                  "&:hover": { borderColor: theme.palette.primary.main }
                                }}
                              />}
                              renderValue={selected => {
                                if (selected.length === rawSolarSysTypes.length) {
                                  return "All System Types";
                                } else if (selected.length === 0) {
                                  return "Select System Types";
                                } else {
                                  return `${selected.length} types selected`;
                                }
                              }}
                              MenuProps={{
                                ...MenuProps,
                                PaperProps: {
                                  style: {
                                    maxHeight: 300,
                                    width: 300,
                                  },
                                },
                              }}
                              sx={{
                                borderRadius: 2,
                                "& .MuiOutlinedInput-root": {
                                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                                }
                              }}
                            >
                              {/* All System Types Option */}
                              <MenuItem value="all">
                                <Checkbox 
                                  checked={solarSystemTypeFilter.length === rawSolarSysTypes.length} 
                                  indeterminate={solarSystemTypeFilter.length > 0 && solarSystemTypeFilter.length < rawSolarSysTypes.length}
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (solarSystemTypeFilter.length === rawSolarSysTypes.length) {
                                      setSolarSystemTypeFilter([]);
                                    } else {
                                      setSolarSystemTypeFilter(rawSolarSysTypes.map(item => item.name));
                                    }
                                  }}
                                />
                                <ListItemText primary="All System Types" />
                              </MenuItem>
                              
                              {/* Divider */}
                              <Divider sx={{ my: 1, borderColor: '#e0e0e0' }} />
                              
                              {/* Individual System Types */}
                              {rawSolarSysTypes.map((value, idx) => (
                                <MenuItem key={idx} value={value.name}>
                                  <Checkbox checked={solarSystemTypeFilter.indexOf(value.name) > -1} color="primary" />
                                  <ListItemText primary={value.name} />
                                </MenuItem>
                              ))}
                            </Select>
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                mt: 0.5, 
                                display: 'block',
                                fontSize: '0.7rem',
                                fontStyle: 'italic'
                              }}
                            >
                              🔧 Filter by solar system type
                            </Typography>
                          </FormControl>

                          {/* Net Metered Filter */}
                          <FormControl sx={{ marginTop: 2, width: 250 }}>
                            <Tooltip 
                              title="Filter by net metering status" 
                              placement="top" 
                              arrow
                            >
                              <InputLabel id="net-metered-label">⚡ Net Metered</InputLabel>
                            </Tooltip>
                            <Select
                              size="small"
                              id="net-metered-checkbox"
                              multiple
                              value={netMeteredFilter}
                              onChange={e => {
                                const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                                const filteredValue = value.filter(v => v !== "all");
                                setNetMeteredFilter(filteredValue);
                              }}
                              input={<OutlinedInput 
                                label="⚡ Net Metered" 
                                sx={{ 
                                  borderRadius: 2,
                                  "&:hover": { borderColor: theme.palette.primary.main }
                                }}
                              />}
                              renderValue={selected => {
                                if (selected.length === 2) {
                                  return "All Options";
                                } else if (selected.length === 0) {
                                  return "Select Options";
                                } else {
                                  return `${selected.length} options selected`;
                                }
                              }}
                              MenuProps={{
                                ...MenuProps,
                                PaperProps: {
                                  style: {
                                    maxHeight: 300,
                                    width: 300,
                                  },
                                },
                              }}
                              sx={{
                                borderRadius: 2,
                                "& .MuiOutlinedInput-root": {
                                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                                }
                              }}
                            >
                              {/* All Options */}
                              <MenuItem value="all">
                                <Checkbox 
                                  checked={netMeteredFilter.length === 2} 
                                  indeterminate={netMeteredFilter.length === 1}
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (netMeteredFilter.length === 2) {
                                      setNetMeteredFilter([]);
                                    } else {
                                      setNetMeteredFilter(["Yes", "No"]);
                                    }
                                  }}
                                />
                                <ListItemText primary="All Options" />
                              </MenuItem>
                              
                              {/* Divider */}
                              <Divider sx={{ my: 1, borderColor: '#e0e0e0' }} />
                              
                              {/* Individual Options */}
                              <MenuItem value="Yes">
                                <Checkbox checked={netMeteredFilter.includes("Yes")} color="primary" />
                                <ListItemText primary="Yes" />
                              </MenuItem>
                              <MenuItem value="No">
                                <Checkbox checked={netMeteredFilter.includes("No")} color="primary" />
                                <ListItemText primary="No" />
                              </MenuItem>
                            </Select>
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                mt: 0.5, 
                                display: 'block',
                                fontSize: '0.7rem',
                                fontStyle: 'italic'
                              }}
                            >
                              ⚡ Filter by net metering status
                            </Typography>
                          </FormControl>

                          {/* Own Use Filter */}
                          <FormControl sx={{ marginTop: 2, width: 250 }}>
                            <Tooltip 
                              title="Filter by own use status" 
                              placement="top" 
                              arrow
                            >
                              <InputLabel id="own-use-label">🏠 Own Use</InputLabel>
                            </Tooltip>
                            <Select
                              size="small"
                              id="own-use-checkbox"
                              multiple
                              value={ownUseFilter}
                              onChange={e => {
                                const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                                const filteredValue = value.filter(v => v !== "all");
                                setOwnUseFilter(filteredValue);
                              }}
                              input={<OutlinedInput 
                                label="🏠 Own Use" 
                                sx={{ 
                                  borderRadius: 2,
                                  "&:hover": { borderColor: theme.palette.primary.main }
                                }}
                              />}
                              renderValue={selected => {
                                if (selected.length === 2) {
                                  return "All Options";
                                } else if (selected.length === 0) {
                                  return "Select Options";
                                } else {
                                  return `${selected.length} options selected`;
                                }
                              }}
                              MenuProps={{
                                ...MenuProps,
                                PaperProps: {
                                  style: {
                                    maxHeight: 300,
                                    width: 300,
                                  },
                                },
                              }}
                              sx={{
                                borderRadius: 2,
                                "& .MuiOutlinedInput-root": {
                                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                                }
                              }}
                            >
                              {/* All Options */}
                              <MenuItem value="all">
                                <Checkbox 
                                  checked={ownUseFilter.length === 2} 
                                  indeterminate={ownUseFilter.length === 1}
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (ownUseFilter.length === 2) {
                                      setOwnUseFilter([]);
                                    } else {
                                      setOwnUseFilter(["Yes", "No"]);
                                    }
                                  }}
                                />
                                <ListItemText primary="All Options" />
                              </MenuItem>
                              
                              {/* Divider */}
                              <Divider sx={{ my: 1, borderColor: '#e0e0e0' }} />
                              
                              {/* Individual Options */}
                              <MenuItem value="Yes">
                                <Checkbox checked={ownUseFilter.includes("Yes")} color="primary" />
                                <ListItemText primary="Yes" />
                              </MenuItem>
                              <MenuItem value="No">
                                <Checkbox checked={ownUseFilter.includes("No")} color="primary" />
                                <ListItemText primary="No" />
                              </MenuItem>
                            </Select>
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                mt: 0.5, 
                                display: 'block',
                                fontSize: '0.7rem',
                                fontStyle: 'italic'
                              }}
                            >
                              🏠 Filter by own use status
                            </Typography>
                          </FormControl>

                          {/* Status Filter */}
                          <FormControl sx={{ marginTop: 2, width: 250 }}>
                            <Tooltip 
                              title="Filter by operational status" 
                              placement="top" 
                              arrow
                            >
                              <InputLabel id="status-label">🔧 System Status</InputLabel>
                            </Tooltip>
                            <Select
                              size="small"
                              id="status-checkbox"
                              multiple
                              value={statusFilter}
                              onChange={e => {
                                const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                                const filteredValue = value.filter(v => v !== "all");
                                setStatusFilter(filteredValue);
                              }}
                              input={<OutlinedInput 
                                label="🔧 System Status" 
                                sx={{ 
                                  borderRadius: 2,
                                  "&:hover": { borderColor: theme.palette.primary.main }
                                }}
                              />}
                              renderValue={selected => {
                                if (selected.length === Status.length) {
                                  return "All Statuses";
                                } else if (selected.length === 0) {
                                  return "Select Statuses";
                                } else {
                                  return `${selected.length} statuses selected`;
                                }
                              }}
                              MenuProps={{
                                ...MenuProps,
                                PaperProps: {
                                  style: {
                                    maxHeight: 300,
                                    width: 300,
                                  },
                                },
                              }}
                              sx={{
                                borderRadius: 2,
                                "& .MuiOutlinedInput-root": {
                                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                                }
                              }}
                            >
                              {/* All Statuses Option */}
                              <MenuItem value="all">
                                <Checkbox 
                                  checked={statusFilter.length === Status.length} 
                                  indeterminate={statusFilter.length > 0 && statusFilter.length < Status.length}
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (statusFilter.length === Status.length) {
                                      setStatusFilter([]);
                                    } else {
                                      setStatusFilter(Status.map(item => item.name));
                                    }
                                  }}
                                />
                                <ListItemText primary="All Statuses" />
                              </MenuItem>
                              
                              {/* Divider */}
                              <Divider sx={{ my: 1, borderColor: '#e0e0e0' }} />
                              
                              {/* Individual Statuses */}
                              <MenuItem value="Operational">
                                <Checkbox checked={statusFilter.includes("Operational")} color="primary" />
                                <ListItemText primary="Operational" />
                              </MenuItem>
                              <MenuItem value="For Repair">
                                <Checkbox checked={statusFilter.includes("For Repair")} color="primary" />
                                <ListItemText primary="For Repair" />
                              </MenuItem>
                              <MenuItem value="Condemnable">
                                <Checkbox checked={statusFilter.includes("Condemnable")} color="primary" />
                                <ListItemText primary="Condemnable" />
                              </MenuItem>
                            </Select>
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                mt: 0.5, 
                                display: 'block',
                                fontSize: '0.7rem',
                                fontStyle: 'italic'
                              }}
                            >
                              🔧 Filter by system operational status
                            </Typography>
                          </FormControl>
                          </>
                        ) : type.contName === 'Biomass' ? (
                          <FormControl sx={{ marginTop: 2, width: 250 }}>
                            <Tooltip 
                              title="Filter by biomass energy usage type" 
                              placement="top" 
                              arrow
                            >
                              <InputLabel id="biomass-usage-label">🌱 Select Usage</InputLabel>
                            </Tooltip>
                            <Select
                              size="small"
                              id="biomass-usage-checkbox"
                              multiple
                              value={biomassUsageFilter}
                              onChange={onBiomassChecked}
                              input={<OutlinedInput 
                                label="🌱 Select Usage" 
                                sx={{ 
                                  borderRadius: 2,
                                  "&:hover": { borderColor: theme.palette.primary.main }
                                }}
                              />}
                              renderValue={selected => {
                                if (selected.length === rawBiomassPriUsage.length) {
                                  return "All Usage Types";
                                } else if (selected.length === 0) {
                                  return "Select Usage Types";
                                } else {
                                  return `${selected.length} types selected`;
                                }
                              }}
                              MenuProps={{
                                ...MenuProps,
                                PaperProps: {
                                  style: {
                                    maxHeight: 300,
                                    width: 300,
                                  },
                                },
                              }}
                              sx={{
                                borderRadius: 2,
                                "& .MuiOutlinedInput-root": {
                                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                                }
                              }}
                            >
                              {/* All Usage Types Option */}
                              <MenuItem value="all">
                                <Checkbox 
                                  checked={biomassUsageFilter.length === rawBiomassPriUsage.length} 
                                  indeterminate={biomassUsageFilter.length > 0 && biomassUsageFilter.length < rawBiomassPriUsage.length}
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (biomassUsageFilter.length === rawBiomassPriUsage.length) {
                                      setBiomassUsageFilter([]);
                                    } else {
                                      setBiomassUsageFilter(rawBiomassPriUsage.map(item => item.name));
                                    }
                                  }}
                                />
                                <ListItemText primary="All Usage Types" />
                              </MenuItem>
                              
                              {/* Divider */}
                              <Divider sx={{ my: 1, borderColor: '#e0e0e0' }} />
                              
                              {/* Individual Usage Types */}
                              {rawBiomassPriUsage.map((value, idx) => (
                                <MenuItem key={idx} value={value.name}>
                                  <Checkbox checked={biomassUsageFilter.indexOf(value.name) > -1} color="primary" />
                                  <ListItemText primary={value.name} />
                                </MenuItem>
                              ))}
                            </Select>
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                mt: 0.5, 
                                display: 'block',
                                fontSize: '0.7rem',
                                fontStyle: 'italic'
                              }}
                            >
                              🌱 Filter by biomass energy usage type
                            </Typography>
                          </FormControl>
                        ) : type.contName === 'Wind Energy' ? (
                          <FormControl sx={{ marginTop: 2, width: 250 }}>
                            <Tooltip 
                              title="Filter by wind energy usage type" 
                              placement="top" 
                              arrow
                            >
                              <InputLabel id="wind-usage-label">💨 Select Usage</InputLabel>
                            </Tooltip>
                            <Select
                              size="small"
                              id="wind-usage-checkbox"
                              multiple
                              value={windUsageFilter}
                              onChange={onWindChecked}
                              input={<OutlinedInput 
                                label="💨 Select Usage" 
                                sx={{ 
                                  borderRadius: 2,
                                  "&:hover": { borderColor: theme.palette.primary.main }
                                }}
                              />}
                              renderValue={selected => {
                                if (selected.length === rawWindUsage.length) {
                                  return "All Usage Types";
                                } else if (selected.length === 0) {
                                  return "Select Usage Types";
                                } else {
                                  return `${selected.length} types selected`;
                                }
                              }}
                              MenuProps={{
                                ...MenuProps,
                                PaperProps: {
                                  style: {
                                    maxHeight: 300,
                                    width: 300,
                                  },
                                },
                              }}
                              sx={{
                                borderRadius: 2,
                                "& .MuiOutlinedInput-root": {
                                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                                }
                              }}
                            >
                              {/* All Usage Types Option */}
                              <MenuItem value="all">
                                <Checkbox 
                                  checked={windUsageFilter.length === rawWindUsage.length} 
                                  indeterminate={windUsageFilter.length > 0 && windUsageFilter.length < rawWindUsage.length}
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (windUsageFilter.length === rawWindUsage.length) {
                                      setWindUsageFilter([]);
                                    } else {
                                      setWindUsageFilter(rawWindUsage.map(item => item.name));
                                    }
                                  }}
                                />
                                <ListItemText primary="All Usage Types" />
                              </MenuItem>
                              
                              {/* Divider */}
                              <Divider sx={{ my: 1, borderColor: '#e0e0e0' }} />
                              
                              {/* Individual Usage Types */}
                              {rawWindUsage.map((value, idx) => (
                                <MenuItem key={idx} value={value.name}>
                                  <Checkbox checked={windUsageFilter.indexOf(value.name) > -1} color="primary" />
                                  <ListItemText primary={value.name} />
                                </MenuItem>
                              ))}
                            </Select>
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                mt: 0.5, 
                                display: 'block',
                                fontSize: '0.7rem',
                                fontStyle: 'italic'
                              }}
                            >
                              💨 Filter by wind energy usage type
                            </Typography>
                          </FormControl>
                        ) : type.contName === 'Hydropower' ? (
                          <FormControl sx={{ marginTop: 2, width: 250 }}>
                            <Tooltip 
                              title="Hydropower usage options are not yet available" 
                              placement="top" 
                              arrow
                            >
                              <InputLabel id="hydro-usage-label">🌊 Select Usage</InputLabel>
                            </Tooltip>
                            <Select
                              size="small"
                              id="hydro-usage-checkbox"
                              multiple
                              value={['not available']}
                              onChange={onWindChecked}
                              input={<OutlinedInput 
                                label="🌊 Select Usage" 
                                sx={{ 
                                  borderRadius: 2,
                                  "&:hover": { borderColor: theme.palette.primary.main }
                                }}
                              />}
                              renderValue={selected => selected.join(', ')}
                              MenuProps={{
                                ...MenuProps,
                                PaperProps: {
                                  style: {
                                    maxHeight: 300,
                                    width: 250,
                                  },
                                },
                              }}
                              sx={{
                                borderRadius: 2,
                                "& .MuiOutlinedInput-root": {
                                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                                }
                              }}
                            >
                              <MenuItem key="hydro" value={['not available']}>
                                <Checkbox checked={true} color="primary" />
                                <ListItemText primary="Not yet available" />
                              </MenuItem>
                            </Select>
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                mt: 0.5, 
                                display: 'block',
                                fontSize: '0.7rem',
                                fontStyle: 'italic'
                              }}
                            >
                              🌊 Hydropower usage options coming soon
                            </Typography>
                          </FormControl>
                        ) : null}
                    </FormControl>
                  </div>
                )}
              </div>
            ))}
          </FormGroup>
        </Stack>
      <Box sx={{ p: 3 }}>
        <Button
          size="medium"
          type="submit"
          color="inherit"
          variant="outlined"
          startIcon={<ClearAllIcon />}
          onClick={clearAllFilters}
          sx={{ width: 120 }}
        >
          Clear All
        </Button>
      </Box>
    </Drawer>
    <MapFilterHelpModal open={openHelpModal} onClose={() => setOpenHelpModal(false)} />
  </>
  );
};

export default InventoryMapFilter;