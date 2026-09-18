import { formatArea, formatCoordinate, formatDimensions } from '../utils/format.js'

function Detail({ label, value }) {
  if (!value) return null
  return (
    <div className="site-popup__row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function SitePopup({ site }) {
  const dimensions = formatDimensions(site)
  const area = formatArea(site.area)

  return (
    <article className="site-popup">
      <p className="site-popup__kicker">{site.displayType}</p>
      <h3 className="site-popup__code">{site.siteCode}</h3>
      <dl className="site-popup__list">
        <Detail label="Zone" value={site.zone} />
        <Detail label="Location" value={site.location} />
        <Detail label="Latitude" value={formatCoordinate(site.latitude)} />
        <Detail label="Longitude" value={formatCoordinate(site.longitude)} />
        <Detail label="Size" value={dimensions} />
        <Detail label="Area" value={area} />
        <Detail label="Media" value={site.mediaStatus} />
        <Detail label="Lit" value={site.litStatus} />
        <Detail label="Qty" value={site.qty > 1 ? String(site.qty) : null} />
      </dl>
      {site.googleMapsUrl ? (
        <a
          className="site-popup__maps"
          href={site.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Google Maps
        </a>
      ) : null}
      <p className="site-popup__hint">Drag the pin onto the cart to select this site.</p>
    </article>
  )
}

export default SitePopup
