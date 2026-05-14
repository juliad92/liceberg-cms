import type { CollectionBeforeChangeHook } from 'payload'
import stripe from '../lib/stripe'

type StripeProductData = {
  title?: string | null
  type?: string | null
  interval?: string | null
  price?: number | null
  stripeProductId?: string | null
  stripePriceId?: string | null
}

const createStripeProduct = async (product: StripeProductData) => {
  if (!product.title) {
    throw new Error('Cannot sync product to Stripe without a title.')
  }

  return stripe.products.create({
    name: product.title,
    metadata: {
      type: product.type ?? '',
    },
  })
}

const createStripePrice = async (
  stripeProductId: string,
  product: StripeProductData
) => {
  if (typeof product.price !== 'number' || !Number.isFinite(product.price)) {
    throw new Error('Cannot sync product to Stripe without a valid price.')
  }

  return stripe.prices.create({
    product: stripeProductId,
    unit_amount: Math.round(product.price * 100),
    currency: 'eur',
    ...(product.type === 'subscription' && {
      recurring: {
        interval: product.interval === 'year' ? 'year' : 'month',
        interval_count: product.interval === 'year' ? 1 : 3,
      },
    }),
  })
}

export const syncToStripe: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  try {
    const previousProduct = (originalDoc ?? {}) as StripeProductData
    const incomingProduct = data as StripeProductData
    const product = {
      ...previousProduct,
      ...incomingProduct,
    }

    if (operation === 'create') {
      // Don't sync if already synced
      if (data.stripeProductId) return data

      console.log('Creating Stripe product for:', data.title)

      const stripeProduct = await createStripeProduct(product)
      const stripePrice = await createStripePrice(stripeProduct.id, product)

      return {
        ...data,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
      }
    } else if (operation === 'update') {
      const stripeProductId = product.stripeProductId

      if (!stripeProductId) {
        const stripeProduct = await createStripeProduct(product)
        const stripePrice = await createStripePrice(stripeProduct.id, product)

        return {
          ...data,
          stripeProductId: stripeProduct.id,
          stripePriceId: stripePrice.id,
        }
      }

      const productUpdate: {
        name?: string
        metadata?: { type: string }
      } = {}

      if (
        incomingProduct.title !== undefined &&
        incomingProduct.title !== previousProduct.title
      ) {
        if (!product.title) {
          throw new Error('Cannot sync product to Stripe without a title.')
        }
        productUpdate.name = product.title
      }

      if (
        incomingProduct.type !== undefined &&
        incomingProduct.type !== previousProduct.type
      ) {
        productUpdate.metadata = {
          type: product.type ?? '',
        }
      }

      if (Object.keys(productUpdate).length > 0) {
        await stripe.products.update(stripeProductId, productUpdate)
        console.log('✅ Stripe product updated:', stripeProductId)
      }

      const priceChanged =
        incomingProduct.price !== undefined &&
        incomingProduct.price !== previousProduct.price
      const typeChanged =
        incomingProduct.type !== undefined &&
        incomingProduct.type !== previousProduct.type
      const intervalChanged =
        incomingProduct.interval !== undefined &&
        incomingProduct.interval !== previousProduct.interval
      const intervalAffectsPrice =
        product.type === 'subscription' ||
        previousProduct.type === 'subscription'
      const shouldCreateNewPrice =
        priceChanged ||
        typeChanged ||
        (intervalAffectsPrice && intervalChanged) ||
        !product.stripePriceId

      if (shouldCreateNewPrice) {
        const stripePrice = await createStripePrice(stripeProductId, product)

        if (product.stripePriceId) {
          await stripe.prices.update(product.stripePriceId, {
            active: false,
          })
        }

        return {
          ...data,
          stripePriceId: stripePrice.id,
        }
      }
    }
  } catch (error) {
    console.error('❌ Stripe sync failed:', error)
    throw error
  }

  return data
}
