'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
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
import { cloneDeep } from 'lodash'

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
  onPageSizeChange?: (pageSize: number) => void
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
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current && typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate, rest.checked])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={classNames('cursor-pointer', className, rest.checked && '!accent-blue-50')}
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
  // onPageSizeChange,
  onRowClick,
  onRowSelection,
  onRowDoubleClick,
  disableFooter = false,
  // disableBorder = false,
  disableDefaultRowSelection = false,
  manualPagination = true,
  customTableClassname,
  onSelect,
  isLoading = false,
  tabs,
  activeTab,
  onTabChange,
}: Props<T>) => {
  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: docsPerPage,
  })

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const isEmpty = !data || data.length === 0
  const startItem = (page - 1) * pagination.pageSize + 1
  const endItem = Math.min(page * pagination.pageSize, totalDocs || 0)

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

  const renderedColumns = (): ColumnDef<T>[] => {
    const clone = cloneDeep(columns)
    if (enableIndexColumn) {
      clone.unshift(indexColumn)
    }
    if (enableRowSelection && !disableDefaultRowSelection) {
      clone.unshift(rowSelectionColumn)
    }
    return clone
  }

  const table = useReactTable({
    data,
    columns: renderedColumns(),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: onRowSelection || setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      rowSelection,
      pagination,
    },
    manualPagination: manualPagination,
    pageCount: totalPage,
  })

  const isFirstPage = useMemo(() => {
    return manualPagination ? page === 1 : !table.getCanPreviousPage()
  }, [manualPagination, page, table])

  const isLastPage = useMemo(() => {
    return manualPagination ? page === totalPage : !table.getCanNextPage()
  }, [manualPagination, page, totalPage, table])

  const handleNextPage = () => {
    if (!isLastPage) {
      if (manualPagination && onPageChange) {
        onPageChange(page + 1)
      } else {
        table.nextPage()
      }
    }
  }

  const handlePrevPage = () => {
    if (!isFirstPage) {
      if (manualPagination && onPageChange) {
        onPageChange(page - 1)
      } else {
        table.previousPage()
      }
    }
  }

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
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
    if (docsPerPage !== pagination.pageSize) {
      setPagination((prev) => ({
        ...prev,
        pageSize: docsPerPage,
      }))
    }
  }, [docsPerPage])

  // const handlePageSizeChange = (newPageSize: number) => {
  //   setPagination((prev) => ({
  //     ...prev,
  //     pageSize: newPageSize,
  //   }));

  //   if (onPageSizeChange) {
  //     onPageSizeChange(newPageSize);
  //   }
  // };

  useEffect(() => {
    if (selectedRow) {
      setRowSelection(selectedRow)
    }
  }, [selectedRow])

  if (isLoading) {
    return (
      <div className="flex h-[100px] w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-10"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div
        className={classNames(
          'w-full overflow-hidden rounded-lg border border-gray-80 bg-white',
          customTableClassname
        )}
      >
        {tabs && activeTab && onTabChange && (
          <div className="flex gap-4 p-4 border-b border-gray-80">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab ? 'bg-primary-10 text-gray-90' : 'text-gray-50 hover:bg-gray-80'
                }`}
                onClick={() => onTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
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
                    colSpan={columns.length}
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
            {/* <select
              value={pagination.pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="bg-gray-90 border border-gray-80 rounded px-2 py-1 text-gray-00"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select> */}
            <span>
              <span className="text-gray-500">
                Showing {startItem}-{endItem}
              </span>{' '}
              <span className="text-gray-700 font-medium">of {totalDocs} results</span>
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
                        ? 'bg-primary-10 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
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
