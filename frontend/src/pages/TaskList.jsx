import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
  setFilters,
} from "../store/slices/taskSlice";
import { fetchCategories } from "../store/slices/categorySlice";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import FilterBar from "../components/FilterBar";
import SortDropdown from "../components/SortDropdown";
import { Plus, ArrowLeft, Search } from "lucide-react";
import NoTask from "../assets/NoTask.jpg"
export default function TaskList() {
  const dispatch = useDispatch();
  const {
    items: tasks,
    loading,
    filters,
  } = useSelector((state) => state.tasks);
  const { items: categories } = useSelector((state) => state.categories);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
    loadTasks();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadTasks = () => {
    dispatch(fetchTasks(filters));
  };

  const handleCreateTask = async (data) => {
    await dispatch(createTask(data));
    setShowForm(false);
    loadTasks();
  };

  const handleUpdateTask = async (data) => {
    await dispatch(updateTask({ id: editingTask._id, data }));
    setEditingTask(null);
    loadTasks();
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Move this task to trash?")) {
      await dispatch(deleteTask(id));
      loadTasks();
    }
  };

  const handleToggleComplete = async (id, completed) => {
    await dispatch(toggleComplete({ id, completed }));
    loadTasks();
  };

  const handleFilterChange = (filter) => {
    dispatch(setFilters({ filter }));
  };

  const handleSortChange = (sort) => {
    dispatch(setFilters({ sort }));
  };

  const handleSearch = () => {
    dispatch(setFilters({ search: searchTerm }));
  };

  return (
    <div className="min-h-screen bg-body dark:bg-dark-body font-Manrope">
      <nav className="bg-card dark:bg-dark-card border-b border-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full p-2 text-textContent dark:text-dark-subHeading hover:text-mainHeading dark:hover:text-dark-mainHeading hover:bg-secondary dark:hover:bg-dark-body"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-lg font-semibold text-mainHeading dark:text-dark-mainHeading">
                My tasks
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-full bg-mainHeading dark:bg-dark-mainHeading px-5 py-2.5 text-sm font-medium text-card dark:text-dark-body hover:bg-black dark:hover:bg-white dark:hover:text-dark-body focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading focus:ring-offset-2 focus:ring-offset-body dark:focus:ring-offset-dark-body"
              >
                <Plus className="w-4 h-4" />
                New task
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <FilterBar
            activeFilter={filters.filter}
            onFilterChange={handleFilterChange}
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textContent dark:text-dark-subHeading w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full rounded-full border border-border dark:border-dark-border bg-card dark:bg-dark-card pl-9 pr-4 py-2.5 text-sm text-mainHeading dark:text-dark-mainHeading placeholder:text-textContent/70 dark:placeholder:text-dark-subHeading/70 focus:outline-none focus:ring-2 focus:ring-mainHeading dark:focus:ring-dark-mainHeading"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <SortDropdown value={filters.sort} onChange={handleSortChange} />
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-mainHeading border-t-transparent" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-4 flex flex-col items-center justify-center">
                <img src={NoTask} alt="Task not found" className="max-w-md border border-border dark:border-dark-border rounded-lg mb-2"/>
                <p className="text-textContent dark:text-dark-subHeading text-sm">
                  No tasks found
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-3 text-sm font-medium text-mainHeading dark:text-dark-mainHeading hover:underline"
                >
                  Create your first task
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggle={handleToggleComplete}
                    onDelete={handleDeleteTask}
                    onClick={() => setEditingTask(task)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {(showForm || editingTask) && (
        <TaskForm
          task={editingTask}
          categories={categories}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
