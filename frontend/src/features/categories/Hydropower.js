import React, { useState, useEffect } from 'react'
import { TextField, Input, InputAdornment, Box, Checkbox, FormControlLabel, FormGroup, Typography, Alert } from '@mui/material'
import { Status } from "../../config/techAssesment"
import { boxstyle } from '../../config/style'


export const Hydropower = (props) => {
  // Check if this is a commercial RE installation
  const isCommercial = props.reClass === "Commercial";

  const [data, setData] = useState([])

  const [capacity, setCapacity] = useState('')

  const [status, setStatus] = useState({ index: '', value: '', otherVal: '' })

  const [remarks, setRemarks] = useState({ index: '', value: '', otherVal: '' })

  useEffect(() => {
    setData({
      ...data,
      capacity: capacity,
      status: status?.value,
      remarks: remarks,
    })

  }, [
    capacity,
    status,
    remarks
  ])

  useEffect(() => {
    props.setHydropower(data)
  }, [data])


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
        <Typography sx={{ fontStyle: "italic", mb: 2 }} component="h1" variant="subtitle2">
          For Hydropower System (leave blank if not applicable)
        </Typography>
        
        {isCommercial && (
          <Alert severity="info" sx={{ mb: 2 }}>
            This is a Commercial hydropower system for power generation.
          </Alert>
        )}
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
            endAdornment: <InputAdornment position="end">W</InputAdornment>,
          }}
        />
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
                  checked={type.id === status?.index}
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
