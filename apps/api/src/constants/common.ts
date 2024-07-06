export const BRAND_NAME = process.env.BRAND_NAME || 'OpenAuth'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const JWT_SECRET = process.env.JWT_SECRET || ''

export const MESSAGE_TEXT = `By signing, you are proving you own this wallet and logging in ${BRAND_NAME}.`

// validate configs
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}
console.info(`IS_PRODUCTION: ${IS_PRODUCTION}`)
