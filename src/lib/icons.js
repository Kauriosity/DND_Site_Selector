import L from './leaflet.js'
import { escapeHtml } from '../utils/format.js'
import { getDisplayStyle } from '../utils/displayTypes.js'

export function createSiteIcon(site) {
  const style = getDisplayStyle(site.displayType)
  const code = escapeHtml(site.siteCode)
  const typeLabel = escapeHtml(site.displayType || style.shortLabel)

  return L.divIcon({
    className: 'site-pin-wrapper',
    iconSize: [34, 44],
    iconAnchor: [17, 42],
    popupAnchor: [0, -36],
    tooltipAnchor: [0, -36],
    html: `
      <div
        class="site-pin site-pin--${style.group}"
        data-site-id="${escapeHtml(site.id)}"
        role="img"
        aria-label="Site ${code}, ${typeLabel}. Drag to the cart to select."
      >
        <span class="site-pin__board">
          <span class="site-pin__glyph">${escapeHtml(style.glyph)}</span>
        </span>
        <span class="site-pin__needle"></span>
      </div>
    `,
  })
}

export function createClusterIcon(cluster) {
  const count = cluster.getChildCount()
  return L.divIcon({
    className: 'cluster-pin-wrapper',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    html: `
      <div class="cluster-pin" role="img" aria-label="${count} overlapping sites. Zoom in or click to separate.">
        <span class="cluster-pin__label">+${count}</span>
      </div>
    `,
  })
}
