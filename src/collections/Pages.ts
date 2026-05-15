import type { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/HeroBlock'
import { RichTextBlock } from '../blocks/RichTextBlock'
import { TitleBlock } from '../blocks/TitleBlock'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
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
    read: () => true,
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
