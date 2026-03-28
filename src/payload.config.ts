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

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
 /* cors: [
    'http://localhost:3001',
  ],
  csrf: [
    'http://localhost:3001',
  ],*/
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
import { buildConfig } from 'payload'

console.log('=== DEBUG ENV ===')
console.log(buildConfig)
console.log('DATABASE_URI:', process.env.DATABASE_URI)
console.log('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET)
console.log('Current working directory:', process.cwd())
console.log('=================')

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Users } from './collections/Users'        
import Products from './collections/Products'
import Orders from './collections/Orders'
import Founders from './collections/Founders'
import FAQ from './collections/FAQ'
import  { Media } from './collections/Media'
import NewsletterSubscribers from './collections/NewsletterSubscribers'

export default buildConfig({
  serverURL: 'http://localhost:3000',
  editor: lexicalEditor(),
  admin: {
    user:  'users',
  },
  collections: [
    Users,
    Products,
    Orders,
    Founders,
    FAQ,
    Media,
    NewsletterSubscribers,
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI as string,
  }),
  secret: process.env.PAYLOAD_SECRET as string,
})
*/