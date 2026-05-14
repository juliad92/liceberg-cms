import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
import { syncToStripe } from '@/hooks/syncToStripe'
import stripe from '@/lib/stripe'

vi.mock('@/lib/stripe', () => ({
  default: {
    products: {
      create: vi.fn(),
      update: vi.fn(),
    },
    prices: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}))

type StripeMock = {
  products: {
    create: Mock
    update: Mock
  }
  prices: {
    create: Mock
    update: Mock
  }
}

const stripeMock = stripe as unknown as StripeMock

const runHook = (args: {
  data: Record<string, unknown>
  operation: 'create' | 'update'
  originalDoc?: Record<string, unknown>
}) => syncToStripe(args as any)

describe('syncToStripe', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    stripeMock.products.create.mockResolvedValue({ id: 'prod_new' } as never)
    stripeMock.products.update.mockResolvedValue({
      id: 'prod_existing',
    } as never)
    stripeMock.prices.create.mockResolvedValue({ id: 'price_new' } as never)
    stripeMock.prices.update.mockResolvedValue({ id: 'price_old' } as never)
  })

  it('creates a Stripe product and recurring price for new subscriptions', async () => {
    const result = await runHook({
      operation: 'create',
      data: {
        title: 'Annual subscription',
        type: 'subscription',
        interval: 'year',
        price: 80,
      },
    })

    expect(stripeMock.products.create).toHaveBeenCalledWith({
      name: 'Annual subscription',
      metadata: { type: 'subscription' },
    })
    expect(stripeMock.prices.create).toHaveBeenCalledWith({
      product: 'prod_new',
      unit_amount: 8000,
      currency: 'eur',
      recurring: {
        interval: 'year',
        interval_count: 1,
      },
    })
    expect(result).toMatchObject({
      stripeProductId: 'prod_new',
      stripePriceId: 'price_new',
    })
  })

  it('updates Stripe product name without replacing price for title-only updates', async () => {
    const result = await runHook({
      operation: 'update',
      originalDoc: {
        title: 'Old issue',
        type: 'issue',
        price: 19,
        stripeProductId: 'prod_existing',
        stripePriceId: 'price_existing',
      },
      data: {
        title: 'New issue',
      },
    })

    expect(stripeMock.products.update).toHaveBeenCalledWith('prod_existing', {
      name: 'New issue',
    })
    expect(stripeMock.prices.create).not.toHaveBeenCalled()
    expect(stripeMock.prices.update).not.toHaveBeenCalled()
    expect(result).toEqual({ title: 'New issue' })
  })

  it('creates a replacement Stripe price when amount changes on a partial update', async () => {
    const result = await runHook({
      operation: 'update',
      originalDoc: {
        title: 'Quarterly subscription',
        type: 'subscription',
        interval: '3_months',
        price: 24,
        stripeProductId: 'prod_existing',
        stripePriceId: 'price_existing',
      },
      data: {
        price: 30,
      },
    })

    expect(stripeMock.products.update).not.toHaveBeenCalled()
    expect(stripeMock.prices.create).toHaveBeenCalledWith({
      product: 'prod_existing',
      unit_amount: 3000,
      currency: 'eur',
      recurring: {
        interval: 'month',
        interval_count: 3,
      },
    })
    expect(stripeMock.prices.update).toHaveBeenCalledWith('price_existing', {
      active: false,
    })
    expect(result).toEqual({
      price: 30,
      stripePriceId: 'price_new',
    })
  })

  it('creates a replacement Stripe price when subscription interval changes', async () => {
    await runHook({
      operation: 'update',
      originalDoc: {
        title: 'Subscription',
        type: 'subscription',
        interval: '3_months',
        price: 24,
        stripeProductId: 'prod_existing',
        stripePriceId: 'price_existing',
      },
      data: {
        interval: 'year',
      },
    })

    expect(stripeMock.prices.create).toHaveBeenCalledWith({
      product: 'prod_existing',
      unit_amount: 2400,
      currency: 'eur',
      recurring: {
        interval: 'year',
        interval_count: 1,
      },
    })
    expect(stripeMock.prices.update).toHaveBeenCalledWith('price_existing', {
      active: false,
    })
  })

  it('creates a one-time replacement price when changing from subscription to issue', async () => {
    await runHook({
      operation: 'update',
      originalDoc: {
        title: 'Subscription',
        type: 'subscription',
        interval: '3_months',
        price: 24,
        stripeProductId: 'prod_existing',
        stripePriceId: 'price_existing',
      },
      data: {
        type: 'issue',
      },
    })

    expect(stripeMock.products.update).toHaveBeenCalledWith('prod_existing', {
      metadata: { type: 'issue' },
    })
    expect(stripeMock.prices.create).toHaveBeenCalledWith({
      product: 'prod_existing',
      unit_amount: 2400,
      currency: 'eur',
    })
    expect(stripeMock.prices.update).toHaveBeenCalledWith('price_existing', {
      active: false,
    })
  })

  it('creates Stripe IDs for updated legacy products that were not synced yet', async () => {
    const result = await runHook({
      operation: 'update',
      originalDoc: {
        title: 'Legacy issue',
        type: 'issue',
        price: 19,
      },
      data: {
        title: 'Legacy issue updated',
      },
    })

    expect(stripeMock.products.create).toHaveBeenCalledWith({
      name: 'Legacy issue updated',
      metadata: { type: 'issue' },
    })
    expect(stripeMock.prices.create).toHaveBeenCalledWith({
      product: 'prod_new',
      unit_amount: 1900,
      currency: 'eur',
    })
    expect(result).toEqual({
      title: 'Legacy issue updated',
      stripeProductId: 'prod_new',
      stripePriceId: 'price_new',
    })
  })
})
