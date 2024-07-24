export async function sleep(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

export function generateReferCode(): string {
  return generateRandomString(8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
}

export function generateRandomString(
  length: number,
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
) {
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    result += chars[randomIndex]
  }
  return result
}
