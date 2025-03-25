import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/auth");

    // setTimeout(() => {
    //   window.location.reload();
    // }, 100);
  }

  return (
    <nav className="w-full bg-blue-600 p-4 shadow-md absolute">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          ResuMaker
        </Link>

        <div className="space-x-4 flex items-center">
          <Link to="/dashboard" className="text-white hover:underline">Dashboard</Link>
          <Link to="/resume" className="text-white hover:underline">Resume Builder</Link>

          {user && user.email !== "undefined" ? (
            <div className="relative group">
              <button className="text-white font-semibold hover:underline">
                {user.email + ""}
              </button>
              <div className="absolute right-0 mt-0 w-32 bg-white shadow-lg rounded hidden group-hover:block">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="text-white hover:underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}