import { buildHttpClient } from '@/openauth/utils/http'

import { OpenAuthContext } from '../context/OpenAuthContext'

export function useHttpClient() {
  const { config, token } = useContext(OpenAuthContext)

  return useMemo(() => {
    return buildHttpClient(config, token)
  }, [config, token])
}
