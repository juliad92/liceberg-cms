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
    // Ce hook s'exécute après que le fichier soit arrivé sur le serveur du CMS
    afterChange: [
      async ({ doc, req, operation }) => {
        if (
          (operation === 'create' || operation === 'update') &&
          req.file?.data
        ) {
          // 1. Déterminer le dossier en fonction de l'extension
          const isPDF = doc.filename.toLowerCase().endsWith('.pdf')
          const folder = isPDF ? 'pdfs' : 'images'

          try {
            // 3. Upload vers Vercel Blob
            const blob = await put(`${folder}/${doc.filename}`, req.file.data, {
              access: 'public',
              token: process.env.BLOB_READ_WRITE_TOKEN,
              addRandomSuffix: true,
            })
            console.log('Blob URL:', blob.url)
            // 4. Mettre à jour le document Payload avec l'URL finale
            // On utilise req.payload.update pour éviter de relancer les hooks à l'infini
            const res = await req.payload.update({
              collection: 'media',
              id: doc.id,
              data: {
                blobUrl: blob.url,
              } as any,
            })
            console.log('Document mis à jour avec blobUrl:', res)
          } catch (err) {
            console.error("Erreur lors de l'upload vers Vercel:", err)
          }
        }
      },
    ],
  },
}
