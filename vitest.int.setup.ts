import { config } from 'dotenv'
import { existsSync } from 'fs'
import net from 'net'
import path from 'path'

const root = process.cwd()
const testEnvPath = path.join(root, '.env.test')
const testEnvExamplePath = path.join(root, '.env.test.example')

config({
  path: existsSync(testEnvPath) ? testEnvPath : testEnvExamplePath,
})

// Avoid Nodemailer verifying production SMTP during Payload init in tests.
process.env.SMTP_HOST = process.env.SMTP_HOST ?? ''
process.env.SMTP_USER = process.env.SMTP_USER ?? ''
process.env.SMTP_PASS = process.env.SMTP_PASS ?? ''

const isLocalMongoUrl = (url: string | undefined): boolean =>
  Boolean(url?.includes('127.0.0.1') || url?.includes('localhost'))

const isMongoPortReachable = (): Promise<boolean> =>
  new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port: 27017 })
    const finish = (reachable: boolean) => {
      socket.removeAllListeners()
      socket.destroy()
      resolve(reachable)
    }

    socket.once('connect', () => finish(true))
    socket.once('error', () => finish(false))
    setTimeout(() => finish(false), 1_000)
  })

const databaseUrl = process.env.DATABASE_URL

if (
  process.env.CI !== 'true' &&
  isLocalMongoUrl(databaseUrl) &&
  !(await isMongoPortReachable())
) {
  process.env.VITEST_IN_MEMORY_MONGO = '1'
}
