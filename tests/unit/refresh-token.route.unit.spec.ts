import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/accounts/refresh-token/route'

describe('POST /api/accounts/refresh-token', () => {
  it('returns 401 when refresh cookie is missing', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/accounts/refresh-token', {
        method: 'POST',
      })
    )

    expect(response.status).toBe(401)

    const body = await response.json()
    expect(body.ok).toBe(false)
    expect(body.error.code).toBe('MISSING_SESSION')
  })
})
