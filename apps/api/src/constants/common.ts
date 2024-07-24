export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const JWT_SECRET = process.env.JWT_SECRET || ''
export const JWT_LIFETIME = parseInt(process.env.JWT_LIFETIME || '86400') // 24h
export const REDIS_HOST = IS_PRODUCTION ? 'openauth-redis' : '127.0.0.1'
export const REDIS_PORT = 6379

// validate configs
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}
console.info(`IS_PRODUCTION: ${IS_PRODUCTION}`)

export function getMessageText(name: string) {
  return `By signing, you are proving you own this wallet and logging in ${name}.`
}
