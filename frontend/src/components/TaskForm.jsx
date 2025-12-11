import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function TaskForm({ task, categories, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    reminderTime: "",
    isReminderEnabled: false,
    category: "",
    labels: "",
    repeatRule: "none",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().slice(0, 16)
          : "",
        reminderTime: task.reminderTime
          ? new Date(task.reminderTime).toISOString().slice(0, 16)
          : "",
        isReminderEnabled: task.isReminderEnabled || false,
        category: task.category?._id || "",
        labels: task.labels?.join(", ") || "",
        repeatRule: task.repeatRule || "none",
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      labels: formData.labels
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
      category: formData.category || undefined,
    };
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
  <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
    <div className="flex items-center justify-between p-6 border-b border-border dark:border-dark-border">
      <h2 className="text-base font-semibold text-mainHeading dark:text-dark-mainHeading">
        {task ? "Edit task" : "Create new task"}
      </h2>
      <button
        onClick={onClose}
        className="text-textContent dark:text-dark-subHeading hover:text-mainHeading dark:hover:text-dark-mainHeading rounded-full p-1 hover:bg-secondary dark:hover:bg-dark-body"
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm text-subHeading dark:text-dark-textContent mb-1">
          Title *
        </label>
        <input
          type="text"
          required
          className="w-full rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-2.5 text-sm text-mainHeading dark:text-dark-mainHeading placeholder:text-textContent/70 dark:placeholder:text-dark-subHeading/70 focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm text-subHeading dark:text-dark-textContent mb-1">
          Description
        </label>
        <textarea
          rows={3}
          className="w-full rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-2.5 text-sm text-mainHeading dark:text-dark-mainHeading placeholder:text-textContent/70 dark:placeholder:text-dark-subHeading/70 focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-subHeading dark:text-dark-textContent mb-1">
            Priority
          </label>
          <select
            className="w-full rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-2.5 text-sm text-mainHeading dark:text-dark-mainHeading focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-subHeading dark:text-dark-textContent mb-1">
            Due date *
          </label>
          <input
            type="datetime-local"
            required
            className="w-full rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-2.5 text-sm text-mainHeading dark:text-dark-mainHeading focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isReminderEnabled}
            onChange={(e) =>
              setFormData({
                ...formData,
                isReminderEnabled: e.target.checked,
              })
            }
            className="h-4 w-4 rounded border-border dark:border-dark-border text-mainHeading dark:text-dark-mainHeading focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
          />
          <span className="text-sm text-subHeading dark:text-dark-textContent">
            Enable reminder
          </span>
        </label>
      </div>

      {formData.isReminderEnabled && (
        <div>
          <label className="block text-sm text-subHeading dark:text-dark-textContent mb-1">
            Reminder time
          </label>
          <input
            type="datetime-local"
            className="w-full rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-2.5 text-sm text-mainHeading dark:text-dark-mainHeading focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
            value={formData.reminderTime}
            onChange={(e) =>
              setFormData({ ...formData, reminderTime: e.target.value })
            }
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-subHeading dark:text-dark-textContent mb-1">
            Category
          </label>
          <select
            className="w-full rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-2.5 text-sm text-mainHeading dark:text-dark-mainHeading focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">None</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {/* {cat.icon} {cat.name} */}
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-subHeading dark:text-dark-textContent mb-1">
            Repeat
          </label>
          <select
            className="w-full rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-2.5 text-sm text-mainHeading dark:text-dark-mainHeading focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
            value={formData.repeatRule}
            onChange={(e) =>
              setFormData({ ...formData, repeatRule: e.target.value })
            }
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-subHeading dark:text-dark-textContent mb-1">
          Labels (comma-separated)
        </label>
        <input
          type="text"
          placeholder="e.g. urgent, work, personal"
          className="w-full rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card px-4 py-2.5 text-sm text-mainHeading dark:text-dark-mainHeading placeholder:text-textContent/70 dark:placeholder:text-dark-subHeading/70 focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
          value={formData.labels}
          onChange={(e) =>
            setFormData({ ...formData, labels: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-full border border-border dark:border-dark-border text-subHeading dark:text-dark-textContent hover:bg-secondary dark:hover:bg-dark-body text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-full bg-mainHeading dark:bg-dark-mainHeading text-sm font-medium text-card dark:text-dark-body hover:bg-black dark:hover:bg-white dark:hover:text-dark-body focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading focus:ring-offset-2 focus:ring-offset-card dark:focus:ring-offset-dark-card"
        >
          {task ? "Update task" : "Create task"}
        </button>
      </div>
    </form>
  </div>
</div>

  );
}
