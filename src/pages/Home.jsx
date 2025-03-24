import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-500">
      <h1 className="text-4xl font-bold text-orange-600">Home</h1>
      <button
        onClick={() => navigate("/auth")}
      >Auth</button>
    </div>
  )
}