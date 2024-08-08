import type { User } from '@open-auth/sdk-core'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAdmin } from '@/context/admin'
import { cn } from '@/utils/css'

const userFields: Array<keyof User> = [
  'id',
  'email',
  'google',
  'discord',
  'telegram',
  'twitter',
  'apple',
  'username',
  'ethAddress',
  'solAddress',
]

export function UserDetailDialog({ user, onClose }: { user: User, onClose: any }) {
  const { id = '' } = useParams()
  const { client } = useAdmin()

  const { data: referral } = useQuery({
    queryKey: ['getUserReferral', id, user?.id],
    queryFn: async () => client.app.getUserReferral(user?.id),
    enabled: !!user,
  })

  if (!user) {
    return null
  }

  return (
    <Dialog open={!!user} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {user.avatar ? <img src={user.avatar} className="h-20" alt="" /> : null}
          <ul className="grid gap-3">
            {userFields.map(key => (
              <li key={`user-${key}`} className={cn('flex items-center', user[key] ? '' : 'hidden')}>
                <div className="w-1/3 text-muted-foreground capitalize">{key}</div>
                <div className="flex-1">{user[key]}</div>
              </li>
            ))}
            {referral && (
              <>
                <li className="flex">
                  <div className="w-1/3 text-muted-foreground capitalize">Referral</div>
                  <div className="flex-1">
                    refee1Count:
                    {' '}
                    {referral.referrals1.length}
                    {' '}
                    <br />
                    {' '}
                    refee2Count:
                    {' '}
                    {referral.referrals2.length}
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onClose}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
