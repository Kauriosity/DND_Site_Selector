import assert from 'node:assert/strict'
import test from 'node:test'
import {
  addSiteToCart,
  matchesFilters,
  partitionSites,
  removeSiteFromCart,
} from './inventory.js'

const sites = [
  {
    id: '1',
    siteCode: 'A/1',
    zone: 'DELHI',
    displayType: 'UNIPOLE',
    mediaStatus: 'Frontlit Flex',
    location: 'DELHI TO NOIDA',
  },
  {
    id: '2',
    siteCode: 'B/2',
    zone: 'NOIDA',
    displayType: 'GANTRY',
    mediaStatus: 'Backlit Flex',
    location: 'TOLL PLAZA',
  },
]

test('cart add is unique and remove restores availability', () => {
  let selected = addSiteToCart([], '1')
  selected = addSiteToCart(selected, '1')
  assert.deepEqual(selected, ['1'])

  const first = partitionSites(sites, selected)
  assert.equal(first.availableSites.length, 1)
  assert.equal(first.selectedSites[0].siteCode, 'A/1')

  selected = removeSiteFromCart(selected, '1')
  const restored = partitionSites(sites, selected)
  assert.equal(restored.availableSites.length, 2)
  assert.equal(restored.selectedSites.length, 0)
})

test('filters hide map inventory without mutating selected identity', () => {
  const selected = ['1']
  const { availableSites, selectedSites } = partitionSites(sites, selected)
  assert.equal(selectedSites[0].id, '1')
  assert.equal(
    availableSites.filter((site) =>
      matchesFilters(site, { query: 'plaza', zone: '', displayType: '', mediaStatus: '' }),
    ).length,
    1,
  )
  assert.equal(
    availableSites.filter((site) =>
      matchesFilters(site, { query: 'zzz', zone: '', displayType: '', mediaStatus: '' }),
    ).length,
    0,
  )
})
