import { useInventory } from '../context/InventoryContext.jsx'

function SearchAndFilters() {
  const { filters, setFilters, filterOptions, resetFilters } = useInventory()
  const hasActiveFilters =
    Boolean(filters.query.trim()) ||
    Boolean(filters.zone) ||
    Boolean(filters.displayType) ||
    Boolean(filters.mediaStatus)

  function update(key, value) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return (
    <section className="filters" aria-label="Search and filters">
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
        <button type="button" className="filters__reset" onClick={resetFilters}>
          Clear filters
        </button>
      ) : null}
    </section>
  )
}

export default SearchAndFilters
