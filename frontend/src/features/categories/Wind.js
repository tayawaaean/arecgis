import React, { useState, useEffect } from 'react'
import { TextField, Input, InputAdornment, Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material'
import { rawWindUsage, Status } from "../../config/techAssesment"
import { boxstyle } from '../../config/style'


export const Wind = (props) => {

  const [data, setData] = useState([])

  const [capacity, setCapacity] = useState('')

  const [windUsage, setWindUsage] = useState({ index: '', value: '', otherVal: '' })

  const [serviceArea, setServiceArea] = useState('')

  const [status, setStatus] = useState({ index: '', value: '', otherVal: '' })

  const [remarks, setRemarks] = useState('')

  useEffect(() => {
    setData({
      ...data,
      capacity: capacity,
      windUsage: windUsage?.otherVal === '' ? windUsage?.value : windUsage?.otherVal,
      serviceArea: serviceArea,
      status: status?.value,
      remarks: remarks,
    })

  }, [
    capacity,
    windUsage,
    serviceArea,
    status,
    remarks
  ])

  useEffect(() => {
    props.setWind(data)
  }, [data])



  const valuesOfWindUsage = (index) => (e) => {

    if (rawWindUsage[index].name === 'Other' && e.target.value !== 'on' && e.target.value !== '') {
      setWindUsage({ index: index, value: rawWindUsage[index].name, otherVal: e.target.value })
    }
    else if (index === windUsage?.index) {
      setWindUsage({ index: '', value: '', otherVal: '' })
    }
    else {
      setWindUsage({ index: index, value: rawWindUsage[index].name, otherVal: '' })
    }
  }


  const valuesOfStatus = (index) => (e) => {
    if (Status[index].name === 'Other' && e.target.value !== 'on' && e.target.value !== '') {
      setStatus({ index: index, value: '', otherVal: e.target.value })
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
          Primary use of Wind Power System
        </Typography>
        {rawWindUsage.map((type, index) => (
          <FormGroup key={index}>
            <FormControlLabel
              sx={{ ml: 2 }}
              control={
                <Checkbox
                  onChange={valuesOfWindUsage(index)}
                  checked={type.name === windUsage?.value}
                />
              }
              label={type.name === 'Other' ? <Input
              onChange={valuesOfWindUsage(index)}
              disabled={type.name !== windUsage?.value}
              value={windUsage?.otherVal}
              startAdornment={<InputAdornment position="start">Other:</InputAdornment>}
          /> : type.name}
            />
          </FormGroup>
        ))}

      </Box>
      <Box
        sx={boxstyle}
      >
        <Typography sx={{ fontStyle: "italic", mb: 2 }} component="h1" variant="subtitle2">
          For {windUsage?.value || windUsage?.otherVal} (leave blank if not applicable)
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
            endAdornment: <InputAdornment position="end"><var><var>Wp</var></var></InputAdornment>,
          }}
        />
        <Box sx={{ display: windUsage?.value !== 'Water pump' ? 'none' : 'block' }}>
          <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
            Serviceable Area:
          </Typography>
          <TextField
            fullWidth
            size="small"
            id="serviceArea"
            name="serviceArea"
            type="number"
            value={serviceArea}
            onChange={(e) => setServiceArea(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">ha</InputAdornment>,
            }}
          />
        </Box>
      </Box>
      <Box
        sx={boxstyle}
      >
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
                  onChange={valuesOfStatus(index)}
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
