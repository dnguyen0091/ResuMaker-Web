import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { user, loginUser, registerUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if(user) {
      setSuccess("Already Logged In");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    console.log("Submitting");
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if(isLogin) {
        await loginUser(login, password);
      } else {
        await registerUser(firstName, lastName, login, password);
      }
      
      navigate("/dashboard");
    } catch (error) {
      setError("Authentication failed. Please try again.");
      console.error("Auth error:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96">
        <LoginToggle isLogin={isLogin} setIsLogin={setIsLogin} />

        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border p-2 rounded mb-2"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border p-2 rounded mb-2"
              required
            />
          </>
        )}

        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white p-2 rounded ${
            user ? "bg-gray-300 text-black" : "hover:bg-blue-600"
          }`}
          disabled={!!user}>
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}

function LoginToggle({
  isLogin,
  setIsLogin,
}) {
  return (
    <div className="mb-4">
      <button
        type="button"
        className={`px-4 py-2 ${
          isLogin ? "bg-blue-500 text-white" : "bg-gray-300"
        } rounded-l`}
        onClick={() => setIsLogin(true)}>
        Login
      </button>
      <button
        type="button"
        className={`px-4 py-2 ${
          !isLogin ? "bg-blue-500 text-white" : "bg-gray-300"
        } rounded-r`}
        onClick={() => setIsLogin(false)}>
        Register
      </button>
    </div>
  );
}
