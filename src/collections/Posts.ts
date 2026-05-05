import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', '_status', 'publishedAt'],
    livePreview: {
      url: ({ data }) => {
        const base =
          process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
        return `${base}/posts/preview/${data?.slug || '_'}`
      },
    },
    preview: (doc) => {
      const base =
        process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
      return `${base}/posts/preview/${(doc as any)?.slug || '_'}`
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 800, // autosave every 800ms while typing
      },
    },
    maxPerDoc: 50,
  },
  access: {
    read: ({ req: { user } }) => {
      // Published posts are public; drafts only for logged-in users
      if (user) return true
      return {
        _status: { equals: 'published' },
      }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  // While validating, only visible by
  // access: {
  //   read: ({ req: { user } }) => user?.email === 'jdemichel.jd@gmail.com',
  //   create: ({ req: { user } }) => user?.email === 'jdemichel.jd@gmail.com',
  //   update: ({ req: { user } }) => user?.email === 'jdemichel.jd@gmail.com',
  //   delete: ({ req: { user } }) => user?.email === 'jdemichel.jd@gmail.com',
  // },
  fields: [
    // ── Title ──────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The main title of the article.',
      },
    },

    // ── Slug ───────────────────────────────────────────────
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier (e.g. "my-first-post").',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Auto-generate slug from title if empty
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },

    // ── Excerpt ────────────────────────────────────────────
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary shown in article listings and SEO.',
        position: 'sidebar',
        rows: 3,
      },
    },

    // ── Featured Image ─────────────────────────────────────
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Cover image displayed at the top of the article.',
      },
    },

    // ── Rich Text Content ──────────────────────────────────
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Main body of the article.',
      },
    },

    // ── Author ─────────────────────────────────────────────
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ req, value }) => {
            // Default to current logged-in user
            if (!value && req.user) return req.user.id
            return value
          },
        ],
      },
    },

    // ── Categories ─────────────────────────────────────────
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories' as any,
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },

    // ── Tags ───────────────────────────────────────────────
    {
      name: 'tags',
      type: 'array',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },

    // ── Published At ───────────────────────────────────────
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Leave empty to publish immediately.',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            // Auto-set publishedAt when status becomes published
            if (siblingData._status === 'published' && !value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },

    // ── SEO ────────────────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      admin: {
        description: 'Search engine optimization settings.',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Defaults to post title if empty. Max 60 characters.',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'Defaults to excerpt if empty. Max 160 characters.',
            rows: 3,
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Social share image. Defaults to featured image.',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
