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
    <div className="min-h-screen flex items-center justify-center bg-body dark:bg-dark-body px-4 py-12 font-Manrope">
      <div className="w-full max-w-4xl bg-card dark:bg-dark-card border border-border/60 dark:border-dark-border/60 rounded-2xl p-2 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Left: form */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full space-y-8 px-4 py-6">
            {/* Title */}
            <div className="text-center">
              <h1 className="font-Cal text-3xl text-mainHeading dark:text-dark-mainHeading">
                D-Taskly
              </h1>
              <p className="mt-2 text-sm text-textContent dark:text-dark-subHeading">
                Welcome back
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-subHeading dark:text-dark-textContent">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="block w-full rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-3 text-sm text-mainHeading dark:text-dark-mainHeading placeholder:text-textContent/70 dark:placeholder:text-dark-subHeading/70 focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-subHeading dark:text-dark-textContent">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    className="block w-full rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-3 text-sm text-mainHeading dark:text-dark-mainHeading placeholder:text-textContent/70 dark:placeholder:text-dark-subHeading/70 focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
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
                className="w-full rounded-full bg-mainHeading dark:bg-dark-mainHeading py-3 text-sm font-medium text-card dark:text-dark-body hover:bg-black dark:hover:bg-white dark:hover:text-dark-body focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading focus:ring-offset-2 focus:ring-offset-card dark:focus:ring-offset-dark-card disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              {/* Footer link */}
              <p className="text-center text-xs text-textContent dark:text-dark-subHeading">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-subHeading dark:text-dark-mainHeading hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right: image (hidden on small screens) */}
        <div className="hidden md:block md:w-1/2 rounded-lg overflow-hidden">
          <img
            src={sideImage} // replace with your image import
            alt="Task Image"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
