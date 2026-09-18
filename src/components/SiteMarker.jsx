import { memo, useMemo } from 'react'
import { Marker, Popup, Tooltip, useMap } from 'react-leaflet'
import { createSiteIcon } from '../lib/icons.js'
import { useDragActions } from '../context/DragContext.jsx'
import SitePopup from './SitePopup.jsx'

function SiteMarker({ site }) {
  const map = useMap()
  const { beginMarkerPress, shouldSuppressClick } = useDragActions()
  const icon = useMemo(() => createSiteIcon(site), [site])

  return (
    <Marker
      position={[site.latitude, site.longitude]}
      icon={icon}
      keyboard={false}
      eventHandlers={{
        add: (event) => {
          const marker = event.target
          const el = marker.getElement()
          if (!el) return
          el.style.touchAction = 'none'
          const onPointerDown = (pointerEvent) => {
            beginMarkerPress(site, pointerEvent, marker, map)
          }
          el.addEventListener('pointerdown', onPointerDown)
          el._dndOnPointerDown = onPointerDown
        },
        remove: (event) => {
          const el = event.target.getElement()
          if (el?._dndOnPointerDown) {
            el.removeEventListener('pointerdown', el._dndOnPointerDown)
            delete el._dndOnPointerDown
          }
        },
        click: (event) => {
          if (!shouldSuppressClick()) return
          event.target.closePopup()
          event.originalEvent?.stopPropagation?.()
        },
      }}
    >
      <Tooltip direction="top" offset={[0, -8]} opacity={1} className="site-tooltip">
        <span className="site-tooltip__code">{site.siteCode}</span>
        <span className="site-tooltip__type">{site.displayType}</span>
      </Tooltip>
      <Popup autoPan={false} className="site-popup-wrap" closeButton>
        <SitePopup site={site} />
      </Popup>
    </Marker>
  )
}

export default memo(SiteMarker)
