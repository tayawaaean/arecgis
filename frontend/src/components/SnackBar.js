import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Snackbar, Table, TableBody, TableContainer, TableHead, TableRow, Paper, IconButton, Link, Drawer, Typography, Button, BottomNavigation, BottomNavigationAction } from '@mui/material'
import TableCell from '@mui/material/TableCell'

import Carousel from 'react-material-ui-carousel'
import { baseUrl } from '../config/baseUrl'
import {
  Close as CloseIcon,
  EnergySavingsLeaf as EnergySavingsLeafIcon,
  ModeEditOutline as ModeEditOutlineIcon,
  EnergySavingsLeafOutlined as EnergySavingsLeafOutlinedIcon,

} from '@mui/icons-material'

import { Modal } from '../config/Modal'
import { Lightbox } from "react-modal-image"
import { GenModal } from '../config/GenModal'

import { scrollbarStyle } from '../config/style'
import useAuth from '../hooks/useAuth'



export const SnackBar = (props) => {

  const [openModal, setOpenModal] = useState(false)
  const [openGenModal, setOpenGenModal] = useState(false)
  const handleClose = () => {
    props.setActive(false)
  }
  const [openImage, setOpenImage] = useState(false)
  const [image, setImage] = useState('')

  const { active, project } = props

  const date = new Date(project?.createdAt);
  const navigate = useNavigate()
  const { username, isManager, isAdmin } = useAuth()

  const handleEdit = (params) => navigate(`/dashboard/inventories/${params}`)
  return (
    <>
      {/* <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={active}
        onClose={handleClose}
        key={project.id}
      > */}{openImage && (<Lightbox
        hideDownload={true}
        // large={`data:${image.contentType};base64, ${image.data.toString('base64')}`}
        large={baseUrl + image}
        alt={project?.properties?.reCat}
        showRotate
        onClose={() => setOpenImage(false)}
      />)}
      <Drawer
        anchor="left"
        open={active}
        onClose={handleClose}

      >
        <Box sx={scrollbarStyle}>
          <Box >
            {project?.images?.length === 0 ?
              <Box sx={{
                display: 'flex',
                alignItems: "center",
                justifyContent: "center",
              }}>
                <EnergySavingsLeafIcon sx={{
                  height: 250,
                  width: 250,
                  maxWidth: { sm: 350, md: 550 },
                  opacity: 0.1
                }} />
              </Box>
              : <Carousel indicators={false} >
                {
                  project?.images?.map((image, index) =>
                    <Box
                      key={index}
                      component="img"
                      sx={{
                        height: 300,
                        width: 350,
                        maxWidth: { sm: 350, md: 350 },
                      }}
                      // alt="The house from the offer."
                      src={baseUrl + image}
                      onClick={() => {
                        setImage(image)
                        setOpenImage(true)
                      }}
                    />
                  )
                }
              </Carousel>}
          </Box>

          <Box
            sx={{
              width: 350,
              maxWidth: { sm: 350, md: 350 },
              padding: 2
            }}

          >
            <Typography variant="h5" component="div">
              {project?.properties?.reCat}
              {isAdmin || isManager ?
                <IconButton aria-label="edit"
                  onClick={() => handleEdit(project?.id)}
                >
                  <ModeEditOutlineIcon />
                </IconButton> : null}

            </Typography>

            <Typography color="text.secondary">
              {username ? project?.properties?.ownerName : null}
            </Typography>
            <Typography sx={{ mb: 1 }} color="text.secondary">
              <i>{project?.properties?.reClass}</i>
            </Typography>
          </Box>
          <Box>
            <TableContainer component={Paper} sx={{ maxWidth: 350, boxShadow: 'none', mb: 6 }}>
              <Table size="small" >
                {/* <TableHead>
              <TableRow>
                <TableCell>Details</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleClose}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead> */}
                <TableBody >
                  {/* <TableRow >
                <TableCell sx={{ fontWeight: "Medium" }}>Type</TableCell>
                <TableCell align="left">
                  {project?.properties?.reCat}
                </TableCell>
              </TableRow> */}
                  {/* <TableRow>
                <TableCell sx={{ fontWeight: "Medium" }}>RE class</TableCell>
                <TableCell align="left">
                  {project?.properties?.reClass}
                </TableCell>
              </TableRow>*/}
                  <TableRow>
                    <TableCell sx={{ fontWeight: "Medium" }}>Primary Usage</TableCell>
                    <TableCell align="left">
                      {project?.properties?.reCat === null ? null :
                        project?.properties?.reCat === 'Solar Energy' ? project?.assessment?.solarUsage :
                          project?.properties?.reCat === 'Wind Energy' ? project?.assessment?.windUsage :
                            project?.properties?.reCat === 'Biomass' ? project?.assessment?.biomassPriUsage :
                              project?.properties?.reCat === 'Hydropower' ? "N/A" : ''}
                    </TableCell>
                  </TableRow>
                  {project?.assessment?.solarUsage === 'Power generation' ?
                    <TableRow>
                      <TableCell sx={{ fontWeight: "Medium" }}>System Type</TableCell>
                      <TableCell align="left">
                        {project.assessment.solarSystemTypes}
                      </TableCell>
                    </TableRow> : null}
                  {project?.assessment?.solarUsage === 'Solar Pump' ?
                    <>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "Medium" }}>Flow rate</TableCell>
                        <TableCell align="left">
                          {project.assessment.flowRate} (m<sup>3</sup>/hr)
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "Medium" }}>Serviceable area</TableCell>
                        <TableCell align="left">
                          {project.assessment.serviceArea} (ha)
                        </TableCell>
                      </TableRow>
                    </>
                    : null}
                  {project?.assessment?.solarUsage !== "Solar Street Lights" ?
                    <TableRow>
                      <TableCell sx={{ fontWeight: "Medium" }}>Capacity</TableCell>
                      <TableCell align="left">
                        {project?.assessment?.capacity}
                        {project?.properties?.reCat === 'Wind Energy' ? <> <var>Wp</var></> : project?.properties?.reCat === 'Biomass' ? <> <var>m&sup3;</var></> : <> <var>Wp</var></>}
                      </TableCell>
                    </TableRow> :
                    project?.assessment?.solarStreetLights.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontWeight: "Medium" }}>Item {index + 1}</TableCell>
                        <TableCell align="left">
                          No. of pcs: {item.pcs}, ({item.capacity}<var>Wp</var>)
                        </TableCell>
                      </TableRow>
                    ))}
                  {project?.properties?.reCat === 'Biomass' ?
                    <TableRow>
                      <TableCell sx={{ fontWeight: "Medium" }}>{project?.assessment?.biomassPriUsage} usage</TableCell>
                      <TableCell align="left">
                        {project.assessment.bioUsage}
                      </TableCell>
                    </TableRow> : null}
                  {project?.properties?.reCat === 'Wind Energy' ?
                    <TableRow>
                      <TableCell sx={{ fontWeight: "Medium" }}>Service area</TableCell>
                      <TableCell align="left">
                        {project?.assessment?.serviceArea} m<sup>2</sup>
                      </TableCell>
                    </TableRow> : null}
                  <TableRow>
                    <TableCell sx={{ fontWeight: "Medium" }}>Acquisition</TableCell>
                    <TableCell align="left">
                      {project?.properties?.acquisition}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "Medium" }}>Year Established</TableCell>
                    <TableCell align="left">
                      {project?.properties?.yearEst}
                    </TableCell>
                  </TableRow>
                  {/* <TableRow>
                <TableCell sx={{ fontWeight: "Medium" }}>Owner</TableCell>
                <TableCell align="left">
                  {project?.properties?.ownerName}
                </TableCell>
              </TableRow> */}
                  {username ?
                    <TableRow>
                      <TableCell sx={{ fontWeight: "Medium" }}>Country</TableCell>
                      <TableCell align="left">
                        {project?.properties?.address?.country},{" "}
                        {project?.properties?.address?.region}
                      </TableCell>
                    </TableRow> : null}
                  {username ?
                    <TableRow>
                      <TableCell sx={{ fontWeight: "Medium" }}>Province</TableCell>
                      <TableCell align="left">
                        {project?.properties?.address?.province}
                      </TableCell>
                    </TableRow> : null}
                  {username ?
                    <TableRow>
                      <TableCell sx={{ fontWeight: "Medium" }}>City/Municipality</TableCell>
                      <TableCell align="left">
                        {project?.properties?.address?.city}
                      </TableCell>
                    </TableRow> : null}
                  {username ?
                    <TableRow>
                      <TableCell sx={{ fontWeight: "Medium" }}>Barangay</TableCell>
                      <TableCell align="left">
                        {project?.properties?.address?.brgy}
                      </TableCell>
                    </TableRow> : null}


                  <TableRow  >
                    <TableCell sx={{ fontWeight: "Medium" }}>Status</TableCell>
                    <TableCell align="left" >
                      {project?.assessment?.status} as of {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                  </TableRow>




                  {/* {project?.images?.length !== 0 ?
                <TableRow>
                  <TableCell sx={{ fontWeight: "Medium" }}>Images</TableCell>
                  <TableCell align="left">
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => {
                        setOpenModal(true)
                        props.setActive(false)
                      }}
                    >
                      View Images
                    </Link>
                  </TableCell>
                </TableRow> : ''} */}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          {project?.properties?.reCat === "Solar Energy" ?
            <Paper sx={{ position: 'fixed', bottom: 0, width: 350, maxWidth: { sm: 350, md: 350 } }} elevation={3}>
              <Button
                fullWidth
                sx={{ backgroundColor: "primary", borderRadius: 0 }}
                size="small"
                variant="contained"
                // startIcon={<ClearAllIcon />}
                // onClick={genModal}
                onClick={() => {
                  setOpenGenModal(true)
                }}
                endIcon={<EnergySavingsLeafOutlinedIcon />}
              >
                Energy estimate
              </Button>

            </Paper> : null}
        </Box>
      </Drawer>
      {/* </Snackbar> */}
      <GenModal openGenModal={openGenModal} setOpenGenModal={setOpenGenModal} setActive={props.setActive} project={project || null} />
      <Modal openModal={openModal} setOpenModal={setOpenModal} setActive={props.setActive} project={project || null} />
    </>
  )
}