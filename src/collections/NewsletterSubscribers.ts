import { CollectionConfig } from 'payload'

const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  access: {
    create: () => true, // ← anyone can read products
    // Seuls les admins peuvent voir la liste ou modifier
    //   read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
    hidden: ({ user }) => user.role !== 'admin',
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
