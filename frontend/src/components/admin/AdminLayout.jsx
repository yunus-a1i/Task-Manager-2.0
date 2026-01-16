// src/components/admin/AdminLayout.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import {
  LayoutDashboard,
  Users,
  ListTodo,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Home,
} from "lucide-react";
import LogoutModal from "../LogoutModal";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Tasks", href: "/admin/tasks", icon: ListTodo },
    { name: "Categories", href: "/admin/categories", icon: FolderOpen },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const isActive = (href) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <div className="min-h-screen bg-body dark:bg-dark-body font-Manrope">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 z-50 h-full w-64
            bg-card dark:bg-dark-card
            border-r border-border dark:border-dark-border
            transform transition-transform duration-200 ease-in-out
            lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border dark:border-dark-border">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-xl font-Cal text-mainHeading dark:text-dark-mainHeading">
                D-Taskly
              </span>
              <span className="px-2 py-0.5 text-xs font-medium bg-mainHeading dark:bg-dark-mainHeading text-card dark:text-dark-body rounded-full">
                Admin
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-full hover:bg-secondary dark:hover:bg-dark-body text-textContent dark:text-dark-subHeading"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                    ${
                      active
                        ? "bg-mainHeading dark:bg-dark-mainHeading text-card dark:text-dark-body"
                        : "text-subHeading dark:text-dark-textContent hover:bg-secondary dark:hover:bg-dark-body"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border dark:border-dark-border">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-subHeading dark:text-dark-textContent hover:bg-secondary dark:hover:bg-dark-body transition-colors mb-2"
            >
              <Home className="w-5 h-5" />
              Back to App
            </Link>
            <button
              onClick={() => setOpenLogout(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Top Nav */}
          <header className="sticky top-0 z-30 bg-card dark:bg-dark-card border-b border-border dark:border-dark-border">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-full hover:bg-secondary dark:hover:bg-dark-body text-textContent dark:text-dark-subHeading"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar || "https://via.placeholder.com/40"}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-border dark:border-dark-border"
                  />
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-mainHeading dark:text-dark-mainHeading">
                      {user?.name}
                    </p>
                    <p className="text-xs text-textContent dark:text-dark-subHeading">
                      Administrator
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>

      <LogoutModal
        open={openLogout}
        onClose={() => setOpenLogout(false)}
        onConfirm={handleLogout}
        title="Logout"
        description="Sign out of D-Taskly Admin?"
        confirmText="Sign out"
      />
    </>
  );
}