import type { Access } from 'payload'
import { describe, expect, it } from 'vitest'
import {
  canManageSubscriberGauge,
  SUBSCRIBER_GAUGE_EDITOR_EMAIL,
  SubscriberGaugeSettings,
} from '@/globals/SubscriberGaugeSettings'

describe('SubscriberGaugeSettings access', () => {
  it('allows only the configured email to update the global', () => {
    expect(
      canManageSubscriberGauge({
        req: { user: { email: SUBSCRIBER_GAUGE_EDITOR_EMAIL } },
      })
    ).toBe(true)
    expect(
      canManageSubscriberGauge({
        req: { user: { email: 'other@example.com' } },
      })
    ).toBe(false)
  })

  it('matches the configured email case-insensitively and trims whitespace', () => {
    expect(
      canManageSubscriberGauge({
        req: {
          user: { email: `  ${SUBSCRIBER_GAUGE_EDITOR_EMAIL.toUpperCase()} ` },
        },
      })
    ).toBe(true)
  })

  it('denies anonymous users', () => {
    expect(canManageSubscriberGauge({ req: { user: null } })).toBe(false)
  })

  it('restricts global reads as well as updates', () => {
    const read = SubscriberGaugeSettings.access?.read as Access
    expect(
      read({
        req: { user: { email: SUBSCRIBER_GAUGE_EDITOR_EMAIL } },
      })
    ).toBe(true)
    expect(
      read({ req: { user: { email: 'other@example.com' } } })
    ).toBe(false)
  })
})
