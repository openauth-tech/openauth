import { User } from '@open-auth/sdk-core'
import { IconBrandGoogle, IconBrandTelegram, IconCurrencyEthereum, IconCurrencySolana } from '@tabler/icons-react'

export function UserAccountIcons({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-1">
      {user.ethAddress && <IconCurrencyEthereum />}
      {user.google && <IconBrandGoogle />}
      {user.telegram && <IconBrandTelegram />}
      {user.solAddress && <IconCurrencySolana />}
    </div>
  )
}
