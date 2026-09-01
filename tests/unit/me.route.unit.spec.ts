import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockPayloadGet } = vi.hoisted(() => ({
  mockPayloadGet: vi.fn(),
}))

vi.mock('@payloadcms/next/routes', () => ({
  REST_GET: vi.fn(() => mockPayloadGet),
  REST_OPTIONS: vi.fn(() => async () => new Response(null, { status: 204 })),
  REST_POST: vi.fn(),
}))

import { GET } from '@/app/api/accounts/me/route'

describe('GET /api/accounts/me', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('normalizes unauthenticated 401 into stable me response', async () => {
    mockPayloadGet.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      })
    )

    const response = await GET(
      new Request('http://localhost:3000/api/accounts/me')
    )

    expect(response.status).toBe(401)

    const body = await response.json()
    expect(body.ok).toBe(true)
    expect(body.authenticated).toBe(false)
    expect(body.user).toBeNull()
  })

  it('normalizes authenticated payload user', async () => {
    mockPayloadGet.mockResolvedValue(
      new Response(
        JSON.stringify({
          user: {
            id: 'acc_1',
            email: 'reader@liceberg.fr',
            firstName: 'Reader',
          },
        }),
        { status: 200, headers: { 'content-type': 'application/json' } }
      )
    )

    const response = await GET(
      new Request('http://localhost:3000/api/accounts/me')
    )

    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body.authenticated).toBe(true)
    expect(body.user?.id).toBe('acc_1')
    expect(body.user?.email).toBe('reader@liceberg.fr')
  })
})
