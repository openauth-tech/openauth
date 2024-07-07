import { AppContainer } from '@/components/app/AppContainer'
import { AppHeader } from '@/components/app/AppHeader'

export default function () {
  const [logoUrl, setLogoUrl] = useState('')

  return (
    <AppContainer>
      <AppHeader
        title="Branding"
        subtitle="Set your preferences for your usersʼ experience."
        button={<Button>Save Changes</Button>}
      />

      <div className="mt-5 space-y-3">
        <div className="space-y-2">
          <div>Name</div>
          <div className="text-sm text-muted-foreground">
            This name is visible to users on modals, emails, and SMS messages.
          </div>
          <Input value={logoUrl} placeholder="Open auth" />
        </div>

        <div className="space-y-2">
          <div>Color</div>
          <div className="text-sm text-muted-foreground">This color is used on links and primary buttons.</div>
          <Input value={logoUrl} placeholder="Input color (hex)" />
        </div>
        <div className="space-y-2">
          <div>Your Logo</div>
          <div className="text-sm text-muted-foreground">
            Add a URL of a PNG to display to your users on login. The aspect ratio is 2:1 and recommended size is
            180x90px.
          </div>
          <Input value={logoUrl} placeholder="Add logo URL" />
        </div>
      </div>
    </AppContainer>
  )
}
