import { OpenAuthContext } from '../context/OpenAuthContext'

export function useOpenAuth() {
  const context = useContext(OpenAuthContext)

  return {
    config: context.config,
    globalConfig: context.globalConfig,
    token: context.token,
    profile: context.profile,
  }
}
