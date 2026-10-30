import type { Metadata } from 'next'
import Link from 'next/link'
import { Filters } from '@/components/site/Filters'
import { SortSelect } from '@/components/site/SortSelect'
import { YachtCard } from '@/components/site/YachtCard'
import { DRIVES, FEATURES, FUELS, GALLEY_POSITIONS, MASTER_POSITIONS, YACHT_TYPES, labelOf } from '@/lib/options'
import { getPayloadClient } from '@/lib/payload'
import { SORTS, hrefWith, parseSearch, type SearchParams } from '@/lib/search'
import type { YachtDoc } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Explore yachts' }

const PER_PAGE = 24

export default async function YachtsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const { filters: f, where, sort, activeCount } = parseSearch(sp)
  const payload = await getPayloadClient()

  const [result, builders] = await Promise.all([
    payload.find({ collection: 'yachts', where, sort, limit: PER_PAGE, page: f.page, depth: 1 }),
    payload.find({ collection: 'builders', limit: 300, sort: 'name', depth: 0, pagination: false }),
  ])

  const yachts = result.docs as unknown as YachtDoc[]
  const builderOpts = (builders.docs as { slug?: string | null; name: string }[])
    .filter((b) => b.slug)
    .map((b) => ({ slug: b.slug as string, name: b.name }))

  const chips: string[] = [
    ...(f.q ? [`“${f.q}”`] : []),
    ...f.type.map((v) => labelOf(YACHT_TYPES, v)),
    ...f.builder.map((s) => builderOpts.find((b) => b.slug === s)?.name ?? s),
    ...(f.priceMin !== null ? [`From €${f.priceMin.toLocaleString('en-GB')}`] : []),
    ...(f.priceMax !== null ? [`Up to €${f.priceMax.toLocaleString('en-GB')}`] : []),
    ...(f.lenMin !== null ? [`≥ ${f.lenMin} m`] : []),
    ...(f.lenMax !== null ? [`≤ ${f.lenMax} m`] : []),
    ...(f.cabins !== null ? [`${f.cabins}+ cabins`] : []),
    ...(f.guests !== null ? [`${f.guests}+ guests`] : []),
    ...(f.speed !== null ? [`${f.speed}+ kn`] : []),
    ...f.fuel.map((v) => labelOf(FUELS, v)),
    ...f.drive.map((v) => labelOf(DRIVES, v)),
    ...(f.blades !== null ? [`${f.blades}-blade props`] : []),
    ...f.galley.map((v) => labelOf(GALLEY_POSITIONS, v)),
    ...f.master.map((v) => `Master: ${labelOf(MASTER_POSITIONS, v)}`),
    ...f.feature.map((n) => FEATURES.find((x) => x.name === n)?.label ?? n),
  ]

  return (
    <>
      <div className="search-head">
        <div className="wrap">
          <span className="eyebrow">Yacht database</span>
          <h1>Explore yachts</h1>
          <form action="/yachts" className="hero-search" style={{ marginTop: 24 }}>
            <input className="input" type="search" name="q" defaultValue={f.q} placeholder="Search a builder or model…" />
            <button className="btn" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="wrap search-layout">
        <div>
          <input type="checkbox" id="filters-toggle" className="filters-toggle" hidden />
          <label htmlFor="filters-toggle" className="btn btn-ghost mobile-filters-toggle" style={{ marginBottom: 16 }}>
            Filters{activeCount ? ` (${activeCount})` : ''}
          </label>
          <Filters f={f} builders={builderOpts} />
        </div>

        <div>
          <div className="results-bar">
            <span>
              <strong>{result.totalDocs}</strong> {result.totalDocs === 1 ? 'yacht' : 'yachts'}
            </span>
            <SortSelect options={SORTS} value={f.sort} />
          </div>

          {chips.length ? (
            <div className="active-filters">
              {chips.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
              <Link href="/yachts" className="chip">
                Clear ×
              </Link>
            </div>
          ) : null}

          {yachts.length ? (
            <div className="grid">
              {yachts.map((y) => (
                <YachtCard key={y.id} yacht={y} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>No yacht matches all these criteria</h3>
              <p className="muted">Try removing a filter or widening your budget or length range.</p>
            </div>
          )}

          {result.totalPages > 1 ? (
            <nav className="pagination" aria-label="Pagination">
              {result.hasPrevPage && result.prevPage ? (
                <Link className="btn btn-ghost" href={hrefWith(sp, { page: String(result.prevPage) })}>
                  ← Previous
                </Link>
              ) : null}
              <span className="btn btn-ghost" aria-current="page">
                {result.page} / {result.totalPages}
              </span>
              {result.hasNextPage && result.nextPage ? (
                <Link className="btn btn-ghost" href={hrefWith(sp, { page: String(result.nextPage) })}>
                  Next →
                </Link>
              ) : null}
            </nav>
          ) : null}
        </div>
      </div>
    </>
  )
}
