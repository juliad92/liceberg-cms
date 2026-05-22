import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'

let payloadInstance: Payload | null = null

export async function getTestPayload(): Promise<Payload> {
  if (!payloadInstance) {
    payloadInstance = await getPayload({ config: await config })
  }
  return payloadInstance
}

export async function resetTestPayload(): Promise<void> {
  payloadInstance = null
}
