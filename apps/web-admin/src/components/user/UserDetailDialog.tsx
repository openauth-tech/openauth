import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/context/ProviderAuth'

export function UserDetailDialog({ user, onClose }: { user: any; onClose: any }) {
  const { id } = useParams()
  const { authClient } = useAuth()

  const { data: referral } = useQuery({
    queryKey: ['get-user-referral', id, user?.id],
    queryFn: async () => {
      return await authClient?.admin.getUserReferral(id!, user?.id)
    },
    enabled: !!user,
  })

  if (!user) {
    return null
  }

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ul className="grid gap-3">
            {['id', 'email', 'google', 'twitter', 'apple', 'ethAddress', 'solAddress'].map((key) => (
              <li key={'user-' + key} className="flex items-center">
                <div className="w-1/3 text-muted-foreground capitalize">{key}</div>
                <div className="flex-1">{user[key]}</div>
              </li>
            ))}
            {referral && (
              <>
                <li className="flex items-center">
                  <div className="w-1/3 text-muted-foreground capitalize">Referral</div>
                  <div className="flex-1">
                    refee1Count: {referral.refee1Count} <br /> refee2Count: {referral.refee2Count}
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
