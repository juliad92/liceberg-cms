import configPromise from '@payload-config'
import { getPayload } from 'payload'

const DEFAULT_GOAL = 1000
const DEFAULT_DEADLINE = '2026-12-30T22:59:59.000Z'

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  try {
    const settings = await payload.findGlobal({
      slug: 'subscriber-gauge-settings',
      depth: 0,
      overrideAccess: true,
    })

    return Response.json({
      enabled: settings.enabled !== false,
      goal:
        Number.isInteger(settings.goal) && settings.goal > 0
          ? settings.goal
          : DEFAULT_GOAL,
      deadline: settings.deadline || DEFAULT_DEADLINE,
    })
  } catch (error) {
    console.error('Unable to read subscriber gauge settings:', error)
    return Response.json({
      enabled: true,
      goal: DEFAULT_GOAL,
      deadline: DEFAULT_DEADLINE,
    })
  }
}
