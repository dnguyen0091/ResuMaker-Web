import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if(!user) {
    return <div className="flex justify-center items-center h-screen">
      <p className="text-xl font-semibold text-gray-600">Redirecting to login...</p>
    </div>
  }

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold text-orange-600 mb-8">Dashboard</h2>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <h3 className="text-2xl font-bold mb-2">User Details</h3>
        <p className="text-lg">
          <span className="font-semibold">Name:</span> {user.firstName} {user.lastName}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Email:</span> {user.login}
        </p>
      </div>
    </div>
  )
}