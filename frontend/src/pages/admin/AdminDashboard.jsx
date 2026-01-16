// src/pages/admin/AdminDashboard.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchTaskAnalytics,
} from "../../store/slices/adminSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import StatsCard from "../../components/admin/StatsCard";
import {
  Users,
  ListTodo,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  FolderOpen,
} from "lucide-react";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { dashboardStats, taskAnalytics, loading } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchTaskAnalytics(30));
  }, [dispatch]);

  const stats = dashboardStats;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-mainHeading dark:text-dark-mainHeading">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-textContent dark:text-dark-subHeading">
            Overview of your task management system
          </p>
        </div>

        {loading && !stats ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-mainHeading border-t-transparent" />
          </div>
        ) : stats ? (
          <>
            {/* User Stats */}
            <div>
              <h2 className="text-sm font-semibold text-subHeading dark:text-dark-textContent mb-3">
                Users
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Users"
                  value={stats.users?.total || 0}
                  icon={Users}
                  subtitle={`${stats.users?.active || 0} active`}
                />
                <StatsCard
                  title="New Today"
                  value={stats.users?.newToday || 0}
                  icon={TrendingUp}
                />
                <StatsCard
                  title="This Week"
                  value={stats.users?.newThisWeek || 0}
                  icon={Clock}
                />
                <StatsCard
                  title="This Month"
                  value={stats.users?.newThisMonth || 0}
                  icon={BarChart3}
                />
              </div>
            </div>

            {/* Task Stats */}
            <div>
              <h2 className="text-sm font-semibold text-subHeading dark:text-dark-textContent mb-3">
                Tasks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Tasks"
                  value={stats.tasks?.total || 0}
                  icon={ListTodo}
                />
                <StatsCard
                  title="Completed"
                  value={stats.tasks?.completed || 0}
                  icon={CheckCircle}
                  subtitle={`${stats.tasks?.completionRate || 0}% completion rate`}
                />
                <StatsCard
                  title="Pending"
                  value={stats.tasks?.pending || 0}
                  icon={Clock}
                />
                <StatsCard
                  title="Overdue"
                  value={stats.tasks?.overdue || 0}
                  icon={AlertTriangle}
                />
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Priority Distribution */}
              <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-mainHeading dark:text-dark-mainHeading mb-4">
                  Priority Distribution
                </h3>
                <div className="space-y-4">
                  {stats.distributions?.priority?.map((item) => (
                    <div key={item._id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-textContent dark:text-dark-subHeading capitalize">
                          {item._id} Priority
                        </span>
                        <span className="text-sm font-medium text-mainHeading dark:text-dark-mainHeading">
                          {item.count}
                        </span>
                      </div>
                      <div className="w-full bg-secondary dark:bg-dark-body rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item._id === "high"
                              ? "bg-red-500"
                              : item._id === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${
                              stats.tasks?.total
                                ? (item.count / stats.tasks.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Distribution */}
              <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-mainHeading dark:text-dark-mainHeading mb-4">
                  Status Distribution
                </h3>
                <div className="space-y-4">
                  {stats.distributions?.status?.map((item) => (
                    <div key={item._id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-textContent dark:text-dark-subHeading capitalize">
                          {item._id}
                        </span>
                        <span className="text-sm font-medium text-mainHeading dark:text-dark-mainHeading">
                          {item.count}
                        </span>
                      </div>
                      <div className="w-full bg-secondary dark:bg-dark-body rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item._id === "completed"
                              ? "bg-green-500"
                              : item._id === "pending"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                          }`}
                          style={{
                            width: `${
                              stats.tasks?.total
                                ? (item.count / stats.tasks.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Most Active Users & Top Streaks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Active Users */}
              {taskAnalytics?.mostActiveUsers && (
                <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-mainHeading dark:text-dark-mainHeading mb-4">
                    Most Active Users
                  </h3>
                  <div className="space-y-3">
                    {taskAnalytics.mostActiveUsers.slice(0, 5).map((user, index) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-3 bg-secondary dark:bg-dark-body rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 flex items-center justify-center text-xs font-medium bg-mainHeading dark:bg-dark-mainHeading text-card dark:text-dark-body rounded-full">
                            {index + 1}
                          </span>
                          <img
                            src={user.avatar || "https://via.placeholder.com/32"}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-mainHeading dark:text-dark-mainHeading">
                              {user.name}
                            </p>
                            <p className="text-xs text-textContent dark:text-dark-subHeading">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-mainHeading dark:text-dark-mainHeading">
                          {user.taskCount} tasks
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Streaks */}
              {taskAnalytics?.topStreaks && (
                <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-mainHeading dark:text-dark-mainHeading mb-4">
                    Top Streaks 🔥
                  </h3>
                  <div className="space-y-3">
                    {taskAnalytics.topStreaks.slice(0, 5).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-secondary dark:bg-dark-body rounded-xl"
                      >
                        <div>
                          <p className="text-sm font-medium text-mainHeading dark:text-dark-mainHeading">
                            {item.title}
                          </p>
                          <p className="text-xs text-textContent dark:text-dark-subHeading">
                            by {item.userName}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-orange-600">
                          {item.streak?.count || 0} days
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <FolderOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-mainHeading dark:text-dark-mainHeading">
                      {stats.categories?.total || 0}
                    </p>
                    <p className="text-sm text-textContent dark:text-dark-subHeading">
                      Total Categories
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <ListTodo className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-mainHeading dark:text-dark-mainHeading">
                      {stats.tasks?.createdToday || 0}
                    </p>
                    <p className="text-sm text-textContent dark:text-dark-subHeading">
                      Tasks Created Today
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-mainHeading dark:text-dark-mainHeading">
                      {stats.tasks?.completedToday || 0}
                    </p>
                    <p className="text-sm text-textContent dark:text-dark-subHeading">
                      Completed Today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-textContent dark:text-dark-subHeading">
            Failed to load dashboard data
          </div>
        )}
      </div>
    </AdminLayout>
  );
}