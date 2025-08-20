import React, { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap , Popup} from 'react-leaflet'
import L from 'leaflet'
import Control from './CustomControl'
import { Button } from '@mui/material'
import {  Search as SearchIcon } from '@mui/icons-material'
import 'leaflet/dist/leaflet.css'
import Test from './Test'


import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
// import LeafletControlGeocoder from './LeafletControlGeocoder'


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  })
// let DefaultIcon = L.icon({
//     iconUrl: icon,
//     shadowUrl: iconShadow,
// })

// L.Marker.prototype.options.icon=DefaultIcon




const HandleFindSelfMap = () => {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({

     click(e){
        // reverseGeoCoding(e.latlng)
     }

    })
    return position == null ? null : <Marker position={position}></Marker>
}



const LeafletMap = () => {
    
    return (
        
        <div>
            <h1>Map</h1>
            <MapContainer
                style={{ height: '100vh' }}
                center={[51.505, -0.09]}
                zoom={13}
                scrollWheelZoom={true}
               
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            {/* <Control prepend position='topright'>
                <Button >
                    <SearchIcon/>
                </Button>
            </Control>  */}
            {/* <LeafletControlGeocoder/> */}

            
            {/* <Test /> */}

            {/* <HandleFindSelfMap /> */}
            <Marker position={[12.512797, 122.395164]}>
                <Popup>
                    qwe
                </Popup>
            </Marker>
            </MapContainer >
          
        </div>
        

    )
}

export default LeafletMap