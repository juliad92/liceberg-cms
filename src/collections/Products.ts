import { CollectionConfig } from 'payload'
import { syncToStripe } from '../hooks/syncToStripe'
import { isAdminUser } from '../lib/isAdminUser'
import type { Product } from '@/payload-types'

type ProductSummaryItem = NonNullable<Product['summary']>[number]

const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: () => true,
    create: ({ req: { user } }) => isAdminUser(user),
    update: ({ req: { user } }) => isAdminUser(user),
    delete: ({ req: { user } }) => isAdminUser(user),
  },
  admin: {
    useAsTitle: 'title', // shows the product title in the admin list
    defaultColumns: ['title', 'price', 'type', 'stripeProductId'],
  },
  hooks: {
    beforeChange: [syncToStripe],
    afterRead: [
      ({ doc }: { doc: Product }) => {
        if (doc?.summary && Array.isArray(doc.summary)) {
          doc.summary = [...doc.summary].sort(
            (a: ProductSummaryItem, b: ProductSummaryItem) =>
              parseInt(a.page, 10) - parseInt(b.page, 10)
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
      name: 'nextIssueSubscriptionStartDate',
      type: 'date',
      label: 'Début des abonnements au prochain numéro',
      admin: {
        description:
          'Date à laquelle le prochain numéro devient le numéro en cours pour les abonnements (ex : 1er octobre 2026).',
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
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Image principale (home + page produit)',
      admin: {
        description: 'Image affichée sur la home page et la page produit',
      },
      filterOptions: {
        mimeType: { not_like: 'application/pdf' },
      },
    },
    {
      name: 'cardImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Image carte produit',
      admin: {
        description: 'Image affichée dans la ProductCard',
      },
      filterOptions: {
        mimeType: { not_like: 'application/pdf' },
      },
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
    {
      name: 'statusPublication',
      type: 'select', // dropdown in the admin UI
      options: [
        { label: 'Non publié sur le site', value: 'unpublished' },
        { label: 'Publié sur le site', value: 'published' },
      ],
    },
    {
      name: 'displayOrder',
      type: 'number',
      admin: {
        description:
          "Ordre d'affichage sur la home page (1 = dernier, 2 = avant-dernier, etc...)",
      },
    },
    // Stripe fields — filled automatically by our hook later
    {
      name: 'stripeProductId',
      type: 'text',
      // admin: { readOnly: true }, // editors can't edit this manually
    },
    {
      name: 'stripePriceId',
      type: 'text',
      // admin: { readOnly: true },
    },
    {
      name: 'productPresentation',
      type: 'richText',
      admin: {
        description:
          'sous le bloc « Au sommaire du numéro » et avant le bloc de lecture du pdf, bloc de contenus avec photo et texte pour présenter les articles - type newsletter',
      },
    },

    {
      name: 'backgroundColor',
      type: 'text',
      admin: {
        description:
          'Code couleur Hex pour le fond de la page produit (ex : #9b8ec4)',
      },
      validate: (val: string | string[] | null | undefined) => {
        if (!val) return true

        if (typeof val === 'string') {
          const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/
          if (hexRegex.test(val)) {
            return true
          }
        }
        return "La couleur doit être un code hexadécimal valide commençant par '#' (ex: #FFFFFF ou #000)"
      },
    },

    {
      name: 'policeColor',
      type: 'text',
      admin: {
        description:
          'Code couleur Hex pour la police du texte du fond de la page produit (ex : #ffffff)',
      },
      validate: (val: string | string[] | null | undefined) => {
        if (!val) return true
        // Vérifie si la chaîne commence par # suivi de 3 ou 6 caractères hexadécimaux
        if (typeof val === 'string') {
          const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/
          if (hexRegex.test(val)) {
            return true
          }
        }
        return "La couleur doit être un code hexadécimal valide commençant par '#' (ex: #FFFFFF ou #000)"
      },
    },
  ],
}

export default Products
