import { isAdminUser } from '@/lib/isAdminUser'
import { CollectionConfig } from 'payload'

const FAQ: CollectionConfig = {
  slug: 'faq',
  access: {
    read: () => true, // ← anyone can read faq
    create: ({ req: { user } }) => isAdminUser(user),
    update: ({ req: { user } }) => isAdminUser(user),
    delete: ({ req: { user } }) => isAdminUser(user),
  },
  admin: {
    useAsTitle: 'question',
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
    { name: 'order', type: 'number' }, // controls display order
  ],
}

export default FAQ
