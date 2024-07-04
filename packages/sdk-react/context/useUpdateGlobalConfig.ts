import { OpenAuthContext } from './OpenAuthContext'

export function useUpdateGlobalConfig() {
  const { config, setGlobalConfig, client } = useContext(OpenAuthContext)
  useEffect(() => {
    if (config.endpoint) {
      ;(async () => {
        const data = await client.api.getGlobalConfig()
        setGlobalConfig(data)
      })()
    }
  }, [client, config, setGlobalConfig])
}
