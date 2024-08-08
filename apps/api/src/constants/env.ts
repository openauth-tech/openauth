import * as crypto from 'node:crypto'

import dotenv from 'dotenv'

dotenv.config()

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const REDIS_HOST = IS_PRODUCTION ? 'openauth-redis' : '127.0.0.1'
export const REDIS_PORT = 6379
export const WALLET_SEED_SALT = process.env.WALLET_SEED_SALT ?? ''

console.info(`IS_PRODUCTION: ${IS_PRODUCTION}`)

export const JWT_PRIVATE_KEY = `
-----BEGIN PRIVATE KEY-----
${process.env.JWT_PRIVATE_KEY}
-----END PRIVATE KEY-----
`.trim()

const pubKeyObject = crypto.createPublicKey({ key: JWT_PRIVATE_KEY, format: 'pem' })
const publicKey = pubKeyObject.export({ format: 'pem', type: 'spki' })
export const JWT_PUBLIC_KEY = publicKey.toString()
