import { Avatar, Box, Button, Dialog, Grid, IconButton, InputAdornment, Paper, Slider, Switch, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography, styled } from "@mui/material"
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import {
    Close as CloseIcon,
    Circle as CircleIcon,
    Pentagon as PentagonIcon,

} from '@mui/icons-material'
import MuiInput from '@mui/material/Input';
import { useEffect, useState } from "react"
//table start



export const BiomassInformation = (props) => {

    //counter
    let rawBiogas = []
    let rawGasification = []
    let rawTorrefaction = []
    let rawPyrolysis = []

    const BiomassFiltered = (props.inventories.map((inventory, index) => {

        if (props.biomassUsageFilter.includes(inventory.assessment.biomassPriUsage)) {
            if (props.bioProvFilter.includes(inventory.properties.address.city)) {

                if (inventory.assessment.biomassPriUsage === 'Biogas') {
                    rawBiogas = [...rawBiogas, parseFloat(inventory.assessment.capacity)]
                }

                if (inventory.assessment.biomassPriUsage === 'Gasification') {
                    rawGasification = [...rawGasification, parseFloat(inventory.assessment.capacity)]
                }

                if (inventory.assessment.biomassPriUsage === 'Torrefaction') {
                    rawTorrefaction = [...rawTorrefaction, parseFloat(inventory.assessment.capacity)]
                }
                if (inventory.assessment.biomassPriUsage === 'Pyrolysis') {
                    rawPyrolysis = [...rawPyrolysis, parseFloat(inventory.assessment.capacity)]
                }
            }
        }
    }))

    const combinedArray = rawBiogas.concat(rawGasification, rawTorrefaction, rawPyrolysis)

    let all = 0;
    const overAll = (combinedArray.reduce((accumulator, currentValue) =>
        accumulator + currentValue, all
    ))

    let Biogas = 0
    const biogasTotal = (rawBiogas.reduce((accumulator, currentValue) =>
        accumulator + currentValue, Biogas
    ))

    let Gasification = 0
    const GasificationTotal = (rawGasification.reduce((accumulator, currentValue) =>
        accumulator + currentValue, Gasification
    ))

    let Torrefaction = 0
    const torrefactionTotal = (rawTorrefaction.reduce((accumulator, currentValue) =>
        accumulator + currentValue, Torrefaction
    ))

    let Pyrolysis = 0
    const pyrolysisTotal = (rawPyrolysis.reduce((accumulator, currentValue) =>
        accumulator + currentValue, Pyrolysis
    ))
    //end counter

    return (
        <>
            <TableContainer component={Paper} sx={{ minWidth: 250, maxHeight: "50vh" }}>
                <Table stickyHeader size="small" >
                    <TableHead>
                        <TableRow>
                            <TableCell>Biomass Energy Usage</TableCell>
                            <TableCell>Capacity(<var>m&sup3;</var> )</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ fontStyle: "italic" }}>
                        <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Biogas</TableCell>
                            <TableCell align="left">{biogasTotal}</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Gasification</TableCell>
                            <TableCell align="left">{GasificationTotal}</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Torrefaction</TableCell>
                            <TableCell align="left">{torrefactionTotal}</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Pyrolysis</TableCell>
                            <TableCell align="left">{pyrolysisTotal}</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Total Capacity</TableCell>
                            <TableCell align="left">{overAll}</TableCell>
                        </TableRow>
                        {/* <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Estimated yield(per day)</TableCell>
                            <TableCell align="left">{totalYield.toFixed(2)}</TableCell>
                        </TableRow> */}

                    </TableBody>
                </Table>
            </TableContainer>
            {/* <div >
                <div style={{marginBottom:  '5px'}} className="leaflet-control-layers">
                    <Box sx={{ flexGrow: 3, backgroundColor: '#FFFFFF' , borderRadius: '10px'}}>
                        <Grid container>
                            <Grid item xs={7} md={7}>
                                <Item sx={{ textAlign: "left" }}>Biogas:</Item>
                            </Grid>
                            <Grid item xs={5} md={5}>
                                <Item sx={{ textAlign: "left" }}>{biogasTotal} <var>m&sup3;</var></Item>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={7} md={7}>
                                <Item sx={{ textAlign: "left" }} >Gasification:</Item>
                            </Grid>
                            <Grid item xs={5} md={5}>
                                <Item sx={{ textAlign: "left" }}>{GasificationTotal} <var>m&sup3;</var></Item>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={7} md={7}>
                                <Item sx={{ textAlign: "left" }} >Torrefaction:</Item>
                            </Grid>
                            <Grid item xs={5} md={5}>
                                <Item sx={{ textAlign: "left" }}>{torrefactionTotal} <var>m&sup3;</var></Item>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={7} md={7}>
                                <Item sx={{ textAlign: "left" }} >Pyrolysis:</Item>
                            </Grid>
                            <Grid item xs={5} md={5}>
                                <Item sx={{ textAlign: "left" }}>{pyrolysisTotal} <var>m&sup3;</var></Item>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={7} md={7}>
                                <Item sx={{ textAlign: "left" }} >Total:</Item>
                            </Grid>
                            <Grid item xs={5} md={5}>
                                <Item sx={{ textAlign: "left" }}><b>{overAll}</b> <var>m&sup3;</var></Item>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </div> */}
        </>
    )
}