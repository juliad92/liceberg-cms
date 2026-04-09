import type { CollectionConfig } from 'payload'
import { put } from '@vercel/blob'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
  upload: {
    staticDir: '/tmp', // Dossier temporaire local avant l'envoi au blob
    handlers: [],
    imageSizes: [],
    adminThumbnail: ({ doc }) => (doc.url as string) || '',
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

          // 2. Créer le chemin complet (ex: pdf/mon-fichier.pdf)
          const blobPath = `${folder}/${doc.filename}`

          // On récupère le fichier local
          // const filePath = `${process.cwd()}/tmp/${doc.filename}`

          try {
            // 3. Upload vers Vercel Blob
            const blob = await put(blobPath, req.file.data, {
              access: 'public',
              token: process.env.BLOB_READ_WRITE_TOKEN,
              addRandomSuffix: true, // Optionnel : garde le nom exact du fichier
            })
            // 4. Mettre à jour le document Payload avec l'URL finale
            // On utilise req.payload.update pour éviter de relancer les hooks à l'infini
            await req.payload.update({
              collection: 'media',
              id: doc.id,
              data: {
                url: blob.url,
              },
            })
          } catch (err) {
            console.error("Erreur lors de l'upload vers Vercel:", err)
          }
        }
      },
    ],
  },
}
