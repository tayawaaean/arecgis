import React from 'react';
import {
  Drawer,
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
  Box,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  ClearAll as ClearAllIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { FadeLoader } from 'react-spinners';
import { rawGeothermalUsage } from '../../config/techAssesment';

const FilterDrawer = ({ 
  openDrawer, 
  handleDrawerClose, 
  category, 
  filters, 
  solarUsageFilter, 
  biomassUsageFilter,
  windUsageFilter,
  geothermalUsageFilter,
  solarProvince, 
  solarProvFilter, 
  biomassProvince, 
  bioProvFilter, 
  windProvince, 
  windProvFilter, 
  geothermalProvince,
  geoProvFilter,
  rawSolarUsage, 
  rawBiomassPriUsage, 
  rawWindUsage, 
  rawGeothermalUsage,
  handleChange, 
  onSolarChecked, 
  onBiomassChecked, 
  onWindChecked, 
  onGeothermalChecked,
  onChangeSolarProv, 
  onChangeBioProv, 
  onChangeWindProv, 
  onChangeGeothermalProv,
  clearAll 
}) => {
  const theme = useTheme();
  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300,
      },
    },
  };

  return (
    <Drawer
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
          <Typography variant="h6" gutterBottom>
            RE categories
          </Typography>
          <FormGroup>
            {category.map((type, index) => (
              <div key={index}>
                <FormControlLabel
                  label={type.contName}
                  key={index}
                  control={
                    <Checkbox
                      checked={type.checked}
                      indeterminate={type.contName === 'Solar Energy' ? (rawSolarUsage.map(item => solarUsageFilter.indexOf(item.name)).includes(-1)) || (solarProvince.map(item => solarProvFilter.indexOf(item)).includes(-1)) :
                        type.contName === 'Biomass' ? (rawBiomassPriUsage.map(item => biomassUsageFilter.indexOf(item.name)).includes(-1)) || (biomassProvince.map(item => bioProvFilter.indexOf(item)).includes(-1)) :
                          type.contName === 'Wind Energy' ? (rawWindUsage.map(item => windUsageFilter.indexOf(item.name)).includes(-1)) || (windProvince.map(item => windProvFilter.indexOf(item)).includes(-1)) :
                            type.contName === 'Geothermal Energy' ? (rawGeothermalUsage.map(item => geothermalUsageFilter.indexOf(item.name)).includes(-1)) || (geothermalProvince.map(item => geoProvFilter.indexOf(item)).includes(-1)) : false}
                      onChange={handleChange(type.contName, index)}
                    />
                  }
                />

                {!filters.contNames.includes(type.contName) ?
                  <div>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <Tooltip 
                        title={`Select usage types for ${type.contName}`}
                        placement="top" 
                        arrow
                      >
                        <InputLabel id="multiple-checkbox-label">Select Usage</InputLabel>
                      </Tooltip>
                      {type.contName === 'Solar Energy' ? <Select
                        id="multiple-checkbox"
                        multiple
                        value={solarUsageFilter}
                        onChange={onSolarChecked}
                        input={<OutlinedInput 
                          label="Select Usage" 
                          sx={{ 
                            borderRadius: 2,
                            "&:hover": { borderColor: theme.palette.primary.main }
                          }}
                        />}
                        renderValue={(selected) => selected.join(', ')}
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
                        {rawSolarUsage.map((value, index) => (
                          <MenuItem key={index} value={value.name}>
                            <Checkbox checked={solarUsageFilter.indexOf(value.name) > -1} color="primary" />
                            <ListItemText primary={value.name} />
                          </MenuItem>
                        ))}
                      </Select> : type.contName === 'Biomass' ? <Select
                        id="multiple-checkbox"
                        multiple
                        value={biomassUsageFilter}
                        onChange={onBiomassChecked}
                        input={<OutlinedInput 
                          label="Select Usage" 
                          sx={{ 
                            borderRadius: 2,
                            "&:hover": { borderColor: theme.palette.primary.main }
                          }}
                        />}
                        renderValue={(selected) => selected.join(', ')}
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
                        {rawBiomassPriUsage.map((value, index) => (
                          <MenuItem key={index} value={value.name}>
                            <Checkbox checked={biomassUsageFilter.indexOf(value.name) > -1} color="primary" />
                            <ListItemText primary={value.name} />
                          </MenuItem>
                        ))}
                      </Select> : type.contName === 'Wind Energy' ? <Select
                        id="multiple-checkbox"
                        multiple
                        value={windUsageFilter}
                        onChange={onWindChecked}
                        input={<OutlinedInput 
                          label="Select Usage" 
                          sx={{ 
                            borderRadius: 2,
                            "&:hover": { borderColor: theme.palette.primary.main }
                          }}
                        />}
                        renderValue={(selected) => selected.join(', ')}
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
                        {rawWindUsage.map((value, index) => (
                          <MenuItem key={index} value={value.name}>
                            <Checkbox checked={windUsageFilter.indexOf(value.name) > -1} color="primary" />
                            <ListItemText primary={value.name} />
                          </MenuItem>
                        ))}
                      </Select> : type.contName === 'Geothermal Energy' ? <Select
                        id="multiple-checkbox"
                        multiple
                        value={geothermalUsageFilter}
                        onChange={onGeothermalChecked}
                        input={<OutlinedInput 
                          label="Select Usage" 
                          sx={{ 
                            borderRadius: 2,
                            "&:hover": { borderColor: theme.palette.primary.main }
                          }}
                        />}
                        renderValue={(selected) => selected.join(', ')}
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
                        {rawGeothermalUsage.map((value, index) => (
                          <MenuItem key={index} value={value.name}>
                            <Checkbox checked={geothermalUsageFilter.indexOf(value.name) > -1} color="primary" />
                            <ListItemText primary={value.name} />
                          </MenuItem>
                        ))}
                      </Select> : type.contName === 'Hydropower' ? <Select
                        id="multiple-checkbox"
                        multiple
                        value={['not available']}
                        onChange={onWindChecked}
                        input={<OutlinedInput 
                          label="Not yet available" 
                          sx={{ 
                            borderRadius: 2,
                            "&:hover": { borderColor: theme.palette.primary.main }
                          }}
                        />}
                        renderValue={(selected) => selected.join(', ')}
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
                        <MenuItem key={Math.random()} value={['not available']}>
                          <Checkbox checked={true} color="primary" />
                          <ListItemText primary="Not yet available" />
                        </MenuItem>
                      </Select> : ''}

                    </FormControl>
                  </div>
                  : null}

                {!filters.contNames.includes(type.contName) ? <div>
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <Tooltip 
                      title={`Select cities/municipalities for ${type.contName}`}
                      placement="top" 
                      arrow
                    >
                      <InputLabel id="multiple-checkbox-label">Select City/Municipality</InputLabel>
                    </Tooltip>
                    {type.contName === 'Solar Energy' && solarProvFilter ? <Select
                      id="demo-multiple-checkbox"
                      multiple
                      value={solarProvFilter}
                      onChange={onChangeSolarProv}
                      input={<OutlinedInput 
                        label="Select City/Municipality" 
                        sx={{ 
                          borderRadius: 2,
                          "&:hover": { borderColor: theme.palette.primary.main }
                        }}
                      />}
                      renderValue={(selected) => selected.join(', ')}
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
                      {solarProvince.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={solarProvFilter.indexOf(name) > -1} color="primary" />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                      : type.contName === 'Biomass' ? <Select
                        id="demo-multiple-checkbox"
                        multiple
                        value={bioProvFilter}
                        onChange={onChangeBioProv}
                        input={<OutlinedInput 
                          label="Select City/Municipality" 
                          sx={{ 
                            borderRadius: 2,
                            "&:hover": { borderColor: theme.palette.primary.main }
                          }}
                        />}
                        renderValue={(selected) => selected.join(', ')}
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
                        {biomassProvince.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={bioProvFilter.indexOf(name) > -1} color="primary" />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select> : type.contName === 'Wind Energy' ? <Select
                        id="demo-multiple-checkbox"
                        multiple
                        value={windProvFilter}
                        onChange={onChangeWindProv}
                        input={<OutlinedInput 
                          label="Select City/Municipality" 
                          sx={{ 
                            borderRadius: 2,
                            "&:hover": { borderColor: theme.palette.primary.main }
                          }}
                        />}
                        renderValue={(selected) => selected.join(', ')}
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
                        {windProvince.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={windProvFilter.indexOf(name) > -1} color="primary" />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select> : type.contName === 'Geothermal Energy' ? <Select
                        id="demo-multiple-checkbox"
                        multiple
                        value={geoProvFilter}
                        onChange={onChangeGeothermalProv}
                        input={<OutlinedInput 
                          label="Select City/Municipality" 
                          sx={{ 
                            borderRadius: 2,
                            "&:hover": { borderColor: theme.palette.primary.main }
                          }}
                        />}
                        renderValue={(selected) => selected.join(', ')}
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
                            "&:hover fieldset": { borderColor: theme.palette.primary.main }
                          }
                        }}
                      >
                        {geothermalProvince.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={geoProvFilter.indexOf(name) > -1} color="primary" />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select> : <FadeLoader height={10} color={"#fffdd0"} />
                    }

                  </FormControl>
                </div> : null}

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
          onClick={clearAll}
          sx={{
            borderRadius: 2,
            "&:hover": { 
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main
            }
          }}
        >
          Clear All
        </Button>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;