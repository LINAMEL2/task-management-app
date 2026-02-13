import { useState } from "react";
import API from "../api/api";

function TaskForm({ refreshTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", { title, description, deadline });

      setTitle("");
      setDescription("");
      setDeadline("");

      refreshTasks(); // recharge la liste
    } catch (err) {
      console.error("Add task error:", err);
      alert("Error adding task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border p-4 rounded">
      <input
        type="text"
        placeholder="Title"
        className="border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        className="border p-2 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        className="border p-2 rounded"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
