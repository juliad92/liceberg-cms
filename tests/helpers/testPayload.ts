import { MongoMemoryServer } from 'mongodb-memory-server'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'

let payloadInstance: Payload | null = null
let mongoMemoryServer: MongoMemoryServer | undefined

async function resolveDatabaseUrl(): Promise<string> {
  if (process.env.VITEST_IN_MEMORY_MONGO === '1') {
    mongoMemoryServer = await MongoMemoryServer.create()
    return mongoMemoryServer.getUri()
  }

  const databaseUrl = process.env.DATABASE_URL?.trim()
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.test.example to .env.test or run integration tests in CI.'
    )
  }

  return databaseUrl
}

export async function getTestPayload(): Promise<Payload> {
  if (!payloadInstance) {
    process.env.DATABASE_URL = await resolveDatabaseUrl()
    payloadInstance = await getPayload({ config: await config })
  }
  return payloadInstance
}

export async function resetTestPayload(): Promise<void> {
  if (payloadInstance) {
    await payloadInstance.db.destroy?.()
    payloadInstance = null
  }

  if (mongoMemoryServer) {
    await mongoMemoryServer.stop()
    mongoMemoryServer = undefined
  }
}
