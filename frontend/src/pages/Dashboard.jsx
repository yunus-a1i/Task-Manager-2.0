import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchAnalytics } from "../store/slices/taskSlice";
import { fetchProfile, logoutUser } from "../store/slices/authSlice";
import {
  BarChart3,
  TrendingUp,
  Target,
  LogOut,
  User,
  ListTodo,
} from "lucide-react";
import LogoutModal from "../components/LogoutModal";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { analytics } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [openLogout, setOpenLogout] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen bg-body dark:bg-dark-body font-Manrope">
        {/* Top Nav */}
        <nav className="bg-card dark:bg-dark-card border-b border-border dark:border-dark-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-2xl font-Cal text-mainHeading dark:text-dark-mainHeading">
                  D-Taskly
                </h1>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <Link
                  to="/tasks"
                  className="flex items-center gap-2 text-subHeading dark:text-dark-textContent hover:text-mainHeading dark:hover:text-dark-mainHeading"
                >
                  <ListTodo className="w-4 h-4" />
                  <span>Tasks</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-subHeading dark:text-dark-textContent hover:text-mainHeading dark:hover:text-dark-mainHeading"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => setOpenLogout(true)}
                  className="flex items-center gap-2 text-textContent dark:text-dark-subHeading hover:text-red-600 text-sm"
                >
                  {" "}
                  <LogOut className="w-4 h-4" /> <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main */}
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-mainHeading dark:text-dark-mainHeading">
              Welcome back, {user?.name}!{" "}
              <span className="inline-block">👋</span>
            </h2>
            <p className="mt-1 text-sm text-textContent dark:text-dark-subHeading">
              Here&apos;s a quick overview of your tasks.
            </p>
          </div>

          {analytics && (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
                <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-textContent dark:text-dark-subHeading">
                        Completed this week
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-mainHeading dark:text-dark-mainHeading">
                        {analytics.stats.completedThisWeek}
                      </p>
                    </div>
                    <div className="rounded-full bg-secondary/80 dark:bg-dark-body px-3 py-3">
                      <TrendingUp className="w-6 h-6 text-textContent dark:text-dark-subHeading" />
                    </div>
                  </div>
                </div>

                <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-textContent dark:text-dark-subHeading">
                        Total tasks
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-mainHeading dark:text-dark-mainHeading">
                        {analytics.stats.totalTasks}
                      </p>
                    </div>
                    <div className="rounded-full bg-secondary/80 dark:bg-dark-body px-3 py-3">
                      <Target className="w-6 h-6 text-textContent dark:text-dark-subHeading" />
                    </div>
                  </div>
                </div>

                <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-textContent dark:text-dark-subHeading">
                        Completion rate
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-mainHeading dark:text-dark-mainHeading">
                        {analytics.stats.completionRate}%
                      </p>
                    </div>
                    <div className="rounded-full bg-secondary/80 dark:bg-dark-body px-3 py-3">
                      <BarChart3 className="w-6 h-6 text-textContent dark:text-dark-subHeading" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Top streaks */}
                <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl px-5 py-5">
                  <h3 className="text-sm font-semibold text-mainHeading dark:text-dark-mainHeading mb-4">
                    Top streaks 🔥
                  </h3>
                  {analytics.topStreaks.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.topStreaks.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-xl bg-secondary dark:bg-dark-body px-4 py-3"
                        >
                          <span className="text-sm text-subHeading dark:text-dark-textContent">
                            {item.title}
                          </span>
                          <span className="text-sm font-semibold text-mainHeading dark:text-dark-mainHeading">
                            {item.streak} days
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-textContent dark:text-dark-subHeading">
                      No streaks yet. Complete tasks daily to build streaks.
                    </p>
                  )}
                </div>

                {/* Priority breakdown */}
                <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl px-5 py-5">
                  <h3 className="text-sm font-semibold text-mainHeading dark:text-dark-mainHeading mb-4">
                    Priority breakdown
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-textContent dark:text-dark-subHeading">
                          High priority
                        </span>
                        <span className="font-medium text-mainHeading dark:text-dark-mainHeading">
                          {analytics.priorityBreakdown.high}
                        </span>
                      </div>
                      <div className="w-full bg-secondary dark:bg-dark-body rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-mainHeading dark:bg-dark-mainHeading"
                          style={{
                            width: `${
                              (analytics.priorityBreakdown.high /
                                analytics.stats.totalTasks) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-textContent dark:text-dark-subHeading">
                          Medium priority
                        </span>
                        <span className="font-medium text-mainHeading dark:text-dark-mainHeading">
                          {analytics.priorityBreakdown.medium}
                        </span>
                      </div>
                      <div className="w-full bg-secondary dark:bg-dark-body rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-subHeading dark:bg-dark-subHeading"
                          style={{
                            width: `${
                              (analytics.priorityBreakdown.medium /
                                analytics.stats.totalTasks) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-textContent dark:text-dark-subHeading">
                          Low priority
                        </span>
                        <span className="font-medium text-mainHeading dark:text-dark-mainHeading">
                          {analytics.priorityBreakdown.low}
                        </span>
                      </div>
                      <div className="w-full bg-secondary dark:bg-dark-body rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-textContent dark:bg-dark-textContent"
                          style={{
                            width: `${
                              (analytics.priorityBreakdown.low /
                                analytics.stats.totalTasks) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* CTA */}
          <div className="mt-10">
            <Link
              to="/tasks"
              className="inline-flex items-center rounded-full bg-mainHeading dark:bg-dark-mainHeading px-6 py-3 text-sm font-medium text-card dark:text-dark-body hover:bg-black dark:hover:bg-white dark:hover:text-dark-body focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading focus:ring-offset-2 focus:ring-offset-body dark:focus:ring-offset-dark-body"
            >
              <ListTodo className="w-4 h-4 mr-2" />
              View all tasks
            </Link>
          </div>
        </div>
      </div>
      <LogoutModal
        open={openLogout}
        onClose={() => setOpenLogout(false)}
        onConfirm={handleLogout}
        title="Logout"
        description="Sign out of D-Taskly now?"
        confirmText="Sign out"
      />
    </>
  );
}
