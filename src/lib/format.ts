import type { BuilderDoc, EngineOption, LayoutOption, MediaDoc, YachtDoc } from './types'

const nf = (digits = 0) => new Intl.NumberFormat('en-GB', { maximumFractionDigits: digits })

export const isMedia = (m: unknown): m is MediaDoc => !!m && typeof m === 'object' && 'id' in (m as object)
export const isBuilder = (b: unknown): b is BuilderDoc => !!b && typeof b === 'object' && 'name' in (b as object)

export const mediaUrl = (m: unknown, size?: 'thumbnail' | 'card' | 'hero'): string | null => {
  if (!isMedia(m)) return null
  return (size && m.sizes?.[size]?.url) || m.url || null
}

export const builderName = (y: YachtDoc) => (isBuilder(y.builder) ? y.builder.name : '')

export const fmtPrice = (y: Pick<YachtDoc, 'priceFromEur' | 'priceOnRequest'>): string => {
  if (y.priceFromEur) {
    const v = y.priceFromEur
    if (v >= 1_000_000) return `€${nf(v >= 10_000_000 ? 1 : 2).format(v / 1_000_000)}M`
    if (v >= 1_000) return `€${nf(0).format(v / 1_000)}K`
    return `€${nf().format(v)}`
  }
  return y.priceOnRequest ? 'On request' : '—'
}

export const fmtEurFull = (v?: number | null) => (v ? `€${nf().format(v)}` : '—')
export const fmtM = (v?: number | null) => (v ? `${nf(2).format(v)} m` : null)
export const fmtFt = (v?: number | null) => (v ? `${nf(0).format(v * 3.28084)} ft` : null)
export const fmtN = (v?: number | null, unit = '', digits = 0) =>
  v || v === 0 ? `${nf(digits).format(v)}${unit ? ` ${unit}` : ''}` : null

const maxOf = (vals: (number | null | undefined)[]) => {
  const n = vals.filter((v): v is number => typeof v === 'number')
  return n.length ? Math.max(...n) : null
}
const minOf = (vals: (number | null | undefined)[]) => {
  const n = vals.filter((v): v is number => typeof v === 'number')
  return n.length ? Math.min(...n) : null
}

export const topSpeed = (y: YachtDoc) => maxOf((y.engineOptions ?? []).map((e) => e.maxSpeedKn))
export const cruiseSpeed = (y: YachtDoc) => maxOf((y.engineOptions ?? []).map((e) => e.cruiseSpeedKn))

export const cabinsRange = (y: YachtDoc): string | null => {
  const vals = (y.layouts ?? []).map((l) => l.cabins)
  const lo = minOf(vals)
  const hi = maxOf(vals)
  if (lo === null || hi === null) return null
  return lo === hi ? `${lo}` : `${lo}–${hi}`
}

export const guestsRange = (y: YachtDoc): string | null => {
  const vals = (y.layouts ?? []).map((l) => l.guests)
  const lo = minOf(vals)
  const hi = maxOf(vals)
  if (lo === null || hi === null) return null
  return lo === hi ? `${lo}` : `${lo}–${hi}`
}

export const standardEngine = (y: YachtDoc): EngineOption | null =>
  (y.engineOptions ?? []).find((e) => e.isStandard) ?? y.engineOptions?.[0] ?? null

export const standardLayout = (y: YachtDoc): LayoutOption | null =>
  (y.layouts ?? []).find((l) => l.isStandard) ?? y.layouts?.[0] ?? null

export const engineSummary = (e?: EngineOption | null): string | null => {
  if (!e) return null
  const name = [e.engineBrand, e.engineModel].filter(Boolean).join(' ')
  if (!name && !e.powerHpEach) return null
  const count = e.engineCount ?? 1
  return `${count} × ${name || 'engine'}${e.powerHpEach ? ` (${nf().format(e.powerHpEach)} hp)` : ''}`
}
