import type { MeResponseBody } from './sessionConfig'

export const normalizeMeResponse = (
  payloadBody: Record<string, unknown> | null | undefined
): MeResponseBody => {
  const userCandidate =
    payloadBody && typeof payloadBody === 'object'
      ? (payloadBody.user as Record<string, unknown> | null)
      : null

  if (!userCandidate || !userCandidate.id) {
    return {
      ok: true,
      authenticated: false,
      user: null,
    }
  }

  return {
    ok: true,
    authenticated: true,
    user: {
      id: userCandidate.id as string | number,
      email:
        typeof userCandidate.email === 'string'
          ? userCandidate.email
          : undefined,
      name:
        typeof userCandidate.name === 'string' ? userCandidate.name : undefined,
      firstName:
        typeof userCandidate.firstName === 'string'
          ? userCandidate.firstName
          : undefined,
      stripeCustomerId:
        typeof userCandidate.stripeCustomerId === 'string'
          ? userCandidate.stripeCustomerId
          : undefined,
    },
  }
}
