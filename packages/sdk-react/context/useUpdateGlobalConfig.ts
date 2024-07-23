import { useContext, useEffect } from 'react'
import { OpenAuthContext } from './OpenAuthContext'

export function useUpdateGlobalConfig() {
  const { config, setGlobalConfig, client } = useContext(OpenAuthContext)
  useEffect(() => {
    if (config.endpoint) {
      ;(async () => {
        const data = await client.app.getGlobalConfig(config.appId)
        setGlobalConfig(data)
      })()
    }
  }, [client, config, setGlobalConfig])
}
