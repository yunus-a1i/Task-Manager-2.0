// components/DeleteModal.jsx
import { useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";

/**
 * DeleteModal props:
 * - open: boolean
 * - onClose: () => void
 * - onConfirm: () => Promise<void> | void
 * - title?: string (default: "Delete item")
 * - description?: string (default: "Are you sure?")
 * - dangerText?: string (default: "Delete")
 */
export default function DeleteModal({
  open,
  onClose,
  onConfirm,
  title = "Delete item",
  description = "Are you sure you want to delete this? This action cannot be undone.",
  dangerText = "Delete",
}) {
  const overlayRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && overlayRef.current) {
        // Basic focus trap: keep focus inside modal
        const focusable = overlayRef.current.querySelectorAll(
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
      previouslyFocused.current = document.activeElement;
      document.addEventListener("keydown", onKey);
      // focus confirm button after a tick
      setTimeout(() => confirmBtnRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      // restore focus
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

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

      {/* modal panel */}
      <div
        ref={overlayRef}
        className="
      relative w-full max-w-md
      rounded-2xl
      border border-border dark:border-dark-border
      bg-card dark:bg-dark-card
      shadow-lg
      ring-1 ring-transparent
      overflow-hidden
    "
      >
        {/* header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary dark:bg-dark-body">
              <Trash2 className="w-5 h-5 text-textContent dark:text-dark-subHeading" />
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

          {/* close */}
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
            This action cannot be undone. Deleting will permanently remove this
            item from your account.
          </p>

          {/* optional details slot (keeps layout tidy) */}
          {/** If you pass children into the modal, render them here */}
          {/** children && <div className="mt-4 text-sm text-textContent">{children}</div> **/}
        </div>

        {/* actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border dark:border-dark-border bg-card dark:bg-dark-card">
          <button
            onClick={onClose}
            className="
          rounded-full border border-border dark:border-dark-border
          px-4 py-2 text-sm font-medium
          text-subHeading dark:text-dark-textContent
          hover:bg-secondary dark:hover:bg-dark-body
          transition
        "
          >
            Cancel
          </button>

          <button
            ref={confirmBtnRef}
            onClick={async () => {
              try {
                await onConfirm();
              } catch (err) {
                console.error(err);
              } finally {
                onClose();
              }
            }}
            className="
          rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white
          hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600
          shadow-sm
        "
          >
            {dangerText}
          </button>
        </div>
      </div>
    </div>
  );
}
