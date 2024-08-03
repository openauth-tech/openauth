import { MagnifyingGlassIcon, ReloadIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'

import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { Pagination } from './pagination'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  total: number
  pageIndex: number
  pageSize: number
  pagers?: number[]
  searchKey?: string
  pending?: boolean
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSortingChange: (sorting: SortingState) => void
  onColumnFiltersChange: (filters: ColumnFiltersState) => void
}

export function DataTableServer<TData, TValue>({
  columns,
  data,
  total,
  pageIndex,
  pageSize,
  pagers = [10, 25, 50, 100],
  searchKey,
  pending = false,
  onPageChange,
  onPageSizeChange,
  onSortingChange,
  onColumnFiltersChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / pageSize),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: (newSorting) => {
      onPageChange(1)
      setSorting(newSorting)
      onSortingChange(newSorting as SortingState)
    },
    onColumnFiltersChange: (newFilters) => {
      onPageChange(1)
      setColumnFilters(newFilters)
      onColumnFiltersChange(newFilters as ColumnFiltersState)
    },
    state: {
      sorting,
      columnFilters,
      pagination: { pageIndex, pageSize },
    },
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        {searchKey && (
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

                <Input
                  placeholder="Search"
                  className="pl-8"
                  value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
                  onChange={(event) => {
                    event.preventDefault()
                    table.getColumn(searchKey)?.setFilterValue(event.target.value)
                  }}
                />
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-black/90 font-semibold text-base">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {pending ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-black/90 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {table.getFilteredRowModel().rows.length > 0 && (
        <div className="flex justify-between">
          <div className="flex gap-1 items-center text-gray-400 text-sm">
            Showing <span className="text-gray-600 font-semibold">{(pageIndex - 1) * pageSize + 1}</span> to{' '}
            <span className="text-gray-600 font-semibold">{Math.min(pageIndex * pageSize, total)}</span> of{' '}
            <span className="text-gray-600 font-semibold">{total}</span>
            records
          </div>
          <div className="flex gap-6 justify-end items-center">
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                onPageChange(1)
                onPageSizeChange(Number(value))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {pagers.map((item) => (
                  <SelectItem key={item} value={`${item}`}>
                    <span className="flex justify-between items-center gap-2">
                      {item}
                      <span className="text-gray-500">rows/page</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Pagination
              page={pageIndex}
              count={Math.ceil(total / pageSize)}
              onChange={(page) => {
                onPageChange(page)
              }}
            ></Pagination>
          </div>
        </div>
      )}
    </div>
  )
}
