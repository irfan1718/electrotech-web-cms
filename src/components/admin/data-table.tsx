"use client";

import { useState, useMemo, ReactNode } from "react";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import clsx from "clsx";

/* ═══════════════════════════════════════
   TYPES
═══════════════════════════════════════ */

export interface Column<T> {
  key: string;
  label: string;
  className?: string; // th/td class
  headerClass?: string; // th only class
  render?: (row: T) => ReactNode;
  sortable?: boolean;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  keyField?: string; // unique id field, defaults to '_id'

  // Search
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[]; // fields to search in

  // Filters
  filters?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
  filterField?: string; // which field to filter on

  // Pagination
  paginated?: boolean;
  pageSize?: number;

  // Empty state
  emptyTitle?: string;
  emptyAction?: ReactNode;

  // Header
  title?: string;
  headerRight?: ReactNode;
}

/* ═══════════════════════════════════════
   COMPONENT
═══════════════════════════════════════ */

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  keyField = "_id",

  searchable = false,
  searchPlaceholder = "Search...",
  searchKeys = [],

  filters,
  activeFilter: controlledFilter,
  onFilterChange,
  filterField,

  paginated = false,
  pageSize = 10,

  emptyTitle = "No data found",
  emptyAction,

  title,
  headerRight,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [internalFilter, setInternalFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const activeFilter = controlledFilter ?? internalFilter;

  const handleFilterChange = (value: string) => {
    if (onFilterChange) {
      onFilterChange(value);
    } else {
      setInternalFilter(value);
    }
    setCurrentPage(1);
  };

  /* ── FILTERED + SEARCHED DATA ── */
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filter
    if (filterField && activeFilter && activeFilter !== "all") {
      result = result.filter((row) => {
        const value = row[filterField];
        return String(value).toLowerCase() === activeFilter.toLowerCase();
      });
    }

    // Apply search
    if (search.trim() && searchKeys.length > 0) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        searchKeys.some((key) => {
          const value = row[key];
          return value && String(value).toLowerCase().includes(q);
        }),
      );
    }

    return result;
  }, [data, search, searchKeys, activeFilter, filterField]);

  /* ── PAGINATION ── */
  const totalPages = paginated
    ? Math.max(1, Math.ceil(processedData.length / pageSize))
    : 1;

  const paginatedData = paginated
    ? processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : processedData;

  const startItem =
    processedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, processedData.length);

  /* ── PAGE NUMBERS ── */
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  /* ═══ RENDER ═══ */
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      {/* ── HEADER ── */}
      {(title || searchable || headerRight) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
          {title && (
            <h3 className="text-[15px] font-bold text-black">{title}</h3>
          )}

          <div className="flex flex-1 items-center justify-end gap-3">
            {/* Search */}
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 w-64 rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm outline-none transition text-neutral-400 placeholder:text-neutral-400 focus:border-[#c0152a] focus:bg-white"
                />
              </div>
            )}

            {headerRight}
          </div>
        </div>
      )}

      {/* ── FILTER CHIPS ── */}
      {filters && filters.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-neutral-100 px-5 py-3">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={clsx(
                "rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all",
                activeFilter === filter.value
                  ? "bg-[#c0152a] text-white shadow-sm"
                  : "border border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-700",
              )}
            >
              {filter.label}
              {filter.count !== undefined && (
                <span
                  className={clsx(
                    "ml-1.5",
                    activeFilter === filter.value
                      ? "text-white/70"
                      : "text-neutral-400",
                  )}
                >
                  ({filter.count})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── LOADING ── */}
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-[#c0152a]" />
        </div>
      ) : paginatedData.length === 0 ? (
        /* ── EMPTY STATE ── */
        <div className="flex h-[250px] flex-col items-center justify-center gap-1 text-neutral-400">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
            <Filter className="h-5 w-5 text-neutral-400" />
          </div>
          <p className="text-sm font-medium">{emptyTitle}</p>
          {search && (
            <p className="text-xs">
              No results for &quot;{search}&quot;.{" "}
              <button
                onClick={() => setSearch("")}
                className="font-medium text-[#c0152a] hover:underline"
              >
                Clear search
              </button>
            </p>
          )}
          {!search && emptyAction}
        </div>
      ) : (
        /* ── TABLE ── */
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50/80">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={clsx(
                      "px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-400",
                      col.headerClass,
                      col.className,
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={row[keyField] || rowIndex}
                  className="border-t border-neutral-100 transition-colors hover:bg-neutral-50/50"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={clsx(
                        "px-5 py-3.5 text-sm text-neutral-600",
                        col.className,
                      )}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── PAGINATION ── */}
      {paginated && processedData.length > 0 && (
        <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-3">
          <p className="text-[12px] text-neutral-400">
            Showing{" "}
            <span className="font-medium text-neutral-600">
              {startItem}–{endItem}
            </span>{" "}
            of{" "}
            <span className="font-medium text-neutral-600">
              {processedData.length}
            </span>{" "}
            results
          </p>

          <div className="flex items-center gap-1">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-lg border text-neutral-500 transition",
                currentPage === 1
                  ? "cursor-not-allowed border-neutral-100 text-neutral-300"
                  : "border-neutral-200 hover:bg-neutral-50",
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span
                  key={`dots-${i}`}
                  className="flex h-8 w-8 items-center justify-center text-xs text-neutral-400"
                >
                  ···
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={clsx(
                    "flex h-8 min-w-[32px] items-center justify-center rounded-lg border px-2 text-[13px] font-medium transition",
                    currentPage === page
                      ? "border-[#c0152a] bg-[#c0152a] text-white"
                      : "border-neutral-200 text-neutral-600 hover:bg-neutral-50",
                  )}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-lg border text-neutral-500 transition",
                currentPage === totalPages
                  ? "cursor-not-allowed border-neutral-100 text-neutral-300"
                  : "border-neutral-200 hover:bg-neutral-50",
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
