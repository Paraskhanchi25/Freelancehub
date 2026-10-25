import { useState } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./AuthContextInstance";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading] = useState(false);

  const login = async (email, password) => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signup = async (userData) => {
    const newUser = await authService.signup(userData);
    setUser(newUser);
    return newUser;
  };

  const updateProfile = async (updatedFields) => {
    if (!user) return null;
    const updated = await authService.updateUser(user.id, updatedFields);
    setUser(updated);
    return updated;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
