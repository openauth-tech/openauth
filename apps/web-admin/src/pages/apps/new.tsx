import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { useHttpClient } from '@/hooks/useHttpClient'

export default function () {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const http = useHttpClient()

  const onSubmit = async () => {
    setLoading(true)
    try {
      await http.post('/admin/apps', { name, description: '', logoUrl: '' })
      toast({ title: 'App created successfully' })
      nav('/apps')
    } catch (error: any) {
      console.error(error)
      toast({ title: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto my-20">
      <CardHeader>
        <CardTitle className="text-2xl">Create App</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">App Name</Label>
          <Input id="username" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!name || loading} onClick={onSubmit}>
          Create
        </Button>
      </CardFooter>
    </Card>
  )
}
