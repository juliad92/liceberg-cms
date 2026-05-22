import { describe, expect, it } from 'vitest'
import { isAdminUser } from '@/lib/isAdminUser'

describe('isAdminUser', () => {
  it('returns true for admin role', () => {
    expect(isAdminUser({ role: 'admin' })).toBe(true)
  })

  it('returns false for non-admin roles', () => {
    expect(isAdminUser({ role: 'user' })).toBe(false)
    expect(isAdminUser({ role: 'editor' })).toBe(false)
  })

  it('returns false for missing or invalid user', () => {
    expect(isAdminUser(null)).toBe(false)
    expect(isAdminUser(undefined)).toBe(false)
    expect(isAdminUser('string')).toBe(false)
    expect(isAdminUser({})).toBe(false)
  })
})
