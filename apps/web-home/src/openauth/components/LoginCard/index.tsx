import { useLogInWithEthereum, useLogInWithGoogle, useLogInWithSolana, useOpenAuth } from '@open-auth/sdk-react'
import {
  IconBrandGoogle,
  IconBrandTelegram,
  IconCurrencyEthereum,
  IconCurrencySolana,
  IconLoader2,
} from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export function LoginCard() {
  const { toast } = useToast()

  const { globalConfig } = useOpenAuth()
  const { logInWithEthereum, loading: loadingETH } = useLogInWithEthereum()
  const { logInWithSolana, loading: loadingSOL } = useLogInWithSolana()
  const { logInWithGoogle, loading: loadingGG } = useLogInWithGoogle()

  const onConnectETH = useCallback(async () => {
    try {
      await logInWithEthereum()
    } catch (error: any) {
      toast({ title: error.message })
    }
  }, [logInWithEthereum, toast])
  const onConnectSOL = useCallback(async () => {
    try {
      await logInWithSolana()
    } catch (error: any) {
      toast({ title: error.message })
    }
  }, [logInWithSolana, toast])
  const onConnectGG = useCallback(async () => {
    try {
      await logInWithGoogle()
    } catch (error: any) {
      toast({ title: error.message })
    }
  }, [logInWithGoogle, toast])

  return (
    <Card className="py-10 px-16 shadow">
      <CardHeader>
        <CardTitle className="text-2xl">
          <span className="font-400">Welcome to</span> <span className="font-bold">{globalConfig?.brand}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="mx-auto flex flex-col items-center justify-center gap-4">
        <Button className="w-full px-6 py-6 text-base" onClick={onConnectSOL} disabled={loadingSOL}>
          <div className="flex gap-2 justify-start items-center w-50">
            {loadingSOL ? <IconLoader2 size={20} className="animate-spin" /> : <IconCurrencySolana size={20} />}
            <span>Sign in with Solana</span>
          </div>
        </Button>
        <Button className="w-full px-6 py-6 text-base" onClick={onConnectETH} disabled={loadingETH}>
          <div className="flex gap-2 justify-start items-center w-50">
            {loadingETH ? <IconLoader2 size={20} className="animate-spin" /> : <IconCurrencyEthereum size={20} />}
            <span>Sign in with Ethereum</span>
          </div>
        </Button>
        <Button className="w-full px-6 py-6 text-base" onClick={onConnectGG} disabled={loadingGG}>
          <div className="flex gap-2 justify-start items-center w-50">
            {loadingGG ? <IconLoader2 size={20} className="animate-spin" /> : <IconBrandGoogle size={20} />}
            <span>Sign in with Google</span>
          </div>
        </Button>
        <TelegramDialog />
      </CardContent>
    </Card>
  )
}

export function TelegramDialog() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState('')
  const { config, globalConfig, client, logIn } = useOpenAuth()

  const onLogInTelegram = useCallback(async () => {
    setLoading(true)
    try {
      await client.user.logInWithTelegram({ appId: config.appId, data: '' })
    } catch (error: any) {
      toast({ title: error.message })
    }
    setLoading(false)
  }, [client.user, config.appId, toast])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full px-6 py-6 text-base">
          <div className="flex gap-2 justify-start items-center w-50">
            {loading ? <IconLoader2 size={20} className="animate-spin" /> : <IconBrandTelegram size={20} />}
            <span>Sign in with Telegram</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Input Telegram Mini App initData</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input value={data} onChange={(e) => setData(e.target.value)} className="w-full" />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onLogInTelegram} disabled={loading}>
            Log In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
