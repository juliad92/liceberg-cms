const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://liceberg-cms.vercel.app',
  'https://liceberg-web.vercel.app',
  'https://liceberg-cms-git-main-juliad92s-projects.vercel.app',
  'https://liceberg-cms-git-dev-juliad92s-projects.vercel.app',
  'https://liceberg-web-git-dev-juliad92s-projects.vercel.app',
  'https://liceberg-web-git-main-juliad92s-projects.vercel.app',
  '*.vercel.app',
]

const parseCsvEnv = (value: string | undefined): string[] => {
  if (!value) return []
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export const AUTH_ALLOWED_ORIGINS = (() => {
  const fromEnv = parseCsvEnv(process.env.AUTH_ALLOWED_ORIGINS)
  if (fromEnv.length > 0) return fromEnv
  return DEFAULT_ALLOWED_ORIGINS
})()

export const isAllowedAuthOrigin = (origin: string | null): boolean => {
  if (!origin) return false
  return AUTH_ALLOWED_ORIGINS.includes(origin)
}

const shouldUseSecureCookies = (): boolean => {
  if (process.env.AUTH_COOKIE_SECURE === 'false') return false
  if (process.env.NODE_ENV === 'production') return true
  return process.env.AUTH_COOKIE_SECURE === 'true'
}

export const AUTH_COOKIE_POLICY = {
  httpOnly: true,
  sameSite: shouldUseSecureCookies() ? ('None' as const) : ('Lax' as const),
  secure: shouldUseSecureCookies(),
}

export type AuthErrorCode =
  | 'MISSING_SESSION'
  | 'INVALID_SESSION'
  | 'UNAUTHORIZED'

export type AuthErrorBody = {
  ok: false
  error: {
    code: AuthErrorCode
    message: string
  }
}

export type MeResponseBody = {
  ok: true
  authenticated: boolean
  user: {
    id: string | number
    email?: string
    name?: string
    firstName?: string
    stripeCustomerId?: string
  } | null
}

export const getRefreshCookieState = (cookieHeader: string | null) => {
  const cookie = cookieHeader || ''
  return {
    hasRefreshCookie: cookie.includes('payload-refresh-token='),
    hasTokenCookie: cookie.includes('payload-token='),
  }
}
