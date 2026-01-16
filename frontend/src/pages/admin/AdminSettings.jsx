// src/pages/admin/AdminSettings.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSystemHealth,
  cleanupDeletedTasks,
  exportData,
  clearSuccessMessage,
  clearError,
} from "../../store/slices/adminSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import Toast from "../../components/admin/Toast";
import {
  Server,
  Database,
  HardDrive,
  Clock,
  Trash2,
  Download,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

export default function AdminSettings() {
  const dispatch = useDispatch();
  const { systemHealth, loading, successMessage, error } = useSelector(
    (state) => state.admin
  );

  const [cleanupDays, setCleanupDays] = useState(30);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchSystemHealth());
  }, [dispatch]);

  const handleCleanup = async () => {
    setCleanupLoading(true);
    await dispatch(cleanupDeletedTasks(cleanupDays));
    setCleanupLoading(false);
  };

  const handleExport = async (type) => {
    setExportLoading(true);
    const result = await dispatch(exportData(type));
    if (result.payload) {
      const dataStr = JSON.stringify(result.payload, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `d-taskly-export-${type}-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
    setExportLoading(false);
  };

  const refreshHealth = () => {
    dispatch(fetchSystemHealth());
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-mainHeading dark:text-dark-mainHeading">
            Settings
          </h1>
          <p className="mt-1 text-sm text-textContent dark:text-dark-subHeading">
            System settings and maintenance tools
          </p>
        </div>

        {/* System Health */}
        <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-mainHeading dark:text-dark-mainHeading">
              System Health
            </h2>
            <button
              onClick={refreshHealth}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border dark:border-dark-border hover:bg-secondary dark:hover:bg-dark-body text-sm text-subHeading dark:text-dark-textContent"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {systemHealth ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-secondary dark:bg-dark-body rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Server className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-textContent dark:text-dark-subHeading">
                      Status
                    </p>
                    <p className="font-medium text-mainHeading dark:text-dark-mainHeading flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {systemHealth.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-secondary dark:bg-dark-body rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-textContent dark:text-dark-subHeading">
                      Database
                    </p>
                    <p className="font-medium text-mainHeading dark:text-dark-mainHeading capitalize">
                      {systemHealth.database?.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-secondary dark:bg-dark-body rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <HardDrive className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-textContent dark:text-dark-subHeading">
                      Memory (Heap)
                    </p>
                    <p className="font-medium text-mainHeading dark:text-dark-mainHeading">
                      {systemHealth.memory?.heapUsed}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-secondary dark:bg-dark-body rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-textContent dark:text-dark-subHeading">
                      Uptime
                    </p>
                    <p className="font-medium text-mainHeading dark:text-dark-mainHeading">
                      {systemHealth.uptime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-textContent dark:text-dark-subHeading">
              {loading ? "Loading..." : "Failed to load system health"}
            </div>
          )}

          {systemHealth && (
            <div className="mt-6 pt-6 border-t border-border dark:border-dark-border">
              <h3 className="text-sm font-medium text-subHeading dark:text-dark-textContent mb-3">
                Collection Statistics
              </h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="px-4 py-2 bg-secondary dark:bg-dark-body rounded-lg">
                  <span className="text-textContent dark:text-dark-subHeading">Users: </span>
                  <span className="font-medium text-mainHeading dark:text-dark-mainHeading">
                    {systemHealth.collections?.users || 0}
                  </span>
                </div>
                <div className="px-4 py-2 bg-secondary dark:bg-dark-body rounded-lg">
                  <span className="text-textContent dark:text-dark-subHeading">Tasks: </span>
                  <span className="font-medium text-mainHeading dark:text-dark-mainHeading">
                    {systemHealth.collections?.tasks || 0}
                  </span>
                </div>
                <div className="px-4 py-2 bg-secondary dark:bg-dark-body rounded-lg">
                  <span className="text-textContent dark:text-dark-subHeading">Categories: </span>
                  <span className="font-medium text-mainHeading dark:text-dark-mainHeading">
                    {systemHealth.collections?.categories || 0}
                  </span>
                </div>
                <div className="px-4 py-2 bg-secondary dark:bg-dark-body rounded-lg">
                  <span className="text-textContent dark:text-dark-subHeading">Environment: </span>
                  <span className="font-medium text-mainHeading dark:text-dark-mainHeading capitalize">
                    {systemHealth.environment}
                  </span>
                </div>
                <div className="px-4 py-2 bg-secondary dark:bg-dark-body rounded-lg">
                  <span className="text-textContent dark:text-dark-subHeading">Node: </span>
                  <span className="font-medium text-mainHeading dark:text-dark-mainHeading">
                    {systemHealth.nodeVersion}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cleanup Tool */}
        <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-mainHeading dark:text-dark-mainHeading mb-4">
            Data Cleanup
          </h2>
          <p className="text-sm text-textContent dark:text-dark-subHeading mb-4">
            Remove deleted tasks that are older than specified days from the database.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-subHeading dark:text-dark-textContent">
                Delete tasks older than:
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={cleanupDays}
                onChange={(e) => setCleanupDays(parseInt(e.target.value) || 30)}
                className="w-20 px-3 py-2 rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card text-sm text-mainHeading dark:text-dark-mainHeading focus:outline-none focus:ring-2 focus:ring-mainHeading"
              />
              <span className="text-sm text-textContent dark:text-dark-subHeading">days</span>
            </div>
            <button
              onClick={handleCleanup}
              disabled={cleanupLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className={`w-4 h-4 ${cleanupLoading ? "animate-pulse" : ""}`} />
              {cleanupLoading ? "Cleaning..." : "Run Cleanup"}
            </button>
          </div>
        </div>

        {/* Export Tool */}
        <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-mainHeading dark:text-dark-mainHeading mb-4">
            Export Data
          </h2>
          <p className="text-sm text-textContent dark:text-dark-subHeading mb-4">
            Export your data as JSON files for backup or analysis.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleExport("all")}
              disabled={exportLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-mainHeading dark:bg-dark-mainHeading text-sm font-medium text-card dark:text-dark-body hover:bg-black dark:hover:bg-white disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export All
            </button>
            <button
              onClick={() => handleExport("users")}
              disabled={exportLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border dark:border-dark-border text-sm font-medium text-subHeading dark:text-dark-textContent hover:bg-secondary dark:hover:bg-dark-body disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export Users
            </button>
            <button
              onClick={() => handleExport("tasks")}
              disabled={exportLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border dark:border-dark-border text-sm font-medium text-subHeading dark:text-dark-textContent hover:bg-secondary dark:hover:bg-dark-body disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export Tasks
            </button>
            <button
              onClick={() => handleExport("categories")}
              disabled={exportLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border dark:border-dark-border text-sm font-medium text-subHeading dark:text-dark-textContent hover:bg-secondary dark:hover:bg-dark-body disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export Categories
            </button>
          </div>
        </div>
      </div>

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