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


export const WindInformation = (props) => {

        //counter
        let rawWaterpump = []
        let rawPowerGeneration = []

    
        const windFiltered = (props.inventories.map((inventory, index) => {
    
          if (props.windUsageFilter.includes(inventory.assessment.windUsage)) {
            if (props.windProvFilter.includes(inventory.properties.address.city)) {

              if (inventory.assessment.windUsage==='Water pump') {
                rawWaterpump = [...rawWaterpump, parseFloat(inventory.assessment.capacity)]
              }
    
              if (inventory.assessment.windUsage==='Power Generation') {
                rawPowerGeneration = [...rawPowerGeneration, parseFloat(inventory.assessment.capacity)]
              }

            }
          }
        }))
    
        const combinedArray = rawWaterpump.concat(rawPowerGeneration)
    
        let all = 0;
        const overAll = (combinedArray.reduce((accumulator, currentValue) =>
          accumulator + currentValue, all
        ))
    
        let Waterpump = 0
        const WaterpumpTotal = (rawWaterpump.reduce((accumulator, currentValue) =>
          accumulator + currentValue, Waterpump
        ))
    
        let PowerGeneration = 0
        const PowerGenerationTotal = (rawPowerGeneration.reduce((accumulator, currentValue) =>
          accumulator + currentValue, PowerGeneration
        ))
    
        
        //end counter
    
    return (
        <>
        <TableContainer component={Paper} sx={{ minWidth: 250, maxHeight: "50vh" }}>
                <Table stickyHeader size="small" >
                    <TableHead>
                        <TableRow>
                            <TableCell>Wind Energy Usage</TableCell>
                            <TableCell>Capacity(<var>kWp</var>)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ fontStyle: "italic" }}>
                        <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Water Pump</TableCell>
                            <TableCell align="left">{WaterpumpTotal}</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Power Generation</TableCell>
                            <TableCell align="left">{PowerGenerationTotal}</TableCell>
                        </TableRow>
                       
                        <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Total Capacity</TableCell>
                            <TableCell align="left">{overAll}</TableCell>
                        </TableRow>

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