import type { CollectionAfterChangeHook } from 'payload'
import stripe from '../lib/stripe'

export const syncToStripe: CollectionAfterChangeHook = async ({
  doc,        // the product document that was just saved
  operation,  // 'create' or 'update'
  req,
}) => {
  try {
    console.log('Stripe key exists:', !!process.env.STRIPE_SECRET_KEY)
  console.log('Stripe key prefix:', process.env.STRIPE_SECRET_KEY?.substring(0, 7))

    const priceInCents = Math.round(doc.price * 100) // Stripe uses cents
    console.log("product doc that we want to save",doc)
    console.log(priceInCents)
    console.log(operation)
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
      console.log("Add - stripePrice", stripePrice)
      // 3 — Save the Stripe IDs back to Payload
      // ← Use REST API instead of req.payload.update
      const cmsUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
      await fetch(`${cmsUrl}/api/products/${doc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripeProductId: stripeProduct.id,
          stripePriceId: stripePrice.id,
        }),
      })
      
      /*await req.payload.update({
        collection: 'products',
        id: doc.id,
        data: {
          stripeProductId: stripeProduct.id,
          stripePriceId: stripePrice.id,
        },
      })*/
     
      console.log("Add- stripeProduct",stripeProduct)
      
      console.log(`✅ Created Stripe product for: ${doc.title}`)
      
    } else if (operation === 'update' && doc.stripeProductId) {
      // Update the existing Stripe product name
      await stripe.products.update(doc.stripeProductId, {
        name: doc.title,
        metadata:{
          unit_amount:priceInCents
      }})
      console.log("Stripe doc", doc)
      console.log(`✅ Updated Stripe product for: ${doc.title}`)
    }

  } catch (error) {
    console.error('❌ Stripe sync failed:', error)
  }

  return doc
}