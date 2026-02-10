function TaskList({ tasks }) {
  if (tasks.length === 0) return <p className="text-gray-500">No tasks yet.</p>;

  return (
    <div className="flex flex-col gap-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white flex flex-col gap-1"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
            <span
              className={`text-sm font-medium px-2 py-1 rounded ${
                task.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {task.status}
            </span>
          </div>
          {task.description && <p className="text-gray-600">{task.description}</p>}
          {task.deadline && (
            <p className="text-gray-500 text-sm">
              Deadline: {task.deadline.substring(0, 10)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default TaskList;
