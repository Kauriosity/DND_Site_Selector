import { DRAG_STATES } from '../constants.js'
import { useDragActions, useDragStatus } from '../context/DragContext.jsx'
import { useInventory } from '../context/InventoryContext.jsx'
import CartItem from './CartItem.jsx'
import EmptyCart from './EmptyCart.jsx'

function Cart() {
  const { selectedSites, removeFromCart } = useInventory()
  const { registerCartTarget } = useDragActions()
  const { dragState, draggedSite, isDragging, isOverCart, justSucceeded } = useDragStatus()

  const count = selectedSites.length
  const cartClass = [
    'cart',
    isDragging ? 'cart--droppable' : '',
    isOverCart ? 'cart--hot' : '',
    justSucceeded ? 'cart--success' : '',
    dragState === DRAG_STATES.INVALID_DROP ? 'cart--miss' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={cartClass} aria-label="Your cart">
      <div className="cart__dropzone" ref={registerCartTarget} data-cart-dropzone="true">
        <header className="cart__header">
          <div>
            <p className="cart__eyebrow">Selection</p>
            <h2 className="cart__title">Your Cart</h2>
          </div>
          <p className="cart__count" aria-live="polite">
            {count} {count === 1 ? 'site' : 'sites'}
          </p>
        </header>

        {isDragging ? (
          <p className="cart__drop-hint">
            {isOverCart
              ? `Release to add ${draggedSite?.siteCode ?? 'this site'}`
              : 'Drop here to add this site'}
          </p>
        ) : null}

        <div className="cart__body">
          {count === 0 ? (
            <EmptyCart />
          ) : (
            <ul className="cart__list">
              {selectedSites.map((site) => (
                <li key={site.id}>
                  <CartItem site={site} onRemove={removeFromCart} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Cart
