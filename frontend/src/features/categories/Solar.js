import React, { useState, useEffect } from 'react'
import { FormLabel, TextField, Input, InputAdornment, Box, Checkbox, FormControlLabel, FormGroup, Typography, Grid, Button, Alert } from '@mui/material'
import { rawSolarUsage, rawSolarSysTypes, Status, rawSolarPowerGenSubcategories, rawSolarPumpSubcategories } from '../../config/techAssesment'
import { boxstyle } from '../../config/style'
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp'

export const Solar = (props) => {
  // Check if this is a commercial RE installation
  const isCommercial = props.reClass === "Commercial";
  // Check if the system is net-metered
  const isNetMetered = props.isNetMetered === true;
  // Check if the system is a Distributed Energy Resource
  const isDer = props.isDer === true;
  // Check if the system is for own use
  const isOwnUse = props.isOwnUse === true;
  
  // Find indexes for auto-selection
  const powerGenerationIndex = rawSolarUsage.findIndex(usage => usage.name === "Power Generation");
  const gridTiedIndex = rawSolarSysTypes.findIndex(type => type.name === "Grid-tied");
  const offGridIndex = rawSolarSysTypes.findIndex(type => type.name === "Off-grid");
  
  // Check if any power generation related option is selected
  const isPowerGenerationRelated = isNetMetered || isDer || isOwnUse;

  const [formValues, setFormValues] = useState([
    { capacity: "", pcs: "" },
  ])

  const [data, setData] = useState([])

  const [capacity, setCapacity] = useState("")
  const [annualEnergyProduction, setAnnualEnergyProduction] = useState("")
  const [batteryCapacity, setBatteryCapacity] = useState("")
  const [solarUsage, setSolarUsage] = useState({
    index: '', value: '', otherVal: ''
  })
  const [solarSystemTypes, setSolarSysTypes] = useState({
    index: '', value: '', otherVal: ''
  })
  const [status, setStatus] = useState({
    index: '', value: '', otherVal: ''
  })
  const [solarPowerGenSubcategory, setSolarPowerGenSubcategory] = useState({
    mainCategory: '',
    subcategory: '',
    mainCategoryId: null,
    subcategoryId: null
  })
  const [solarPumpSubcategory, setSolarPumpSubcategory] = useState('')

  const [remarks, setRemarks] = useState("")
  const [flowRate, setFlowRate] = useState("")
  const [serviceArea, setServiceArea] = useState("")

  // Auto-select Power Generation & Grid-tied for Commercial RE
  useEffect(() => {
    if (isCommercial) {
      // Auto-select Power Generation
      if (powerGenerationIndex !== -1) {
        setSolarUsage({ 
          index: powerGenerationIndex, 
          value: rawSolarUsage[powerGenerationIndex].name,
          otherVal: ''
        });
      }
      
      // Auto-select Grid-tied
      if (gridTiedIndex !== -1) {
        setSolarSysTypes({
          index: gridTiedIndex,
          value: rawSolarSysTypes[gridTiedIndex].name,
          otherVal: ''
        });
      }
    }
  }, [isCommercial, powerGenerationIndex, gridTiedIndex]);

  // Auto-clear Off-grid selection when system becomes net-metered
  useEffect(() => {
    if (isNetMetered && solarSystemTypes?.value === 'Off-grid') {
      setSolarSysTypes({ index: '', value: '', otherVal: '' });
    }
  }, [isNetMetered, solarSystemTypes?.value]);

  // Auto-clear Solar Street Lights and Solar Pump when power generation related options are selected
  useEffect(() => {
    if (isPowerGenerationRelated) {
      const solarStreetLightsIndex = rawSolarUsage.findIndex(usage => usage.name === "Solar Street Lights");
      const solarPumpIndex = rawSolarUsage.findIndex(usage => usage.name === "Solar Pump");
      
      if (solarUsage?.value === "Solar Street Lights" || solarUsage?.value === "Solar Pump") {
        setSolarUsage({ index: '', value: '', otherVal: '' });
      }
      
      // Auto-select Power Generation if not already selected
      if (solarUsage?.value !== "Power Generation" && powerGenerationIndex !== -1) {
        setSolarUsage({ 
          index: powerGenerationIndex, 
          value: rawSolarUsage[powerGenerationIndex].name,
          otherVal: ''
        });
      }
    }
  }, [isPowerGenerationRelated, solarUsage?.value, powerGenerationIndex]);

  useEffect(() => {
    setData({
      ...data,
      solarStreetLights: formValues,
      capacity: capacity,
      flowRate: flowRate,
      serviceArea: serviceArea,
      solarSystemTypes: solarSystemTypes?.value,
      solarUsage: solarUsage?.otherVal === '' ? solarUsage?.value : solarUsage?.otherVal,
      status: status?.value,
      remarks: remarks,
      annualEnergyProduction: solarUsage?.value === "Power Generation" ? annualEnergyProduction : undefined,
      batteryCapacity: (solarSystemTypes?.value === "Off-grid" || solarSystemTypes?.value === "Hybrid") ? batteryCapacity : undefined,
      solarPowerGenSubcategory: solarUsage?.value === "Power Generation" ? solarPowerGenSubcategory : undefined,
      solarPumpSubcategory: solarUsage?.value === "Solar Pump" ? solarPumpSubcategory : undefined,
    })
    
    // Debug logging for solar subcategories
    if (solarUsage?.value === "Power Generation") {
      console.log('Solar component - Setting solar subcategories:', {
        solarUsage: solarUsage?.value,
        solarPowerGenSubcategory,
        data: solarUsage?.value === "Power Generation" ? solarPowerGenSubcategory : undefined
      });
    }
    
    // eslint-disable-next-line
  }, [
    capacity,
    formValues,
    flowRate,
    solarUsage,
    serviceArea,
    solarSystemTypes,
    status,
    remarks,
    annualEnergyProduction,
    batteryCapacity,
    solarPowerGenSubcategory
  ])

  useEffect(() => {
    props.setSolar(data)
    // eslint-disable-next-line
  }, [data])

  const handleChange = (index) => (e) => {
    let newFormValues = [...formValues];
    newFormValues[index][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  }

  const addFormFields = () => {
    setFormValues([...formValues, { capacity: "", pcs: "" }])
  }

  const removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues)
  }

  const valuesOfSolarUsage = (index) => (e) => {
    // If Commercial, only allow Power Generation
    if (isCommercial && index !== powerGenerationIndex) {
      return;
    }
    
    // If power generation related (net-metered, DER, or own-use), don't allow Solar Street Lights or Solar Pump
    if (isPowerGenerationRelated) {
      const solarStreetLightsIndex = rawSolarUsage.findIndex(usage => usage.name === "Solar Street Lights");
      const solarPumpIndex = rawSolarUsage.findIndex(usage => usage.name === "Solar Pump");
      
      if (index === solarStreetLightsIndex || index === solarPumpIndex) {
        return;
      }
    }
    
    if (rawSolarUsage[index].name === 'Other' && e.target.value !== 'on' && e.target.value !== '') {
      setSolarUsage({ index: index, value: '', otherVal: e.target.value })
    }
    else if (index === solarUsage?.index) {
      // If commercial, don't allow deselecting Power Generation
      if (isCommercial && index === powerGenerationIndex) {
        return;
      }
      setSolarUsage({ index: '', value: '', otherVal: '' })
    }
    else {
      setSolarUsage({ index: index, value: rawSolarUsage[index].name, otherVal: '' })
    }
  }

  const valuesOfSolarSystem = (index) => (e) => {
    // If Commercial, only allow Grid-tied (index should match Grid-tied)
    if (isCommercial && index !== gridTiedIndex) {
      return;
    }
    
    // If net-metered, don't allow Off-grid (index should not match Off-grid)
    if (isNetMetered && index === offGridIndex) {
      return;
    }
    
    if (rawSolarSysTypes[index].name === 'Other' && e.target.value !== 'on' && e.target.value !== '') {
      setSolarSysTypes({ index: index, value: '', otherVal: e.target.value })
    }
    else if (index === solarSystemTypes?.index) {
      // If commercial, don't allow deselecting Grid-tied
      if (isCommercial && index === gridTiedIndex) {
        return;
      }
      setSolarSysTypes({ index: '', value: '', otherVal: '' })
    }
    else {
      setSolarSysTypes({ index: index, value: rawSolarSysTypes[index].name, otherVal: '' })
    }
  }

  const statusValueofSolarEnergySystem = (index) => (e) => {
    if (Status[index].name === 'Other' && e.target.value !== 'on' && e.target.value !== '') {
      setStatus({ ...status, index: index, otherVal: e.target.value })
    }
    else if (index === status?.index) {
      setStatus({ index: '', value: '', otherVal: '' })
    }
    else {
      setStatus({ index: index, value: Status[index].name, otherVal: '' })
    }
  }

  return (
    <>
      <Box sx={boxstyle}>
        <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
          Primary use of Solar Energy System
        </Typography>
        
        {isCommercial && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Commercial RE systems must use Power Generation. Other options are disabled.
          </Alert>
        )}
        
        {isPowerGenerationRelated && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Power generation systems (Net-metered, DER, or Own-use) must use Power Generation. Solar Street Lights and Solar Pump options are disabled.
          </Alert>
        )}
        
        {rawSolarUsage.map((type, index) => {
          // Find indexes for specific usage types
          const solarStreetLightsIndex = rawSolarUsage.findIndex(usage => usage.name === "Solar Street Lights");
          const solarPumpIndex = rawSolarUsage.findIndex(usage => usage.name === "Solar Pump");
          
          // Disable Solar Street Lights and Solar Pump if power generation related
          const isDisabled = (isCommercial && index !== powerGenerationIndex) || // Commercial constraint
                           (isPowerGenerationRelated && (index === solarStreetLightsIndex || index === solarPumpIndex)); // Power generation constraint
          
          return (
            <FormGroup key={index}>
              <FormControlLabel
                sx={{ ml: 2 }}
                control={
                  <Checkbox
                    onChange={valuesOfSolarUsage(index)}
                    checked={type.name === solarUsage?.value}
                    disabled={isDisabled}
                  />
                }
                label={
                  <Typography 
                    sx={{ 
                      color: isDisabled ? 'text.disabled' : 'inherit',
                      fontStyle: isDisabled ? 'italic' : 'normal'
                    }}
                  >
                    {type.name === 'Other' ? <Input
                      onChange={valuesOfSolarUsage(index)}
                      disabled={(type.name !== solarUsage?.value) || isCommercial}
                      value={solarUsage?.otherVal}
                      startAdornment={<InputAdornment position="start">Other:</InputAdornment>}
                    /> : type.name}
                    {isPowerGenerationRelated && (index === solarStreetLightsIndex || index === solarPumpIndex) && (
                      <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                        (Not available for power generation systems)
                      </Typography>
                    )}
                  </Typography>
                }
              />
            </FormGroup>
          );
        })}
      </Box>

      <Box sx={boxstyle}>
        <Box sx={{ display: solarUsage?.value === "Solar Street Lights" ? 'block' : 'none' }}>
          <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
            For Solar Street Lights (leave blank if not applicable)
          </Typography>
          {formValues.map((element, index) => (
            <Grid container spacing={1} key={index}>
              <Grid item xs>
                <TextField
                  fullWidth
                  size="small"
                  label="Capacity"
                  name='capacity'
                  type="number"
                  value={element.capacity || ""}
                  onChange={handleChange(index)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end"><var>Wp</var></InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  size="small"
                  label="No. of Solar Street Lights"
                  name='pcs'
                  type="number"
                  value={element.pcs || ""}
                  onChange={handleChange(index)}
                />
              </Grid>
              <Grid item xs={2} key="3">
                {
                  index ?
                    <Button
                      component="label"
                      variant="contained"
                      sx={{
                        my: 1,
                      }}
                      onClick={() => removeFormFields(index)}
                    ><HighlightOffSharpIcon /></Button>
                    : null
                }
              </Grid>
            </Grid>
          ))}
          <div className="button-section">
            <Button onClick={addFormFields} component="button" underline="none">Add More..</Button>
          </div>
        </Box>
        <Box sx={{ display: solarUsage?.value === "Solar Pump" ? 'block' : 'none' }}>
          <Typography sx={{ fontStyle: "italic", mb: 2 }} component="h1" variant="subtitle2">
            For Solar Pump (leave blank if not applicable)
          </Typography>
          <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
            Solar Pump Subcategory:
          </Typography>
          {rawSolarPumpSubcategories.map((opt) => (
            <FormGroup key={opt.id}>
              <FormControlLabel
                sx={{ ml: 2 }}
                control={
                  <Checkbox
                    onChange={(e) => setSolarPumpSubcategory(e.target.checked ? opt.name : '')}
                    checked={solarPumpSubcategory === opt.name}
                  />
                }
                label={opt.name}
              />
            </FormGroup>
          ))}
          <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
            Capacity:
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="capacity"
            name="capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end"><var>Wp</var></InputAdornment>,
            }}
          />
          <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
            Flow rate:
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="flowRate"
            name="flowRate"
            type="text"
            value={flowRate}
            onChange={(e) => setFlowRate(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">m<sup>3</sup>/hr</InputAdornment>,
            }}
          />
          <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
            Serviceable Area:
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="serviceArea"
            name="serviceArea"
            type="text"
            value={serviceArea}
            onChange={(e) => setServiceArea(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">ha</InputAdornment>,
            }}
          />
        </Box>
        <Box sx={{ display: solarUsage?.value === 'Power Generation' ? 'block' : 'none' }}>
          <Typography sx={{ fontStyle: 'italic', mb: 2 }} component="h1" variant="subtitle2">
            For Power Generation (leave blank if not applicable)
          </Typography>
          
          {/* Solar Power Generation Subcategories */}
          <Typography sx={{ fontStyle: 'italic', mt: 2, mb: 1 }} component="h1" variant="subtitle2">
            Solar Power Generation Subcategory:
          </Typography>
          
          {rawSolarPowerGenSubcategories.map((mainCat, mainIndex) => (
            <Box key={mainIndex} sx={{ ml: 2, mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSolarPowerGenSubcategory({
                          mainCategory: mainCat.name,
                          subcategory: '',
                          mainCategoryId: mainCat.id,
                          subcategoryId: null
                        });
                      } else {
                        setSolarPowerGenSubcategory({
                          mainCategory: '',
                          subcategory: '',
                          mainCategoryId: null,
                          subcategoryId: null
                        });
                      }
                    }}
                    checked={solarPowerGenSubcategory.mainCategory === mainCat.name}
                  />
                }
                label={<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{mainCat.name}</Typography>}
              />
              
              {solarPowerGenSubcategory.mainCategory === mainCat.name && (
                <Box sx={{ ml: 3 }}>
                  {mainCat.subcategories.map((subCat, subIndex) => (
                    <FormControlLabel
                      key={subIndex}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSolarPowerGenSubcategory(prev => ({
                                ...prev,
                                subcategory: subCat.name,
                                subcategoryId: subCat.id
                              }));
                            } else {
                              setSolarPowerGenSubcategory(prev => ({
                                ...prev,
                                subcategory: '',
                                subcategoryId: null
                              }));
                            }
                          }}
                          checked={solarPowerGenSubcategory.subcategory === subCat.name}
                        />
                      }
                      label={subCat.name}
                    />
                  ))}
                </Box>
              )}
            </Box>
          ))}
          
          <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
            Solar Energy System Types:
          </Typography>
          
          {isCommercial && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Commercial RE systems must use Grid-tied configuration. Other options are disabled.
            </Alert>
          )}
          
          {isNetMetered && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Net-metered systems must be connected to the grid. Off-grid option is disabled.
            </Alert>
          )}
          
          {rawSolarSysTypes.map((type, index) => (
            <FormGroup key={index}>
              <FormControlLabel
                sx={{ ml: 2 }}
                control={
                  <Checkbox
                    onChange={valuesOfSolarSystem(index)}
                    checked={type.name === solarSystemTypes?.value}
                    disabled={
                      (isCommercial && index !== gridTiedIndex) || // Disable all except Grid-tied if Commercial
                      (isNetMetered && index === offGridIndex) // Disable Off-grid if net-metered
                    }
                  />
                }
                label={
                  <Typography 
                    sx={{ 
                      color: (isNetMetered && index === offGridIndex) ? 'text.disabled' : 'inherit',
                      fontStyle: (isNetMetered && index === offGridIndex) ? 'italic' : 'normal'
                    }}
                  >
                    {type.name}
                    {(isNetMetered && index === offGridIndex) && (
                      <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                        (Not available for net-metered systems)
                      </Typography>
                    )}
                  </Typography>
                }
              />
            </FormGroup>
          ))}
        </Box>

        
        {/* Capacity and Energy Production Fields - Added at the end */}
        <Box sx={{ display: solarUsage?.value === 'Power Generation' ? 'block' : 'none' }}>
          <Typography sx={{ fontStyle: 'italic', mt: 2, mb: 1 }} component="h1" variant="subtitle2">
            Capacity (kWp):
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="capacity"
            name="capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">kWp</InputAdornment>,
            }}
          />
          
          <Typography sx={{ fontStyle: 'italic', mt: 2, mb: 1 }} component="h1" variant="subtitle2">
            Annual Energy Production (kWh):
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="annualEnergyProduction"
            name="annualEnergyProduction"
            type="number"
            value={annualEnergyProduction}
            onChange={(e) => setAnnualEnergyProduction(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">kWh</InputAdornment>,
            }}
          />
          
          {/* Battery Capacity for Off-grid and Hybrid systems */}
          <Box sx={{ display: (solarSystemTypes?.value === 'Off-grid' || solarSystemTypes?.value === 'Hybrid') ? 'block' : 'none' }}>
            <Typography sx={{ fontStyle: 'italic', mt: 2, mb: 1 }} component="h1" variant="subtitle2">
              Battery Capacity (Ah) - Optional:
            </Typography>
            <TextField
              fullWidth
              size="small"
              id="batteryCapacity"
              name="batteryCapacity"
              type="number"
              value={batteryCapacity}
              onChange={(e) => setBatteryCapacity(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">Ah</InputAdornment>,
              }}
            />
          </Box>
        </Box>
        
        <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
          Status:
        </Typography>
        {Status.map((type, index) => (
          <FormGroup key={type.id}>
            <FormControlLabel
              key={Math.random()}
              sx={{ ml: 2 }}
              control={
                <Checkbox
                  onChange={statusValueofSolarEnergySystem(index)}
                  checked={type.name === status?.value}
                />
              }
              label={type.name}
            />
          </FormGroup>
        ))}

        <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
          Remarks
        </Typography>
        <TextField
          fullWidth
          size="small"
          id="remarks"
          name="remarks"
          type="text"
          multiline
          maxRows={4}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </Box>
    </>
  )
}