import { useParams } from 'react-router'

import { AppContainer } from '@/components/app/AppContainer'
import { AppHeader } from '@/components/app/AppHeader'

export default function () {
  const { id } = useParams()

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
            The app ID is used to associate your Privy client with this app.
          </div>
          <div className="flex-center gap-2">
            <Input value={id} readOnly className="text-muted-foreground" />
            <Button variant="outline" className="px-3">
              <span className="i-lucide-copy"></span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div>App secret</div>
          <div className="text-sm text-muted-foreground">
            Privy does not store your app secret. Please be sure to store it somewhere safe.
          </div>
          <Input value="124" type="password" readOnly className="text-muted-foreground" />
        </div>
      </div>
    </AppContainer>
  )
}
