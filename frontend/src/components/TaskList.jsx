import React, { useState } from "react";
import API from "../api/api";

function TaskList({ tasks, refreshTasks }) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [message, setMessage] = useState(null); // message de confirmation ou erreur
  const [messageType, setMessageType] = useState(""); // "success" ou "error"

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      showMessage("Task deleted successfully!", "success");
      refreshTasks();
    } catch (err) {
      console.error("Delete task error:", err.response?.data || err.message);
      showMessage("Error deleting task", "error");
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

  const handleSave = async (id) => {
    try {
      await API.put(`/tasks/${id}`, {
        title: editedTitle,
        description: editedDescription,
      });
      showMessage("Task updated successfully!", "success");
      setEditingTaskId(null);
      refreshTasks();
    } catch (err) {
      console.error("Save task error:", err.response?.data || err.message);
      showMessage("Error saving task", "error");
    }
  };

  const toggleStatus = async (task) => {
    try {
      const newStatus = task.status === "completed" ? "in progress" : "completed";
      await API.put(`/tasks/${task._id}`, { status: newStatus });
      showMessage(`Task marked as ${newStatus}`, "success");
      refreshTasks();
    } catch (err) {
      console.error("Toggle status error:", err.response?.data || err.message);
      showMessage("Error toggling task status", "error");
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-2 rounded text-white ${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}

      {tasks.map((task) => (
        <div
          key={task._id}
          className="flex flex-col md:flex-row justify-between items-start md:items-center border p-4 rounded bg-gray-50"
        >
          {editingTaskId === task._id ? (
            <>
              <input
                className="border p-2 rounded mb-2 md:mb-0 md:mr-2 flex-1"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <input
                className="border p-2 rounded mb-2 md:mb-0 md:mr-2 flex-1"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => handleSave(task._id)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                  onClick={() => setEditingTaskId(null)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p>{task.description}</p>
                <p className="text-sm text-gray-600">
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    task.status === "completed" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {task.status}
                </p>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => toggleStatus(task)}
                >
                  Toggle Status
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TaskList;
