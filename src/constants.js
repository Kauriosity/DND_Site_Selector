export const DRAG_THRESHOLD_PX = 8

export const MAP_MAX_ZOOM = 19
export const MAP_MIN_ZOOM = 11
export const MAP_FIT_MAX_ZOOM = 14

/** Reliable basemap tiles (no API key). */
export const MAP_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
export const MAP_TILE_ATTRIBUTION =
  'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom'

export const CLUSTER_RADIUS_PX = 48
export const SPIDERFY_DISTANCE_MULTIPLIER = 2
export const CLUSTER_DISABLE_ZOOM = 16

export const DROP_FEEDBACK_MS = 900

export const DRAG_STATES = {
  IDLE: 'idle',
  DRAGGING: 'dragging',
  DRAGGING_OVER_CART: 'dragging_over_cart',
  SUCCESSFUL_DROP: 'successful_drop',
  INVALID_DROP: 'invalid_drop',
}
