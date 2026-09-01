import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getTestPayload } from '../helpers/testPayload'
import {
  cleanupTestData,
  createAccount,
  createAdminUser,
  createTestOrder,
  getAccountUser,
  testCredentials,
} from '../helpers/seedTestData'

describe('Orders access', () => {
  beforeAll(async () => {
    const payload = await getTestPayload()
    await cleanupTestData(payload)
    await createAdminUser(payload)
    await createAccount(payload, testCredentials.account1Email)
    await createAccount(payload, testCredentials.account2Email)

    await createTestOrder(
      payload,
      testCredentials.account1Email,
      `cs_test_${Date.now()}_1`
    )
    await createTestOrder(
      payload,
      testCredentials.account2Email,
      `cs_test_${Date.now()}_2`
    )
  })

  afterAll(async () => {
    const payload = await getTestPayload()
    await cleanupTestData(payload)
  })

  it('scopes account reads to orders with matching customerEmail', async () => {
    const payload = await getTestPayload()
    const accountUser = await getAccountUser(
      payload,
      testCredentials.account1Email
    )

    const orders = await payload.find({
      collection: 'orders',
      user: accountUser,
      overrideAccess: false,
      limit: 100,
    })

    expect(orders.docs.length).toBeGreaterThan(0)
    expect(
      orders.docs.every(
        (order) => order.customerEmail === testCredentials.account1Email
      )
    ).toBe(true)
  })

  it('does not expose other customers orders to an account', async () => {
    const payload = await getTestPayload()
    const accountUser = await getAccountUser(
      payload,
      testCredentials.account1Email
    )

    const orders = await payload.find({
      collection: 'orders',
      where: { customerEmail: { equals: testCredentials.account2Email } },
      user: accountUser,
      overrideAccess: false,
      limit: 10,
    })

    expect(orders.docs).toHaveLength(0)
  })

  it('lets admins read all orders', async () => {
    const payload = await getTestPayload()
    const admin = await payload.find({
      collection: 'users',
      where: { email: { equals: testCredentials.adminEmail } },
      limit: 1,
    })

    const orders = await payload.find({
      collection: 'orders',
      user: admin.docs[0],
      overrideAccess: false,
      limit: 100,
    })

    const emails = new Set(orders.docs.map((order) => order.customerEmail))
    expect(emails.has(testCredentials.account1Email)).toBe(true)
    expect(emails.has(testCredentials.account2Email)).toBe(true)
  })
})
