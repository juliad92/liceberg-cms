import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getTestPayload } from '../helpers/testPayload'
import {
  cleanupTestData,
  createAdminUser,
  testCredentials,
} from '../helpers/seedTestData'

describe('Payload API connectivity', () => {
  beforeAll(async () => {
    const payload = await getTestPayload()
    await cleanupTestData(payload)
    await createAdminUser(payload)
  })

  afterAll(async () => {
    const payload = await getTestPayload()
    await cleanupTestData(payload)
  })

  it('connects to the database and reads users', async () => {
    const payload = await getTestPayload()
    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: testCredentials.adminEmail } },
      limit: 1,
    })

    expect(users.docs).toHaveLength(1)
    expect(users.docs[0]?.role).toBe('admin')
  })
})
