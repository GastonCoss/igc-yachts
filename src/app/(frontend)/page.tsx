import Link from 'next/link'
import { YachtCard } from '@/components/site/YachtCard'
import { getPayloadClient } from '@/lib/payload'
import type { YachtDoc } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayloadClient()

  const [featured, latest, builders] = await Promise.all([
    payload.find({
      collection: 'yachts',
      where: { and: [{ _status: { equals: 'published' } }, { featured: { equals: true } }] },
      limit: 6,
      depth: 1,
      sort: '-updatedAt',
    }),
    payload.find({
      collection: 'yachts',
      where: { _status: { equals: 'published' } },
      limit: 6,
      depth: 1,
      sort: '-createdAt',
    }),
    payload.count({ collection: 'builders' }),
  ])

  const showcase = (featured.docs.length ? featured.docs : latest.docs) as unknown as YachtDoc[]

  return (
    <>
      <section className="home-hero">
        <div className="wrap">
          <span className="eyebrow">The yacht discovery engine</span>
          <h1>
            Find the yacht <em>made for you.</em>
          </h1>
          <p className="lead">
            Every model, every specification, comparable side by side. Search by budget, length, cabins, propulsion,
            layout and the details that actually matter on board.
          </p>
          <form action="/yachts" className="hero-search">
            <input
              className="input"
              type="search"
              name="q"
              placeholder="Search a builder or model — e.g. Pershing, Princess Y85…"
              aria-label="Search yachts"
            />
            <button className="btn" type="submit">
              Search
            </button>
          </form>
          <div className="stats">
            <div>
              <strong>{latest.totalDocs}</strong>
              <span className="muted small">yachts documented</span>
            </div>
            <div>
              <strong>{builders.totalDocs}</strong>
              <span className="muted small">builders</span>
            </div>
            <div>
              <strong>40+</strong>
              <span className="muted small">searchable criteria</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>{featured.docs.length ? 'Featured yachts' : 'Latest additions'}</h2>
            <Link href="/yachts" className="link-arrow">
              Explore all yachts →
            </Link>
          </div>
          {showcase.length ? (
            <div className="grid">
              {showcase.map((y) => (
                <YachtCard key={y.id} yacht={y} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>No yachts published yet</h3>
              <p className="muted">
                Add your first yacht in the <Link href="/admin" className="link-arrow">admin</Link>.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
