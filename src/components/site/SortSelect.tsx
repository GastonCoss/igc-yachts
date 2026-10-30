'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function SortSelect({ options, value }: { options: { value: string; label: string }[]; value: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  return (
    <select
      className="select"
      aria-label="Sort results"
      value={value}
      onChange={(e) => {
        const next = new URLSearchParams(params.toString())
        next.set('sort', e.target.value)
        next.delete('page')
        router.push(`${pathname}?${next.toString()}`)
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
