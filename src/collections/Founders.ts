import { CollectionConfig } from 'payload'

const Founders: CollectionConfig = {
  slug: 'founders',
  access: {
    read: () => true, // ← anyone can read founders
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
    },
    { name: 'mediaTmp', type: 'text' },
  ],
}

export default Founders
