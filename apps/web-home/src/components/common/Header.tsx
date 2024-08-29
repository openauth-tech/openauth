import { IconBrandGithub } from '@tabler/icons-react'
import { NavLink } from 'react-router-dom'

import ImgLogo from '@/assets/images/common/logo.png'
import { NavButton } from '@/components/common/NavButton'

export function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <NavLink className="flex items-center" to="/">
            <img src={ImgLogo} alt="" className="h-8" />
          </NavLink>
          <NavButton className="flex-center hover:text-primary" to="/demo">
            Demo
          </NavButton>
        </div>
        <div className="flex-center">
          <NavButton className="flex-center hover:text-primary" to="https://github.com/openauth-tech">
            <IconBrandGithub size={20} />
            GitHub
          </NavButton>
        </div>
      </div>
    </header>
  )
}
