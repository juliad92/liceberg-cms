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
import Articles from './collections/Articles'
import FAQ from './collections/FAQ'
import NewsletterSubscribers from './collections/NewsletterSubscribers'
import Accounts from './collections/Accounts'

import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: [
    'http://localhost:3001',
    'https://liceberg-cms.vercel.app', // ← CMS itself
    'https://liceberg-web.vercel.app', // ← web frontend
  ],
  csrf: [
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
    // Articles,
    FAQ,
    Media,
    NewsletterSubscribers,
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
