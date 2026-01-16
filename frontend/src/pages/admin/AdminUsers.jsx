// src/pages/admin/AdminUsers.jsx
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  deleteUser,
  toggleUserStatus,
  changeUserRole,
  bulkDeleteUsers,
  clearSuccessMessage,
  clearError,
} from "../../store/slices/adminSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SearchInput from "../../components/admin/SearchInput";
import UserDetailModal from "../../components/admin/UserDetailModal";
import DeleteModal from "../../components/DeleteModal";
import Toast from "../../components/admin/Toast";
import {
  Eye,
  Trash2,
  Shield,
  ShieldOff,
  UserCheck,
  UserX,
  MoreVertical,
  RefreshCw,
} from "lucide-react";

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users, usersPagination, loading, successMessage, error } = useSelector(
    (state) => state.admin
  );

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [actionMenu, setActionMenu] = useState(null);

  const loadUsers = useCallback(() => {
    dispatch(
      fetchAllUsers({
        page,
        limit: 10,
        search,
        role: roleFilter,
        isActive: statusFilter,
      })
    );
  }, [dispatch, page, search, roleFilter, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => dispatch(clearSuccessMessage()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const handleSearch = () => {
    setPage(1);
    loadUsers();
  };

  const handleDeleteUser = async () => {
    await dispatch(deleteUser(deleteTarget));
    setDeleteTarget(null);
    loadUsers();
  };

  const handleToggleStatus = async (userId) => {
    await dispatch(toggleUserStatus(userId));
    setActionMenu(null);
    loadUsers();
  };

  const handleChangeRole = async (userId, newRole) => {
    await dispatch(changeUserRole({ userId, role: newRole }));
    setActionMenu(null);
    loadUsers();
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    await dispatch(bulkDeleteUsers(selectedRows));
    setSelectedRows([]);
    loadUsers();
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(users.map((u) => u._id));
    } else {
      setSelectedRows([]);
    }
  };

  const columns = [
    {
      key: "name",
      label: "User",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar || "https://via.placeholder.com/40"}
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover border border-border dark:border-dark-border"
          />
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-textContent dark:text-dark-subHeading">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === "admin"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {value ? "Active" : "Suspended"}
        </span>
      ),
    },
    {
      key: "taskStats",
      label: "Tasks",
      render: (value) => (
        <div className="text-sm">
          <span className="text-mainHeading dark:text-dark-mainHeading">
            {value?.total || 0}
          </span>
          <span className="text-textContent dark:text-dark-subHeading"> total, </span>
          <span className="text-green-600">{value?.completed || 0}</span>
          <span className="text-textContent dark:text-dark-subHeading"> done</span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActionMenu(actionMenu === row._id ? null : row._id);
            }}
            className="p-2 hover:bg-secondary dark:hover:bg-dark-body rounded-lg"
          >
            <MoreVertical className="w-4 h-4 text-textContent dark:text-dark-subHeading" />
          </button>

          {actionMenu === row._id && (
            <div className="absolute right-0 mt-1 w-48 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl shadow-lg z-10 overflow-hidden">
              <button
                onClick={() => {
                  setSelectedUserId(row._id);
                  setShowDetailModal(true);
                  setActionMenu(null);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-subHeading dark:text-dark-textContent hover:bg-secondary dark:hover:bg-dark-body"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={() => handleToggleStatus(row._id)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-subHeading dark:text-dark-textContent hover:bg-secondary dark:hover:bg-dark-body"
              >
                {row.isActive ? (
                  <>
                    <UserX className="w-4 h-4" />
                    Suspend User
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Activate User
                  </>
                )}
              </button>
              <button
                onClick={() =>
                  handleChangeRole(row._id, row.role === "admin" ? "user" : "admin")
                }
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-subHeading dark:text-dark-textContent hover:bg-secondary dark:hover:bg-dark-body"
              >
                {row.role === "admin" ? (
                  <>
                    <ShieldOff className="w-4 h-4" />
                    Remove Admin
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Make Admin
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setDeleteTarget(row._id);
                  setActionMenu(null);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                Delete User
              </button>
            </div>
          )}
        </div>
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
              Users
            </h1>
            <p className="mt-1 text-sm text-textContent dark:text-dark-subHeading">
              Manage all users in your system
            </p>
          </div>
          <button
            onClick={loadUsers}
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
              placeholder="Search users..."
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card text-sm text-mainHeading dark:text-dark-mainHeading focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card text-sm text-mainHeading dark:text-dark-mainHeading focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Suspended</option>
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
              {selectedRows.length} user(s) selected
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
          data={users}
          loading={loading}
          pagination={usersPagination}
          onPageChange={setPage}
          emptyMessage="No users found"
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
        />
      </div>

      {/* Modals */}
      <UserDetailModal
        userId={selectedUserId}
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedUserId(null);
        }}
      />

      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description="This will permanently delete the user and all their data."
        dangerText="Delete User"
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