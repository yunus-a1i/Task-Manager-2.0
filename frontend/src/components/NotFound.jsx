// src/components/NotFound.jsx
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NotExist from "../assets/NotFound.jpg";
import { Home, Shield } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-body dark:bg-dark-body font-Manrope text-center py-4 flex flex-col items-center justify-center">
      <img
        src={NotExist}
        alt="Page not found"
        loading="lazy"
        className="max-w-md border border-border dark:border-dark-border rounded-lg mb-2"
      />
      <p className="text-textContent dark:text-dark-subHeading text-sm">
        404 - Page not found
      </p>
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-mainHeading dark:text-dark-mainHeading hover:underline"
        >
          <Home className="w-4 h-4" />
          Back to Dashboard
        </button>
        {isAuthenticated && isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
          >
            <Shield className="w-4 h-4" />
            Admin Dashboard
          </button>
        )}
      </div>
    </div>
  );
}