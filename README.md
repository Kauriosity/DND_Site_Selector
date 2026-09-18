# DND Site Selector

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Drag a map pin onto the cart to select a site.

## Edge cases

- Dropping a pin outside the cart does not add it.
- Clicking a pin shows details only; it does not add the site.
- Selected sites leave the map and return when removed from the cart.
- Overlapping coordinates cluster as `+N` and can be selected individually after zoom/spiderfy.
- Duplicate site codes stay separate via `id`.
- Empty search/filter results do not clear the cart.
- A selected site stays in the cart even if filters no longer match it.
- Removing a site while filters are active only shows it on the map if it still matches.
- Missing optional fields and missing Google Maps links are hidden.
