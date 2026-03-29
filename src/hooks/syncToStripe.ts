import type { CollectionBeforeChangeHook } from 'payload'
import stripe from '../lib/stripe'

export const syncToStripe: CollectionBeforeChangeHook = async ({
  data,
  operation,
}) => {
  try {
    const priceInCents = Math.round(data.price * 100)

    if (operation === 'create') {
      // Don't sync if already synced
      if (data.stripeProductId) return data

      console.log('Creating Stripe product for:', data.title)

      // 1 — Create Stripe product
      const stripeProduct = await stripe.products.create({
        name: data.title,
        metadata: {
          type: data.type,
        },
      })

      // 2 — Create Stripe price
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: priceInCents,
        currency: 'eur',
        ...(data.type === 'subscription' && {
          recurring: { interval: 'year' },
        }),
      })

      console.log('✅ Stripe product created:', stripeProduct.id)

      // 3 — Return data with Stripe IDs included
      // This saves everything in ONE single database write
      return {
        ...data,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
      }

    } else if (operation === 'update') {
      // Update Stripe product name if it changed
      if (data.stripeProductId && data.title) {
        await stripe.products.update(data.stripeProductId, {
          name: data.title,
        })
        console.log('✅ Stripe product updated:', data.stripeProductId)
      }
    }

  } catch (error) {
    console.error('❌ Stripe sync failed:', error)
  }

  return data
}