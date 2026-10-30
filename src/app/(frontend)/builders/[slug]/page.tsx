import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { YachtCard } from '@/components/site/YachtCard'
import { getPayloadClient } from '@/lib/payload'
import type { BuilderDoc, YachtDoc } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

async function getBuilder(slug: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'builders', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return (res.docs[0] as unknown as BuilderDoc) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const b = await getBuilder(slug)
  return b ? { title: `${b.name} yachts`, description: b.summary ?? `All ${b.name} models with full specifications.` } : {}
}

export default async function BuilderPage({ params }: Props) {
  const { slug } = await params
  const b = await getBuilder(slug)
  if (!b) notFound()

  const payload = await getPayloadClient()
  const yachts = await payload.find({
    collection: 'yachts',
    where: { and: [{ builder: { equals: b.id } }, { _status: { equals: 'published' } }] },
    sort: 'loaM',
    limit: 200,
    depth: 1,
  })

  const meta = [b.country, b.parentGroup, b.founded ? `Founded ${b.founded}` : null].filter(Boolean).join(' · ')

  return (
    <>
      <div className="search-head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/builders">Builders</Link> / {b.name}
          </div>
          <h1>{b.name}</h1>
          {meta ? <p className="muted" style={{ marginTop: 12 }}>{meta}</p> : null}
          {b.summary ? <p className="prose" style={{ marginTop: 16 }}>{b.summary}</p> : null}
          {b.website ? (
            <p style={{ marginTop: 16 }}>
              <a className="link-arrow" href={b.website} target="_blank" rel="noreferrer nofollow">
                Official website ↗
              </a>
            </p>
          ) : null}
        </div>
      </div>
      <div className="wrap">
        <div className="results-bar">
          <span>
            <strong>{yachts.totalDocs}</strong> {yachts.totalDocs === 1 ? 'model' : 'models'}
          </span>
          <Link className="link-arrow" href={`/yachts?builder=${b.slug}`}>
            Filter {b.name} yachts →
          </Link>
        </div>
        <div className="grid">
          {(yachts.docs as unknown as YachtDoc[]).map((y) => (
            <YachtCard key={y.id} yacht={y} />
          ))}
        </div>
      </div>
    </>
  )
}
