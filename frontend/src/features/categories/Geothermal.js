import React, { useEffect, useState } from 'react'
import { Box, Checkbox, FormControlLabel, FormGroup, InputAdornment, TextField, Typography } from '@mui/material'
import { Status } from '../../config/techAssesment'
import { boxstyle } from '../../config/style'

export const Geothermal = (props) => {
  const [data, setData] = useState([])

  // Primary usage – only Power Generation for now
  const [geothermalUsage, setGeothermalUsage] = useState('Power Generation')

  const [capacity, setCapacity] = useState('')
  const [status, setStatus] = useState({ index: '', value: '', otherVal: '' })
  const [remarks, setRemarks] = useState('')

  useEffect(() => {
    setData({
      ...data,
      geothermalUsage,
      capacity,
      status: status?.value,
      remarks
    })
  }, [geothermalUsage, capacity, status, remarks])

  useEffect(() => {
    props.setGeothermal(data)
  }, [data])

  const valuesOfStatus = (index) => (e) => {
    if (Status[index].name === 'Other' && e.target.value !== 'on' && e.target.value !== '') {
      setStatus({ index, value: '', otherVal: e.target.value })
    } else if (index === status?.index) {
      setStatus({ index: '', value: '', otherVal: '' })
    } else {
      setStatus({ index, value: Status[index].name, otherVal: '' })
    }
  }

  return (
    <>
      <Box sx={boxstyle}>
        <Typography sx={{ fontStyle: 'italic', mb: 2 }} component="h1" variant="subtitle2">
          For Geothermal System (leave blank if not applicable)
        </Typography>

        <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
          Primary Usage:
        </Typography>
        <FormGroup>
          <FormControlLabel
            sx={{ ml: 2 }}
            control={
              <Checkbox
                checked={geothermalUsage === 'Power Generation'}
                onChange={() => setGeothermalUsage(geothermalUsage === 'Power Generation' ? '' : 'Power Generation')}
              />
            }
            label={'Power Generation'}
          />
        </FormGroup>

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
          InputProps={{ endAdornment: <InputAdornment position="end">W</InputAdornment> }}
        />

        <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
          Status:
        </Typography>
        {Status.map((type, index) => (
          <FormGroup key={type.id}>
            <FormControlLabel
              sx={{ ml: 2 }}
              control={<Checkbox onChange={valuesOfStatus(index)} checked={type.name === status?.value} />}
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

export default Geothermal


