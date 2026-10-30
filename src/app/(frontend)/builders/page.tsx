import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Builders' }

export default async function BuildersPage() {
  const payload = await getPayloadClient()
  const builders = await payload.find({ collection: 'builders', sort: 'name', limit: 500, depth: 0, pagination: false })

  const counts = await Promise.all(
    builders.docs.map((b) =>
      payload.count({
        collection: 'yachts',
        where: { and: [{ builder: { equals: b.id } }, { _status: { equals: 'published' } }] },
      }),
    ),
  )

  return (
    <>
      <div className="search-head">
        <div className="wrap">
          <span className="eyebrow">Shipyards</span>
          <h1>Builders</h1>
        </div>
      </div>
      <div className="wrap">
        {builders.docs.length ? (
          <div className="builder-list">
            {builders.docs.map((b, i) => (
              <Link key={b.id} href={`/builders/${(b as { slug?: string }).slug}`}>
                <span>{(b as { name: string }).name}</span>
                <span className="muted small">
                  {counts[i].totalDocs} {counts[i].totalDocs === 1 ? 'model' : 'models'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>No builders yet</h3>
          </div>
        )}
      </div>
    </>
  )
}
