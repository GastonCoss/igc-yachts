/** Types simplifiés utilisés par le site public (indépendants des types générés par Payload). */

export type MediaDoc = {
  id: number | string
  url?: string | null
  alt?: string | null
  credit?: string | null
  filename?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<string, { url?: string | null; width?: number | null; height?: number | null } | undefined> | null
}

export type BuilderDoc = {
  id: number | string
  name: string
  slug?: string | null
  country?: string | null
  parentGroup?: string | null
  founded?: number | null
  website?: string | null
  logo?: MediaDoc | number | null
  summary?: string | null
}

export type EngineOption = {
  id?: string
  isStandard?: boolean | null
  label?: string | null
  engineCount?: number | null
  engineBrand?: string | null
  engineModel?: string | null
  powerHpEach?: number | null
  fuel?: string | null
  drive?: string | null
  propellerBlades?: number | null
  maxSpeedKn?: number | null
  cruiseSpeedKn?: number | null
  rangeNm?: number | null
}

export type LayoutOption = {
  id?: string
  isStandard?: boolean | null
  label?: string | null
  cabins?: number | null
  guests?: number | null
  heads?: number | null
  crewBerths?: number | null
  plan?: MediaDoc | number | null
}

export type YachtDoc = {
  id: number | string
  title?: string | null
  slug?: string | null
  model: string
  builder?: BuilderDoc | number | null
  type?: string | null
  range?: string | null
  productionStatus?: string | null
  yearLaunched?: number | null
  yearDiscontinued?: number | null
  exteriorDesigner?: string | null
  interiorDesigner?: string | null
  navalArchitect?: string | null
  tagline?: string | null
  description?: unknown
  loaM?: number | null
  hullLengthM?: number | null
  beamM?: number | null
  draftM?: number | null
  airDraftM?: number | null
  grossTonnage?: number | null
  displacementLightT?: number | null
  displacementFullT?: number | null
  hullMaterial?: string | null
  hullType?: string | null
  deadriseDeg?: number | null
  fuelCapacityL?: number | null
  waterCapacityL?: number | null
  maxPersons?: number | null
  ceCategory?: string | null
  engineOptions?: EngineOption[] | null
  layouts?: LayoutOption[] | null
  galleyPosition?: string | null
  masterPosition?: string | null
  headroomM?: number | null
  features?: Record<string, boolean | null | undefined> | null
  tenderMaxLengthM?: number | null
  jetskiCount?: number | null
  tenderNotes?: string | null
  priceFromEur?: number | null
  priceYear?: number | null
  priceVat?: string | null
  priceOnRequest?: boolean | null
  priceNotes?: string | null
  heroImage?: MediaDoc | number | null
  gallery?: (MediaDoc | number)[] | null
  brochure?: MediaDoc | number | null
  videoUrl?: string | null
  sources?: { label: string; url?: string | null; checkedAt?: string | null }[] | null
  dataConfidence?: string | null
  featured?: boolean | null
  updatedAt?: string
}
