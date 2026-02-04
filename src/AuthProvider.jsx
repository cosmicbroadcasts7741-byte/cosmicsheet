// AuthProvider.jsx
import { useState, createContext, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
  });

  const login = (username, password) => {
    console.log("AuthProvider login method");

    // Load saved user from localStorage
    const savedUser = JSON.parse(localStorage.getItem("savedUser"));
    if (savedUser && savedUser.email === username) {
      setUser({
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        mobileNumber: savedUser.mobileNumber,
      });
      return true;
    } else {
      console.error("Invalid username");
      return false;
    }
  };

  const logout = () =>
    setUser({
      email: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
    });

  return (
    <AuthContext.Provider value={{ ...user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
