// src/components/admin/SearchInput.jsx
import { Search, X } from "lucide-react";

export default function SearchInput({ value, onChange, onClear, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textContent dark:text-dark-subHeading" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card text-sm text-mainHeading dark:text-dark-mainHeading placeholder:text-textContent/70 dark:placeholder:text-dark-subHeading/70 focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-textContent dark:text-dark-subHeading hover:text-mainHeading dark:hover:text-dark-mainHeading"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}