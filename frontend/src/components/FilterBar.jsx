import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Filter,
} from "lucide-react";

export default function FilterBar({ activeFilter, onFilterChange }) {
  const filters = [
    { id: "today", label: "Today", icon: Calendar },
    { id: "upcoming", label: "Upcoming", icon: Clock },
    { id: "overdue", label: "Overdue", icon: AlertCircle },
    { id: "high-priority", label: "High Priority", icon: Filter },
    { id: "completed", label: "Completed", icon: CheckCircle },
  ];

  return (
    <>
    <div className="relative flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onFilterChange("")}
        className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 text-sm transition-colors
      ${
        activeFilter === ""
          ? "bg-mainHeading dark:bg-dark-mainHeading text-card dark:text-dark-body"
          : "bg-secondary dark:bg-dark-body text-subHeading dark:text-dark-textContent hover:bg-card dark:hover:bg-dark-card"
      }`}
      >
        All tasks
      </button>
      {filters.map((filter) => {
        const Icon = filter.icon;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 text-sm transition-colors
          ${
            activeFilter === filter.id
              ? "bg-mainHeading dark:bg-dark-mainHeading text-card dark:text-dark-body"
              : "bg-secondary dark:bg-dark-body text-subHeading dark:text-dark-textContent hover:bg-card dark:hover:bg-dark-card"
          }`}
          >
            <Icon className="w-4 h-4" />
            {filter.label}
          </button>
        );
      })}
    {/* <div className="absolute w-10 right-0 h-full bg-gradient-to-r from-transparent dark:from-transparent via-transparent dark:via-transparent to-body dark:to-dark-body"></div> */}
    </div>
    </>
  );
}
