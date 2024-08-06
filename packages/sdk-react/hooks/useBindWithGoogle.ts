import { useGoogleLogin } from '@react-oauth/google'
import { useCallback, useContext, useState } from 'react'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useBindWithGoogle() {
  const { client } = useContext(OpenAuthContext)
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
      await client.user.bindWithGoogle({ google: userinfo.email, token })
      setLoading(false)
    },
  })

  const bindWithGoogle = useCallback(async () => {
    setLoading(true)
    googleLogin()
  }, [googleLogin])

  return {
    bindWithGoogle,
    loading,
  }
}
