import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getTestPayload } from '../helpers/testPayload'
import {
  buildTestProduct,
  cleanupTestData,
  createAdminUser,
  createEditorUser,
  testCredentials,
  testRunId,
} from '../helpers/seedTestData'

const testSlug = `product-${testRunId}`

describe('Products access', () => {
  beforeAll(async () => {
    const payload = await getTestPayload()
    await cleanupTestData(payload)
    await createAdminUser(payload)
    await createEditorUser(payload)
  })

  afterAll(async () => {
    const payload = await getTestPayload()
    await cleanupTestData(payload)
  })

  it('allows public read with access control enforced', async () => {
    const payload = await getTestPayload()
    const admin = await payload.find({
      collection: 'users',
      where: { email: { equals: testCredentials.adminEmail } },
      limit: 1,
    })

    await payload.create({
      collection: 'products',
      data: buildTestProduct(testSlug),
      user: admin.docs[0],
    })

    const publicRead = await payload.find({
      collection: 'products',
      where: { slug: { equals: testSlug } },
      overrideAccess: false,
    })

    expect(publicRead.docs.length).toBe(1)
  })

  it('denies product creation for non-admin users', async () => {
    const payload = await getTestPayload()
    const editor = await payload.find({
      collection: 'users',
      where: { email: { equals: testCredentials.editorEmail } },
      limit: 1,
    })

    await expect(
      payload.create({
        collection: 'products',
        data: buildTestProduct(`${testSlug}-denied`),
        user: editor.docs[0],
        overrideAccess: false,
      })
    ).rejects.toThrow()
  })

  it('allows admins to create products when access control is enforced', async () => {
    const payload = await getTestPayload()
    const admin = await payload.find({
      collection: 'users',
      where: { email: { equals: testCredentials.adminEmail } },
      limit: 1,
    })

    const created = await payload.create({
      collection: 'products',
      data: buildTestProduct(`${testSlug}-admin`),
      user: admin.docs[0],
      overrideAccess: false,
    })

    expect(created.slug).toBe(`${testSlug}-admin`)
  })
})
