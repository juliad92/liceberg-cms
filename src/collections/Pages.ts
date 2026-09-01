import type { Access, CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/HeroBlock'
import { RichTextBlock } from '../blocks/RichTextBlock'
import { TitleBlock } from '../blocks/TitleBlock'

export const PAGES_EDITOR_EMAIL = 'jdemichel.jd@gmail.com'

export function canManagePages({
  req,
}: {
  req: { user?: { email?: string } | null }
}) {
  return req.user?.email?.trim().toLowerCase() === PAGES_EDITOR_EMAIL
}

const pagesReadAccess: Access = ({ req: { user } }) => {
  if (canManagePages({ req: { user } })) return true
  if (user) return false
  return {
    _status: { equals: 'published' },
  }
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    hidden: ({ user }) => !canManagePages({ req: { user } }),
    livePreview: {
      url: ({ data }) => {
        const base =
          process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
        return `${base}/pages/preview/${data?.slug || '_'}`
      },
    },
    preview: (doc) => {
      const base =
        process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
      return `${base}/pages/preview/${(doc as { slug?: string })?.slug || '_'}`
    },
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: pagesReadAccess,
    create: ({ req }) => canManagePages({ req }),
    update: ({ req }) => canManagePages({ req }),
    delete: ({ req }) => canManagePages({ req }),
  },
  versions: {
    // drafts: true, // enables draft/publish workflow
    drafts: {
      autosave: {
        interval: 375, // ms — lower = snappier preview
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Auto-generate slug from title if empty
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, RichTextBlock, TitleBlock],
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
