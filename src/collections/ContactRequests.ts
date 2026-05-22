import type { CollectionConfig } from 'payload'
import { isAdminUser } from '../lib/isAdminUser'

const serviceOptions = [
  { label: 'Service client', value: 'Service client' },
  { label: 'Rédaction', value: 'Rédaction' },
  { label: 'Juridique', value: 'Juridique' },
] as const

const ContactRequests: CollectionConfig = {
  slug: 'contact-requests',
  labels: {
    singular: 'Demande de contact',
    plural: 'Demandes de contact',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => isAdminUser(user),
    update: ({ req: { user } }) => isAdminUser(user),
    delete: ({ req: { user } }) => isAdminUser(user),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'service', 'createdAt'],
    description: 'Messages envoyés depuis le formulaire de contact du site.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Téléphone',
    },
    {
      name: 'service',
      type: 'select',
      label: 'Service',
      required: true,
      options: [...serviceOptions],
      defaultValue: 'Service client',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
    },
  ],
}

export default ContactRequests
