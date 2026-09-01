import config from '@payload-config'
import { REST_OPTIONS, REST_POST } from '@payloadcms/next/routes'
import {
  getRefreshCookieState,
  type AuthErrorBody,
} from '@/lib/auth/sessionConfig'

const payloadPost = REST_POST(config)
const payloadOptions = REST_OPTIONS(config)

const payloadArgs = {
  params: Promise.resolve({ slug: ['accounts', 'refresh-token'] }),
}

export const OPTIONS = async (request: Request): Promise<Response> =>
  payloadOptions(request, payloadArgs)

const buildErrorResponse = (
  status: 401 | 403,
  body: AuthErrorBody,
  sourceHeaders?: Headers
) => {
  const headers = new Headers(sourceHeaders)
  headers.set('content-type', 'application/json; charset=utf-8')
  return new Response(JSON.stringify(body), { status, headers })
}

export const POST = async (request: Request): Promise<Response> => {
  const origin = request.headers.get('origin')
  const cookieState = getRefreshCookieState(request.headers.get('cookie'))

  console.info('[accounts.refresh-token.attempt]', {
    origin,
    hasRefreshCookie: cookieState.hasRefreshCookie,
    hasTokenCookie: cookieState.hasTokenCookie,
  })

  if (!cookieState.hasRefreshCookie) {
    return buildErrorResponse(401, {
      ok: false,
      error: {
        code: 'MISSING_SESSION',
        message: 'Refresh token cookie is missing.',
      },
    })
  }

  const response = await payloadPost(request, payloadArgs)

  if (response.ok) {
    console.info('[accounts.refresh-token.success]', {
      origin,
      status: response.status,
    })
    return response
  }

  if (response.status === 401 || response.status === 403) {
    console.warn('[accounts.refresh-token.denied]', {
      origin,
      status: response.status,
      hasRefreshCookie: cookieState.hasRefreshCookie,
      hasTokenCookie: cookieState.hasTokenCookie,
    })
    return buildErrorResponse(
      response.status,
      {
        ok: false,
        error: {
          code: 'INVALID_SESSION',
          message: 'Session is missing or invalid.',
        },
      },
      response.headers
    )
  }

  return response
}
