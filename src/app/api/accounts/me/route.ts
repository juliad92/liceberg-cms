import config from '@payload-config'
import { REST_GET, REST_OPTIONS } from '@payloadcms/next/routes'
import type { MeResponseBody } from '@/lib/auth/sessionConfig'
import { normalizeMeResponse } from '@/lib/auth/sessionResponses'

const payloadGet = REST_GET(config)
const payloadOptions = REST_OPTIONS(config)

const payloadArgs = {
  params: Promise.resolve({ slug: ['accounts', 'me'] }),
}

export const OPTIONS = async (request: Request): Promise<Response> =>
  payloadOptions(request, payloadArgs)

export const GET = async (request: Request): Promise<Response> => {
  const response = await payloadGet(request, payloadArgs)
  const headers = new Headers(response.headers)
  headers.set('content-type', 'application/json; charset=utf-8')

  if (response.status === 401 || response.status === 403) {
    const body: MeResponseBody = {
      ok: true,
      authenticated: false,
      user: null,
    }
    return new Response(JSON.stringify(body), {
      status: response.status,
      headers,
    })
  }

  if (!response.ok) return response

  let payloadBody: Record<string, unknown> = {}
  try {
    payloadBody = await response.json()
  } catch {
    payloadBody = {}
  }

  const body: MeResponseBody = normalizeMeResponse(payloadBody)

  return new Response(JSON.stringify(body), { status: 200, headers })
}
