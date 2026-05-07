import { CollectionConfig } from 'payload'
import { isAdminUser } from '../lib/isAdminUser'

const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  access: {
    create: () => true,
    read: ({ req: { user } }) => isAdminUser(user),
    update: ({ req: { user } }) => isAdminUser(user),
    delete: ({ req: { user } }) => isAdminUser(user),
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'subscribedAt',
      type: 'date',
    },
    {
      name: 'subscribed',
      type: 'checkbox',
    },
  ],
}

export default NewsletterSubscribers
