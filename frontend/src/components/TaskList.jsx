import { useState } from "react";
import API from "../api/api";

function TaskList({ tasks, refreshTasks }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const handleDelete = async (id) => {
    await API.delete(`/tasks/${id}`);
    refreshTasks();
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditData({
      title: task.title,
      description: task.description,
      deadline: task.deadline?.slice(0, 10),
    });
  };

  const handleUpdate = async (id) => {
    await API.put(`/tasks/${id}`, editData);
    setEditingId(null);
    refreshTasks();
  };

  return (
    <div className="mt-6 space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="p-4 bg-white rounded shadow flex justify-between items-center"
        >
          {editingId === task._id ? (
            <div className="flex-1 space-y-2">
              <input
                className="border p-1 w-full"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
              <input
                className="border p-1 w-full"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
              <input
                type="date"
                className="border p-1 w-full"
                value={editData.deadline}
                onChange={(e) =>
                  setEditData({ ...editData, deadline: e.target.value })
                }
              />

              <button
                onClick={() => handleUpdate(task._id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <div>
                <h3 className="font-bold">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-xs text-gray-500">{task.deadline?.slice(0, 10)}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(task)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
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
