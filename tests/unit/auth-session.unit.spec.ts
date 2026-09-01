import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import {
  getRefreshCookieState,
  isAllowedAuthOrigin,
} from '@/lib/auth/sessionConfig'
import { normalizeMeResponse } from '@/lib/auth/sessionResponses'
import { refreshSessionInBrowser } from '@/lib/auth/browserSession'

describe('auth session config', () => {
  it('detects refresh success preconditions with cookies', () => {
    const cookieState = getRefreshCookieState(
      'payload-refresh-token=abc; payload-token=def'
    )

    expect(cookieState.hasRefreshCookie).toBe(true)
    expect(cookieState.hasTokenCookie).toBe(true)
  })

  it('detects missing cookies for refresh failure', () => {
    const cookieState = getRefreshCookieState(null)

    expect(cookieState.hasRefreshCookie).toBe(false)
    expect(cookieState.hasTokenCookie).toBe(false)
  })

  it('allows configured CORS origin and rejects unknown origin', () => {
    expect(isAllowedAuthOrigin('https://liceberg-web.vercel.app')).toBe(true)
    expect(isAllowedAuthOrigin('https://malicious.example')).toBe(false)
  })
})

describe('me response normalization', () => {
  it('returns authenticated shape when user exists', () => {
    const normalized = normalizeMeResponse({
      user: {
        id: 'account_1',
        email: 'test@example.com',
        firstName: 'Test',
      },
    })

    expect(normalized.authenticated).toBe(true)
    expect(normalized.user?.id).toBe('account_1')
    expect(normalized.user?.email).toBe('test@example.com')
  })

  it('returns unauthenticated shape without user payload', () => {
    const normalized = normalizeMeResponse({})

    expect(normalized.authenticated).toBe(false)
    expect(normalized.user).toBeNull()
  })
})

describe('browser refresh helper', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('calls refresh endpoint with include credentials', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ token: 'new-token' }), { status: 200 })
      )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await refreshSessionInBrowser()

    expect(fetchMock).toHaveBeenCalledWith('/api/accounts/refresh-token', {
      method: 'POST',
      credentials: 'include',
    })
    expect(result.ok).toBe(true)
  })

  it('returns stable error payload when refresh fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: false,
          error: { code: 'INVALID_SESSION', message: 'Session is invalid.' },
        }),
        { status: 403 }
      )
    )
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await refreshSessionInBrowser()

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(403)
      expect(result.error.code).toBe('INVALID_SESSION')
    }
  })
})
