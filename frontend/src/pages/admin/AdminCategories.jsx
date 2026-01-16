// src/pages/admin/AdminCategories.jsx
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories, clearSuccessMessage } from "../../store/slices/adminSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SearchInput from "../../components/admin/SearchInput";
import Toast from "../../components/admin/Toast";
import { RefreshCw } from "lucide-react";

export default function AdminCategories() {
  const dispatch = useDispatch();
  const { categories, categoriesPagination, loading, successMessage } = useSelector(
    (state) => state.admin
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const loadCategories = useCallback(() => {
    dispatch(
      fetchAllCategories({
        page,
        limit: 10,
        search,
      })
    );
  }, [dispatch, page, search]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSearch = () => {
    setPage(1);
    loadCategories();
  };

  const columns = [
    {
      key: "icon",
      label: "Icon",
      render: (value) => (
        <span className="text-2xl">{value || "📁"}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: row.color || "#3B82F6" }}
          />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: "user",
      label: "Owner",
      render: (value) => (
        <div>
          <p className="text-sm">{value?.name || "Unknown"}</p>
          <p className="text-xs text-textContent dark:text-dark-subHeading">
            {value?.email}
          </p>
        </div>
      ),
    },
    {
      key: "taskCount",
      label: "Tasks",
      render: (value) => (
        <span className="px-2 py-1 text-xs font-medium bg-secondary dark:bg-dark-body rounded-full">
          {value || 0} tasks
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-mainHeading dark:text-dark-mainHeading">
              Categories
            </h1>
            <p className="mt-1 text-sm text-textContent dark:text-dark-subHeading">
              View all categories created by users
            </p>
          </div>
          <button
            onClick={loadCategories}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border dark:border-dark-border hover:bg-secondary dark:hover:bg-dark-body text-sm font-medium text-subHeading dark:text-dark-textContent"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              onClear={() => {
                setSearch("");
                setPage(1);
              }}
              placeholder="Search categories..."
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 rounded-xl bg-mainHeading dark:bg-dark-mainHeading text-sm font-medium text-card dark:text-dark-body hover:bg-black dark:hover:bg-white"
          >
            Search
          </button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={categories}
          loading={loading}
          pagination={categoriesPagination}
          onPageChange={setPage}
          emptyMessage="No categories found"
        />
      </div>

      {/* Toast */}
      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => dispatch(clearSuccessMessage())}
        />
      )}
    </AdminLayout>
  );
}