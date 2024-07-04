import { OpenAuthContext } from '@/openauth/context/OpenAuthContext'

export function useOpenAuth() {
  const context = useContext(OpenAuthContext)

  return {
    ...context,
  }
}
