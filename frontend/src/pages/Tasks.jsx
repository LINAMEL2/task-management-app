import { useEffect, useState } from "react";
import API from "../api/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  // This function can still be used for refreshing tasks
  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    // Define async function **inside useEffect**
    const fetch = async () => {
      await fetchTasks();
    };
    fetch();
  }, []); // ✅ No dependencies, ESLint happy

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">My Tasks</h1>
        <TaskForm refreshTasks={fetchTasks} /> {/* still reusable */}
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}

export default Tasks;
