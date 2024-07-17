export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const JWT_SECRET = process.env.JWT_SECRET || ''

// validate configs
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}
console.info(`IS_PRODUCTION: ${IS_PRODUCTION}`)

export function getMessageText(name: string) {
  return `By signing, you are proving you own this wallet and logging in ${name}.`
}
