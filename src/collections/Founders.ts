import { isAdminUser } from '@/lib/isAdminUser'
import { CollectionConfig } from 'payload'

const Founders: CollectionConfig = {
  slug: 'founders',
  access: {
    read: () => true, // ← anyone can read founders
    create: ({ req: { user } }) => isAdminUser(user),
    update: ({ req: { user } }) => isAdminUser(user),
    delete: ({ req: { user } }) => isAdminUser(user),
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text' }, // ex: "Rédactrice en chef"
    { name: 'bio', type: 'textarea' },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        // Optionnel : n'affiche que les images dans le sélecteur
        mimeType: { not_like: 'application/pdf' },
      },
    },
  ],
}

export default Founders
