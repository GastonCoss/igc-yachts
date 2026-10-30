import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { YachtCard } from '@/components/site/YachtCard'
import {
  cabinsRange,
  engineSummary,
  fmtEurFull,
  fmtFt,
  fmtM,
  fmtN,
  fmtPrice,
  guestsRange,
  isBuilder,
  isMedia,
  mediaUrl,
  standardEngine,
  topSpeed,
} from '@/lib/format'
import {
  CE_CATEGORIES,
  CONFIDENCE,
  DRIVES,
  FEATURES,
  FUELS,
  GALLEY_POSITIONS,
  HULL_MATERIALS,
  HULL_TYPES,
  MASTER_POSITIONS,
  PRODUCTION_STATUS,
  YACHT_TYPES,
  labelOf,
} from '@/lib/options'
import { getPayloadClient } from '@/lib/payload'
import type { YachtDoc } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

async function getYacht(slug: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'yachts',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 2,
  })
  return (res.docs[0] as unknown as YachtDoc) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const y = await getYacht(slug)
  if (!y) return {}
  const img = mediaUrl(y.heroImage, 'hero')
  return {
    title: `${y.title} — specifications`,
    description:
      y.tagline ??
      `${y.title}: length ${fmtM(y.loaM) ?? 'n/a'}, ${cabinsRange(y) ?? '–'} cabins, top speed ${topSpeed(y) ?? '–'} kn. Full specifications, engines, layout and features.`,
    openGraph: img ? { images: [img] } : undefined,
  }
}

type SpecRow = [string, string | null | undefined]

