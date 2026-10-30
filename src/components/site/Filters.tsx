import type { ReactNode } from 'react'
import { DRIVES, FEATURES, FUELS, GALLEY_POSITIONS, MASTER_POSITIONS, YACHT_TYPES, type Option } from '@/lib/options'
import type { Filters as F } from '@/lib/search'

type BuilderOpt = { slug: string; name: string }

function Checks({ name, options, selected }: { name: string; options: Option[]; selected: string[] }) {
  return (
    <>
      {options.map((o) => (
        <label key={o.value} className="check">
          <input type="checkbox" name={name} value={o.value} defaultChecked={selected.includes(o.value)} />
          {o.label}
        </label>
      ))}
    </>
  )
}

function Group({ title, open, children }: { title: string; open?: boolean; children: ReactNode }) {
  return (
    <details open={open}>
      <summary>{title}</summary>
      <div className="filter-body">{children}</div>
    </details>
  )
}

export function Filters({ f, builders }: { f: F; builders: BuilderOpt[] }) {
  const featureGroups = Array.from(new Set(FEATURES.map((x) => x.group)))
  return (
    <form action="/yachts" className="filters" id="filters">
      {f.q ? <input type="hidden" name="q" value={f.q} /> : null}
      {f.sort !== 'newest' ? <input type="hidden" name="sort" value={f.sort} /> : null}

      <Group title="Budget (€)" open>
        <div className="pair">
          <input className="input" name="priceMin" inputMode="numeric" placeholder="Min" defaultValue={f.priceMin ?? ''} />
          <input className="input" name="priceMax" inputMode="numeric" placeholder="Max" defaultValue={f.priceMax ?? ''} />
        </div>
        <span className="muted small">e.g. 3000000 for €3M</span>
      </Group>

      <Group title="Length (m)" open>
        <div className="pair">
          <input className="input" name="lenMin" inputMode="decimal" placeholder="Min" defaultValue={f.lenMin ?? ''} />
          <input className="input" name="lenMax" inputMode="decimal" placeholder="Max" defaultValue={f.lenMax ?? ''} />
        </div>
      </Group>

      <Group title="Type" open={f.type.length > 0}>
        <Checks name="type" options={YACHT_TYPES} selected={f.type} />
      </Group>

      {builders.length ? (
        <Group title="Builder" open={f.builder.length > 0}>
          {builders.map((b) => (
            <label key={b.slug} className="check">
              <input type="checkbox" name="builder" value={b.slug} defaultChecked={f.builder.includes(b.slug)} />
              {b.name}
            </label>
          ))}
        </Group>
      ) : null}

      <Group title="Accommodation" open>
        <label className="small muted">Minimum guest cabins</label>
        <select className="select" name="cabins" defaultValue={f.cabins ?? ''}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
        <label className="small muted">Minimum guest berths</label>
        <select className="select" name="guests" defaultValue={f.guests ?? ''}>
          <option value="">Any</option>
          {[2, 4, 6, 8, 10, 12].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </Group>

      <Group title="Performance" open={f.speed !== null}>
        <label className="small muted">Top speed at least (knots)</label>
        <select className="select" name="speed" defaultValue={f.speed ?? ''}>
          <option value="">Any</option>
          {[10, 15, 20, 25, 30, 35, 40, 45, 50].map((n) => (
            <option key={n} value={n}>
              {n}+ kn
            </option>
          ))}
        </select>
      </Group>

      <Group title="Propulsion" open={f.fuel.length + f.drive.length > 0 || f.blades !== null}>
        <span className="small muted">Fuel</span>
        <Checks name="fuel" options={FUELS} selected={f.fuel} />
        <span className="small muted" style={{ marginTop: 8 }}>
          Drive
        </span>
        <Checks name="drive" options={DRIVES} selected={f.drive} />
        <label className="small muted" style={{ marginTop: 8 }}>
          Propeller blades
        </label>
        <select className="select" name="blades" defaultValue={f.blades ?? ''}>
          <option value="">Any</option>
          {[3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} blades
            </option>
          ))}
        </select>
      </Group>

      <Group title="Layout" open={f.galley.length + f.master.length > 0}>
        <span className="small muted">Galley</span>
        <Checks name="galley" options={GALLEY_POSITIONS} selected={f.galley} />
        <span className="small muted" style={{ marginTop: 8 }}>
          Owner&apos;s cabin
        </span>
        <Checks name="master" options={MASTER_POSITIONS} selected={f.master} />
      </Group>

      {featureGroups.map((g) => {
        const items = FEATURES.filter((x) => x.group === g)
        return (
          <Group key={g} title={g} open={items.some((x) => f.feature.includes(x.name))}>
            {items.map((x) => (
              <label key={x.name} className="check">
                <input type="checkbox" name="feature" value={x.name} defaultChecked={f.feature.includes(x.name)} />
                {x.label}
              </label>
            ))}
          </Group>
        )
      })}

      <div className="filter-actions">
        <button className="btn" type="submit">
          Show yachts
        </button>
        <a className="btn btn-ghost" href="/yachts">
          Reset all filters
        </a>
      </div>
    </form>
  )
}
