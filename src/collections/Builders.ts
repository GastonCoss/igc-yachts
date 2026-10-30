import type { CollectionConfig } from 'payload'
import { slugify } from '../hooks/slugify'

export const Builders: CollectionConfig = {
  slug: 'builders',
  labels: { singular: 'Chantier', plural: 'Chantiers' },
  admin: {
    useAsTitle: 'name',
    group: 'Contenu',
    defaultColumns: ['name', 'country', 'updatedAt'],
    description: 'Les constructeurs (Pershing, Sunseeker, Princess…). Crée-les une fois, puis sélectionne-les dans chaque yacht.',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', label: 'Nom', required: true, unique: true },
    {
      name: 'slug',
      type: 'text',
      label: 'Adresse web (slug)',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Rempli automatiquement depuis le nom.' },
      hooks: {
        beforeValidate: [({ value, data }) => (value ? slugify(value) : data?.name ? slugify(data.name) : value)],
      },
    },
    { name: 'country', type: 'text', label: 'Pays' },
    { name: 'parentGroup', type: 'text', label: 'Groupe', admin: { description: 'Ex. Ferretti Group, Azimut|Benetti Group…' } },
    { name: 'founded', type: 'number', label: 'Année de fondation' },
    { name: 'website', type: 'text', label: 'Site officiel' },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
    { name: 'summary', type: 'textarea', label: 'Présentation (rédigée par IGC)' },
  ],
}
