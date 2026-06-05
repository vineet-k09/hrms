"use client";

import { useEffect, useState } from "react";
import { AuthContext, User } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedToken = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("user");

  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
  } else {
    setToken(null);
    setUser(null);
  }


}, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setLoading(false);
  };

   return (
  <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!token, login, logout }}>
    {children}
  </AuthContext.Provider>
);
}