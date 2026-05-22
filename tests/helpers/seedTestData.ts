import type { Payload } from 'payload'
import type { Account, Order, Product, User } from '@/payload-types'

export const testRunId = Date.now().toString(36)

export const testCredentials = {
  password: 'TestPassword123!',
  adminEmail: `admin-${testRunId}@test.local`,
  editorEmail: `editor-${testRunId}@test.local`,
  account1Email: `account1-${testRunId}@test.local`,
  account2Email: `account2-${testRunId}@test.local`,
}

export async function createAdminUser(payload: Payload): Promise<User> {
  return payload.create({
    collection: 'users',
    data: {
      email: testCredentials.adminEmail,
      password: testCredentials.password,
      role: 'admin',
    },
  })
}

export async function createEditorUser(payload: Payload): Promise<User> {
  return payload.create({
    collection: 'users',
    data: {
      email: testCredentials.editorEmail,
      password: testCredentials.password,
      role: 'user',
    },
  })
}

export async function createAccount(
  payload: Payload,
  email: string,
): Promise<Account> {
  return payload.create({
    collection: 'accounts',
    data: {
      email,
      password: testCredentials.password,
    },
  })
}

export async function getAccountUser(
  payload: Payload,
  email: string,
): Promise<Account & { collection: 'accounts' }> {
  const result = await payload.find({
    collection: 'accounts',
    where: { email: { equals: email } },
    limit: 1,
  })

  const account = result.docs[0]
  if (!account) {
    throw new Error(`Test account not found: ${email}`)
  }

  return { ...account, collection: 'accounts' }
}

export function buildTestProduct(slug: string): Omit<Product, 'id' | 'updatedAt' | 'createdAt'> {
  return {
    title: 'Test product',
    slug,
    type: 'issue',
    price: 19,
    stripeProductId: 'prod_test_skip_sync',
    stripePriceId: 'price_test_skip_sync',
  } as Omit<Product, 'id' | 'updatedAt' | 'createdAt'>
}

export async function createTestOrder(
  payload: Payload,
  customerEmail: string,
  stripeSessionId: string,
): Promise<Order> {
  return payload.create({
    collection: 'orders',
    data: {
      customerEmail,
      total: 19,
      status: 'paid',
      stripeSessionId,
    },
  })
}

export async function cleanupTestData(payload: Payload): Promise<void> {
  const emails = [
    testCredentials.adminEmail,
    testCredentials.editorEmail,
    testCredentials.account1Email,
    testCredentials.account2Email,
  ]

  await payload.delete({
    collection: 'orders',
    where: {
      customerEmail: { in: [testCredentials.account1Email, testCredentials.account2Email] },
    },
  })

  await payload.delete({
    collection: 'products',
    where: {
      slug: { contains: testRunId },
    },
  })

  await payload.delete({
    collection: 'accounts',
    where: {
      email: { in: [testCredentials.account1Email, testCredentials.account2Email] },
    },
  })

  await payload.delete({
    collection: 'users',
    where: {
      email: { in: emails },
    },
  })
}
