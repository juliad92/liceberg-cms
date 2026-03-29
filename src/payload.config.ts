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

import { cloudinaryAdapter } from '@payloadcms/plugin-cloud-storage/cloudinary'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'

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
  plugins: [
  cloudStoragePlugin({
    collections: {
      media: {
        adapter: cloudinaryAdapter({
          config: {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
            api_key: process.env.CLOUDINARY_API_KEY as string,
            api_secret: process.env.CLOUDINARY_API_SECRET as string,
          },
        }),
      },
    },
  }),
],
})

/*

export default buildConfig({
  serverURL: 'http://localhost:3000',
  editor: lexicalEditor(),
  
*/