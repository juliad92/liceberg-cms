export const isAdminUser = (user: unknown): boolean => {
  if (!user || typeof user !== 'object') return false

  const maybeUser = user as { role?: unknown }
  return maybeUser.role === 'admin'
}
