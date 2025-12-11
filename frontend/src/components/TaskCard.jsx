import { CheckCircle2, Circle, Trash2, Clock, Flame } from "lucide-react";
import { formatDate, isOverdue } from "../utils/date";
import { getStreakColor, getStreakEmoji } from "../utils/streak";
import { useState } from "react";
import DeleteModal from "./DeleteModal";

export default function TaskCard({ task, onToggle, onDelete, onClick }) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function handleConfirmDelete() {
    await onDelete(deleteTarget);
  }

  const priorityColors = {
    high: "border-l-4 border-red-500",
    medium: "border-l-4 border-yellow-500",
    low: "border-l-4 border-green-500",
  };

  const statusColor = task.status === "completed" ? "bg-gray-50" : "bg-white";

  return (
    <>
      <div
        className={`${statusColor} ${priorityColors[task.priority]}
    bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl px-4 py-3
    hover:border-mainHeading/60 dark:hover:border-dark-mainHeading/60 hover:shadow-sm transition-shadow cursor-pointer`}
        onClick={onClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(task._id, task.status === "completed");
              }}
              className="mt-1"
            >
              {task.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-textContent dark:text-dark-subHeading hover:text-mainHeading dark:hover:text-dark-mainHeading" />
              )}
            </button>

            <div className="flex-1">
              <h3
                className={`text-sm font-medium ${
                  task.status === "completed"
                    ? "line-through text-textContent dark:text-dark-subHeading"
                    : "text-mainHeading dark:text-dark-mainHeading"
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-textContent dark:text-dark-subHeading mt-1">
                  {task.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-textContent dark:text-dark-subHeading">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span
                    className={
                      isOverdue(task.dueDate) && task.status !== "completed"
                        ? "text-red-500 font-medium"
                        : ""
                    }
                  >
                    {formatDate(task.dueDate)}
                  </span>
                </span>
                {task.category && (
                  <span
                    className="px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: task.category.color + "20",
                      color: task.category.color,
                    }}
                  >
                    {task.category.name}
                  </span>
                )}
                {task.streak?.count > 0 && (
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStreakColor(
                      task.streak.count
                    )}`}
                  >
                    {getStreakEmoji(task.streak.count)} {task.streak.count} day
                    streak
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(task._id);
            }}
            className="text-textContent/60 dark:text-dark-subHeading/60 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete task"
        description="Are you sure you want to delete this task?"
        dangerText="Delete task"
      />
    </>
  );
}
