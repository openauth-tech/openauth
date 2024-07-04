import { useGoogleLogin } from '@react-oauth/google'
import { useCallback } from 'react'

import { OpenAuthContext } from '@/openauth/context/OpenAuthContext'
import { useHttpClient } from '@/openauth/hooks/useHttpClient'

export function useLogInWithGoogle() {
  const { setToken, config } = useContext(OpenAuthContext)
  const [loading, setLoading] = useState(false)
  const http = useHttpClient()

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
      console.log(userinfo)
      const email = userinfo.email
      const { data } = await http.post('/auth/login', { appId: config.appId })
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
