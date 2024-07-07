import { AppContainer } from '@/components/app/AppContainer'
import { AppHeader } from '@/components/app/AppHeader'
import { Checker } from '@/components/common/Checker'

export default function () {
  return (
    <AppContainer>
      <AppHeader
        title="Login methods"
        subtitle="Select which login and linking methods are enabled for your app. To customize specific methods and how they appear, use client configuration."
        button={<Button>Save Changes</Button>}
      />
      <div className="mt-5 space-y-3">
        <div className="space-y-2">
          <div className="capitalize">wallets</div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Checker id="eth" label="ethereum" />
            <Checker id="sol" label="solana" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="capitalize">Social</div>
          <div className="mt-5 space-y-3">
            <Checker id="google" label="google" />
          </div>
        </div>
      </div>
    </AppContainer>
  )
}
