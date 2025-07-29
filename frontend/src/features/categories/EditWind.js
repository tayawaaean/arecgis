import React, { useState, useEffect } from 'react'
import { FormLabel, TextField, Input, InputAdornment, Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material'
import { rawWindSysTypes, rawWindUsage, rawWindSystemStatus, rawWindTurbineTypes, rawWindTowerTypes, Status } from '../../config/techAssesment'
import { boxstyle } from '../../config/style'

export const EditWind = (props) => {

  const [data, setData] = useState([])

  let windUse = props?.reItems?.assessment?.windUsage

  let found = rawWindUsage.findIndex(item => item.name === windUse)

  const [capacity, setCapacity] = useState(props?.reItems?.assessment?.capacity || '')

  const [windUsage, setWindUsage] = useState(found === -1 ? { index: '', value: 'Other', otherVal: windUse || '' } : { index: '', value: windUse || '', otherVal: '' })

  const [serviceArea, setServiceArea] = useState(props?.reItems?.assessment?.serviceArea || '')

  const [status, setStatus] = useState({ index: '', value: props?.reItems?.assessment?.status || '', otherVal: '' })

  const [remarks, setRemarks] = useState(props?.reItems?.assessment?.remarks || '')

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
    props.setEditWind(data)
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
