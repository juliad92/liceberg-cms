import { CollectionConfig } from 'payload'
import { syncToStripe } from '../hooks/syncToStripe' 

const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: () => true,   // ← anyone can read products
  },
  admin: {
    useAsTitle: 'title',       // shows the product title in the admin list
    defaultColumns: ['title', 'price', 'type', 'stripeProductId'],
  },
  hooks: {
    afterChange: [syncToStripe],   
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,           // ex: "Le numéro 4"
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,             // ex: "numero-4" — used in the URL
    },
    {
      name: 'type',
      type: 'select',           // dropdown in the admin UI
      options: [
        { label: 'Single Issue', value: 'issue' },
        { label: 'Subscription', value: 'subscription' },
        { label: 'Pack', value: 'pack' },
        { label: 'Poster', value: 'poster' },
      ],
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,           // in euros, ex: 19
    },
    {
      name: 'originalPrice',
      type: 'number',           // the crossed-out price, ex: 86
    },
    {
      name: 'badge',
      type: 'text',             // ex: "OFFRE limitée jusqu'au 31 mars"
    },
    {
      name: 'description',
      type: 'richText',         // the editorial text below the price
    },
    {
      name: 'features',
      type: 'array',            // the bullet points list ("Vous recevez...")
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',  // links to our Media collection
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