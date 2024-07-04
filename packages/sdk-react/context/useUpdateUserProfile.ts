import { OpenAuthContext } from './OpenAuthContext'
import { usePrevious } from '@did-network/dapp-sdk'

export function useUpdateUserProfile() {
  const { config, setProfile, token, client } = useContext(OpenAuthContext)
  const preToken = usePrevious(token)

  useEffect(() => {
    if (preToken !== token) {
      if (!token) {
        setProfile(undefined)
        return
      }
      ;(async () => {
        const data = await client.api.getUserProfile()
        setProfile(data)
      })()
    }
  }, [config, preToken, token, setProfile, client.api])
}
