import { useState } from "react";
import API from "../api/api";

function TaskForm({ refreshTasks }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };






  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("SUBMIT CLICKED", form); // 👈 test

  try {
    await API.post("/tasks", form);
    setForm({ title: "", description: "", deadline: "" });
    refreshTasks();
  } catch (err) {
    console.error("ADD TASK ERROR:", err.response?.data || err.message);
  }
};





  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-4 rounded-lg shadow mb-6 flex flex-col gap-3"
    >
      <h2 className="text-lg font-semibold text-gray-700">Create New Task</h2>

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        className="border border-gray-300 rounded px-3 py-2"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2"
      />

      <input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
