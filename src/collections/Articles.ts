import { CollectionConfig } from 'payload'

const Articles: CollectionConfig = {
  slug: 'articles',
  access: {
    read: () => true, // ← anyone can read articles
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'article', type: 'textarea' },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        // Optionnel : n'affiche que les images dans le sélecteur
        mimeType: { not_like: 'application/img' },
      },
    },
  ],
}

export default Articles
