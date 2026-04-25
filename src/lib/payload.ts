// lib/payload.ts
// Helper functions to fetch data from Payload's REST API

const API_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

interface FetchOptions {
  draft?: boolean
  depth?: number
}

// ── Posts ──────────────────────────────────────────────────────────────────

export async function getPostBySlug(slug: string, options: FetchOptions = {}) {
  const { draft = false, depth = 2 } = options

  const params = new URLSearchParams({
    'where[slug][equals]': slug,
    depth: String(depth),
    limit: '1',
    ...(draft ? { draft: 'true' } : { 'where[_status][equals]': 'published' }),
  })

  const res = await fetch(`${API_URL}/api/posts?${params}`, {
    // Revalidate every 60s on published pages; no-store on preview
    next: draft ? { revalidate: 0 } : { revalidate: 60 },
    headers: draft
      ? { Authorization: `Bearer ${process.env.PAYLOAD_API_KEY}` }
      : {},
  })

  if (!res.ok) return null

  const data = await res.json()
  return data.docs?.[0] ?? null
}

export async function getAllPosts(options: FetchOptions = {}) {
  const { depth = 1 } = options

  const params = new URLSearchParams({
    'where[_status][equals]': 'published',
    sort: '-publishedAt',
    depth: String(depth),
    limit: '100',
  })

  const res = await fetch(`${API_URL}/api/posts?${params}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) return []

  const data = await res.json()
  return data.docs ?? []
}

export async function getAllPostSlugs(): Promise<string[]> {
  const res = await fetch(
    `${API_URL}/api/posts?where[_status][equals]=published&limit=1000&depth=0&select[slug]=true`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) return []

  const data = await res.json()
  return data.docs?.map((doc: any) => doc.slug).filter(Boolean) ?? []
}

// ── Categories ─────────────────────────────────────────────────────────────

export async function getAllCategories() {
  const res = await fetch(`${API_URL}/api/categories?limit=100`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) return []

  const data = await res.json()
  return data.docs ?? []
}
