import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getTestPayload } from '../helpers/testPayload'
import {
  cleanupTestData,
  createAccount,
  createAdminUser,
  getAccountUser,
  testCredentials,
} from '../helpers/seedTestData'

describe('Accounts access', () => {
  let account1Id: string | number
  let account2Id: string | number

  beforeAll(async () => {
    const payload = await getTestPayload()
    await cleanupTestData(payload)
    await createAdminUser(payload)

    const account1 = await createAccount(payload, testCredentials.account1Email)
    const account2 = await createAccount(payload, testCredentials.account2Email)
    account1Id = account1.id
    account2Id = account2.id
  })

  afterAll(async () => {
    const payload = await getTestPayload()
    await cleanupTestData(payload)
  })

  it('lets an account read only its own profile', async () => {
    const payload = await getTestPayload()
    const accountUser = await getAccountUser(
      payload,
      testCredentials.account1Email
    )

    const ownProfile = await payload.findByID({
      collection: 'accounts',
      id: account1Id,
      user: accountUser,
      overrideAccess: false,
    })

    expect(ownProfile.email).toBe(testCredentials.account1Email)
  })

  it('prevents an account from reading another account', async () => {
    const payload = await getTestPayload()
    const accountUser = await getAccountUser(
      payload,
      testCredentials.account1Email
    )

    await expect(
      payload.findByID({
        collection: 'accounts',
        id: account2Id,
        user: accountUser,
        overrideAccess: false,
      })
    ).rejects.toThrow()
  })

  it('lets admins read any account', async () => {
    const payload = await getTestPayload()
    const admin = await payload.find({
      collection: 'users',
      where: { email: { equals: testCredentials.adminEmail } },
      limit: 1,
    })

    const otherAccount = await payload.findByID({
      collection: 'accounts',
      id: account2Id,
      user: admin.docs[0],
      overrideAccess: false,
    })

    expect(otherAccount.email).toBe(testCredentials.account2Email)
  })
})
