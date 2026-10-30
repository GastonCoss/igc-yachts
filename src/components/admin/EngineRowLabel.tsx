'use client'
import { useRowLabel } from '@payloadcms/ui'

type EngineRow = {
  engineCount?: number
  engineBrand?: string
  engineModel?: string
  powerHpEach?: number
  isStandard?: boolean
  label?: string
}

export const EngineRowLabel = () => {
  const { data, rowNumber } = useRowLabel<EngineRow>()
  const engine = [data?.engineBrand, data?.engineModel].filter(Boolean).join(' ')
  const parts = [
    data?.label,
    engine ? `${data?.engineCount ?? 1} × ${engine}` : null,
    data?.powerHpEach ? `${data.powerHpEach} ch` : null,
    data?.isStandard ? 'standard' : null,
  ].filter(Boolean)
  return <span>{parts.length ? parts.join(' · ') : `Motorisation ${(rowNumber ?? 0) + 1}`}</span>
}
