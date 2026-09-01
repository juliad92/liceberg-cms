export type BrowserRefreshSuccess = {
  ok: true
  status: 200
  data: unknown
}

export type BrowserRefreshFailure = {
  ok: false
  status: number
  error: {
    code: string
    message: string
  }
}

export type BrowserRefreshResult = BrowserRefreshSuccess | BrowserRefreshFailure

const parseError = async (
  response: Response
): Promise<BrowserRefreshFailure['error']> => {
  try {
    const parsed = await response.json()
    if (parsed?.error?.code && parsed?.error?.message) {
      return {
        code: String(parsed.error.code),
        message: String(parsed.error.message),
      }
    }
  } catch {
    // Fallback to default error payload.
  }

  return {
    code: 'REFRESH_FAILED',
    message: 'Unable to refresh session.',
  }
}

export const refreshSessionInBrowser =
  async (): Promise<BrowserRefreshResult> => {
    if (typeof window === 'undefined') {
      return {
        ok: false,
        status: 400,
        error: {
          code: 'BROWSER_ONLY',
          message: 'refreshSessionInBrowser must run in browser context.',
        },
      }
    }

    const attemptRefresh = async (): Promise<Response> =>
      fetch('/api/accounts/refresh-token', {
        method: 'POST',
        credentials: 'include',
      })

    let response = await attemptRefresh()

    if (response.status === 429) {
      response = await attemptRefresh()
    }

    if (response.ok) {
      return {
        ok: true,
        status: 200,
        data: await response.json(),
      }
    }

    return {
      ok: false,
      status: response.status,
      error: await parseError(response),
    }
  }
