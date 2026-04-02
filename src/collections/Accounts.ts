import { CollectionConfig } from 'payload'

const Accounts: CollectionConfig = {
  slug: 'accounts',
  auth: true,           // ← gère login/password
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'stripeCustomerId', 'createdAt']
  },
  access: {
    create: () => true,   // ← inscription publique depuis le site
    read: () => true,    // false ? 
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Rempli automatiquement après le premier achat',
      },
    },
  ],
}

export default Accounts