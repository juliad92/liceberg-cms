import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

import Products from './collections/Products'
import Orders from './collections/Orders'
import Founders from './collections/Founders'
import FAQ from './collections/FAQ'
import NewsletterSubscribers from './collections/NewsletterSubscribers'
import Accounts from './collections/Accounts'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'

import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

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
      url: ({ data, collectionConfig }) => {
        const base =
          process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
        if (collectionConfig?.slug === 'posts') {
          return `${base}/posts/preview/${data?.slug || '_'}`
        }
        return base
      },
      collections: ['posts'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://liceberg-cms.vercel.app', // ← CMS itself
    'https://liceberg-web.vercel.app', // ← web frontend
  ],
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://liceberg-cms.vercel.app', // ← CMS itself
    'https://liceberg-web.vercel.app', // ← web frontend
  ],
  collections: [
    Users, // ← admins CMS uniquement
    Accounts, // ← abonnés du site
    Products,
    Orders,
    Founders,
    FAQ,
    Media,
    NewsletterSubscribers,
    Posts,
    Categories,
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
    defaultFromAddress: 'onboarding@resend.dev',
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
})

/*

export default buildConfig({
  serverURL: 'http://localhost:3000',
  editor: lexicalEditor(),
  
*/
