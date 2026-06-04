"use client";

import { createContext } from "react";

export type User = {
  id: string;
  full_name: string;
  email: string;
  employee_id: string;
  role: string;
  is_active: boolean;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);