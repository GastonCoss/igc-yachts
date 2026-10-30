'use client'
import { useRowLabel } from '@payloadcms/ui'

type LayoutRow = { cabins?: number; guests?: number; label?: string; isStandard?: boolean }

export const LayoutRowLabel = () => {
  const { data, rowNumber } = useRowLabel<LayoutRow>()
  const parts = [
    data?.label,
    data?.cabins ? `${data.cabins} cabines` : null,
    data?.guests ? `${data.guests} couchages` : null,
    data?.isStandard ? 'standard' : null,
  ].filter(Boolean)
  return <span>{parts.length ? parts.join(' · ') : `Aménagement ${(rowNumber ?? 0) + 1}`}</span>
}
