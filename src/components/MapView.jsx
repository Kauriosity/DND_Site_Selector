import { memo, useCallback, useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import {
  CLUSTER_RADIUS_PX,
  MAP_FIT_MAX_ZOOM,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  SPIDERFY_DISTANCE_MULTIPLIER,
} from '../constants.js'
import { useInventory } from '../context/InventoryContext.jsx'
import { createClusterIcon } from '../lib/icons.js'
import { LEGEND_ITEMS } from '../utils/displayTypes.js'
import { getCorridorPositions } from '../utils/inventory.js'
import MarkerClusterGroup from './MarkerClusterGroup.jsx'
import SiteMarker from './SiteMarker.jsx'

function MapView() {
  const { allSites, visibleSites, filters } = useInventory()
  const [mapReady, setMapReady] = useState(false)
  const handleMapReady = useCallback(() => setMapReady(true), [])
  const corridorPositions = useMemo(() => getCorridorPositions(allSites), [allSites])
  const hasNoResults = visibleSites.length === 0
  const hasActiveFilters =
    Boolean(filters.query.trim()) ||
    Boolean(filters.zone) ||
    Boolean(filters.displayType) ||
    Boolean(filters.mediaStatus)

  return (
    <section className="map-panel" aria-label="DND corridor map">
      {!mapReady ? (
        <div className="map-status" role="status">
          Loading DND corridor map…
        </div>
      ) : null}

      <MapContainer
        className="map-panel__canvas"
        bounds={corridorPositions}
        boundsOptions={{ padding: [40, 40], maxZoom: MAP_FIT_MAX_ZOOM }}
        minZoom={MAP_MIN_ZOOM}
        maxZoom={MAP_MAX_ZOOM}
        scrollWheelZoom
        whenReady={handleMapReady}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          spiderfyOnMaxZoom
          zoomToBoundsOnClick
          maxClusterRadius={CLUSTER_RADIUS_PX}
          spiderfyDistanceMultiplier={SPIDERFY_DISTANCE_MULTIPLIER}
          iconCreateFunction={createClusterIcon}
          animateAddingMarkers={false}
        >
          {visibleSites.map((site) => (
            <SiteMarker key={site.id} site={site} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {mapReady && hasNoResults ? (
        <div className="map-empty" role="status">
          <p className="map-empty__title">No sites match these filters</p>
          <p className="map-empty__copy">
            {hasActiveFilters
              ? 'Try a different search or clear filters. Sites already in your cart stay selected.'
              : 'All matching sites are currently in your cart.'}
          </p>
        </div>
      ) : null}

      <div className="map-legend" aria-label="Display type legend">
        {LEGEND_ITEMS.map((item) => (
          <p key={item.group} className="map-legend__item">
            <span className={`map-legend__swatch map-legend__swatch--${item.group}`} />
            {item.label}
          </p>
        ))}
      </div>
    </section>
  )
}

export default memo(MapView)
