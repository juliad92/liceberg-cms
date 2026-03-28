import { CollectionConfig } from 'payload'

const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
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
  ],
}

export default NewsletterSubscribers