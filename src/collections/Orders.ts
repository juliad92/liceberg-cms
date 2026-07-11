import { CollectionConfig } from 'payload'
import { isAdminUser } from '../lib/isAdminUser'

const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: ({ req }) => {
      const { user } = req
      if (isAdminUser(user)) return true
      if (
        req.headers.get('authorization') ===
        `users API-Key ${process.env.PAYLOAD_API_KEY}`
      ) {
        return true
      }
      return false
    },
    read: ({ req }) => {
      const { user } = req
      if (isAdminUser(user)) return true
      if (
        req.headers.get('authorization') ===
        `users API-Key ${process.env.PAYLOAD_API_KEY}`
      ) {
        return true
      }
      // Account token — Payload populates req.user from the auth collection
      // that matches the token, so we check the collection slug
      if (user?.collection === 'accounts' && user?.email) {
        return {
          customerEmail: { equals: user.email },
        }
      }
      if (!user?.email) return false

      return false
    },

    update: ({ req }) => {
      const { user } = req
      if (isAdminUser(user)) return true
      // Allow updates via API Key (for Stripe Webhook)
      if (
        req.headers.get('authorization') ===
        `users API-Key ${process.env.PAYLOAD_API_KEY}`
      ) {
        return true
      }
      return false
    },

    delete: () => false,
  },
  admin: {
    useAsTitle: 'customerEmail',
    defaultColumns: ['customerEmail', 'total', 'status', 'createdAt'],
  },

  fields: [
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'customerName',
      type: 'text',
    },
    {
      name: 'productTitles',
      type: 'text',
      admin: { readOnly: true },
    },

    {
      name: 'stripeSessionId',
      type: 'text', // the ID from Stripe, to avoid duplicates
      unique: true,
    },
    {
      name: 'items',
      type: 'array', // what was bought
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products', // links to a Product document
        },
        {
          name: 'quantity',
          type: 'number',
        },
        {
          name: 'price',
          type: 'number',
        },
      ],
    },
    {
      name: 'startingIssue',
      type: 'text',
      admin: {
        description: "Numéro de départ de l'abonnement (ex: 4, 5...)",
        condition: (data) => data.orderType === 'subscription',
      },
    },
    {
      name: 'total',
      type: 'number',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'shippingAddress',
      type: 'group', // groups related fields together
      fields: [
        { name: 'line1', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text' },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'Carte bancaire', value: 'card' },
        { label: 'Prélèvement SEPA', value: 'sepa_debit' },
        // Legacy / imported orders (e.g. Shopify) — must stay valid for bulk edits
        { label: 'Shopify Payments', value: 'Shopify Payments' },
      ],
      defaultValue: 'card',
    },
    {
      name: 'orderType',
      type: 'select',
      options: [
        { label: 'Paiement unique', value: 'payment' },
        { label: 'Abonnement', value: 'subscription' },
      ],
      defaultValue: 'payment',
    },
    { name: 'stripeSubscriptionId', type: 'text' },
  ],
}

export default Orders
