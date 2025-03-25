import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { apiLoginUser } from "../api/auth";
import { apiRegisterUser } from "../api/auth";

export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if(storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
  }, [localStorage.getItem("user")]);


  const loginUser = async (email, password) => {
    const data = await apiLoginUser(email, password);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    setUser(data.user);
    console.log("User saved:", data.user);
  };

  const registerUser = async (firstName, lastName, email, password
  ) => {
    const data = await apiRegisterUser(firstName, lastName, email, password);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  const logoutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log("removing user from local storage");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}