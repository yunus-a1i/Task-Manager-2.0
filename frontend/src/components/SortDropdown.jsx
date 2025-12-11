import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const options = [
    { value: "date", label: "Sort by date" },
    { value: "priority", label: "Sort by priority" },
    { value: "streak", label: "Sort by streak" },
  ];

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative w-full sm:w-52">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          w-full flex items-center justify-between gap-2
          rounded-full border border-border dark:border-dark-border
          bg-card dark:bg-dark-card
          px-4 py-2.5 text-sm
          text-mainHeading dark:text-dark-mainHeading
          focus:outline-none focus:ring-2
          focus:ring-mainHeading dark:focus:ring-dark-mainHeading
        "
      >
        <span>{selected?.label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="
            absolute z-20 mt-2 w-full overflow-hidden
            rounded-2xl border border-border dark:border-dark-border
            bg-card dark:bg-dark-card shadow-lg
          "
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2.5 text-sm
                transition-colors
                ${
                  value === opt.value
                    ? "bg-secondary dark:bg-dark-body text-mainHeading dark:text-dark-mainHeading"
                    : "hover:bg-secondary dark:hover:bg-dark-body text-subHeading dark:text-dark-subHeading"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