function SpecList({ rows }: { rows: SpecRow[] }) {
  const visible = rows.filter(([, v]) => v !== null && v !== undefined && v !== '')
  if (!visible.length) return null
  return (
    <dl className="spec-list">
      {visible.map(([k, v]) => (
        <div className="row" key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

export default async function YachtPage({ params }: Props) {
  const { slug } = await params
  const y = await getYacht(slug)
  if (!y) notFound()

  const builder = isBuilder(y.builder) ? y.builder : null
  const hero = mediaUrl(y.heroImage, 'hero')
  const speed = topSpeed(y)
  const std = standardEngine(y)
  const engines = y.engineOptions ?? []
  const layouts = y.layouts ?? []
  const gallery = (y.gallery ?? []).filter(isMedia)
  const plans = layouts.filter((l) => isMedia(l.plan))
  const presentFeatures = FEATURES.filter((f) => y.features?.[f.name])
  const featureGroups = Array.from(new Set(presentFeatures.map((f) => f.group)))
  const hasDescription = Boolean(
    y.description && typeof y.description === 'object' && 'root' in (y.description as object),
  )

  const payload = await getPayloadClient()
  const more = builder
    ? ((
        await payload.find({
          collection: 'yachts',
          where: {
            and: [
              { builder: { equals: builder.id } },
              { id: { not_equals: y.id } },
              { _status: { equals: 'published' } },
            ],
          },
          limit: 3,
          depth: 1,
        })
      ).docs as unknown as YachtDoc[])
    : []

  const nav = [
    ['overview', 'Overview'],
    ['specifications', 'Specifications'],
    engines.length ? ['engines', 'Engines & performance'] : null,
    layouts.length || y.galleyPosition || y.masterPosition ? ['layout', 'Layout'] : null,
    presentFeatures.length ? ['features', 'Features & toys'] : null,
    gallery.length ? ['gallery', 'Gallery'] : null,
    ['sources', 'Sources'],
  ].filter(Boolean) as [string, string][]

  return (
    <article>
      <div className="y-hero wrap">
        <div className="crumbs">
          <Link href="/yachts">Yachts</Link>
          {builder?.slug ? (
            <>
              {' / '}
              <Link href={`/builders/${builder.slug}`}>{builder.name}</Link>
            </>
          ) : null}
          {' / '}
          {y.model}
        </div>

        <div className="y-title">
          <div>
            <div className="builder-line">
              {[builder?.name, labelOf(YACHT_TYPES, y.type), y.range].filter(Boolean).join(' · ')}
            </div>
            <h1>{y.title}</h1>
            {y.tagline ? <p className="tagline">{y.tagline}</p> : null}
          </div>
          <div className="y-price">
            <span className="eyebrow">Base price</span>
            <strong>{fmtPrice(y)}</strong>
            {y.priceFromEur ? (
              <span className="muted small">
                {y.priceVat === 'inc-vat' ? 'inc. VAT' : 'ex. VAT'}
                {y.priceYear ? ` · ${y.priceYear}` : ''}
              </span>
            ) : null}
          </div>
        </div>

        <div className="y-image">
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero} alt={(isMedia(y.heroImage) && y.heroImage.alt) || y.title || ''} />
          ) : (
            <div className="placeholder">{y.title}</div>
          )}
        </div>
        <div className="keyfacts">
          <div>
            <span className="eyebrow">Length</span>
            <strong>{fmtM(y.loaM) ?? '—'}</strong>
          </div>
          <div>
            <span className="eyebrow">Beam</span>
            <strong>{fmtM(y.beamM) ?? '—'}</strong>
          </div>
          <div>
            <span className="eyebrow">Cabins</span>
            <strong>{cabinsRange(y) ?? '—'}</strong>
          </div>
          <div>
            <span className="eyebrow">Guests</span>
            <strong>{guestsRange(y) ?? '—'}</strong>
          </div>
          <div>
            <span className="eyebrow">Top speed</span>
            <strong>{speed ? `${speed} kn` : '—'}</strong>
          </div>
          <div>
            <span className="eyebrow">Fuel</span>
            <strong>{std?.fuel ? labelOf(FUELS, std.fuel) : '—'}</strong>
          </div>
        </div>
      </div>

      <nav className="y-nav" aria-label="Sections">
        <div className="wrap">
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="wrap">
        <section id="overview" className="y-section">
          <h2>Overview</h2>
          <div>
            {hasDescription ? (
              <div className="prose">
                <RichText data={y.description as SerializedEditorState} />
              </div>
            ) : (
              <p className="prose muted">Editorial review coming soon.</p>
            )}
            <SpecList
              rows={[
                ['Builder', builder?.name],
                ['Model', y.model],
                ['Type', labelOf(YACHT_TYPES, y.type)],
                ['Status', y.productionStatus ? labelOf(PRODUCTION_STATUS, y.productionStatus) : null],
                ['Launched', y.yearLaunched ? String(y.yearLaunched) : null],
                ['Discontinued', y.yearDiscontinued ? String(y.yearDiscontinued) : null],
                ['Exterior design', y.exteriorDesigner],
                ['Interior design', y.interiorDesigner],
                ['Naval architecture', y.navalArchitect],
                ['Standard engines', engineSummary(std)],
              ]}
            />
          </div>
        </section>

        <section id="specifications" className="y-section">
          <h2>Specifications</h2>
          <div className="spec-groups">
            <SpecList
              rows={[
                ['Length overall', [fmtM(y.loaM), fmtFt(y.loaM)].filter(Boolean).join(' · ') || null],
                ['Hull length', fmtM(y.hullLengthM)],
                ['Beam', [fmtM(y.beamM), fmtFt(y.beamM)].filter(Boolean).join(' · ') || null],
                ['Draft', fmtM(y.draftM)],
                ['Air draft', fmtM(y.airDraftM)],
                ['Light displacement', fmtN(y.displacementLightT, 't', 1)],
                ['Full load displacement', fmtN(y.displacementFullT, 't', 1)],
                ['Gross tonnage', fmtN(y.grossTonnage, 'GT')],
              ]}
            />
            <SpecList
              rows={[
                ['Hull material', y.hullMaterial ? labelOf(HULL_MATERIALS, y.hullMaterial) : null],
                ['Hull type', y.hullType ? labelOf(HULL_TYPES, y.hullType) : null],
                ['Deadrise', fmtN(y.deadriseDeg, '°')],
                ['Fuel capacity', fmtN(y.fuelCapacityL, 'L')],
                ['Water capacity', fmtN(y.waterCapacityL, 'L')],
                ['CE category', y.ceCategory ? labelOf(CE_CATEGORIES, y.ceCategory) : null],
                ['Max persons', fmtN(y.maxPersons)],
                ['Base price', y.priceFromEur ? fmtEurFull(y.priceFromEur) : y.priceOnRequest ? 'On request' : null],
                ['Price notes', y.priceNotes],
              ]}
            />
          </div>
        </section>

        {engines.length ? (
          <section id="engines" className="y-section">
            <h2>Engines &amp; performance</h2>
            <div className="table-wrap">
              <table className="specs">
                <thead>
                  <tr>
                    <th>Engines</th>
                    <th>Power</th>
                    <th>Fuel</th>
                    <th>Drive</th>
                    <th>Props</th>
                    <th>Top speed</th>
                    <th>Cruise</th>
                    <th>Range</th>
                  </tr>
                </thead>
                <tbody>
                  {engines.map((e, i) => (
                    <tr key={e.id ?? i}>
                      <td>
                        {e.label ? <div className="muted small">{e.label}</div> : null}
                        {`${e.engineCount ?? 1} × ${[e.engineBrand, e.engineModel].filter(Boolean).join(' ') || '—'}`}
                        {e.isStandard ? <span className="std">Std</span> : null}
                      </td>
                      <td>
                        {e.powerHpEach
                          ? `${(e.engineCount ?? 1) > 1 ? `${e.engineCount} × ` : ''}${e.powerHpEach.toLocaleString('en-GB')} hp`
                          : '—'}
                      </td>
                      <td>{e.fuel ? labelOf(FUELS, e.fuel) : '—'}</td>
                      <td>{e.drive ? labelOf(DRIVES, e.drive) : '—'}</td>
                      <td>{e.propellerBlades ? `${e.propellerBlades}-blade` : '—'}</td>
                      <td>{e.maxSpeedKn ? `${e.maxSpeedKn} kn` : '—'}</td>
                      <td>{e.cruiseSpeedKn ? `${e.cruiseSpeedKn} kn` : '—'}</td>
                      <td>{e.rangeNm ? `${e.rangeNm.toLocaleString('en-GB')} nm` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {layouts.length || y.galleyPosition || y.masterPosition ? (
          <section id="layout" className="y-section">
            <h2>Layout</h2>
            <div>
              {layouts.length ? (
                <div className="table-wrap">
                  <table className="specs">
                    <thead>
                      <tr>
                        <th>Version</th>
                        <th>Guest cabins</th>
                        <th>Guest berths</th>
                        <th>Heads</th>
                        <th>Crew berths</th>
                      </tr>
                    </thead>
                    <tbody>
                      {layouts.map((l, i) => (
                        <tr key={l.id ?? i}>
                          <td>
                            {l.label || `Layout ${i + 1}`}
                            {l.isStandard ? <span className="std">Std</span> : null}
                          </td>
                          <td>{l.cabins ?? '—'}</td>
                          <td>{l.guests ?? '—'}</td>
                          <td>{l.heads ?? '—'}</td>
                          <td>{l.crewBerths ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              <div style={{ marginTop: 16 }}>
                <SpecList
                  rows={[
                    ['Galley', y.galleyPosition ? labelOf(GALLEY_POSITIONS, y.galleyPosition) : null],
                    ["Owner's cabin", y.masterPosition ? labelOf(MASTER_POSITIONS, y.masterPosition) : null],
                    ['Max headroom', fmtM(y.headroomM)],
                  ]}
                />
              </div>
              {plans.length ? (
                <div className="plans">
                  {plans.map((l, i) => (
                    <figure key={l.id ?? i}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mediaUrl(l.plan, 'hero') ?? ''} alt={`${y.title} layout ${l.label ?? i + 1}`} loading="lazy" />
                      <figcaption>{l.label || `Layout ${i + 1}`}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {presentFeatures.length ? (
          <section id="features" className="y-section">
            <h2>Features &amp; toys</h2>
            <div>
              <div className="feature-groups">
                {featureGroups.map((g) => (
                  <div key={g}>
                    <h3>{g}</h3>
                    <ul>
                      {presentFeatures
                        .filter((f) => f.group === g)
                        .map((f) => (
                          <li key={f.name}>{f.label}</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24 }}>
                <SpecList
                  rows={[
                    ['Max tender length', fmtM(y.tenderMaxLengthM)],
                    ['Jet-skis', fmtN(y.jetskiCount)],
                    ['Tender & toys notes', y.tenderNotes],
                  ]}
                />
              </div>
            </div>
          </section>
        ) : null}

        {gallery.length ? (
          <section id="gallery" className="y-section">
            <h2>Gallery</h2>
            <div className="gallery">
              {gallery.map((m) => (
                <a key={m.id} href={mediaUrl(m, 'hero') ?? '#'} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(m, 'card') ?? ''} alt={m.alt ?? y.title ?? ''} loading="lazy" />
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <section id="sources" className="y-section">
          <h2>Sources</h2>
          <div className="sources">
            <p>
              Data reliability: <strong>{labelOf(CONFIDENCE, y.dataConfidence ?? 'manufacturer')}</strong>
              {y.updatedAt ? ` · Last updated ${new Date(y.updatedAt).toLocaleDateString('en-GB')}` : ''}
            </p>
            {y.sources?.length ? (
              <ul>
                {y.sources.map((s, i) => (
                  <li key={i}>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noreferrer nofollow">
                        {s.label}
                      </a>
                    ) : (
                      s.label
                    )}
                    {s.checkedAt ? <span className="muted"> — checked {new Date(s.checkedAt).toLocaleDateString('en-GB')}</span> : null}
                  </li>
                ))}
              </ul>
            ) : null}
            {isMedia(y.brochure) && y.brochure.url ? (
              <p style={{ marginTop: 16 }}>
                <a className="btn btn-ghost" href={y.brochure.url} target="_blank" rel="noreferrer">
                  Download specification sheet (PDF)
                </a>
              </p>
            ) : null}
          </div>
        </section>

        {more.length ? (
          <section className="section">
            <div className="section-head">
              <h2>More from {builder?.name}</h2>
              {builder?.slug ? (
                <Link href={`/builders/${builder.slug}`} className="link-arrow">
                  All {builder.name} yachts →
                </Link>
              ) : null}
            </div>
            <div className="grid">
              {more.map((m) => (
                <YachtCard key={m.id} yacht={m} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  )
}
