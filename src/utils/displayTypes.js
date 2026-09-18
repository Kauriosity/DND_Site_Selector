const TYPE_STYLES = {
  UNIPOLE: { group: 'unipole', glyph: 'U', shortLabel: 'Unipole' },
  'V-POLE - UNIPOLE': { group: 'unipole', glyph: 'V', shortLabel: 'V-Pole' },
  'TWIN POLE - UNIPOLE': { group: 'unipole', glyph: 'T', shortLabel: 'Twin Pole' },
  TWINPOLE: { group: 'unipole', glyph: 'T', shortLabel: 'Twin Pole' },
  'SMART POLE- UNIPOLE': { group: 'unipole', glyph: 'S', shortLabel: 'Smart Pole' },
  'UNIPOLE - CANOPY': { group: 'unipole', glyph: 'C', shortLabel: 'Canopy' },
  GANTRY: { group: 'gantry', glyph: 'G', shortLabel: 'Gantry' },
  MUPI: { group: 'panel', glyph: 'M', shortLabel: 'MUPI' },
  'Map Panels': { group: 'panel', glyph: 'P', shortLabel: 'Map Panel' },
  'POLE KIOSK': { group: 'kiosk', glyph: 'K', shortLabel: 'Kiosk' },
  'FLAG POLE': { group: 'kiosk', glyph: 'F', shortLabel: 'Flag Pole' },
  'FLYOVER PANEL': { group: 'flyover', glyph: 'F', shortLabel: 'Flyover' },
  INNOVATION: { group: 'innovation', glyph: 'I', shortLabel: 'Innovation' },
  'Public Utility': { group: 'innovation', glyph: 'U', shortLabel: 'Utility' },
}

const FALLBACK = { group: 'unipole', glyph: '•', shortLabel: 'Site' }

export const LEGEND_ITEMS = [
  { group: 'unipole', label: 'Unipoles' },
  { group: 'gantry', label: 'Gantries' },
  { group: 'panel', label: 'MUPI / Map panels' },
  { group: 'kiosk', label: 'Kiosks / flags' },
  { group: 'flyover', label: 'Flyover panels' },
  { group: 'innovation', label: 'Innovation / utility' },
]

export function getDisplayStyle(displayType) {
  return TYPE_STYLES[displayType] || { ...FALLBACK, shortLabel: displayType || 'Site' }
}
