export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function formatCoordinate(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—'
  return value.toFixed(6)
}

export function formatDimensions(site) {
  if (site.width == null || site.height == null) return null
  return `${site.width} × ${site.height} ft`
}

export function formatArea(area) {
  if (area == null) return null
  return `${area.toLocaleString('en-IN')} sq ft`
}
