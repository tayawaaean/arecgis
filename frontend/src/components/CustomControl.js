import { useEffect, useMemo } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { createPortal } from 'react-dom'

const CustomControl = ({ position = 'topright', children }) => {
  const map = useMap()

  const container = useMemo(() => {
    const div = L.DomUtil.create('div', '')
    // Prevent map interactions when interacting with controls
    L.DomEvent.disableClickPropagation(div)
    L.DomEvent.disableScrollPropagation(div)
    return div
  }, [])

  useEffect(() => {
    if (!map) return
    const control = L.control({ position })
    control.onAdd = () => container
    control.addTo(map)
    return () => {
      try {
        control.remove()
      } catch (_) {}
    }
  }, [map, position, container])

  return createPortal(children, container)
}

export default CustomControl

