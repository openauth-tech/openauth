import { OpenAuthContext } from '@/openauth/context/OpenAuthContext'
import { buildHttpClient } from '@/openauth/utils/http'

export function useUpdateGlobalConfig() {
  const { config, setGlobalConfig } = useContext(OpenAuthContext)
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
