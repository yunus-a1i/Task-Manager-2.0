// src/components/admin/UserDetailModal.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Mail, Calendar, ListTodo, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { fetchUserDetails, clearSelectedUser } from "../../store/slices/adminSlice";

export default function UserDetailModal({ userId, open, onClose }) {
  const dispatch = useDispatch();
  const { selectedUser, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    if (open && userId) {
      dispatch(fetchUserDetails(userId));
    }
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [open, userId, dispatch]);

  if (!open) return null;

  const user = selectedUser?.user;
  const taskStats = selectedUser?.taskStats;
  const recentTasks = selectedUser?.recentTasks || [];
  const topStreaks = selectedUser?.topStreaks || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl shadow-lg">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border dark:border-dark-border bg-card dark:bg-dark-card">
          <h2 className="text-lg font-semibold text-mainHeading dark:text-dark-mainHeading">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary dark:hover:bg-dark-body text-textContent dark:text-dark-subHeading"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading || !user ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-mainHeading border-t-transparent" />
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-start gap-4">
              <img
                src={user.avatar || "https://via.placeholder.com/80"}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border border-border dark:border-dark-border"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-mainHeading dark:text-dark-mainHeading">
                  {user.name}
                </h3>
                <p className="flex items-center gap-2 text-sm text-textContent dark:text-dark-subHeading mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
                <p className="flex items-center gap-2 text-sm text-textContent dark:text-dark-subHeading mt-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    user.isActive
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {user.isActive ? 'Active' : 'Suspended'}
                  </span>
                </div>
              </div>
            </div>

            {/* Task Stats */}
            <div>
              <h4 className="text-sm font-semibold text-mainHeading dark:text-dark-mainHeading mb-3">
                Task Statistics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-secondary dark:bg-dark-body rounded-xl p-3 text-center">
                  <ListTodo className="w-5 h-5 mx-auto text-textContent dark:text-dark-subHeading" />
                  <p className="text-2xl font-semibold text-mainHeading dark:text-dark-mainHeading mt-1">
                    {taskStats?.total || 0}
                  </p>
                  <p className="text-xs text-textContent dark:text-dark-subHeading">Total</p>
                </div>
                <div className="bg-secondary dark:bg-dark-body rounded-xl p-3 text-center">
                  <CheckCircle className="w-5 h-5 mx-auto text-green-500" />
                  <p className="text-2xl font-semibold text-mainHeading dark:text-dark-mainHeading mt-1">
                    {taskStats?.completed || 0}
                  </p>
                  <p className="text-xs text-textContent dark:text-dark-subHeading">Completed</p>
                </div>
                <div className="bg-secondary dark:bg-dark-body rounded-xl p-3 text-center">
                  <Clock className="w-5 h-5 mx-auto text-yellow-500" />
                  <p className="text-2xl font-semibold text-mainHeading dark:text-dark-mainHeading mt-1">
                    {taskStats?.pending || 0}
                  </p>
                  <p className="text-xs text-textContent dark:text-dark-subHeading">Pending</p>
                </div>
                <div className="bg-secondary dark:bg-dark-body rounded-xl p-3 text-center">
                  <AlertTriangle className="w-5 h-5 mx-auto text-red-500" />
                  <p className="text-2xl font-semibold text-mainHeading dark:text-dark-mainHeading mt-1">
                    {taskStats?.overdue || 0}
                  </p>
                  <p className="text-xs text-textContent dark:text-dark-subHeading">Overdue</p>
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            {recentTasks.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-mainHeading dark:text-dark-mainHeading mb-3">
                  Recent Tasks
                </h4>
                <div className="space-y-2">
                  {recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between p-3 bg-secondary dark:bg-dark-body rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <span className="text-sm text-mainHeading dark:text-dark-mainHeading">
                          {task.title}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Streaks */}
            {topStreaks.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-mainHeading dark:text-dark-mainHeading mb-3">
                  Top Streaks 🔥
                </h4>
                <div className="space-y-2">
                  {topStreaks.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-secondary dark:bg-dark-body rounded-xl"
                    >
                      <span className="text-sm text-mainHeading dark:text-dark-mainHeading">
                        {item.title}
                      </span>
                      <span className="text-sm font-semibold text-orange-600">
                        {item.streak?.count || 0} days
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}