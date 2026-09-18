import Header from './components/Header.jsx'
import SearchAndFilters from './components/SearchAndFilters.jsx'
import MapView from './components/MapView.jsx'
import Cart from './components/Cart.jsx'
import DragGhost from './components/DragGhost.jsx'
import { InventoryProvider, useInventory } from './context/InventoryContext.jsx'
import { DragProvider, useDragStatus } from './context/DragContext.jsx'

function StatusRegion() {
  const { statusMessage } = useDragStatus()
  return (
    <p className="sr-only" role="status" aria-live="polite">
      {statusMessage}
    </p>
  )
}

function Workspace() {
  const { status, error } = useInventory()

  if (status === 'error') {
    return (
      <div className="app-error" role="alert">
        <h1>Unable to load inventory</h1>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <DragProvider>
      <div className="app-shell">
        <Header />
        <SearchAndFilters />
        <main className="workspace">
          <MapView />
          <Cart />
        </main>
        <DragGhost />
        <StatusRegion />
      </div>
    </DragProvider>
  )
}

export default function App() {
  return (
    <InventoryProvider>
      <Workspace />
    </InventoryProvider>
  )
}
