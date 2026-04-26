import type { CollectionConfig } from 'payload'

export const AgendaEvents: CollectionConfig = {
  slug: 'agenda-events',
  labels: {
    singular: 'Agenda Event',
    plural: 'Agenda Events',
  },
  access: {
    read: ({ req: { user } }) => user?.email === 'jdemichel.jd@gmail.com',
    create: ({ req: { user } }) => user?.email === 'jdemichel.jd@gmail.com',
    update: ({ req: { user } }) => user?.email === 'jdemichel.jd@gmail.com',
    delete: ({ req: { user } }) => user?.email === 'jdemichel.jd@gmail.com',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'location', 'eventType', 'featured'],
    description: 'Manage events displayed on the agenda page.',
  },
  defaultSort: 'startDate',
  // access: {
  //   read: () => true,
  // },
  fields: [
    // ─── Core Info ───────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      label: 'Event Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      admin: {
        description: 'URL-friendly identifier (auto-fill or set manually).',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'eventType',
      type: 'select',
      label: 'Event Type',
      options: [
        { label: 'Festival', value: 'festival' },
        { label: 'Exposition', value: 'exposition' },
        { label: 'Rencontre', value: 'rencontre' },
        { label: 'Concert', value: 'concert' },
        { label: 'Projection', value: 'projection' },
        { label: 'Lancement', value: 'lancement' },
        { label: 'Conférence', value: 'conference' },
        { label: 'Autre', value: 'autre' },
      ],
      admin: {
        description: 'Category tag shown on the event card.',
      },
    },

    // ─── Dates & Time ─────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: 'Start Date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd MMM yyyy, HH:mm',
            },
            width: '50%',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'End Date / End Time',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd MMM yyyy, HH:mm',
            },
            description: 'Leave blank if end time is same day as start.',
            width: '50%',
          },
        },
      ],
    },

    // ─── Location ─────────────────────────────────────────────────
    {
      name: 'location',
      type: 'group',
      label: 'Location',
      fields: [
        {
          name: 'venueName',
          type: 'text',
          label: 'Venue Name',
          admin: {
            placeholder: "e.g. Librairie L'échappée belle",
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'city',
              type: 'text',
              label: 'City',
              admin: {
                placeholder: 'e.g. Sète',
                width: '50%',
              },
            },
            {
              name: 'postalCode',
              type: 'text',
              label: 'Postal Code',
              admin: {
                placeholder: 'e.g. 34200',
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'address',
          type: 'text',
          label: 'Full Address (optional)',
          admin: {
            description: 'Street address if needed for maps or display.',
          },
        },
        {
          name: 'mapsUrl',
          type: 'text',
          label: 'Google Maps URL (optional)',
        },
      ],
    },

    // ─── Featured Card ────────────────────────────────────────────
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Event',
      defaultValue: false,
      admin: {
        description:
          'Display this event as the large featured card on the agenda page.',
        position: 'sidebar',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
      admin: {
        description: 'Used on the featured card. Recommended: 600×700px.',
        condition: (data) => data?.featured === true,
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags / Labels',
      admin: {
        description:
          'Small keyword tags shown on the featured card (e.g. "festival", "exposition", "concert").',
        condition: (data) => data?.featured === true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },

    // ─── CTA ──────────────────────────────────────────────────────
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      admin: {
        description: 'Button shown on the featured card.',
        condition: (data) => data?.featured === true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'Réserver son billet',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Button URL',
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: true,
        },
      ],
    },

    // ─── Description ──────────────────────────────────────────────
    {
      name: 'description',
      type: 'richText',
      label: 'Description (optional)',
      admin: {
        description: 'Extended content for the event detail page.',
      },
    },

    // ─── Status ───────────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
