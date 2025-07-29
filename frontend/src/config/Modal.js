import {
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    styled,
    Box,
    Grid,
    ImageList,
    ImageListItem,
} from "@mui/material"
import PropTypes from "prop-types"
import {
    Close as CloseIcon,
} from "@mui/icons-material"
import Carousel from "react-material-ui-carousel"
import { baseUrl } from "./baseUrl"
import { Lightbox } from "react-modal-image"
import { useCallback, useEffect, useState } from "react"


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    // "& .MuiDialogContent-root": {
    //     padding: theme.spacing(2),
    // },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}))

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    )
}
BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
}

export const Modal = (props) => {
    const handleCloseModal = () => {
        props.setOpenModal(false)
        props.setActive(true)
    }

    const [openImage, setOpenImage] = useState(false)
    const [image, setImage] = useState('')

    
    return (
        <>
            <BootstrapDialog 
                onClose={handleCloseModal}
                open={props.openModal}
                fullWidth
                maxWidth={"sm"}
            >
                <BootstrapDialogTitle id="custom-dialog-title" onClose={handleCloseModal}>
                    {props?.project?.properties?.reCat || 'Images'}
                </BootstrapDialogTitle>
                <DialogContent dividers >
                    {openImage && (<Lightbox
                        // large={`data:${image.contentType};base64, ${image.data.toString('base64')}`}
                        large={baseUrl + image}
                        alt={props.project.properties.reCat}
                        showRotate
                        onClose={() => setOpenImage(false)}
                    />)}
                    {props.project !== null ?
                        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                            {props?.project?.images.map((image, index) => (
                                <ImageListItem key={index}>
                                    <img
                                        // src={`data:${image.contentType};base64, ${image.data.toString('base64')}`}
                                        src={baseUrl + image}
                                        alt={props.project.properties.reCat}
                                        loading="lazy"
                                        onClick={() => {
                                            setImage(image)
                                            setOpenImage(true)
                                        }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                        : null}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCloseModal}>
                        Exit
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )
}