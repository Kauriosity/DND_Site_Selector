# DND Site Selector

Times OOH prototype for browsing Delhi–Noida Expressway (DND) out-of-home inventory on a map and selecting sites by dragging them into a cart.

This is a front-end-only shopping-style inventory picker. There is no backend, login, pricing, or campaign workflow.

## How to run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

Optional checks:

```bash
npm test
npm run build
npm run preview
```

The inventory is loaded from `src/data/sites.json`, generated from `DND- Site List Latitude Longitude.xlsx`.

To regenerate the JSON after spreadsheet changes (requires Python and `openpyxl`):

```bash
pip install openpyxl
python scripts/convert-xlsx.py "path/to/DND- Site List Latitude Longitude.xlsx"
```

## Assumptions

- Site selection happens only by dragging a map pin onto the cart. Clicking a pin shows details; it does not add the site.
- Spreadsheet `Sr.No` is stored as `id` and used as the unique key. `siteCode` is preserved exactly, including duplicate codes that exist in the source file (`LANDSCAPE ADVERTISING` appears five times; `DND/N/MP/PKG-25` appears twice).
- Google Maps links are not invented. Every row uses the spreadsheet `HYPERLINK` formula `http://maps.google.com/?q={lat},{lng}`.
- Area values come from the spreadsheet where cached; otherwise they are computed as width × height × qty.
- Empty optional cells become `null` and are omitted from the UI.
- Filters affect only map inventory. A selected cart item stays selected even if it no longer matches the current search or filter.
- Removing a cart item returns the original site object to the available set. If active filters hide it, it will not reappear on the map until filters match.

## Key implementation decisions

- **React + Vite**, with React state/hooks only. No extra state library.
- **Leaflet / React-Leaflet** for the map, fitted to the 122 DND coordinates on load.
- **leaflet.markercluster** for overlapping and near-identical coordinates. Clusters show a live `+N` count. Zooming in, or clicking a cluster at max zoom, spiderfies the group so each site can be dragged independently. Sites are never merged.
- **Custom billboard-style pins** encode display type with both color and a letter, plus a hover tooltip for site code.
- **Pointer-based drag-and-drop**, not HTML5 drag APIs. Leaflet captures mouse events for panning, so a pointer threshold (8px) starts a ghost pin; dropping on the cart adds the site, dropping elsewhere restores it.
- Cart and map share one inventory model: a site is either available or selected, never both, and never duplicated in the cart.
- Search matches site code and location. Zone, display type, and media status filters are derived from the dataset.

## Edge cases handled

- Dropping a pin outside the cart does not select it.
- Removing the last cart item returns the empty cart state.
- Identical and near-identical coordinates cluster and can still be selected individually after spiderfy/zoom.
- Duplicate site codes remain separate records via `id`.
- Clicking a pin never adds it to the cart.
- Selected sites disappear from the map; removing them restores the same objects.
- Missing optional fields and missing Google Maps URLs are hidden rather than fabricated.
- Search/filter combinations that match nothing show an empty map state without clearing the cart.
- Restoring a site while filters are active only shows it if it still matches.
- Site codes with slashes or unexpected characters are escaped in pin HTML and displayed as-is in the cart.
- Marker drag updates do not re-render every pin on every pointer move.

## What I would build next with more time

- Real-time inventory availability
- Date-based booking
- Pricing and quotation
- Persistent carts
- Campaign creation
- User accounts and roles
- Backend inventory APIs
- Integration with existing OOH inventory systems
- Keyboard-accessible selection as a complement to drag-and-drop
- Saved shortlists and shareable cart links

## AI tools used and what was changed/rejected from AI output

Built with Cursor Grok 4.6. Generated scaffolding and component drafts were reviewed and changed before use:

- Rejected HTML5 native drag-and-drop as the map interaction. Leaflet pan/click handling made it unreliable; pointer capture with a movement threshold is the actual implementation.
- Rejected using latitude/longitude or raw `siteCode` as the only identity. The spreadsheet contains duplicate codes, so `id` comes from `Sr.No` while `siteCode` stays visible.
- Rejected leaving Google Maps cells as the display text “Click here to map”. The JSON stores the URL produced by the spreadsheet `HYPERLINK` formula.
- Rejected a custom overlap algorithm. Leaflet.markercluster with spiderfy covers identical coordinates more reliably.
- Rejected putting ghost-pin coordinates in React context. That re-rendered all markers during drag; ghost position is published separately.
- Did not add authentication, payments, admin dashboards, or chat features from generic app templates.
