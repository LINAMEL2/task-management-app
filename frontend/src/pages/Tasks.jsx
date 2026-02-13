import { useEffect, useState } from "react";
import API from "../api/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [reload, setReload] = useState(false);

  // Filtrage / tri
  const [statusFilter, setStatusFilter] = useState(""); // completed, in progress
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(""); // deadline, priority

  // 🔹 Fonction pour recharger la liste depuis TaskForm ou TaskList
  const refreshTasks = () => setReload(prev => !prev);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/tasks");
        let data = res.data;

        // 🔹 Filter by status
        if (statusFilter) {
          data = data.filter(task => task.status === statusFilter);
        }

        // 🔹 Search by title or description
        if (search) {
          const s = search.toLowerCase();
          data = data.filter(task =>
            task.title.toLowerCase().includes(s) ||
            task.description.toLowerCase().includes(s)
          );
        }

        // 🔹 Sort
        if (sortBy === "deadline") {
          data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        } else if (sortBy === "priority") {
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          data.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        }

        setTasks(data);
      } catch (err) {
        console.error("Fetch tasks error:", err.response?.data || err.message);
      }
    };

    fetchTasks();
  }, [reload, statusFilter, search, sortBy]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      {/* 🔹 Task Form */}
      <TaskForm refreshTasks={refreshTasks} />

      {/* 🔹 Filters */}
      <div className="flex flex-wrap gap-2 my-4">
        <select
          className="border p-1 rounded"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="in progress">In Progress</option>
        </select>

        <input
          type="text"
          placeholder="Search tasks..."
          className="border p-1 rounded flex-1"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="border p-1 rounded"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="deadline">Deadline</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* 🔹 Task List */}
      <TaskList tasks={tasks} refreshTasks={refreshTasks} />
    </div>
  );
}

export default Tasks;