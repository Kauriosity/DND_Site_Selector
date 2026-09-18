import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import dataset from '../data/sites.json'
import {
  addSiteToCart,
  getFilterOptions,
  matchesFilters,
  partitionSites,
  removeSiteFromCart,
  EMPTY_FILTERS,
} from '../utils/inventory.js'

const InventoryContext = createContext(null)

function loadInventory() {
  const sites = dataset?.sites
  if (!Array.isArray(sites) || sites.length === 0) {
    throw new Error('Site inventory is empty or missing.')
  }
  return sites
}

export function InventoryProvider({ children }) {
  const loaded = useMemo(() => {
    try {
      return { sites: loadInventory(), error: null }
    } catch (error) {
      return { sites: [], error: error.message || 'Failed to load site inventory.' }
    }
  }, [])

  const [selectedIds, setSelectedIds] = useState([])
  const [filters, setFilters] = useState(EMPTY_FILTERS)

  const addToCart = useCallback((siteId) => {
    setSelectedIds((current) => addSiteToCart(current, siteId))
  }, [])

  const removeFromCart = useCallback((siteId) => {
    setSelectedIds((current) => removeSiteFromCart(current, siteId))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS)
  }, [])

  const value = useMemo(() => {
    const { availableSites, selectedSites } = partitionSites(loaded.sites, selectedIds)
    const visibleSites = availableSites.filter((site) => matchesFilters(site, filters))

    return {
      status: loaded.error ? 'error' : 'ready',
      error: loaded.error,
      allSites: loaded.sites,
      availableSites,
      selectedSites,
      visibleSites,
      selectedIds,
      filters,
      filterOptions: getFilterOptions(loaded.sites),
      addToCart,
      removeFromCart,
      setFilters,
      resetFilters,
    }
  }, [addToCart, filters, loaded, removeFromCart, resetFilters, selectedIds])

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider')
  }
  return context
}
