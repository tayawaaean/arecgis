import React, { useState, useEffect } from 'react'
import { FormLabel, TextField, Input, InputAdornment, Box, Checkbox, FormControlLabel, FormGroup, Typography, Grid, Button, Alert } from '@mui/material'
import { rawSolarUsage, rawSolarSysTypes, Status } from "../../config/techAssesment"
import { boxstyle } from '../../config/style'
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp'

export const EditSolar = (props) => {
  // Check if this is a commercial RE installation
  const isCommercial = props.reClass === "Commercial";
  
  // Find indexes for auto-selection
  const powerGenerationIndex = rawSolarUsage.findIndex(usage => usage.name === "Power Generation");
  const gridTiedIndex = rawSolarSysTypes.findIndex(type => type.name === "Grid-tied");
  
  const [formValues, setFormValues] = useState(
    props.reItems.assessment.solarUsage === 'Solar Street Lights'
      ? JSON.parse(JSON.stringify(props.reItems.assessment.solarStreetLights))
      : [{ capacity: "", pcs: "" }]
  )
  const [data, setData] = useState([])

  let solarUse = props?.reItems?.assessment?.solarUsage
  let found = rawSolarUsage.findIndex(item => item.name === solarUse)

  const [capacity, setCapacity] = useState(props?.reItems?.assessment?.capacity || '')
  const [annualEnergyProduction, setAnnualEnergyProduction] = useState(
    props?.reItems?.assessment?.annualEnergyProduction || ''
  )

  const [solarUsage, setSolarUsage] = useState(
    found === -1
      ? { index: '', value: 'Other', otherVal: solarUse || '' }
      : { index: found, value: solarUse || '', otherVal: '' }
  )
  
  const [solarSystemTypes, setSolarSysTypes] = useState({
    index: '',
    value: props?.reItems?.assessment?.solarSystemTypes || '',
    otherVal: ''
  })
  const [status, setStatus] = useState({
    index: '',
    value: props?.reItems?.assessment?.status || '',
    otherVal: ''
  })

  const [remarks, setRemarks] = useState(props?.reItems?.assessment?.remarks || '')
  const [flowRate, setFlowRate] = useState(props?.reItems?.assessment?.flowRate || '')
  const [serviceArea, setServiceArea] = useState(props?.reItems?.assessment?.serviceArea || '')

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
    })
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
    annualEnergyProduction
  ])

  useEffect(() => {
    props.setEditSolar(data)
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
    // If Commercial, only allow Power Generation (index should match Power Generation)
    if (isCommercial && index !== powerGenerationIndex) {
      return;
    }
    
    if (rawSolarUsage[index].name === 'Other' && e.target.value !== 'on' && e.target.value !== '') {
      setSolarUsage({ index: index, value: rawSolarUsage[index].name, otherVal: e.target.value })
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
    if (rawSolarUsage[index].name !== "Power Generation") setAnnualEnergyProduction('');
  }

  const valuesOfSolarSystem = (index) => (e) => {
    // If Commercial, only allow Grid-tied (index should match Grid-tied)
    if (isCommercial && index !== gridTiedIndex) {
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
        
        {rawSolarUsage.map((type, index) => (
          <FormGroup key={index}>
            <FormControlLabel
              sx={{ ml: 2 }}
              control={
                <Checkbox
                  onChange={valuesOfSolarUsage(index)}
                  checked={type.name === solarUsage?.value}
                  disabled={isCommercial && index !== powerGenerationIndex} // Disable all except Power Generation if Commercial
                />
              }
              label={type.name === 'Other' ? <Input
                onChange={valuesOfSolarUsage(index)}
                disabled={(type.name !== solarUsage?.value) || isCommercial}
                value={solarUsage?.otherVal}
                startAdornment={<InputAdornment position="start">Other:</InputAdornment>}
              /> : type.name}
            />
          </FormGroup>
        ))}
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
          {/* Annual Energy Production input, only for Power Generation */}
          <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
            Annual Energy Production:
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
          <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
            Solar Energy System Types:
          </Typography>
          
          {isCommercial && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Commercial RE systems must use Grid-tied configuration. Other options are disabled.
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
                    disabled={isCommercial && index !== gridTiedIndex} // Disable all except Grid-tied if Commercial
                  />
                }
                label={type.name}
              />
            </FormGroup>
          ))}
        </Box>
        <Box sx={{ display: solarUsage?.value === 'Other' ? 'block' : 'none' }}>
          <Typography sx={{ fontStyle: 'italic', mb: 2 }} component="h1" variant="subtitle2">
            For Other Solar Energy System
          </Typography>
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