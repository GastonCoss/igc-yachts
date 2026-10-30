import type { CollectionBeforeChangeHook, CollectionConfig, Field } from 'payload'
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
  toAdminOptions,
} from '../lib/options'
import { slugify } from '../hooks/slugify'

/** Construit automatiquement le titre (« Pershing 6X ») et le slug (« pershing-6x »). */
const setTitleAndSlug: CollectionBeforeChangeHook = async ({ data, req, originalDoc }) => {
  const builderRef = data.builder ?? originalDoc?.builder
  let builderName = ''
  if (builderRef) {
    if (typeof builderRef === 'object' && 'name' in builderRef) {
      builderName = builderRef.name
    } else {
      const builder = await req.payload.findByID({ collection: 'builders', id: builderRef, depth: 0, req })
      builderName = builder?.name ?? ''
    }
  }
  const model = data.model ?? originalDoc?.model ?? ''
  data.title = [builderName, model].filter(Boolean).join(' ')
  if (!data.slug && data.title) data.slug = slugify(data.title)
  else if (data.slug) data.slug = slugify(data.slug)
  return data
}

type NumOpts = { description?: string; width?: string; step?: number; defaultValue?: number }
const num = (name: string, label: string, description?: string, opts: NumOpts = {}): Field => ({
  name,
  type: 'number',
  label,
  min: 0,
  ...(opts.defaultValue !== undefined ? { defaultValue: opts.defaultValue } : {}),
  admin: {
    ...(description ? { description } : {}),
    ...(opts.width ? { width: opts.width } : {}),
    ...(opts.step ? { step: opts.step } : {}),
  },
})

const row = (fields: Field[]): Field => ({ type: 'row', fields })

const featureFields: Field[] = FEATURES.map((f) => ({
  name: f.name,
  type: 'checkbox',
  label: f.fr,
  defaultValue: false,
}))

