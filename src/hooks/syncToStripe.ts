import type { CollectionAfterChangeHook } from 'payload'
import stripe from '../lib/stripe'

export const syncToStripe: CollectionAfterChangeHook = async ({
  doc,        // the product document that was just saved
  operation,  // 'create' or 'update'
  req,
}) => {
  try {
    const priceInCents = Math.round(doc.price * 100) // Stripe uses cents

    if (operation === 'create') {
      // 1 — Create a Product in Stripe
      const stripeProduct = await stripe.products.create({
        name: doc.title,
        metadata: {
          payloadId: doc.id,
          type: doc.type,
        },
      })

      // 2 — Create a Price attached to that product
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: priceInCents,
        currency: 'eur',
        // if it's a subscription, bill monthly
        ...(doc.type === 'subscription' && {
          recurring: { interval: 'year' },
        }),
      })

      // 3 — Save the Stripe IDs back to Payload
      await req.payload.update({
        collection: 'products',
        id: doc.id,
        data: {
          stripeProductId: stripeProduct.id,
          stripePriceId: stripePrice.id,
        },
      })

      console.log(`✅ Created Stripe product for: ${doc.title}`)

    } else if (operation === 'update' && doc.stripeProductId) {
      // Update the existing Stripe product name
      await stripe.products.update(doc.stripeProductId, {
        name: doc.title,
      })

      console.log(`✅ Updated Stripe product for: ${doc.title}`)
    }

  } catch (error) {
    console.error('❌ Stripe sync failed:', error)
  }

  return doc
}