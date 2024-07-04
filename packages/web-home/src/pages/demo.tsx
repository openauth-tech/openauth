import { LoginCard } from '@/openauth/components/LoginCard'
import { ProfileCard } from '@/openauth/components/ProfileCard'
import { useOpenAuth } from '@/openauth/hooks/useOpenAuth'

export default function () {
  const { profile } = useOpenAuth()
  return (
    <div className="py-20">
      <div className="flex-center">{profile ? <ProfileCard /> : <LoginCard />}</div>
    </div>
  )
}
