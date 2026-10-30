import Link from 'next/link'
import { YACHT_TYPES, labelOf } from '@/lib/options'
import { builderName, cabinsRange, fmtM, fmtPrice, mediaUrl, topSpeed } from '@/lib/format'
import type { YachtDoc } from '@/lib/types'

export function YachtCard({ yacht }: { yacht: YachtDoc }) {
  const img = mediaUrl(yacht.heroImage, 'card')
  const speed = topSpeed(yacht)
  const cabins = cabinsRange(yacht)
  const builder = builderName(yacht)
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
        <span className="tag">{labelOf(YACHT_TYPES, yacht.type)}</span>
        <h3>{yacht.title}</h3>
        {builder && yacht.yearLaunched ? (
          <span className="muted small">
            {builder} · since {yacht.yearLaunched}
          </span>
        ) : null}
        <div className="card-facts">
          {fmtM(yacht.loaM) && <span>{fmtM(yacht.loaM)}</span>}
          {cabins && <span>{cabins} cabins</span>}
          {speed && <span>{speed} kn</span>}
          <span className="card-price">{fmtPrice(yacht)}</span>
        </div>
      </div>
    </Link>
  )
}
