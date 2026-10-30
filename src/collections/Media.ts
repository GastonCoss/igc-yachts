import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médias' },
  admin: {
    group: 'Contenu',
    description: 'Photos, plans et brochures PDF. Tu peux aussi les ajouter directement depuis la fiche d\'un yacht.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Description de l\'image',
      admin: { description: 'Courte description (ex. « Pershing 6X vue arrière »). Utile pour Google et l\'accessibilité.' },
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Crédit / droits',
      admin: { description: 'Qui détient les droits de cette image (ex. « © Pershing — media kit officiel »).' },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 480, height: 320, position: 'centre' },
      { name: 'card', width: 960, height: 640, position: 'centre' },
      { name: 'hero', width: 2000 },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
}
