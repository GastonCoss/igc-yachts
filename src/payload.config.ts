import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Builders } from './collections/Builders'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Yachts } from './collections/Yachts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Stockage des photos dans le cloud (Supabase Storage / Cloudflare R2) dès que toutes les variables S3_ sont renseignées.
// Sinon (en local), les fichiers vont dans le dossier /media du projet.
const useCloudStorage = [
  'S3_BUCKET',
  'S3_ENDPOINT',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
].every((key) => Boolean(process.env[key]))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — IGC Yachts Admin',
    },
    dateFormat: 'dd/MM/yyyy HH:mm',
  },
  i18n: {
    supportedLanguages: { fr, en },
    fallbackLanguage: 'fr',
  },
  collections: [Yachts, Builders, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      enabled: useCloudStorage,
      alwaysInsertFields: true,
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
