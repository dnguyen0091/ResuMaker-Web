import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { user, loginUser, registerUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
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
        await loginUser(email, password);
      } else {
        await registerUser(firstName, lastName, email, password);
      }
      
      navigate("/");
    } catch (error) {
      setError("Authentication failed. Please try again.");
      console.error("Auth error:", error);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center">

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
