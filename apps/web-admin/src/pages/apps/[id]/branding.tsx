import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { AppContainer } from '@/components/app/AppContainer'
import { AppHeader } from '@/components/app/AppHeader'
import { useAuth } from '@/context/ProviderAuth'

export default function () {
  const { authClient } = useAuth()
  const { id } = useParams()
  const { data } = useQuery({
    queryKey: ['app', 'branding', 'logoUrl'],
    queryFn: async () => {
      return await authClient?.admin.getApp(id!)
    },
  })

  useEffect(() => {
    if (data) {
      setLogoUrl(data.logoUrl!)
      setName(data.name)
      setDescription(data.description!)
    }
  }, [data])

  const [logoUrl, setLogoUrl] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const changeMu = useMutation({
    mutationFn: async ({ logoUrl, name, description }: { logoUrl: string; name: string; description: string }) => {
      await authClient?.admin.updateApp(id!, { logoUrl, name, description })
    },
  })
  const changeHandler = useCallback(async () => {
    await changeMu.mutateAsync({ description, logoUrl, name })
  }, [changeMu, description, logoUrl, name])

  return (
    <AppContainer>
      <AppHeader
        title="Branding"
        subtitle="Set your preferences for your usersʼ experience."
        button={
          <Button loading={changeMu.isPending} onClick={changeHandler}>
            Save Changes
          </Button>
        }
      />

      <div className="mt-5 space-y-3">
        <div className="space-y-2">
          <div>Name</div>
          <div className="text-sm text-muted-foreground">
            This name is visible to users on modals, emails, and SMS messages.
          </div>
          <Input value={name ?? ''} placeholder="App name" onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <div>Description</div>
          <div className="text-sm text-muted-foreground">This description is description.</div>
          <Input value={description ?? ''} placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="space-y-2">
          <div>Your Logo</div>
          <div className="text-sm text-muted-foreground">
            Add a URL of a PNG to display to your users on login. The aspect ratio is 2:1 and recommended size is
            180x90px.
          </div>
          <Input value={logoUrl ?? ''} placeholder="Add logo URL" onChange={(e) => setLogoUrl(e.target.value)} />
        </div>
      </div>
    </AppContainer>
  )
}