export const Yachts: CollectionConfig = {
  slug: 'yachts',
  labels: { singular: 'Yacht', plural: 'Yachts' },
  admin: {
    useAsTitle: 'title',
    group: 'Contenu',
    defaultColumns: ['title', 'type', 'loaM', 'priceFromEur', '_status', 'updatedAt'],
    listSearchableFields: ['title', 'model'],
    description:
      'Un yacht = un modèle (ex. Pershing 6X). Remplis ce que tu connais, laisse vide ce que tu ne sais pas. « Publier » le met en ligne, « Enregistrer le brouillon » le garde invisible.',
    preview: (doc) => (doc?.slug ? `/yachts/${doc.slug}` : null),
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  },
  hooks: {
    beforeChange: [setTitleAndSlug],
  },
  fields: [
    // ---------- Barre latérale ----------
    {
      name: 'title',
      type: 'text',
      label: 'Titre affiché',
      index: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Généré automatiquement : Chantier + Modèle.' },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Adresse web (slug)',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Laisse vide : rempli automatiquement (ex. pershing-6x).' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Mettre en avant sur l\'accueil',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'dataConfidence',
      type: 'select',
      label: 'Fiabilité des données',
      options: toAdminOptions(CONFIDENCE),
      defaultValue: 'manufacturer',
      admin: { position: 'sidebar' },
    },

    {
      type: 'tabs',
      tabs: [
        // ---------- 1. IDENTITÉ ----------
        {
          label: 'Identité',
          fields: [
            row([
              {
                name: 'builder',
                type: 'relationship',
                relationTo: 'builders',
                label: 'Chantier',
                required: true,
                admin: { width: '50%', description: 'Pas dans la liste ? Clique sur « + » pour le créer.' },
              },
              {
                name: 'model',
                type: 'text',
                label: 'Modèle',
                required: true,
                admin: { width: '50%', description: 'Sans le nom du chantier. Ex. « 6X », « Y85 », « 46 ».' },
              },
            ]),
            row([
              {
                name: 'type',
                type: 'select',
                label: 'Type',
                required: true,
                options: toAdminOptions(YACHT_TYPES),
                admin: { width: '50%' },
              },
              {
                name: 'range',
                type: 'text',
                label: 'Gamme / série',
                admin: { width: '50%', description: 'Ex. « X Series », « Y Class ».' },
              },
            ]),
            row([
              {
                name: 'productionStatus',
                type: 'select',
                label: 'Statut',
                options: toAdminOptions(PRODUCTION_STATUS),
                defaultValue: 'in-production',
                admin: { width: '34%' },
              },
              num('yearLaunched', 'Année de lancement', undefined, { width: '33%' }),
              num('yearDiscontinued', 'Année de fin', 'Si plus produit.', { width: '33%' }),
            ]),
            row([
              { name: 'exteriorDesigner', type: 'text', label: 'Design extérieur', admin: { width: '33%' } },
              { name: 'interiorDesigner', type: 'text', label: 'Design intérieur', admin: { width: '33%' } },
              { name: 'navalArchitect', type: 'text', label: 'Architecte naval', admin: { width: '34%' } },
            ]),
            {
              name: 'tagline',
              type: 'text',
              label: 'Accroche',
              admin: { description: 'Une phrase courte, rédigée par toi. Ex. « The fastest three-cabin open in its class. »' },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Description (rédigée par IGC)',
              admin: { description: 'Ne copie pas le texte du constructeur : reformule avec tes mots.' },
            },
          ],
        },

        // ---------- 2. DIMENSIONS & COQUE ----------
        {
          label: 'Dimensions & coque',
          fields: [
            row([
              num('loaM', 'Longueur hors-tout (m)', 'LOA', { width: '33%', step: 0.01 }),
              num('hullLengthM', 'Longueur de coque (m)', undefined, { width: '33%', step: 0.01 }),
              num('beamM', 'Largeur (m)', 'Beam', { width: '34%', step: 0.01 }),
            ]),
            row([
              num('draftM', 'Tirant d\'eau (m)', 'Draft', { width: '33%', step: 0.01 }),
              num('airDraftM', 'Tirant d\'air (m)', undefined, { width: '33%', step: 0.01 }),
              num('grossTonnage', 'Jauge brute (GT)', undefined, { width: '34%' }),
            ]),
            row([
              num('displacementLightT', 'Déplacement lège (t)', undefined, { width: '50%', step: 0.1 }),
              num('displacementFullT', 'Déplacement en charge (t)', undefined, { width: '50%', step: 0.1 }),
            ]),
            row([
              {
                name: 'hullMaterial',
                type: 'select',
                label: 'Matériau de coque',
                options: toAdminOptions(HULL_MATERIALS),
                admin: { width: '33%' },
              },
              {
                name: 'hullType',
                type: 'select',
                label: 'Type de carène',
                options: toAdminOptions(HULL_TYPES),
                admin: { width: '33%' },
              },
              num('deadriseDeg', 'Angle de V (°)', 'Deadrise au tableau arrière', { width: '34%' }),
            ]),
            row([
              num('fuelCapacityL', 'Carburant (L)', undefined, { width: '25%' }),
              num('waterCapacityL', 'Eau douce (L)', undefined, { width: '25%' }),
              num('maxPersons', 'Personnes max (CE)', undefined, { width: '25%' }),
              {
                name: 'ceCategory',
                type: 'select',
                label: 'Catégorie CE',
                options: toAdminOptions(CE_CATEGORIES),
                admin: { width: '25%' },
              },
            ]),
          ],
        },

        // ---------- 3. MOTORISATIONS ----------
        {
          label: 'Motorisations',
          description:
            'Une ligne par motorisation proposée. Si le modèle existe avec 2 choix de moteurs, ajoute 2 lignes et coche « Standard » sur celle de série.',
          fields: [
            {
              name: 'engineOptions',
              type: 'array',
              label: 'Options de motorisation',
              labels: { singular: 'Motorisation', plural: 'Motorisations' },
              admin: {
                initCollapsed: false,
                components: { RowLabel: '/components/admin/EngineRowLabel#EngineRowLabel' },
              },
              fields: [
                row([
                  { name: 'isStandard', type: 'checkbox', label: 'Standard (de série)', admin: { width: '30%' } },
                  { name: 'label', type: 'text', label: 'Nom de l\'option', admin: { width: '70%', description: 'Optionnel. Ex. « Version Sport ».' } },
                ]),
                row([
                  num('engineCount', 'Nombre de moteurs', undefined, { width: '20%', defaultValue: 2 }),
                  { name: 'engineBrand', type: 'text', label: 'Marque moteur', admin: { width: '25%', description: 'Ex. MAN, Volvo Penta, Mercury' } },
                  { name: 'engineModel', type: 'text', label: 'Modèle moteur', admin: { width: '30%', description: 'Ex. V12-1550' } },
                  num('powerHpEach', 'Puissance par moteur (ch)', undefined, { width: '25%' }),
                ]),
                row([
                  {
                    name: 'fuel',
                    type: 'select',
                    label: 'Carburant',
                    options: toAdminOptions(FUELS),
                    defaultValue: 'diesel',
                    admin: { width: '33%' },
                  },
                  {
                    name: 'drive',
                    type: 'select',
                    label: 'Transmission',
                    options: toAdminOptions(DRIVES),
                    admin: { width: '33%' },
                  },
                  num('propellerBlades', 'Nombre de pales d\'hélice', undefined, { width: '34%' }),
                ]),
                row([
                  num('maxSpeedKn', 'Vitesse max (nœuds)', undefined, { width: '33%', step: 0.5 }),
                  num('cruiseSpeedKn', 'Vitesse de croisière (nœuds)', undefined, { width: '33%', step: 0.5 }),
                  num('rangeNm', 'Autonomie (milles)', 'À vitesse de croisière', { width: '34%' }),
                ]),
              ],
            },
          ],
        },

        // ---------- 4. AMÉNAGEMENT ----------
        {
          label: 'Aménagement',
          description:
            'Une ligne par plan d\'aménagement (ex. version 3 cabines et version 4 cabines).',
          fields: [
            {
              name: 'layouts',
              type: 'array',
              label: 'Plans d\'aménagement',
              labels: { singular: 'Aménagement', plural: 'Aménagements' },
              admin: {
                components: { RowLabel: '/components/admin/LayoutRowLabel#LayoutRowLabel' },
              },
              fields: [
                row([
                  { name: 'isStandard', type: 'checkbox', label: 'Standard', admin: { width: '25%' } },
                  { name: 'label', type: 'text', label: 'Nom du layout', admin: { width: '75%', description: 'Optionnel. Ex. « Owner version ».' } },
                ]),
                row([
                  num('cabins', 'Cabines invités', undefined, { width: '25%' }),
                  num('guests', 'Couchages invités', undefined, { width: '25%' }),
                  num('heads', 'Salles d\'eau invités', undefined, { width: '25%' }),
                  num('crewBerths', 'Couchages équipage', undefined, { width: '25%' }),
                ]),
                { name: 'plan', type: 'upload', relationTo: 'media', label: 'Plan (image)' },
              ],
            },
            row([
              {
                name: 'galleyPosition',
                type: 'select',
                label: 'Position de la cuisine',
                options: toAdminOptions(GALLEY_POSITIONS),
                admin: { width: '50%' },
              },
              {
                name: 'masterPosition',
                type: 'select',
                label: 'Position de la cabine propriétaire',
                options: toAdminOptions(MASTER_POSITIONS),
                admin: { width: '50%' },
              },
            ]),
            num('headroomM', 'Hauteur sous barrot max (m)', undefined, { step: 0.01 }),
          ],
        },

        // ---------- 5. EXTÉRIEUR & JOUETS ----------
        {
          label: 'Extérieur & équipements',
          description: 'Coche ce que le yacht possède (en série ou en option courante).',
          fields: [
            {
              name: 'features',
              type: 'group',
              label: 'Équipements',
              admin: { hideGutter: true },
              fields: featureFields,
            },
            row([
              num('tenderMaxLengthM', 'Longueur max du tender (m)', 'Si garage ou bossoir', { width: '33%', step: 0.01 }),
              num('jetskiCount', 'Nombre de jet-skis', undefined, { width: '33%' }),
              { name: 'tenderNotes', type: 'text', label: 'Notes tender / jouets', admin: { width: '34%', description: 'Ex. « Williams 345 ou 2 jet-skis »' } },
            ]),
          ],
        },

        // ---------- 6. PRIX ----------
        {
          label: 'Prix',
          fields: [
            row([
              num('priceFromEur', 'Prix de base (€)', 'Sans les options. Laisse vide si inconnu.', { width: '33%' }),
              num('priceYear', 'Année du prix', undefined, { width: '33%' }),
              {
                name: 'priceVat',
                type: 'select',
                label: 'TVA',
                options: [
                  { value: 'ex-vat', label: 'Hors TVA' },
                  { value: 'inc-vat', label: 'TVA incluse' },
                ],
                defaultValue: 'ex-vat',
                admin: { width: '34%' },
              },
            ]),
            { name: 'priceOnRequest', type: 'checkbox', label: 'Prix sur demande' },
            { name: 'priceNotes', type: 'text', label: 'Notes sur le prix' },
          ],
        },

        // ---------- 7. MÉDIAS ----------
        {
          label: 'Photos & documents',
          description: 'Utilise uniquement des images dont tu as les droits (media kit constructeur, tes photos…).',
          fields: [
            { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Photo principale' },
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true, label: 'Galerie' },
            { name: 'brochure', type: 'upload', relationTo: 'media', label: 'Brochure / fiche technique (PDF)' },
            { name: 'videoUrl', type: 'text', label: 'Lien vidéo (YouTube / Vimeo)' },
          ],
        },

        // ---------- 8. SOURCES ----------
        {
          label: 'Sources',
          description: 'D\'où viennent les chiffres ? Indispensable pour garder une base fiable.',
          fields: [
            {
              name: 'sources',
              type: 'array',
              label: 'Sources',
              labels: { singular: 'Source', plural: 'Sources' },
              fields: [
                row([
                  { name: 'label', type: 'text', label: 'Source', required: true, admin: { width: '40%', description: 'Ex. « Site Pershing », « Brochure 2025 »' } },
                  { name: 'url', type: 'text', label: 'Lien', admin: { width: '40%' } },
                  { name: 'checkedAt', type: 'date', label: 'Vérifié le', admin: { width: '20%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
                ]),
              ],
            },
            { name: 'internalNotes', type: 'textarea', label: 'Notes internes (jamais affichées sur le site)' },
          ],
        },
      ],
    },
  ],
}
