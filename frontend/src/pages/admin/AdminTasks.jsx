// src/pages/admin/AdminTasks.jsx
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllTasks,
  deleteTaskPermanently,
  bulkDeleteTasks,
  clearSuccessMessage,
  clearError,
} from "../../store/slices/adminSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SearchInput from "../../components/admin/SearchInput";
import DeleteModal from "../../components/DeleteModal";
import Toast from "../../components/admin/Toast";
import { Trash2, RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";

export default function AdminTasks() {
  const dispatch = useDispatch();
  const { tasks, tasksPagination, loading, successMessage, error } = useSelector(
    (state) => state.admin
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const loadTasks = useCallback(() => {
    dispatch(
      fetchAllTasks({
        page,
        limit: 10,
        search,
        status: statusFilter,
        priority: priorityFilter,
      })
    );
  }, [dispatch, page, search, statusFilter, priorityFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => dispatch(clearSuccessMessage()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const handleSearch = () => {
    setPage(1);
    loadTasks();
  };

  const handleDeleteTask = async () => {
    await dispatch(deleteTaskPermanently(deleteTarget));
    setDeleteTarget(null);
    loadTasks();
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    await dispatch(bulkDeleteTasks(selectedRows));
    setSelectedRows([]);
    loadTasks();
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(tasks.map((t) => t._id));
    } else {
      setSelectedRows([]);
    }
  };

  const priorityColors = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4 text-yellow-500" />,
    completed: <CheckCircle className="w-4 h-4 text-green-500" />,
    cancelled: <XCircle className="w-4 h-4 text-gray-500" />,
  };

  const columns = [
    {
      key: "title",
      label: "Task",
      render: (_, row) => (
        <div>
          <p className="font-medium">{row.title}</p>
          {row.description && (
            <p className="text-xs text-textContent dark:text-dark-subHeading line-clamp-1">
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (value) => (
        <div className="flex items-center gap-2">
          <img
            src={value?.avatar || "https://via.placeholder.com/32"}
            alt={value?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm">{value?.name || "Unknown"}</p>
            <p className="text-xs text-textContent dark:text-dark-subHeading">
              {value?.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <div className="flex items-center gap-2">
          {statusIcons[value]}
          <span className="text-sm capitalize">{value}</span>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${priorityColors[value]}`}>
          {value}
        </span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (value) =>
        value ? (
          <span
            className="px-2 py-1 text-xs rounded-full"
            style={{
              backgroundColor: value.color + "20",
              color: value.color,
            }}
          >
            {value.name}
          </span>
        ) : (
          <span className="text-textContent dark:text-dark-subHeading">—</span>
        ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      render: (value) => {
        const date = new Date(value);
        const isOverdue = date < new Date() && true;
        return (
          <span className={isOverdue ? "text-red-500" : ""}>
            {date.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDeleteTarget(row._id);
          }}
          className="p-2 text-textContent dark:text-dark-subHeading hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-mainHeading dark:text-dark-mainHeading">
              Tasks
            </h1>
            <p className="mt-1 text-sm text-textContent dark:text-dark-subHeading">
              View and manage all tasks across users
            </p>
          </div>
          <button
            onClick={loadTasks}
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
              placeholder="Search tasks..."
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card text-sm text-mainHeading dark:text-dark-mainHeading focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card text-sm text-mainHeading dark:text-dark-mainHeading focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 rounded-xl bg-mainHeading dark:bg-dark-mainHeading text-sm font-medium text-card dark:text-dark-body hover:bg-black dark:hover:bg-white"
          >
            Search
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-secondary dark:bg-dark-body rounded-xl">
            <span className="text-sm text-mainHeading dark:text-dark-mainHeading">
              {selectedRows.length} task(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedRows([])}
              className="px-4 py-2 rounded-lg border border-border dark:border-dark-border text-sm text-subHeading dark:text-dark-textContent hover:bg-card dark:hover:bg-dark-card"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Table */}
        <DataTable
          columns={columns}
          data={tasks}
          loading={loading}
          pagination={tasksPagination}
          onPageChange={setPage}
          emptyMessage="No tasks found"
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
        />
      </div>

      {/* Delete Modal */}
      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        description="This will permanently delete this task."
        dangerText="Delete Task"
      />

      {/* Toast */}
      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => dispatch(clearSuccessMessage())}
        />
      )}
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => dispatch(clearError())}
        />
      )}
    </AdminLayout>
  );
}