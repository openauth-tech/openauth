import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function UserDetailDialog({ user, onClose }: { user: any; onClose: any }) {
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
