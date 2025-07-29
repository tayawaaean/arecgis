import React, { useState } from 'react'
import {  Marker, useMapEvents } from 'react-leaflet'


const Test = () => {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
     click(){
       alert('hi')
     }

    })
    return position == null ? null : <Marker position={position}></Marker>
}

export default Test