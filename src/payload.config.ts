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


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// console.log('DATABASE_URL:', process.env.DATABASE_URL)
// console.log('DATABASE_URL:', process.env.SERVER_URL)

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: [
    'http://localhost:3001',
    'https://liceberg-cms.vercel.app',   // ← CMS itself
    'https://liceberg-web.vercel.app',   // ← web frontend
  ],
  csrf: [
    'http://localhost:3001',
    'https://liceberg-cms.vercel.app',   // ← CMS itself
    'https://liceberg-web.vercel.app',   // ← web frontend
  ],
  collections: [Users,
    Products,
    Orders,
    Founders,
    FAQ,
    Media,
    NewsletterSubscribers],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})

/*

export default buildConfig({
  serverURL: 'http://localhost:3000',
  editor: lexicalEditor(),
  
*/