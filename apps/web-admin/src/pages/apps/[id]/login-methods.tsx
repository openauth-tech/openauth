import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { AppContainer } from '@/components/app/AppContainer'
import { AppHeader } from '@/components/app/AppHeader'
import { useAdmin } from '@/context/admin'

const FormSchema = z.object({
  solana: z.boolean(),
  ethereum: z.boolean(),
  google: z.boolean(),
  discord: z.boolean(),
  telegram: z.boolean(),
  tiktok: z.boolean(),
  googleClientId: z.string().optional(),
  telegramBotToken: z.string().optional(),
  tiktokClientKey: z.string().optional(),
  tiktokClientSecret: z.string().optional(),
  discordApplicationId: z.string().optional(),
})

type FormDataType = z.infer<typeof FormSchema>

export default function () {
  const { id: appId = '' } = useParams()
  const { client } = useAdmin()
  const { data } = useQuery({
    queryKey: ['getApp', appId],
    queryFn: async () => client.admin.getApp(appId),
    enabled: client.admin.isAuthorized(),
  })

  const form = useForm<FormDataType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  useEffect(() => {
    if (data) {
      form.setValue('solana', data.solEnabled)
      form.setValue('ethereum', data.ethEnabled)
      form.setValue('google', data.googleEnabled)
      form.setValue('discord', data.discordEnabled)
      form.setValue('tiktok', data.tiktokEnabled)
      form.setValue('telegram', data.telegramEnabled)
      form.setValue('googleClientId', data.googleClientId ?? undefined)
      form.setValue('telegramBotToken', data.telegramBotToken ?? undefined)
      form.setValue('tiktokClientKey', data.tiktokClientKey ?? undefined)
      form.setValue('tiktokClientSecret', data.tiktokClientSecret ?? undefined)
      form.setValue('discordApplicationId', data.discordApplicationId ?? undefined)
    }
  }, [data, form])

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    client.admin.updateApp(appId, {
      solEnabled: data.solana,
      ethEnabled: data.ethereum,
      googleEnabled: data.google,
      discordEnabled: data.discord,
      telegramEnabled: data.telegram,
      tiktokEnabled: data.tiktok,
      googleClientId: data.googleClientId,
      telegramBotToken: data.telegramBotToken,
      tiktokClientKey: data.tiktokClientKey,
      tiktokClientSecret: data.tiktokClientSecret,
      discordApplicationId: data.discordApplicationId,
    })
    toast.success('Settings saved')
  }

  return (
    <AppContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <AppHeader
            title="Login methods"
            subtitle="Select which login and linking methods are enabled for your app. To customize specific methods and how they appear, use client configuration."
            button={<Button onClick={() => form.handleSubmit(onSubmit)}>Save Changes</Button>}
          />
          <div className="mt-5 space-y-3">
            <Checker form={form} id="ethereum" label="Ethereum" />
            <Checker form={form} id="solana" label="Solana" />
            <Checker form={form} id="google" label="Google" />
            <FormField
              control={form.control}
              name="googleClientId"
              render={({ field }) => (
                <FormItem className="pl-8">
                  <FormLabel>Client ID</FormLabel>
                  <FormControl>
                    <Input value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Checker form={form} id="discord" label="Discord" />
            <FormField
              control={form.control}
              name="discordApplicationId"
              render={({ field }) => (
                <FormItem className="pl-8">
                  <FormLabel>Application ID</FormLabel>
                  <FormControl>
                    <Input value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Checker form={form} id="telegram" label="Telegram" />
            <FormField
              control={form.control}
              name="telegramBotToken"
              render={({ field }) => (
                <FormItem className="pl-8">
                  <FormLabel>Bot Token</FormLabel>
                  <FormControl>
                    <Input value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Checker form={form} id="tiktok" label="TikTok" />
            <FormField
              control={form.control}
              name="tiktokClientKey"
              render={({ field }) => (
                <FormItem className="pl-8">
                  <FormLabel>Client Key</FormLabel>
                  <FormControl>
                    <Input value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tiktokClientSecret"
              render={({ field }) => (
                <FormItem className="pl-8">
                  <FormLabel>Client Secret</FormLabel>
                  <FormControl>
                    <Input value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </AppContainer>
  )
}

function Checker({ form, id, label }: { form: UseFormReturn<FormDataType>, id: string, label: string }) {
  return (
    <FormField
      control={form.control}
      name={id as any}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start border rounded-md p-4 space-x-3 space-y-0">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel>{label}</FormLabel>
        </FormItem>
      )}
    />
  )
}
