import { useCallback, useMemo, useState } from 'react'
import { useInventory } from '../context/InventoryContext.jsx'

function notifyMapResize() {
  window.setTimeout(() => window.dispatchEvent(new Event('resize')), 150)
}

function SearchAndFilters() {
  const { filters, setFilters, filterOptions, resetFilters } = useInventory()
  const [open, setOpen] = useState(false)

  const hasActiveFilters =
    Boolean(filters.query.trim()) ||
    Boolean(filters.zone) ||
    Boolean(filters.displayType) ||
    Boolean(filters.mediaStatus)

  const summary = useMemo(() => {
    const parts = []
    if (filters.query.trim()) parts.push(`“${filters.query.trim()}”`)
    if (filters.zone) parts.push(filters.zone)
    if (filters.displayType) parts.push(filters.displayType)
    if (filters.mediaStatus) parts.push(filters.mediaStatus)
    return parts.length ? parts.join(' · ') : 'All sites on map'
  }, [filters])

  function update(key, value) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const closePanel = useCallback(() => {
    setOpen(false)
    notifyMapResize()
  }, [])

  const togglePanel = useCallback(() => {
    setOpen((current) => {
      const next = !current
      notifyMapResize()
      return next
    })
  }, [])

  function handleReset() {
    resetFilters()
    notifyMapResize()
  }

  return (
    <section
      className={`filters${open ? ' filters--open' : ''}`}
      aria-label="Search and filters"
    >
      <div className="filters__mobile-bar">
        <button
          type="button"
          className="filters__toggle"
          aria-expanded={open}
          aria-controls="filters-panel"
          onClick={togglePanel}
        >
          <span className="filters__toggle-label">Search & filters</span>
          <span className="filters__toggle-summary">{summary}</span>
        </button>
        {open ? (
          <button type="button" className="filters__done" onClick={closePanel}>
            Done
          </button>
        ) : null}
      </div>

      <div className="filters__panel" id="filters-panel">
        <label className="filters__search">
          <span className="filters__label">Search sites</span>
          <input
            type="search"
            value={filters.query}
            onChange={(event) => update('query', event.target.value)}
            placeholder="Search site code or location"
            autoComplete="off"
          />
        </label>

        <label className="filters__select">
          <span className="filters__label">Zone</span>
          <select value={filters.zone} onChange={(event) => update('zone', event.target.value)}>
            <option value="">All zones</option>
            {filterOptions.zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </label>

        <label className="filters__select">
          <span className="filters__label">Display type</span>
          <select
            value={filters.displayType}
            onChange={(event) => update('displayType', event.target.value)}
          >
            <option value="">All types</option>
            {filterOptions.displayTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="filters__select">
          <span className="filters__label">Media status</span>
          <select
            value={filters.mediaStatus}
            onChange={(event) => update('mediaStatus', event.target.value)}
          >
            <option value="">All media</option>
            {filterOptions.mediaStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        {hasActiveFilters ? (
          <button type="button" className="filters__reset" onClick={handleReset}>
            Clear filters
          </button>
        ) : null}
      </div>
    </section>
  )
}

export default SearchAndFilters
