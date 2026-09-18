import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

/** Keeps Leaflet tile layers aligned after zoom / layout changes. */
export default function MapViewportSync() {
  const map = useMap()

  useEffect(() => {
    const sync = () => {
      map.invalidateSize({ pan: false })
    }

    map.on('zoomend', sync)
    map.on('moveend', sync)
    map.on('resize', sync)

    return () => {
      map.off('zoomend', sync)
      map.off('moveend', sync)
      map.off('resize', sync)
    }
  }, [map])

  return null
}
