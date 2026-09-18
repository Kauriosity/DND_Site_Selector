import { useEffect, useState } from 'react'
import { getDisplayStyle } from '../utils/displayTypes.js'
import { subscribeGhostPosition, useDragStatus } from '../context/DragContext.jsx'

function DragGhost() {
  const { isDragging, draggedSite } = useDragStatus()
  const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 })

  useEffect(() => subscribeGhostPosition(setGhostPos), [])

  if (!isDragging || !draggedSite) return null

  const style = getDisplayStyle(draggedSite.displayType)

  return (
    <div
      className="drag-ghost"
      style={{ transform: `translate(${ghostPos.x}px, ${ghostPos.y}px)` }}
      aria-hidden="true"
    >
      <div className={`site-pin site-pin--${style.group} site-pin--ghost`}>
        <span className="site-pin__board">
          <span className="site-pin__glyph">{style.glyph}</span>
        </span>
        <span className="site-pin__needle"></span>
      </div>
      <p className="drag-ghost__code">{draggedSite.siteCode}</p>
    </div>
  )
}

export default DragGhost
