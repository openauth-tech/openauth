import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuth } from '@/context/ProviderAuth'
import { useAppState } from '@/store/app'

export default function () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { authClient } = useAuth()
  const { saveToken } = useAppState()

  const onLogIn = async () => {
    setLoading(true)
    try {
      const res = await authClient?.admin.login({
        username,
        password,
      })
      saveToken(username, res!.token)

      toast.success('Log in successfully')
      nav('/')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto my-20">
      <CardHeader>
        <CardTitle className="text-2xl">Log In</CardTitle>
        <CardDescription>Log into your admin account.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!username || !password || loading} onClick={onLogIn}>
          Log In
        </Button>
      </CardFooter>
    </Card>
  )
}
