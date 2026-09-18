import { createElementObject, createLayerComponent, extendContext } from '@react-leaflet/core'
import L from '../lib/leaflet.js'
import '../lib/leafletCluster.js'

const MarkerClusterGroup = createLayerComponent(
  function createMarkerClusterGroup({ children: _children, ...options }, context) {
    const group = L.markerClusterGroup(options)
    return createElementObject(
      group,
      extendContext(context, {
        layerContainer: group,
      }),
    )
  },
)

export default MarkerClusterGroup
