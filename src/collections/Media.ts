import type { CollectionConfig } from 'payload'
import { put } from '@vercel/blob'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'blobUrl',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },

    {
      name: 'blobUrl',
      type: 'text',
      hooks: {
        afterRead: [
          ({ data, value }) => {
            // Si Payload essaie de renvoyer l'URL locale cassée,
            // on s'assure que blobUrl est prioritaire dans ton esprit,
            // mais ici on peut aussi forcer la valeur si elle manque.
            return value
          },
        ],
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  upload: {
    staticDir: '/tmp', // Dossier temporaire local avant l'envoi au blob
    handlers: [],
    imageSizes: [],
    adminThumbnail: ({ doc }) => (doc.blobUrl as string) || '',
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // On ne s'occupe que de la création ou si un nouveau fichier est envoyé
        if (
          (operation === 'create' || operation === 'update') &&
          req.file?.data
        ) {
          try {
            const isPDF = req.file.name.toLowerCase().endsWith('.pdf')
            const folder = isPDF ? 'pdfs' : 'images'

            // On upload sur Vercel
            const blob = await put(
              `${folder}/${req.file.name}`,
              req.file.data,
              {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN,
                addRandomSuffix: true,
              }
            )

            // AU LIEU de faire un .update(), on modifie directement l'objet 'data'
            // Payload enregistrera ces valeurs automatiquement.
            return {
              ...data,
              blobUrl: blob.url,
              url: blob.url, // On peut aussi écraser l'URL ici
            }
          } catch (err) {
            console.error('Erreur Blob:', err)
          }
        }
        return data
      },
    ],
  },
}
