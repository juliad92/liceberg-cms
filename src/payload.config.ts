import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

import Products from './collections/Products'
import Orders from './collections/Orders'
import Founders from './collections/Founders'
import FAQ from './collections/FAQ'
import NewsletterSubscribers from './collections/NewsletterSubscribers'
import ContactRequests from './collections/ContactRequests'
import Accounts from './collections/Accounts'
import { Posts } from '@/collections/Posts'
import { Categories } from './collections/Categories'
import { AgendaEvents } from './collections/AgendaEvents'

import { Pages } from './collections/Pages'

import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { AUTH_ALLOWED_ORIGINS } from './lib/auth/sessionConfig'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      // The iframe URL must resolve to a page that mounts useLivePreview / PostPreviewClient.
      // Using /posts/preview/[slug] keeps the preview route separate from the public route.
      url: ({ data }) => {
        const base =
          process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
        return `${base}/posts/preview/${data?.slug || '_'}`
      },
      collections: ['posts', 'pages'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  cors: AUTH_ALLOWED_ORIGINS,
  csrf: AUTH_ALLOWED_ORIGINS,
  collections: [
    Users, // ← admins CMS uniquement
    Accounts, // ← abonnés du site
    Products,
    Orders,
    Founders,
    FAQ,
    Media,
    NewsletterSubscribers,
    ContactRequests,
    Posts,
    Categories,
    AgendaEvents,
    Pages,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  email: nodemailerAdapter({
    defaultFromAddress: 'contact@liceberg.fr',
    defaultFromName: "L'Iceberg",
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  sharp,
  plugins: [
    importExportPlugin({
      collections: [{ slug: 'orders' }],
      // Visible in the admin sidebar (hidden by default via admin.group: false)
      overrideExportCollection: ({ collection }) => ({
        ...collection,
        admin: {
          ...collection.admin,
          group: 'Data Management',
        },
      }),
    }),
    // Must run after import-export so `exports` / `imports` exist.
    // Required on Vercel for any collection with upload: true.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
        exports: true,
        imports: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true, // bypass Vercel 4.5MB serverless body limit
      addRandomSuffix: true,
    }),
  ],
})
