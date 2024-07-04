import { usePrevious } from '@did-network/dapp-sdk'
import { Dispatch, SetStateAction } from 'react'

import { IOpenAuthConfig, IOpenAuthUserProfile } from '@/openauth/context/types'
import { buildHttpClient } from '@/openauth/utils/http'

export function useUpdateUserProfile(
  config: IOpenAuthConfig,
  token: string | undefined,
  setUserProfile: Dispatch<SetStateAction<IOpenAuthUserProfile | undefined>>
) {
  const preToken = usePrevious(token)

  useEffect(() => {
    if (preToken !== token) {
      if (!token) {
        setUserProfile(undefined)
        return
      }
      ;(async () => {
        const http = buildHttpClient(config, token)
        const { data } = await http.get('/user/profile')
        setUserProfile(data)
      })()
    }
  }, [config, preToken, token, setUserProfile])
}
