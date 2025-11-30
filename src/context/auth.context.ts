import { createContext } from "react";
import type { UserInterface } from "@/interfaces/user.interface";

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: UserInterface) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
