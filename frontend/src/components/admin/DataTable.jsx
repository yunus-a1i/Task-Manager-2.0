// src/components/admin/DataTable.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DataTable({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  emptyMessage = "No data found",
  selectedRows = [],
  onSelectRow,
  onSelectAll,
}) {
  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border dark:border-dark-border bg-secondary/50 dark:bg-dark-body/50">
              {onSelectRow && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => el && (el.indeterminate = someSelected)}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="h-4 w-4 rounded border-border dark:border-dark-border text-mainHeading focus:ring-mainHeading"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-subHeading dark:text-dark-textContent"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-dark-border">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (onSelectRow ? 1 : 0)} className="px-4 py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-mainHeading border-t-transparent" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectRow ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm text-textContent dark:text-dark-subHeading"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row._id || rowIndex}
                  className="hover:bg-secondary/30 dark:hover:bg-dark-body/30 transition-colors"
                >
                  {onSelectRow && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row._id)}
                        onChange={() => onSelectRow(row._id)}
                        className="h-4 w-4 rounded border-border dark:border-dark-border text-mainHeading focus:ring-mainHeading"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm text-mainHeading dark:text-dark-mainHeading"
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border dark:border-dark-border">
          <p className="text-sm text-textContent dark:text-dark-subHeading">
            Showing {((pagination.currentPage - 1) * 10) + 1} to{" "}
            {Math.min(pagination.currentPage * 10, pagination.totalUsers || pagination.totalTasks || pagination.totalCategories)} of{" "}
            {pagination.totalUsers || pagination.totalTasks || pagination.totalCategories} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-lg border border-border dark:border-dark-border hover:bg-secondary dark:hover:bg-dark-body disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-textContent dark:text-dark-subHeading" />
            </button>
            <span className="text-sm text-mainHeading dark:text-dark-mainHeading">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasMore}
              className="p-2 rounded-lg border border-border dark:border-dark-border hover:bg-secondary dark:hover:bg-dark-body disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-textContent dark:text-dark-subHeading" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}