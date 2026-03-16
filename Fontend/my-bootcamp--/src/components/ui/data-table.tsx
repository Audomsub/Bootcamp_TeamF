import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  searchPlaceholder?: string;
  searchColumn?: string;
  pageSize?: number;
}

export function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  searchColumn,
  pageSize = 10,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize } },
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchColumn !== undefined && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-100 bg-gray-50/50">
                   {headerGroup.headers.map((header) => {
                     const meta = header.column.columnDef.meta as any;
                     const alignClass = meta?.align === 'right' ? 'text-right' : meta?.align === 'center' ? 'text-center' : 'text-left';
                     const alignHeaderClass = meta?.align === 'right' ? 'justify-end' : meta?.align === 'center' ? 'justify-center' : 'justify-start';

                     return (
                       <th
                         key={header.id}
                         className={cn(
                           'px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-widest transition-colors',
                           alignClass,
                           header.column.getCanSort() && 'cursor-pointer select-none hover:text-primary-700 hover:bg-neutral-100/50'
                         )}
                         onClick={header.column.getToggleSortingHandler()}
                       >
                         <div className={cn("flex items-center gap-2", alignHeaderClass)}>
                           {header.isPlaceholder
                             ? null
                             : flexRender(header.column.columnDef.header, header.getContext())}
                           {header.column.getCanSort() && (
                             <ArrowUpDown className="h-3 w-3 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                           )}
                         </div>
                       </th>
                     );
                   })}
                 </tr>
               ))}
             </thead>
             <tbody className="divide-y divide-gray-100">
               {table.getRowModel().rows.length === 0 ? (
                 <tr>
                   <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 text-sm italic">
                     No records matching your search.
                   </td>
                 </tr>
               ) : (
                 table.getRowModel().rows.map((row) => (
                   <tr key={row.id} className="group hover:bg-gray-50/80 transition-all duration-300">
                     {row.getVisibleCells().map((cell) => {
                       const meta = cell.column.columnDef.meta as any;
                       const alignClass = meta?.align === 'right' ? 'text-right' : meta?.align === 'center' ? 'text-center' : 'text-left';
                       
                       return (
                         <td key={cell.id} className={cn(
                           "px-6 py-5 text-sm transition-colors",
                           alignClass,
                           "text-neutral-700 group-hover:text-neutral-900"
                         )}>
                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
                         </td>
                       );
                     })}
                   </tr>
                 ))
               )}
             </tbody>
          </table>
        </div>

        {/* Pagination */}
        {table.getPageCount() > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} results
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
