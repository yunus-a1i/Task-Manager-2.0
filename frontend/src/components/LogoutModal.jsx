// components/LogoutModal.jsx
import { useEffect, useRef, useState } from "react";
import { LogOut, X } from "lucide-react";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onConfirm: () => Promise<void> | void   // logout handler
 * - title?: string (default: "Logout")
 * - description?: string (default: "Are you sure you want to logout?")
 * - confirmText?: string (default: "Logout")
 */
export default function LogoutModal({
  open,
  onClose,
  onConfirm,
  title = "Logout",
  description = "Are you sure you want to logout? You will be returned to the sign-in screen.",
  confirmText = "Logout",
}) {
  const panelRef = useRef(null);
  const confirmRef = useRef(null);
  const prevFocus = useRef(null);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }

    if (open) {
      prevFocus.current = document.activeElement;
      document.addEventListener("keydown", onKey);
      // small delay so element exists in DOM
      setTimeout(() => confirmRef.current?.focus?.(), 50);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleConfirm() {
    try {
      setLoading(true);
      await onConfirm();
    } catch (err) {
      // allow parent to show toast; swallow here
      console.error(err);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-hidden="true"
      />

      {/* panel */}
      <div
        ref={panelRef}
        className="font-Manrope relative w-full max-w-md rounded-2xl border border-border dark:border-dark-border bg-card dark:bg-dark-card shadow-lg overflow-hidden"
      >
        {/* header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary dark:bg-dark-body">
              <LogOut className="w-5 h-5 text-textContent dark:text-dark-subHeading" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-mainHeading dark:text-dark-mainHeading">
                {title}
              </h3>
              <p className="mt-0.5 text-xs text-textContent dark:text-dark-subHeading">
                {description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-auto -mr-2 rounded-full p-1 hover:bg-secondary dark:hover:bg-dark-body text-textContent dark:text-dark-subHeading"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* body */}
        <div className="px-6 py-5">
          <p className="text-sm text-textContent dark:text-dark-subHeading">
            You’ll need to sign in again to access your tasks. Any unsaved changes may be lost.
          </p>
        </div>

        {/* actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border dark:border-dark-border bg-card dark:bg-dark-card">
          <button
            onClick={onClose}
            className="rounded-full border border-border dark:border-dark-border px-4 py-2 text-sm font-medium text-subHeading dark:text-dark-textContent hover:bg-secondary dark:hover:bg-dark-body transition"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            ref={confirmRef}
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 rounded-full bg-mainHeading dark:bg-dark-mainHeading px-4 py-2 text-sm font-medium text-card dark:text-dark-body hover:bg-black dark:hover:bg-white dark:hover:text-dark-body focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
