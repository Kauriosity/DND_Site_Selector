export const EMPTY_FILTERS = {
  query: '',
  zone: '',
  displayType: '',
  mediaStatus: '',
}

export function addSiteToCart(selectedIds, siteId) {
  if (selectedIds.includes(siteId)) return selectedIds
  return [...selectedIds, siteId]
}

export function removeSiteFromCart(selectedIds, siteId) {
  return selectedIds.filter((id) => id !== siteId)
}

export function partitionSites(sites, selectedIds) {
  const selectedSet = new Set(selectedIds)
  const byId = new Map(sites.map((site) => [site.id, site]))

  return {
    availableSites: sites.filter((site) => !selectedSet.has(site.id)),
    selectedSites: selectedIds.map((id) => byId.get(id)).filter(Boolean),
  }
}

export function matchesFilters(site, filters) {
  if (filters.zone && site.zone !== filters.zone) return false
  if (filters.displayType && site.displayType !== filters.displayType) return false
  if (filters.mediaStatus && site.mediaStatus !== filters.mediaStatus) return false

  const query = filters.query.trim().toLowerCase()
  if (query) {
    const code = (site.siteCode ?? '').toLowerCase()
    const location = (site.location ?? '').toLowerCase()
    if (!code.includes(query) && !location.includes(query)) return false
  }

  return true
}

export function getFilterOptions(sites) {
  const zones = new Set()
  const displayTypes = new Set()
  const mediaStatuses = new Set()

  for (const site of sites) {
    if (site.zone) zones.add(site.zone)
    if (site.displayType) displayTypes.add(site.displayType)
    if (site.mediaStatus) mediaStatuses.add(site.mediaStatus)
  }

  return {
    zones: [...zones].sort((a, b) => a.localeCompare(b)),
    displayTypes: [...displayTypes].sort((a, b) => a.localeCompare(b)),
    mediaStatuses: [...mediaStatuses].sort((a, b) => a.localeCompare(b)),
  }
}

export function getCorridorPositions(sites) {
  return sites.map((site) => [site.latitude, site.longitude])
}
