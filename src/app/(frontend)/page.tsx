import Link from 'next/link'
import { YachtCard } from '@/components/site/YachtCard'
import { getPayloadClient } from '@/lib/payload'
import type { YachtDoc } from '@/lib/types'

export const dynamic = 'force-dynamic'

const SHORTCUTS = [
  { label: 'Under 20 metres', href: '/yachts?lenMax=20' },
  { label: 'Three cabins or more', href: '/yachts?cabins=3' },
  { label: 'Over 40 knots', href: '/yachts?speed=40' },
  { label: 'Tender garage', href: '/yachts?feature=tenderGarage' },
  { label: 'Beach club', href: '/yachts?feature=beachClub' },
  { label: 'Flybridge', href: '/yachts?feature=flybridge' },
]

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
      <section className="hero on-dark">
        <div className="wrap">
          <h1>Find the yacht made for you.</h1>
          <p className="hero-lead">
            Every model, every specification, side by side. Search by budget, length, cabins, propulsion and the
            details that matter on board.
          </p>
          <form action="/yachts" className="hero-search" role="search">
            <input
              type="search"
              name="q"
              placeholder="Search a builder or a model"
              aria-label="Search a builder or a model"
            />
            <button type="submit">Search</button>
          </form>
          <div className="shortcuts">
            {SHORTCUTS.map((s) => (
              <Link key={s.href} href={s.href}>
                {s.label}
              </Link>
            ))}
          </div>
          <div className="hero-figures">
            <div>
              <strong>{latest.totalDocs}</strong>
              <span>{latest.totalDocs === 1 ? 'yacht documented' : 'yachts documented'}</span>
            </div>
            <div>
              <strong>{builders.totalDocs}</strong>
              <span>{builders.totalDocs === 1 ? 'builder' : 'builders'}</span>
            </div>
            <div>
              <strong>40+</strong>
              <span>searchable criteria</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>{featured.docs.length ? 'Featured yachts' : 'Latest additions'}</h2>
              <p>Hand-documented models, each with engines, layouts and on-board features.</p>
            </div>
            <Link href="/yachts" className="text-link">
              View all yachts
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
                Add your first yacht from the <Link href="/admin" className="text-link">admin</Link>.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
