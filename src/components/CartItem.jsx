import { formatArea, formatCoordinate, formatDimensions } from '../utils/format.js'

function Meta({ label, value }) {
  if (!value) return null
  return (
    <p className="cart-item__meta">
      <span>{label}</span>
      <strong>{value}</strong>
    </p>
  )
}

function CartItem({ site, onRemove }) {
  const dimensions = formatDimensions(site)
  const area = formatArea(site.area)
  const mediaLabel = [site.mediaStatus, site.litStatus].filter(Boolean).join(' · ')

  return (
    <article className="cart-item">
      <header className="cart-item__header">
        <h3 className="cart-item__code">{site.siteCode}</h3>
        {site.displayType ? <p className="cart-item__type">{site.displayType}</p> : null}
      </header>

      <p className="cart-item__coords">
        {formatCoordinate(site.latitude)}, {formatCoordinate(site.longitude)}
      </p>

      <Meta label="Zone" value={site.zone} />
      <Meta label="Location" value={site.location} />
      <Meta label="Size" value={dimensions} />
      <Meta label="Area" value={area} />
      <Meta label="Media" value={mediaLabel} />

      <div className="cart-item__actions">
        {site.googleMapsUrl ? (
          <a
            className="cart-item__maps"
            href={site.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Google Maps
          </a>
        ) : null}
        <button
          type="button"
          className="cart-item__remove"
          onClick={() => onRemove(site.id)}
          aria-label={`Remove ${site.siteCode} from cart`}
        >
          Remove
        </button>
      </div>
    </article>
  )
}

export default CartItem
