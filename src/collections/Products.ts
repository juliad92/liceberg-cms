import { CollectionConfig } from 'payload'
import { syncToStripe } from '../hooks/syncToStripe'
import { Analytics } from '@vercel/analytics/next'

const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: () => true, // ← anyone can read products
    update: () => true,
  },
  admin: {
    useAsTitle: 'title', // shows the product title in the admin list
    defaultColumns: ['title', 'price', 'type', 'stripeProductId'],
  },
  hooks: {
    beforeChange: [syncToStripe],
    afterRead: [
      ({ doc }) => {
        if (doc?.summary && Array.isArray(doc.summary)) {
          doc.summary = [...doc.summary].sort(
            (a: any, b: any) => parseInt(a.page) - parseInt(b.page)
          )
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true, // ex: "Le numéro 4"
      admin: {
        description: "ex: 'Le numéro 4'",
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true, // ex: "numero-4" — used in the URL
      admin: {
        description: "ex: 'numero-4' — used in the URL",
      },
    },
    {
      name: 'type',
      type: 'select', // dropdown in the admin UI
      options: [
        { label: 'Single Issue', value: 'issue' },
        { label: 'Subscription', value: 'subscription' },
        { label: 'Pack', value: 'pack' },
        { label: 'Poster', value: 'poster' },
      ],
      required: true,
    },
    {
      name: 'interval',
      type: 'select',
      label: 'Fréquence de facturation',
      admin: {
        condition: (data) => data?.type === 'subscription',
        description: 'Obligatoire pour les abonnements Stripe',
      },
      options: [
        { label: 'Tous les 3 mois', value: '3_months' },
        { label: 'Tous les ans', value: 'year' },
      ],
      // On rend le champ requis seulement si c'est un abonnement
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.type === 'subscription' && !value) {
              return '3_months' // Valeur par défaut si oubliée
            }
            return value
          },
        ],
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true, // in euros, ex: 19
    },
    {
      name: 'originalPrice',
      type: 'number', // the crossed-out price, ex: 86
    },
    {
      name: 'badge',
      type: 'text',
      admin: {
        description: "ex : OFFRE limitée jusqu'au 31 mars",
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'the editorial text for the product page',
      },
    },
    {
      name: 'summary',
      type: 'array',
      label: 'Sommaire du numéro',
      admin: {
        description: 'Sommaire du numéro',
        condition: (data) => data?.type === 'issue',
      },
      fields: [
        { name: 'page', type: 'text', required: true }, // "32"
        { name: 'rubrique', type: 'text', required: true }, // "Sur le terrain"
        { name: 'title', type: 'text', required: true }, // "À Plessé..."
      ],
    },
    {
      name: 'issueNumber',
      type: 'text',
      admin: {
        description: 'Obligatoire pour les revues. Ex: 4',
        condition: (data) => data?.type === 'issue',
      },
    },
    {
      name: 'features',
      type: 'richText',
      admin: {
        description: 'the content below the product card ("Vous recevez...")',
      },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media', // links to our Media collection
          filterOptions: {
            // Optionnel : n'affiche que les images dans le sélecteur
            mimeType: { not_like: 'application/pdf' },
          },
        },
      ],
    },
    {
      name: 'pages',
      type: 'array',
      label: 'Pages intérieures',
      admin: { description: 'Photos de pages intérieures du magazine' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: {
            // Optionnel : n'affiche que les PDFs dans le sélecteur
            mimeType: { like: 'application/pdf' },
          },
        },
      ],
    },

    // Stripe fields — filled automatically by our hook later
    {
      name: 'stripeProductId',
      type: 'text',
      admin: { readOnly: true }, // editors can't edit this manually
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: { readOnly: true },
    },
  ],
}

export default Products
