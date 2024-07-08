import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { useCopyToClipboard } from 'usehooks-ts'

import { AppContainer } from '@/components/app/AppContainer'
import { AppHeader } from '@/components/app/AppHeader'
import { useAuth } from '@/context/ProviderAuth'

export default function () {
  const { id } = useParams()
  const { authClient, isAuthorized } = useAuth()
  const [copiedText, copy] = useCopyToClipboard()

  const { data: secretData } = useQuery({
    queryKey: ['get-api-key', id],
    queryFn: async () => {
      return await authClient?.admin.getSecret(id!)
    },
    enabled: isAuthorized,
  })

  const [showKey, setShowKey] = useState(false)

  return (
    <AppContainer>
      <AppHeader
        title="Wolcome"
        subtitle="Here are a few things we recommend doing to to build a delightful, secure experience for your users."
      />
      <div className="mt-5 space-y-3">
        <div className="space-y-2">
          <div>App ID</div>
          <div className="text-sm text-muted-foreground">
            The app ID is used to associate your OpenAuth client with this app.
          </div>
          <div className="flex-center gap-2">
            <Input value={id} readOnly className="text-muted-foreground" />
            <Button
              variant="outline"
              className="px-3"
              onClick={() => {
                copy(id!)
                toast.success('Copied to clipboard')
              }}
            >
              <span className="i-lucide-copy"></span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div>App secret</div>
          <div className="text-sm text-muted-foreground">
            OpenAuth does not store your app secret. Please be sure to store it somewhere safe.
          </div>
          <div className="flex-center gap-2">
            <Input
              value={secretData?.secret}
              type={showKey ? 'text' : 'password'}
              readOnly
              className="text-muted-foreground"
            />
            <Button
              variant="outline"
              className="px-3"
              onClick={() => {
                setShowKey(!showKey)
              }}
            >
              <span className="i-lucide-eye-off"></span>
            </Button>
          </div>
        </div>
      </div>
    </AppContainer>
  )
}
