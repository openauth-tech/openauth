export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const JWT_SECRET = process.env.JWT_SECRET || ''
export const REDIS_HOST = IS_PRODUCTION ? 'openauth-redis' : '127.0.0.1'
export const REDIS_PORT = 6379
export const WALLET_SEED_SALT = process.env.WALLET_SEED_SALT ?? ''

// validate configs
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}
console.info(`IS_PRODUCTION: ${IS_PRODUCTION}`)

export function getMessageText(name: string) {
  return `By signing, you are proving you own this wallet and logging in ${name}.`
}
