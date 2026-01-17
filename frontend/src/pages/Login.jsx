import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearError } from "../store/slices/authSlice";
import sideImage from "../assets/AuthImage.jpg";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen w-full flex bg-body dark:bg-dark-body font-Manrope">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20">
        <div className="w-full max-w-md space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="font-Cal text-4xl text-mainHeading dark:text-dark-mainHeading mb-2">
              D-Taskly
            </h1>
            <h2 className="text-2xl font-bold text-mainHeading dark:text-dark-mainHeading">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-textContent dark:text-dark-subHeading">
              Please enter your details to sign in
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wide text-subHeading dark:text-dark-textContent">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="block w-full rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-3.5 text-sm text-mainHeading dark:text-dark-mainHeading placeholder:text-textContent/50 dark:placeholder:text-dark-subHeading/50 focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wide text-subHeading dark:text-dark-textContent">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="block w-full rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-3.5 text-sm text-mainHeading dark:text-dark-mainHeading placeholder:text-textContent/50 dark:placeholder:text-dark-subHeading/50 focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-mainHeading dark:bg-dark-mainHeading py-3.5 text-sm font-bold text-card dark:text-dark-body hover:bg-black dark:hover:bg-white hover:scale-[1.01] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading focus:ring-offset-2 focus:ring-offset-body dark:focus:ring-offset-dark-body disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Footer link */}
            <p className="text-center text-sm text-textContent dark:text-dark-subHeading">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-mainHeading dark:text-dark-mainHeading hover:underline transition-all"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-secondary dark:bg-dark-card">
        <img
          src={sideImage}
          alt="Dashboard Preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Subtle Overlay to ensure text readability if you add overlay text later, or just for mood */}
        <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
      </div>
    </div>
  );
}