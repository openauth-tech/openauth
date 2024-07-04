import { Dispatch, SetStateAction } from 'react'

import { IOpenAuthConfig, IOpenAuthGlobalConfig } from '@/openauth/context/types'
import { buildHttpClient } from '@/openauth/utils/http'

export function useUpdateGlobalConfig(
  config: IOpenAuthConfig,
  setGlobalConfig: Dispatch<SetStateAction<IOpenAuthGlobalConfig | undefined>>
) {
  useEffect(() => {
    if (config.endpoint) {
      ;(async () => {
        const http = buildHttpClient(config)
        const { data } = await http.get('/config/global')
        setGlobalConfig(data)
      })()
    }
  }, [config, setGlobalConfig])
}
