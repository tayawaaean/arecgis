import React, { useState, useEffect } from 'react'
import { TextField, Input, InputAdornment, Box, Checkbox, FormControlLabel, FormGroup, Typography, Alert } from '@mui/material'
import { rawBiomassPriUsage, rawBioUsage, Status } from "../../config/techAssesment"
import { boxstyle } from '../../config/style'


export const Biomass = (props) => {
    // Check if this is a commercial RE installation
    const isCommercial = props.reClass === "Commercial";
    
    // Find the index of Power Generation in rawBioUsage
    const powerGenerationIndex = rawBioUsage.findIndex(usage => usage.name === "Power Generation");

    const [data, setData] = useState([])
    // console.log(data)
    const [capacity, setCapacity] = useState('')

    const [biomassPriUsage, setBiomassPriUsage] = useState({ index: '', value: '', otherVal: '' })

    const [bioUsage, setBioUsage] = useState({ index: '', value: '', otherVal: '' })

    const [status, setStatus] = useState({ index: '', value: '', otherVal: '' })

    const [remarks, setRemarks] = useState('')

    // Auto-select Power Generation for Commercial RE
    useEffect(() => {
        if (isCommercial && powerGenerationIndex >= 0) {
            if (!bioUsage.value || bioUsage.value !== rawBioUsage[powerGenerationIndex].name) {
                setBioUsage({ 
                    index: powerGenerationIndex, 
                    value: rawBioUsage[powerGenerationIndex].name, 
                    otherVal: '' 
                });
            }
        }
    }, [isCommercial, powerGenerationIndex, bioUsage.value]);

    useEffect(() => {
        setData({
            ...data,
            capacity: capacity,
            biomassPriUsage: biomassPriUsage?.otherVal === '' ? biomassPriUsage?.value : biomassPriUsage?.otherVal,
            bioUsage: bioUsage?.value,
            status: status?.value,
            remarks: remarks,
        })

    }, [capacity,
        biomassPriUsage,
        bioUsage,
        status,
        remarks])

    useEffect(() => {
        props.setBiomass(data)
    }, [data])

    const valuesOfBiomassPriUsage = (index) => (e) => {
        if (rawBiomassPriUsage[index].name === 'Other' && e.target.value !== 'on' && e.target.value !== '') {
            setBiomassPriUsage({ index: index, value: rawBiomassPriUsage[index].name, otherVal: e.target.value })
        }
        else if (index === biomassPriUsage?.index) {
            setBiomassPriUsage({ index: '', value: '', otherVal: '' })
        }
        else {
            setBiomassPriUsage({ index: index, value: rawBiomassPriUsage[index].name, otherVal: '' })
        }
    }


    const valuesOfBioUsage = (index) => (e) => {
        // If Commercial, only allow Power Generation selection
        if (isCommercial && index !== powerGenerationIndex) {
            return;
        }

        if (rawBioUsage[index].name === 'Other' && e.target.value !== 'on' && e.target.value !== '') {
            setBioUsage({ index: index, value: '', otherVal: e.target.value })
        }
        else if (index === bioUsage?.index) {
            setBioUsage({ index: '', value: '', otherVal: '' })
        }
        else {
            setBioUsage({ index: index, value: rawBioUsage[index].name, otherVal: '' })
        }
    }

    const valuesOfBiomassStatus = (index) => (e) => {
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
                    Primary use of Biomass
                </Typography>
                {rawBiomassPriUsage.map((type, index) => (
                    <FormGroup key={index}>
                        <FormControlLabel
                            sx={{ ml: 2 }}
                            control={
                                <Checkbox
                                    onChange={valuesOfBiomassPriUsage(index)}
                                    checked={type.name === biomassPriUsage?.value}
                                />
                            }
                            label={type.name === 'Other' ? <Input
                                onChange={valuesOfBiomassPriUsage(index)}
                                disabled={type.name !== biomassPriUsage?.value}
                                value={biomassPriUsage?.otherVal}
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
                    For {biomassPriUsage?.value || biomassPriUsage?.otherVal} (leave blank if not applicable)
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
                        endAdornment: <InputAdornment position="end"><var>m&sup3;</var></InputAdornment>,
                    }}
                />
                <Box sx={{ display: biomassPriUsage?.value === 'Biogas' || biomassPriUsage?.value === 'Gasification' ? 'block' : 'none' }}>
                    <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
                        Usage:
                    </Typography>
                    
                    {isCommercial && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Commercial RE systems must use Power Generation. Other options are disabled.
                        </Alert>
                    )}
                    
                    {rawBioUsage.map((type, index) => (
                        <FormGroup key={index}>
                            <FormControlLabel
                                sx={{ ml: 2 }}
                                control={
                                    <Checkbox
                                        onChange={valuesOfBioUsage(index)}
                                        checked={type.name === bioUsage?.value}
                                        disabled={isCommercial && index !== powerGenerationIndex} // Disable non-Power Generation options if Commercial
                                    />
                                }
                                label={type.name}
                            />
                        </FormGroup>
                    ))}

                </Box>
                <Typography sx={{ fontStyle: 'italic' }} component="h1" variant="subtitle2">
                    Status:
                </Typography>
                {Status.map((type, index) => (
                    <FormGroup key={index}>
                        <FormControlLabel
                            key={Math.random()}
                            sx={{ ml: 2 }}
                            control={
                                <Checkbox
                                    onChange={valuesOfBiomassStatus(index)}
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
