import { ChevronLeftIcon, ChevronRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import * as React from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utils/css'

import usePagination, { type PaginationProps } from './use-pagination'

const PaginationRoot = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav role="navigation" aria-label="pagination" className={cn('flex', className)} {...props} />
)
PaginationRoot.displayName = 'PaginationRoot'

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  ),
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & ButtonProps

const PaginationLink = ({ className, isActive, size = 'icon', type = 'button', ...props }: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? 'page' : undefined}
    variant={isActive ? 'default' : 'secondary'}
    size={size}
    className={cn(className, isActive ? 'text-white' : '', '!disabled:cursor-not-allowed')}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" size="default" className={cn('px-2.5', className)} {...props}>
    <ChevronLeftIcon className="h-4 w-4" />
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" size="default" className={cn('px-2.5', className)} {...props}>
    <ChevronRightIcon className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span aria-hidden className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
    <DotsHorizontalIcon className="h-4 w-4 text-white" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

const Pagination: React.FC<PaginationProps> = (props) => {
  const { items } = usePagination(props)
  return (
    <PaginationRoot className={props.className}>
      <PaginationContent>
        {items.map(({ page, type, selected, ...item }, index) => {
          let children = null

          if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            children = <PaginationEllipsis />
          } else if (type === 'page') {
            children = (
              <PaginationLink isActive={selected} {...item}>
                {page}
              </PaginationLink>
            )
          } else if (type === 'previous') {
            children = <PaginationPrevious {...item} />
          } else if (type === 'next') {
            children = <PaginationNext {...item} />
          } else {
            children = (
              <button type="button" {...item}>
                {type}
              </button>
            )
          }

          return <PaginationItem key={index}>{children}</PaginationItem>
        })}
      </PaginationContent>
    </PaginationRoot>
  )
}
Pagination.displayName = 'Pagination'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationRoot,
}
