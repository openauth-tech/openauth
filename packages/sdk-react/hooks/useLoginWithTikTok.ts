import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { OAuth2Config } from '../utils/constants.ts'
import { useOpenAuth } from './useOpenAuth.ts'

export function useLogInWithTikTok({
  callbackUrl,
}: { callbackUrl: string }) {
  const { config, logIn, client } = useOpenAuth()
  const [loading, setLoading] = useState(false)

  const authUri = useMemo(() => `${config.endpoint}${OAuth2Config.tiktok.authPath}`, [config.endpoint])
  const redirectUri = useMemo(() => `${config.endpoint}${OAuth2Config.tiktok.redirectPath}`, [config.endpoint])
  const [searchParams] = useSearchParams()
  const accessToken = useMemo(() => searchParams.get('access_token'), [searchParams])
  const openId = useMemo(() => searchParams.get('open_id'), [searchParams])

  const handleLogin = useCallback(async () => {
    if (!accessToken || !openId) {
      return
    }
    setLoading(true)
    try {
      const data = await client.user.logInWithTikTok({ appId: config.appId, tiktok: openId, token: accessToken })
      logIn(data.token)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }, [client.user, config.appId, logIn, accessToken, openId])

  useEffect(() => {
    handleLogin()
  }, [handleLogin])

  const logInWithTikTok = useCallback(
    () => {
      const params = new URLSearchParams()
      params.append('appId', config.appId)
      params.append('redirectUri', redirectUri)
      params.append('callback', callbackUrl)
      window.location.href = `${authUri}?${params.toString()}`
    },
    [config.appId, authUri, redirectUri, callbackUrl],
  )

  return {
    logInWithTikTok,
    loading,
  }
}
