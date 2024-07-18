import { useContext } from 'react'
import { OpenAuthContext } from '../context/OpenAuthContext'

export function useOpenAuth() {
  const context = useContext(OpenAuthContext)

  return {
    config: context.config,
    globalConfig: context.globalConfig,
    token: context.token,
    setToken: context.setToken,
    client: context.client,
    profile: context.profile,
  }
}
