import Link from 'next/link'
import { YACHT_TYPES, labelOf } from '@/lib/options'
import { builderName, cabinsRange, fmtPrice, mediaUrl, topSpeed } from '@/lib/format'
import type { YachtDoc } from '@/lib/types'

const nf = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 })

export function YachtCard({ yacht }: { yacht: YachtDoc }) {
  const img = mediaUrl(yacht.heroImage, 'card')
  const speed = topSpeed(yacht)
  const cabins = cabinsRange(yacht)
  const builder = builderName(yacht)
  const kicker = [builder, labelOf(YACHT_TYPES, yacht.type)].filter(Boolean).join(', ')
  return (
    <Link href={`/yachts/${yacht.slug}`} className="card">
      <div className="card-media">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={yacht.title ?? ''} loading="lazy" />
        ) : (
          <div className="placeholder">{yacht.title}</div>
        )}
      </div>
      <div className="card-body">
        {kicker ? <span className="card-kicker">{kicker}</span> : null}
        <h3>{yacht.title}</h3>
        <dl className="card-specs">
          <dt>Length</dt>
          <dd>{yacht.loaM ? `${nf.format(yacht.loaM)} m` : '—'}</dd>
          <dt>Cabins</dt>
          <dd>{cabins ?? '—'}</dd>
          <dt>Top speed</dt>
          <dd>{speed ? `${speed} kn` : '—'}</dd>
          <dt className="price">From</dt>
          <dd className="price">{fmtPrice(yacht)}</dd>
        </dl>
      </div>
    </Link>
  )
}
