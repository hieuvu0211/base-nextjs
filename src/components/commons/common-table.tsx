'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  Row,
  Table,
  ColumnDef,
  OnChangeFn,
  RowSelectionState,
} from '@tanstack/react-table'
import classNames from 'classnames'

interface TableRow {
  id?: string | number
  [key: string]: unknown
}

interface Props<T extends TableRow> {
  data: T[]
  columns: ColumnDef<T>[]
  page: number
  totalPage: number
  totalDocs?: number
  docsPerPage?: number
  selectedRow?: Record<number, boolean>
  onPageChange?: (page: number) => void
  onRowClick?: (row: Row<T>) => void
  onRowDoubleClick?: (row: Row<T>) => void
  onRowSelection?: OnChangeFn<RowSelectionState>
  enableRowSelection?: boolean
  enableIndexColumn?: boolean
  disableFooter?: boolean
  disableBorder?: boolean
  manualPagination?: boolean
  disableDefaultRowSelection?: boolean
  onSelect?: (row: T) => void
  customTableClassname?: string
  isLoading?: boolean
  tabs?: string[]
  activeTab?: string
  onTabChange?: (tab: string) => void
}

interface IndeterminateCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: IndeterminateCheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current && typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate, rest.checked])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={classNames('cursor-pointer', className, rest.checked && '!accent-blue-600')}
      {...rest}
    />
  )
}

export const CommonTable = <T extends TableRow>({
  columns,
  data,
  docsPerPage = 10,
  totalPage,
  totalDocs,
  page = 1,
  selectedRow,
  enableRowSelection = false,
  enableIndexColumn = false,
  onPageChange,
  onRowClick,
  onRowDoubleClick,
  onRowSelection,
  disableFooter = false,
  disableBorder = false,
  manualPagination = true,
  disableDefaultRowSelection = false,
  onSelect,
  customTableClassname,
  isLoading = false,
  tabs,
  activeTab,
  onTabChange,
}: Props<T>) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const isEmpty = !data || data.length === 0

  // Calculate displayed items based on current page and docsPerPage
  const startIndex = (page - 1) * docsPerPage
  const endIndex = startIndex + docsPerPage
  const paginatedData = manualPagination ? data.slice(startIndex, endIndex) : data

  const startItem = startIndex + 1
  const endItem = Math.min(endIndex, totalDocs || data.length)

  const rowSelectionColumn: ColumnDef<T> = {
    id: 'select',
    header: ({ table }: { table: Table<T> }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }: { row: Row<T> }) => (
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
    size: 36,
  }

  const indexColumn: ColumnDef<T> = {
    header: 'STT',
    cell: ({ row }: { row: Row<T> }) => <span>{row.index + 1}</span>,
  }

  const renderedColumns = useMemo(() => {
    const cols = [...columns]
    if (enableIndexColumn) {
      cols.unshift(indexColumn)
    }
    if (enableRowSelection && !disableDefaultRowSelection) {
      cols.unshift(rowSelectionColumn)
    }
    return cols
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, enableIndexColumn, enableRowSelection, disableDefaultRowSelection])

  const table = useReactTable({
    data: paginatedData,
    columns: renderedColumns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection,
    onRowSelectionChange: onRowSelection || setRowSelection,
    state: {
      rowSelection,
    },
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: manualPagination,
    pageCount: totalPage,
  })

  const isFirstPage = page === 1
  const isLastPage = page === totalPage

  const handleNextPage = () => {
    if (!isLastPage && onPageChange) {
      onPageChange(page + 1)
    }
  }

  const handlePrevPage = () => {
    if (!isFirstPage && onPageChange) {
      onPageChange(page - 1)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (onPageChange && newPage >= 1 && newPage <= totalPage) {
      onPageChange(newPage)
    }
  }

  const handleRowClick = (row: Row<T>) => {
    if (onRowClick) {
      onRowClick(row)
    }
    if (onSelect) {
      onSelect(row.original)
    }
  }

  useEffect(() => {
    if (selectedRow) {
      setRowSelection(selectedRow)
    }
  }, [selectedRow])

  if (isLoading) {
    return (
      <div className="flex h-[100px] w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div
        className={classNames(
          'w-full overflow-hidden rounded-lg border bg-white',
          !disableBorder && 'border-gray-200',
          customTableClassname
        )}
      >
        {tabs && activeTab && onTabChange && (
          <div className="flex gap-4 p-4 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => onTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                      style={{
                        width: header.getSize() !== 150 ? header.getSize() : 'auto',
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isEmpty ? (
                <tr>
                  <td
                    colSpan={renderedColumns.length}
                    className="text-center py-8 text-gray-500 bg-gray-50"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-sm font-medium">No data available</span>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row)}
                    onDoubleClick={() => onRowDoubleClick?.(row)}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer text-gray-900 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!disableFooter && !isEmpty && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-b-lg">
          <div className="flex items-center gap-2 text-gray-600">
            <span>
              Showing{' '}
              <span className="font-medium text-gray-900">
                {startItem}-{endItem}
              </span>{' '}
              of <span className="font-medium text-gray-900">{totalDocs || data.length}</span>{' '}
              results
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevPage}
              disabled={isFirstPage}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPage }, (_, i) => i + 1)
                .slice(Math.max(0, page - 3), Math.min(totalPage, page + 2))
                .map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                      pageNumber === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={isLastPage}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
