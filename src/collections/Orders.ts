import { CollectionConfig } from 'payload'

const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: () => true, // ← allow Stripe webhook to create orders
    read: () => true, // ← false only admins can read orders
    update: () => false,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'customerEmail',
    defaultColumns: [
      'customerEmail',
      'productTitles',
      'total',
      'status',
      'orderType',
      'startingIssue',
      'createdAt',
    ],
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
