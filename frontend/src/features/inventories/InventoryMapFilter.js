import React, { useState } from 'react';
import { useInventoryFilter } from './inventoryFilterContext';
import { reCats } from '../../config/reCats';
import { rawSolarUsage, rawBiomassPriUsage, rawWindUsage, Status } from '../../config/techAssesment';
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
  Close as CloseIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectAllInventories } from './inventoriesApiSlice';

const InventoryMapFilter = () => {
  const [openDrawer, setDrawer] = useState(false);
  const inventories = useSelector(selectAllInventories);
  
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
    setSolarUsageFilter(typeof value === 'string' ? value.split(',') : value);
  };
  
  const onSolarSystemTypeChecked = (event) => {
    const { target: { value } } = event;
    setSolarSystemTypeFilter(typeof value === 'string' ? value.split(',') : value);
  };
  
  const onBiomassChecked = (event) => {
    const { target: { value } } = event;
    setBiomassUsageFilter(typeof value === 'string' ? value.split(',') : value);
  };
  
  const onWindChecked = (event) => {
    const { target: { value } } = event;
    setWindUsageFilter(typeof value === 'string' ? value.split(',') : value);
  };
  
  const onStatusFilterChanged = (event) => {
    const { target: { value } } = event;
    setStatusFilter(typeof value === 'string' ? value.split(',') : value);
  };
  
  return (
    <>
      <Tooltip title="Filter settings" placement="left-start">
        <button className="leaflet-control-layers controlStyle" aria-label="place-icon" onClick={handleDrawerOpen}>
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
          <IconButton onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <div>
            <TextField
              fullWidth
              size="small"
              label="Filter by City/Municipality"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {/* Uploader filter UI - Now properly populated with uploader options */}
            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <InputLabel id="uploader-filter-label">Filter by Uploader</InputLabel>
              <Select
                labelId="uploader-filter-label"
                id="uploader-filter"
                multiple
                value={uploaderFilter}
                onChange={e =>
                  setUploaderFilter(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)
                }
                input={<OutlinedInput label="Filter by Uploader" />}
                renderValue={selected => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {uploaderOptions.map((name, idx) => (
                  <MenuItem key={idx} value={name}>
                    <Checkbox checked={uploaderFilter.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Typography variant="h6" gutterBottom>
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
                        indeterminate={
                          type.contName === 'Solar Energy'
                            ? (rawSolarUsage.map(item => solarUsageFilter.indexOf(item.name)).includes(-1))
                            : type.contName === 'Biomass'
                            ? (rawBiomassPriUsage.map(item => biomassUsageFilter.indexOf(item.name)).includes(-1))
                            : type.contName === 'Wind Energy'
                            ? (rawWindUsage.map(item => windUsageFilter.indexOf(item.name)).includes(-1))
                            : false
                        }
                        onChange={() => handleCategoryChange(type.contName, index)}
                      />
                    }
                  />
                  {!filters.contNames.includes(type.contName) && (
                    <div>
                      <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="multiple-checkbox-label">Select Usage</InputLabel>
                        {type.contName === 'Solar Energy' ? (
                          <>
                            <Select
                              size="small"
                              id="solar-usage-checkbox"
                              multiple
                              value={solarUsageFilter}
                              onChange={onSolarChecked}
                              input={<OutlinedInput label="Select Usage" />}
                              renderValue={(selected) => selected.join(', ')}
                              MenuProps={MenuProps}
                            >
                              {rawSolarUsage.map((value, idx) => (
                                <MenuItem key={idx} value={value.name}>
                                  <Checkbox checked={solarUsageFilter.indexOf(value.name) > -1} />
                                  <ListItemText primary={value.name} />
                                </MenuItem>
                              ))}
                            </Select>
                            {/* Show Solar System Type filter only if "Power Generation" is selected */}
                            {solarUsageFilter.includes("Power Generation") && (
                            <FormControl sx={{ marginTop: 2, width: 300 }}>
                              <InputLabel id="solar-system-type-label">Solar System Type</InputLabel>
                              <Select
                                size="small"
                                labelId="solar-system-type-label"
                                id="solar-system-type-checkbox"
                                multiple
                                value={solarSystemTypeFilter}
                                onChange={onSolarSystemTypeChecked}
                                input={<OutlinedInput label="Solar System Type" />}
                                renderValue={selected => selected.join(', ')}
                                MenuProps={MenuProps}
                              >
                                {["Hybrid", "Off-grid", "Grid-tied"].map(type => (
                                  <MenuItem key={type} value={type}>
                                    <Checkbox checked={solarSystemTypeFilter.indexOf(type) > -1} />
                                    <ListItemText primary={type} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}

                          {/* Status */}
                          <FormControl sx={{ marginTop: 2, width: 300 }}>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                              size="small"
                              labelId="status-label"
                              id="status-select"
                              multiple
                              value={statusFilter}
                              onChange={onStatusFilterChanged}
                              input={<OutlinedInput label="Status" />}
                              renderValue={(selected) => selected.join(', ')}
                              MenuProps={MenuProps}
                            >
                              {Status.map((value, idx) => (
                                <MenuItem key={idx} value={value.name}>
                                  <Checkbox checked={statusFilter.indexOf(value.name) > -1} />
                                  <ListItemText primary={value.name} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          
                          {/* Net Metered */}
                          <FormControl sx={{ marginTop: 2, width: 300 }}>
                            <InputLabel id="net-metered-label">Net Metered</InputLabel>
                            <Select
                              size="small"
                              labelId="net-metered-label"
                              id="net-metered-select"
                              multiple
                              value={netMeteredFilter}
                              onChange={e =>
                                setNetMeteredFilter(
                                  typeof e.target.value === 'string'
                                    ? e.target.value.split(',')
                                    : e.target.value
                                )
                              }
                              input={<OutlinedInput label="Net Metered" />}
                              renderValue={selected => selected.join(', ')}
                              MenuProps={MenuProps}
                            >
                              <MenuItem value="Yes">
                                <Checkbox checked={netMeteredFilter.indexOf('Yes') > -1} />
                                <ListItemText primary="Yes" />
                              </MenuItem>
                              <MenuItem value="No">
                                <Checkbox checked={netMeteredFilter.indexOf('No') > -1} />
                                <ListItemText primary="No" />
                              </MenuItem>
                            </Select>
                          </FormControl>
                          
                          {/* Own Use */}
                          <FormControl sx={{ marginTop: 2, width: 300 }}>
                            <InputLabel id="own-use-label">Own Use</InputLabel>
                            <Select
                              size="small"
                              labelId="own-use-label"
                              id="own-use-select"
                              multiple
                              value={ownUseFilter}
                              onChange={e =>
                                setOwnUseFilter(
                                  typeof e.target.value === 'string'
                                    ? e.target.value.split(',')
                                    : e.target.value
                                )
                              }
                              input={<OutlinedInput label="Own Use" />}
                              renderValue={selected => selected.join(', ')}
                              MenuProps={MenuProps}
                            >
                              <MenuItem value="Yes">
                                <Checkbox checked={ownUseFilter.indexOf('Yes') > -1} />
                                <ListItemText primary="Yes" />
                              </MenuItem>
                              <MenuItem value="No">
                                <Checkbox checked={ownUseFilter.indexOf('No') > -1} />
                                <ListItemText primary="No" />
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </>
                      ) : type.contName === 'Biomass' ? (
                        <Select
                          size="small"
                          id="biomass-usage-checkbox"
                          multiple
                          value={biomassUsageFilter}
                          onChange={onBiomassChecked}
                          input={<OutlinedInput label="Select Usage" />}
                          renderValue={selected => selected.join(', ')}
                          MenuProps={MenuProps}
                        >
                          {rawBiomassPriUsage.map((value, idx) => (
                            <MenuItem key={idx} value={value.name}>
                              <Checkbox checked={biomassUsageFilter.indexOf(value.name) > -1} />
                              <ListItemText primary={value.name} />
                            </MenuItem>
                          ))}
                        </Select>
                      ) : type.contName === 'Wind Energy' ? (
                        <Select
                          size="small"
                          id="wind-usage-checkbox"
                          multiple
                          value={windUsageFilter}
                          onChange={onWindChecked}
                          input={<OutlinedInput label="Select Usage" />}
                          renderValue={selected => selected.join(', ')}
                          MenuProps={MenuProps}
                        >
                          {rawWindUsage.map((value, idx) => (
                            <MenuItem key={idx} value={value.name}>
                              <Checkbox checked={windUsageFilter.indexOf(value.name) > -1} />
                              <ListItemText primary={value.name} />
                            </MenuItem>
                          ))}
                        </Select>
                      ) : type.contName === 'Hydropower' ? (
                        <Select
                          size="small"
                          id="hydro-usage-checkbox"
                          multiple
                          value={['not available']}
                          onChange={onWindChecked}
                          input={<OutlinedInput label="Not yet available" />}
                          renderValue={selected => selected.join(', ')}
                          MenuProps={MenuProps}
                        >
                          <MenuItem key="hydro" value={['not available']}>
                            <Checkbox checked={true} />
                            <ListItemText primary={['not available']} />
                          </MenuItem>
                        </Select>
                      ) : null}
                    </FormControl>
                  </div>
                )}
              </div>
            ))}
          </FormGroup>
        </div>
      </Stack>
      <Box sx={{ p: 3 }}>
        <Button
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="outlined"
          startIcon={<ClearAllIcon />}
          onClick={clearAllFilters}
        >
          Clear All
        </Button>
      </Box>
    </Drawer>
  </>
  );
};

export default InventoryMapFilter;