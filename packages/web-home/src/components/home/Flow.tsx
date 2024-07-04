import {
  IconBrandGoogle,
  IconBrandTwitter,
  IconBrandX,
  IconCurrencyBitcoin,
  IconCurrencyEthereum,
  IconCurrencySolana,
  IconUser,
} from '@tabler/icons-react'
import React, { forwardRef, useRef } from 'react'

import ImgKaiwa from '@/assets/images/common/logo.png'
import ImgCommune from '@/assets/images/logo/commune.webp'
import ImgEden from '@/assets/images/logo/eden.jpg'
import ImgMosaic from '@/assets/images/logo/mosaic.jpg'
import ImgScope from '@/assets/images/logo/scope.jpg'
import { AnimatedBeam } from '@/components/magicui/animated-beam'
import { cn } from '@/utils/css'

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div ref={ref} className={cn('z-10 flex-center rounded-xl border-1 bg-white shadow-sm', className)}>
        {children}
      </div>
    )
  }
)

export function Flow({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className={cn('relative flex w-full max-w-[500px] items-center justify-center px-2', className)}
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref} className="h-12 w-12">
            <IconUser size={24} />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="h-16 w-16">
            <img src={ImgKaiwa} alt="" className="h-8 w-8" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-4">
          <Circle ref={div1Ref} className="px-4 py-2 flex items-center justify-start gap-2">
            <IconCurrencyEthereum />
            Ethereum
          </Circle>
          <Circle ref={div2Ref} className="px-4 py-2 flex items-center justify-start gap-2">
            <IconCurrencySolana />
            Solana
          </Circle>
          <Circle ref={div3Ref} className="px-4 py-2 flex items-center justify-start gap-2">
            <IconBrandX />
            Twitter
          </Circle>
          <Circle ref={div4Ref} className="px-4 py-2 flex items-center justify-start gap-2">
            <IconBrandGoogle />
            Google
          </Circle>
        </div>
      </div>

      {/* AnimatedBeams */}
      <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div4Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div7Ref} duration={3} />
    </div>
  )
}
