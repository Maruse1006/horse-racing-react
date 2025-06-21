// context/AuthContext.tsx
import { createContext } from "react";

type AuthContextType = {
  login: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
