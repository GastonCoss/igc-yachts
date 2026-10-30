import type { Where } from 'payload'
import { DRIVES, FEATURES, FUELS, GALLEY_POSITIONS, MASTER_POSITIONS, YACHT_TYPES } from './options'

export type SearchParams = Record<string, string | string[] | undefined>

const list = (v: string | string[] | undefined): string[] =>
  (Array.isArray(v) ? v : v ? [v] : []).flatMap((s) => s.split(',')).filter(Boolean)

const one = (v: string | string[] | undefined): string => (Array.isArray(v) ? v[0] : v) ?? ''

const numParam = (v: string | string[] | undefined): number | null => {
  const raw = one(v).replace(/[^0-9.]/g, '')
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

const allowed = (values: string[], opts: { value: string }[]) =>
  values.filter((v) => opts.some((o) => o.value === v))

export const SORTS = [
  { value: 'newest', label: 'Newest first', sort: '-createdAt' },
  { value: 'price-asc', label: 'Price: low to high', sort: 'priceFromEur' },
  { value: 'price-desc', label: 'Price: high to low', sort: '-priceFromEur' },
  { value: 'length-asc', label: 'Length: short to long', sort: 'loaM' },
  { value: 'length-desc', label: 'Length: long to short', sort: '-loaM' },
  { value: 'name', label: 'Name A–Z', sort: 'title' },
]

/** Lit les paramètres de l'URL (/yachts?type=flybridge&cabins=3…) et construit la requête Payload. */
export function parseSearch(sp: SearchParams) {
  const f = {
    q: one(sp.q).trim(),
    builder: list(sp.builder),
    type: allowed(list(sp.type), YACHT_TYPES),
    priceMin: numParam(sp.priceMin),
    priceMax: numParam(sp.priceMax),
    lenMin: numParam(sp.lenMin),
    lenMax: numParam(sp.lenMax),
    cabins: numParam(sp.cabins),
    guests: numParam(sp.guests),
    speed: numParam(sp.speed),
    fuel: allowed(list(sp.fuel), FUELS),
    drive: allowed(list(sp.drive), DRIVES),
    blades: numParam(sp.blades),
    galley: allowed(list(sp.galley), GALLEY_POSITIONS),
    master: allowed(list(sp.master), MASTER_POSITIONS),
    feature: list(sp.feature).filter((n) => FEATURES.some((x) => x.name === n)),
    sort: SORTS.some((s) => s.value === one(sp.sort)) ? one(sp.sort) : 'newest',
    page: Math.max(1, numParam(sp.page) ?? 1),
  }

  const and: Where[] = [{ _status: { equals: 'published' } }]

  if (f.q) {
    for (const word of f.q.split(/\s+/).slice(0, 5)) {
      and.push({ or: [{ title: { like: word } }, { range: { like: word } }] })
    }
  }
  if (f.builder.length) and.push({ 'builder.slug': { in: f.builder } })
  if (f.type.length) and.push({ type: { in: f.type } })
  if (f.priceMin !== null) and.push({ priceFromEur: { greater_than_equal: f.priceMin } })
  if (f.priceMax !== null) and.push({ priceFromEur: { less_than_equal: f.priceMax } })
  if (f.lenMin !== null) and.push({ loaM: { greater_than_equal: f.lenMin } })
  if (f.lenMax !== null) and.push({ loaM: { less_than_equal: f.lenMax } })
  if (f.cabins !== null) and.push({ 'layouts.cabins': { greater_than_equal: f.cabins } })
  if (f.guests !== null) and.push({ 'layouts.guests': { greater_than_equal: f.guests } })
  if (f.speed !== null) and.push({ 'engineOptions.maxSpeedKn': { greater_than_equal: f.speed } })
  if (f.fuel.length) and.push({ 'engineOptions.fuel': { in: f.fuel } })
  if (f.drive.length) and.push({ 'engineOptions.drive': { in: f.drive } })
  if (f.blades !== null) and.push({ 'engineOptions.propellerBlades': { equals: f.blades } })
  if (f.galley.length) and.push({ galleyPosition: { in: f.galley } })
  if (f.master.length) and.push({ masterPosition: { in: f.master } })
  for (const name of f.feature) and.push({ [`features.${name}`]: { equals: true } })

  const sort = SORTS.find((s) => s.value === f.sort)!.sort

  const activeCount =
    (f.q ? 1 : 0) +
    f.builder.length +
    f.type.length +
    [f.priceMin, f.priceMax, f.lenMin, f.lenMax, f.cabins, f.guests, f.speed, f.blades].filter((v) => v !== null).length +
    f.fuel.length +
    f.drive.length +
    f.galley.length +
    f.master.length +
    f.feature.length

  return { filters: f, where: { and } as Where, sort, activeCount }
}

export type Filters = ReturnType<typeof parseSearch>['filters']

/** Reconstruit une URL en changeant un paramètre (utilisé pour la pagination et le tri). */
export function hrefWith(sp: SearchParams, changes: Record<string, string | null>) {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined || k in changes) continue
    for (const item of Array.isArray(v) ? v : [v]) params.append(k, item)
  }
  for (const [k, v] of Object.entries(changes)) if (v !== null) params.set(k, v)
  const s = params.toString()
  return s ? `/yachts?${s}` : '/yachts'
}
