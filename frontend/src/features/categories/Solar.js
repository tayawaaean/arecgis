import React, { useState, useEffect } from 'react'
import { TextField, Input, InputAdornment, Box, Checkbox, FormControlLabel, FormGroup, Typography, Link, Button, Grid } from '@mui/material'
import { rawSolarUsage, rawSolarSysTypes, Status } from "../../config/techAssesment"
import { boxstyle } from '../../config/style'
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp'


export const Solar = (props) => {


  const [formValues, setFormValues] = useState([{ capacity: "", pcs: "" }])

  const [data, setData] = useState([])

  const [capacity, setCapacity] = useState('')

  const [solarUsage, setSolarUsage] = useState({ index: '', value: '', otherVal: '' })

  const [solarSystemTypes, setSolarSysTypes] = useState({ index: '', value: '', otherVal: '' })

  const [status, setStatus] = useState({ index: '', value: '', otherVal: '' })

  const [remarks, setRemarks] = useState('')

  const [flowRate, setFlowRate] = useState('')

  const [serviceArea, setServiceArea] = useState('')

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
    })

  }, [
    capacity,
    formValues,
    flowRate,
    solarUsage,
    serviceArea,
    solarSystemTypes,
    status,
    remarks])

  useEffect(() => {
    props.setSolar(data)
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
    if (rawSolarUsage[index].name === 'Other' && e.target.value !== 'on' && e.target.value !== '') {
      setSolarUsage({ index: index, value: rawSolarUsage[index].name, otherVal: e.target.value })
    }
    else if (index === solarUsage?.index) {
      setSolarUsage({ index: '', value: '', otherVal: '' })
    }
    else {
      setSolarUsage({ index: index, value: rawSolarUsage[index].name, otherVal: '' })
    }
  }

  const valuesOfSolarSystem = (index) => (e) => {

    if (rawSolarSysTypes[index].name === 'Other' && e.target.value !== 'on' && e.target.value !== '') {
      setSolarSysTypes({ index: index, value: '', otherVal: e.target.value })
    }
    else if (index === solarSystemTypes?.index) {
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
      <Box
        sx={boxstyle}
      >
        <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
          Primary use of Solar Energy System
        </Typography>
        {rawSolarUsage.map((type, index) => (
          <FormGroup key={index}>
            <FormControlLabel
              sx={{ ml: 2 }}
              control={
                <Checkbox
                  onChange={valuesOfSolarUsage(index)}
                  checked={type.name === solarUsage?.value}
                />
              }
              label={type.name === 'Other' ? <Input
                onChange={valuesOfSolarUsage(index)}
                disabled={type.name !== solarUsage?.value}
                value={solarUsage?.otherVal}
                startAdornment={<InputAdornment position="start">Other:</InputAdornment>}
              /> : type.name}
            />
          </FormGroup>
        ))}
      </Box>

      <Box
        sx={boxstyle}
      >
        <Box sx={{ display: solarUsage?.index === 0 ? 'block' : 'none' }}>
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
        <Box sx={{ display: solarUsage?.index === 1 ? 'block' : 'none' }}>
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
        <Box sx={{ display: solarUsage?.index === 2 ? 'block' : 'none' }}>
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
            type="text"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end"><var>Wp</var></InputAdornment>,
            }}
          />
          <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
            Solar Energy System Types:
          </Typography>
          {rawSolarSysTypes.map((type, index) => (
            <FormGroup key={index}>
              <FormControlLabel
                sx={{ ml: 2 }}
                control={
                  <Checkbox
                    onChange={valuesOfSolarSystem(index)}
                    checked={type.name === solarSystemTypes?.value}
                  />
                }
                label={type.name}
              />
            </FormGroup>
          ))}
        </Box>
        <Box sx={{ display: solarUsage?.index === 3 ? 'block' : 'none' }}>
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
            type="text"
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
