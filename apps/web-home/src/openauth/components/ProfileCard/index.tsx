import { useOpenAuth } from '@open-auth/sdk-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProfileCard() {
  const { globalConfig, profile, logOut } = useOpenAuth()

  if (!profile) {
    return null
  }

  return (
    <Card className="py-10 px-16 shadow">
      <CardHeader>
        <CardTitle className="text-2xl">
          <span className="font-400">Welcome to</span> <span className="font-bold">{globalConfig?.brand}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="mx-auto flex flex-col items-center justify-center gap-4">
        <div className="flex-center gap-2">
          <span>User ID:</span>
          <span>{profile.id.toString()}</span>
        </div>
        <div>
          <Button onClick={logOut}>Log Out</Button>
        </div>
      </CardContent>
    </Card>
  )
}
