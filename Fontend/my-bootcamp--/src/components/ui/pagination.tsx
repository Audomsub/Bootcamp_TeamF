import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  totalCount?: number;
  totalElements?: number; // Alias for totalCount to match existing usage in shared.tsx
  totalPages?: number;
  onPageChange: (index: number) => void;
  className?: string;
}

export function Pagination({
  pageIndex,
  pageSize,
  totalCount,
  totalElements,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const finalTotalCount = totalElements ?? totalCount ?? 0;
  const pageCount = totalPages ?? Math.ceil(finalTotalCount / pageSize);
  
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  if (pageCount <= 1 && finalTotalCount <= pageSize) return null;

  const start = finalTotalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, finalTotalCount);

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4", className)}>
      <div className="text-sm text-neutral-600 font-medium order-2 sm:order-1">
        Showing <span className="font-bold text-neutral-900">{start}</span> to{' '}
        <span className="font-bold text-neutral-900">{end}</span> of{' '}
        <span className="font-bold text-neutral-900">{finalTotalCount}</span> results
      </div>

      <div className="flex items-center gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(0)}
          disabled={!canPreviousPage}
          className="p-2.5 rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
          title="First Page"
        >
          <ChevronsLeft className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={!canPreviousPage}
          className="p-2.5 rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
          title="Previous Page"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>

        <div className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-black shadow-lg shadow-neutral-900/20 min-w-[80px] text-center tracking-wider">
          {pageIndex + 1} <span className="text-neutral-500 mx-1.5 font-medium">/</span> {Math.max(1, pageCount)}
        </div>

        <button
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={!canNextPage}
          className="p-2.5 rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
          title="Next Page"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => onPageChange(pageCount - 1)}
          disabled={!canNextPage}
          className="p-2.5 rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
          title="Last Page"
        >
          <ChevronsRight className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
