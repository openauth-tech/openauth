import { usePrevious } from '@did-network/dapp-sdk'

import { OpenAuthContext } from '@/openauth/context/OpenAuthContext'
import { buildHttpClient } from '@/openauth/utils/http'

export function useUpdateUserProfile() {
  const { config, setProfile, token } = useContext(OpenAuthContext)
  const preToken = usePrevious(token)

  useEffect(() => {
    if (preToken !== token) {
      if (!token) {
        setProfile(undefined)
        return
      }
      ;(async () => {
        const http = buildHttpClient(config, token)
        const { data } = await http.get('/user/profile')
        setProfile(data)
      })()
    }
  }, [config, preToken, token, setProfile])
}
