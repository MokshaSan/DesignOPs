import { createContext, useContext, useState, ReactNode } from 'react';
import type { User, Role } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (userId: string) => {
    const found = MOCK_USERS.find(u => u.id === userId);
    if (found) setUser(found);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useRequireRole(role: Role) {
  const { user } = useAuth();
  return user?.role === role;
}
