import { useGoogleLogin } from '@react-oauth/google'
import { useCallback, useContext, useState } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useLogInWithGoogle() {
  const { setToken, config, client } = useContext(OpenAuthContext)
  const [loading, setLoading] = useState(false)

  const googleLogin = useGoogleLogin({
    onError: (error) => {
      console.error(error)
      setLoading(false)
    },
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token
      const userinfo = await (
        await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).json()
      console.debug(userinfo)
      const email = userinfo.email
      const data = await client.app.loginGoogle({ appId: config.appId, email, token })
      setLoading(false)
      setToken(data.token)
    },
  })

  const connect = useCallback(async () => {
    setLoading(true)
    googleLogin()
  }, [googleLogin])

  return {
    connect,
    loading,
  }
}
