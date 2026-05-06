// lib/payload.ts
// Helper functions to fetch data from Payload's REST API

import { getPayload } from 'payload'
import config from '@/payload.config'

const API_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

interface FetchOptions {
  draft?: boolean
  depth?: number
}

// Helper pour initialiser Payload (Local API)
const getPayloadClient = async () => {
  return await getPayload({ config })
}

// ── Posts ──────────────────────────────────────────────────────────────────

export async function getPostBySlug(slug: string, options: FetchOptions = {}) {
  const { draft = false, depth = 2 } = options
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    draft,
    depth,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
      // Le statut est géré automatiquement par Payload avec l'option 'draft'
    },
  })
  return result.docs?.[0] ?? null
}

export async function getAllPosts(options: FetchOptions = {}) {
  const { depth = 1 } = options
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    depth,
    sort: '-publishedAt',
    limit: 100,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return result.docs ?? []
}

export async function getAllPostSlugs(): Promise<string[]> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    limit: 1000,
    depth: 0,
    select: {
      slug: true,
    },
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return (result.docs?.map((doc) => doc.slug).filter(Boolean) as string[]) ?? []
}

// ── Categories ─────────────────────────────────────────────────────────────

export async function getAllCategories() {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'categories', // Assurez-vous que le slug est 'categories'
    limit: 100,
  })

  return result.docs ?? []
}
