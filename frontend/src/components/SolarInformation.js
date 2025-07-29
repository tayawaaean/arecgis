import { Avatar, Box, Button, Dialog, Grid, IconButton, InputAdornment, Paper, Slider, Switch, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography, styled } from "@mui/material"
import TableCell, { tableCellClasses } from '@mui/material/TableCell'

export const SolarInformation = (props) => {

        //counter
        let rawSolarPowerGen = []
        let rawSolarValue = []
        let rawSolarPumpValue = []
        
        const solarStreetLightFiltered = (props.inventories.map((inventory, index) => {
    
          if (props.solarUsageFilter.includes(inventory?.assessment?.solarUsage)) {
            if (props.solarProvFilter.includes(inventory?.properties?.address?.city)) {
              if (inventory.assessment.solarStreetLights) {
                const rawSolarItems = inventory.assessment.solarStreetLights
                // return ({capacity: rawSolarItems.map(x=>x.capacity)})
                // return rawSolarItems
                const product = rawSolarItems.map((solar => solar.capacity * solar.pcs))
                const initialValue = 0;
                const rawSolarStreet = product.reduce((accumulator, currentValue) =>
                  accumulator + currentValue, initialValue
                )
                rawSolarValue = [...rawSolarValue, rawSolarStreet]
    
                // const ini = 0;
                // const totalFiltered = solarStreetLightFiltered.filter(function (element) {
                //   return element !== undefined;
                // })
                // console.log(rawSolarPowerGen)
                // const finalTotal = (totalFiltered.reduce((accumulator, currentValue) =>
                //   accumulator + currentValue, ini
                // ))
              }
    
              if (inventory.assessment.solarUsage==='Power Generation') {
                rawSolarPowerGen = [...rawSolarPowerGen, parseFloat(inventory.assessment.capacity)]
              }
    
              if (inventory.assessment.solarUsage==='Solar Pump') {
                rawSolarPumpValue = [...rawSolarPumpValue, parseFloat(inventory.assessment.capacity)]
              }
            }
          }
        }))
    
        const combinedArray = rawSolarValue.concat(rawSolarPowerGen, rawSolarPumpValue)
    
        let all = 0;
        const overAll = (combinedArray.reduce((accumulator, currentValue) =>
          accumulator + currentValue, all
        ))/1000
    
        let solarSt = 0
        const solarStTotal = (rawSolarValue.reduce((accumulator, currentValue) =>
          accumulator + currentValue, solarSt
        ))/1000
    
        let powerGen = 0
        const powerGenTotal = (rawSolarPowerGen.reduce((accumulator, currentValue) =>
          accumulator + currentValue, powerGen
        ))/1000
    
        let solarPump = 0
        const solarPumpTotal = (rawSolarPumpValue.reduce((accumulator, currentValue) =>
          accumulator + currentValue, solarPump
        ))/1000

        const totalYield = (overAll*4.7)
        //end counter

    return (
        <>
            <TableContainer component={Paper} sx={{ minWidth: 250, maxHeight: "50vh" }}>
                <Table stickyHeader size="small" >
                    <TableHead>
                        <TableRow>
                            <TableCell>Solar Energy Usage</TableCell>
                            <TableCell>Capacity(<var>kWp</var>)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ fontStyle: "italic" }}>
                        <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Solar Streetlights/Lights</TableCell>
                            <TableCell align="left">{solarStTotal}</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Power Generation</TableCell>
                            <TableCell align="left">{powerGenTotal}</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Solar Pump</TableCell>
                            <TableCell align="left">{solarPumpTotal}</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Total Capacity</TableCell>
                            <TableCell align="left">{overAll.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell sx={{ fontWeight: "Medium" }}>Estimated yield(per day)</TableCell>
                            <TableCell align="left">{totalYield.toFixed(2)}</TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
            </TableContainer>

            {/* <div >
                <div style={{marginBottom:  '5px'}} className="leaflet-control-layers">
                    <Box sx={{ flexGrow: 3, backgroundColor: '#FFFFFF' , borderRadius: '10px'}}>
                        <Grid container>
                            <Grid item xs={7} md={7}>
                                <Item sx={{ textAlign: "left" }}>Solar Street/Flood Lights:</Item>
                            </Grid>
                            <Grid item xs={5} md={5}>
                                <Item sx={{ textAlign: "left" }}>{solarStTotal} <var>Wp</var></Item>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={7} md={7}>
                                <Item sx={{ textAlign: "left" }} >Power Generation:</Item>
                            </Grid>
                            <Grid item xs={5} md={5}>
                                <Item sx={{ textAlign: "left" }}>{powerGenTotal} <var>Wp</var></Item>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={7} md={7}>
                                <Item sx={{ textAlign: "left" }} >Solar Pump:</Item>
                            </Grid>
                            <Grid item xs={5} md={5}>
                                <Item sx={{ textAlign: "left" }}>{solarPumpTotal} <var>Wp</var></Item>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={7} md={7}>
                                <Item sx={{ textAlign: "left" }} >Total Capacity:</Item>
                            </Grid>
                            <Grid item xs={5} md={5}>
                                <Item sx={{ textAlign: "left" }}><b>{overAll.toFixed(2)} kWp</b></Item>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={7} md={7}>
                                <Item sx={{ textAlign: "left" }} >Total yield(per day):</Item>
                            </Grid>
                            <Grid item xs={5} md={5}>
                                <Item sx={{ textAlign: "left" }}><b>{totalYield.toFixed(2)} kWh</b></Item>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </div> */}
        </>
    )
}