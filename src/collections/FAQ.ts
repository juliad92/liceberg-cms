import { CollectionConfig } from 'payload'

const FAQ: CollectionConfig = {
  slug: 'faq',
  access: {
    read: () => true, // ← anyone can read faq
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
