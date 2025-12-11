import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateUserProfile } from "../store/slices/authSlice";
import { ArrowLeft, Save } from "lucide-react";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    notificationPreference: true,
    themePreference: "light",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        avatar: user.avatar || "",
        notificationPreference: user.notificationPreference ?? true,
        themePreference: user.themePreference || "light",
      });
    }
  }, [user]);

  useEffect(() => {
    const root = document.documentElement;
    if (!root) return;

    const userTheme = user?.themePreference ?? user?.theme ?? null;
    const initialTheme = userTheme || formData.themePreference || "light";

    if (initialTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [user]);

  useEffect(() => {
    const root = document.documentElement;
    if (!root) return;

    if (formData.themePreference === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [formData.themePreference]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateUserProfile(formData));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-body dark:bg-dark-body font-Manrope">
      {/* Top bar */}
      <nav className="bg-card dark:bg-dark-card border-b border-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full p-2 text-textContent dark:text-dark-subHeading hover:text-mainHeading dark:hover:text-dark-mainHeading hover:bg-secondary dark:hover:bg-dark-body"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold text-mainHeading dark:text-dark-mainHeading">
              Profile settings
            </h1>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Profile form */}
        <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-6 sm:p-8">
          {saved && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm text-subHeading dark:text-dark-textContent mb-1">
                Name
              </label>
              <input
                type="text"
                className="block w-full rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-3 text-sm text-mainHeading dark:text-dark-mainHeading placeholder:text-textContent/70 dark:placeholder:text-dark-subHeading/70 focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-subHeading dark:text-dark-textContent mb-1">
                Email
              </label>
              <input
                type="email"
                disabled
                className="block w-full rounded-lg border border-border/70 dark:border-dark-border bg-secondary dark:bg-dark-body px-4 py-3 text-sm text-textContent dark:text-dark-subHeading"
                value={user?.email || ""}
              />
              <p className="mt-1 text-xs text-textContent dark:text-dark-subHeading">
                Email cannot be changed
              </p>
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-sm text-subHeading dark:text-dark-textContent mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                className="block w-full rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-3 text-sm text-mainHeading dark:text-dark-mainHeading placeholder:text-textContent/70 dark:placeholder:text-dark-subHeading/70 focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
                value={formData.avatar}
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.value })
                }
              />
              {formData.avatar && (
                <img
                  src={formData.avatar}
                  alt="Avatar preview"
                  className="mt-3 h-20 w-20 rounded-full object-cover border border-border dark:border-dark-border"
                />
              )}
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-sm text-subHeading dark:text-dark-textContent mb-3">
                Preferences
              </label>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm text-subHeading dark:text-dark-textContent">
                  <input
                    type="checkbox"
                    checked={formData.notificationPreference}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notificationPreference: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-border dark:border-dark-border text-mainHeading dark:text-dark-mainHeading focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
                  />
                  <span>Enable notifications</span>
                </label>

                <div>
                  <label className="block text-sm text-subHeading dark:text-dark-textContent mb-2">
                    Theme
                  </label>
                  <select
                    className="block w-full rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-3 text-sm text-mainHeading dark:text-dark-mainHeading focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
                    value={formData.themePreference}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        themePreference: e.target.value,
                      })
                    }
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-mainHeading dark:bg-dark-mainHeading px-6 py-3 text-sm font-medium text-card dark:text-dark-body hover:bg-black dark:hover:bg-white dark:hover:text-dark-body focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading focus:ring-offset-2 focus:ring-offset-body dark:focus:ring-offset-dark-body"
              >
                <Save className="w-4 h-4" />
                Save changes
              </button>
            </div>
          </form>
        </div>

        {/* Account info */}
        <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-6 sm:p-8">
          <h3 className="text-sm font-semibold text-mainHeading dark:text-dark-mainHeading mb-3">
            Account information
          </h3>
          <div className="space-y-1 text-sm text-textContent dark:text-dark-subHeading">
            <p>
              Member since:{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p>User ID: {user?.id || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
