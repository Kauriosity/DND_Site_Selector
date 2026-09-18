import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { DRAG_STATES, DRAG_THRESHOLD_PX, DROP_FEEDBACK_MS } from '../constants.js'
import { useInventory } from './InventoryContext.jsx'

const DragActionsContext = createContext(null)
const DragStatusContext = createContext(null)

let ghostListener = null

export function subscribeGhostPosition(listener) {
  ghostListener = listener
  return () => {
    if (ghostListener === listener) ghostListener = null
  }
}

function publishGhostPosition(point) {
  ghostListener?.(point)
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function getPoint(event) {
  if (event.clientX != null && event.clientY != null) {
    return { x: event.clientX, y: event.clientY }
  }
  const touch = event.changedTouches?.[0] || event.touches?.[0]
  return touch ? { x: touch.clientX, y: touch.clientY } : null
}

function isPointInElement(x, y, element) {
  if (!element) return false
  const rect = element.getBoundingClientRect()
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

function setMapInteractivity(map, enabled) {
  if (!map) return
  const method = enabled ? 'enable' : 'disable'
  map.dragging?.[method]()
  map.touchZoom?.[method]()
  map.doubleClickZoom?.[method]()
  map.scrollWheelZoom?.[method]()
  map.boxZoom?.[method]()
  map.keyboard?.[method]()
}

export function DragProvider({ children }) {
  const { addToCart } = useInventory()
  const [dragState, setDragState] = useState(DRAG_STATES.IDLE)
  const [draggedSite, setDraggedSite] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')

  const cartRef = useRef(null)
  const sessionRef = useRef(null)
  const suppressClickRef = useRef(false)
  const feedbackTimerRef = useRef(null)

  const registerCartTarget = useCallback((node) => {
    cartRef.current = node
  }, [])

  const finishFeedback = useCallback((nextState, message) => {
    setDragState(nextState)
    setStatusMessage(message)
    window.clearTimeout(feedbackTimerRef.current)
    feedbackTimerRef.current = window.setTimeout(() => {
      setDragState(DRAG_STATES.IDLE)
      setDraggedSite(null)
    }, DROP_FEEDBACK_MS)
  }, [])

  const shouldSuppressClick = useCallback(() => suppressClickRef.current, [])

  const beginMarkerPress = useCallback(
    (site, event, marker, map) => {
      if (event.button != null && event.button !== 0) return
      if (sessionRef.current) return

      const origin = getPoint(event)
      if (!origin) return

      const session = {
        site,
        marker,
        map,
        origin,
        didDrag: false,
        overCart: false,
      }
      sessionRef.current = session
      publishGhostPosition(origin)

      const markerEl = marker.getElement()

      const onMove = (moveEvent) => {
        const point = getPoint(moveEvent)
        if (!point) return
        publishGhostPosition(point)

        if (!session.didDrag) {
          if (distance(session.origin, point) < DRAG_THRESHOLD_PX) return
          session.didDrag = true
          marker.closePopup?.()
          marker.closeTooltip?.()
          markerEl?.classList.add('is-dragging-source')
          document.body.classList.add('is-site-dragging')
          setMapInteractivity(map, false)
          setDraggedSite(site)
          setDragState(DRAG_STATES.DRAGGING)
        }

        const overCart = isPointInElement(point.x, point.y, cartRef.current)
        if (session.overCart !== overCart) {
          session.overCart = overCart
          setDragState(overCart ? DRAG_STATES.DRAGGING_OVER_CART : DRAG_STATES.DRAGGING)
        }
      }

      const onUp = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onUp)
        markerEl?.classList.remove('is-dragging-source')
        document.body.classList.remove('is-site-dragging')
        setMapInteractivity(map, true)

        const didDrag = session.didDrag
        const overCart = session.overCart
        sessionRef.current = null

        if (didDrag) {
          suppressClickRef.current = true
          marker.closePopup?.()
          window.setTimeout(() => {
            marker.closePopup?.()
            suppressClickRef.current = false
          }, 80)
        }

        if (!didDrag) return

        if (overCart) {
          addToCart(site.id)
          finishFeedback(DRAG_STATES.SUCCESSFUL_DROP, `${site.siteCode} added to cart`)
          return
        }

        finishFeedback(
          DRAG_STATES.INVALID_DROP,
          'Site was not added. Drop it on the cart to select.',
        )
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
    },
    [addToCart, finishFeedback],
  )

  const actions = useMemo(
    () => ({
      beginMarkerPress,
      registerCartTarget,
      shouldSuppressClick,
    }),
    [beginMarkerPress, registerCartTarget, shouldSuppressClick],
  )

  const isDragging =
    dragState === DRAG_STATES.DRAGGING || dragState === DRAG_STATES.DRAGGING_OVER_CART

  const status = useMemo(
    () => ({
      dragState,
      draggedSite,
      statusMessage,
      isDragging,
      isOverCart: dragState === DRAG_STATES.DRAGGING_OVER_CART,
      justSucceeded: dragState === DRAG_STATES.SUCCESSFUL_DROP,
      justRejected: dragState === DRAG_STATES.INVALID_DROP,
    }),
    [dragState, draggedSite, isDragging, statusMessage],
  )

  return (
    <DragActionsContext.Provider value={actions}>
      <DragStatusContext.Provider value={status}>{children}</DragStatusContext.Provider>
    </DragActionsContext.Provider>
  )
}

export function useDragActions() {
  const context = useContext(DragActionsContext)
  if (!context) {
    throw new Error('useDragActions must be used within DragProvider')
  }
  return context
}

export function useDragStatus() {
  const context = useContext(DragStatusContext)
  if (!context) {
    throw new Error('useDragStatus must be used within DragProvider')
  }
  return context
}
