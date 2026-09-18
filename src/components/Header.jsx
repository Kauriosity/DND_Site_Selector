import { useInventory } from '../context/InventoryContext.jsx'

function Header() {
  const { allSites, availableSites, selectedSites, visibleSites } = useInventory()

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <p className="app-header__company">Times OOH</p>
        <h1 className="app-header__title">DND Site Selector</h1>
        <p className="app-header__subtitle">Delhi–Noida Expressway inventory</p>
      </div>
      <p className="app-header__stats">
        <span>
          <strong>{visibleSites.length}</strong> on map
        </span>
        <span>
          <strong>{availableSites.length}</strong> available
        </span>
        <span>
          <strong>{selectedSites.length}</strong> selected
        </span>
        <span className="app-header__total">{allSites.length} sites</span>
      </p>
    </header>
  )
}

export default Header
