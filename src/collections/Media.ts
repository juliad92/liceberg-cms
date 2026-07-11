import type { CollectionConfig } from 'payload'
import { isAdminUser } from '@/lib/isAdminUser'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) => isAdminUser(user),
    update: ({ req: { user } }) => isAdminUser(user),
    delete: ({ req: { user } }) => isAdminUser(user),
  },
  admin: {
    useAsTitle: 'filename',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    // Kept for backward compatibility with existing docs / frontend (blobUrl || url).
    // New uploads store the public URL on Payload's built-in `url` field via the storage adapter.
    {
      name: 'blobUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data, value }) => {
            if (data?.url) return data.url
            return value
          },
        ],
        afterRead: [
          ({ data, value }) => value || data?.url || null,
        ],
      },
    },
  ],
  upload: {
    imageSizes: [],
    adminThumbnail: ({ doc }) =>
      (doc.blobUrl as string) || (doc.url as string) || '',
  },
}
