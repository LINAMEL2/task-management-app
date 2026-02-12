import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-gray-900 text-white">
      <h1 className="text-lg font-bold cursor-pointer" onClick={() => navigate("/")}>
        TaskManager
      </h1>

      <div className="flex gap-4">
        {!token && (
          <>
            <button onClick={() => navigate("/login")} className="hover:text-blue-400">
              Login
            </button>
            <button onClick={() => navigate("/register")} className="hover:text-blue-400">
              Register
            </button>
          </>
        )}

        {token && (
          <>
            <button onClick={() => navigate("/tasks")} className="hover:text-blue-400">
              Tasks
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="text-red-400 hover:text-red-500"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
