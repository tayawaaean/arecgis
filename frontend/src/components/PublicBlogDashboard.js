


import React, { useEffect, useState, memo } from 'react'
import { CssBaseline, Grid } from "@mui/material"


import useTitle from '../hooks/useTitle'
import { MoonLoader } from 'react-spinners'
import { useNavigate, useLocation } from 'react-router-dom'
// import { selectAllBlogs } from '../features/blogs/blogsApiSlice'
import { selectAllBlogs } from '../features/blogs/publicBlogsApiSlice'
import { MapContainer, TileLayer, GeoJSON, ZoomControl, LayersControl, Marker, useMap, FeatureGroup, Circle } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import Control from 'react-leaflet-custom-control'
import { Button, Modal, Drawer, Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { SnackBar } from './SnackBar'
import {
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    FilterAlt as FilterAltIcon,
    ListAlt as ListAltIcon,
    Home as HomeIcon,
}
    from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { reCats } from '../config/reCats'



const PublicBlogDashboard = () => {

    useTitle('ArecGIS | Blogs')

    const blogs = useSelector(selectAllBlogs)


    const navigate = useNavigate()


    if (blogs) {

        // const handleEdit = () => navigate(`/dashboard/blog/${blogId}`)
        return (
            <>
                <div></div>
            </>
        )
    } else return null
}
export default PublicBlogDashboard