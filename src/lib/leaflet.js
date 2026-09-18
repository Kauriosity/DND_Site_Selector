import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// leaflet.markercluster expects a global L (UMD). Set it before that plugin loads.
globalThis.L = L

export default L
