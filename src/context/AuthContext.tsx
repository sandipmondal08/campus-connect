import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (data: RegisterData) => boolean;
  logout: () => void;
  allUsers: User[];
  deleteUser: (id: string) => void;
  blockUser: (id: string) => void;
  resetUserPassword: (userId: string, newPassword: string) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty';
  department: string;
  hostel?: string;
}

interface UserWithPassword extends User {
  password: string;
}

const MOCK_USERS: UserWithPassword[] = [
  { id: 'admin-1', name: 'Sandip Mondal', email: 'sandipmondal2506@gmail.com', role: 'admin', department: 'Administration', password: 'Sandip@123' },
  { id: 'team-1', name: 'Rajesh Kumar', email: 'rajesh@college.edu', role: 'team', department: 'Maintenance', password: 'Team@123' },
  { id: 'team-2', name: 'Priya Sharma', email: 'priya@college.edu', role: 'team', department: 'IT Support', password: 'Team@123' },
  { id: 'team-3', name: 'Suresh Patel', email: 'suresh@college.edu', role: 'team', department: 'Hostel Management', password: 'Team@123' },
  { id: 'user-1', name: 'Amit Singh', email: 'amit@student.edu', role: 'student', department: 'Computer Science', hostel: 'Block A', password: 'Student@123' },
  { id: 'user-2', name: 'Dr. Meena Gupta', email: 'meena@faculty.edu', role: 'faculty', department: 'Electronics', password: 'Faculty@123' },
  { id: 'user-3', name: 'Riya Verma', email: 'riya@student.edu', role: 'student', department: 'Mechanical', hostel: 'Block B', password: 'Student@123' },
];

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const login = useCallback((email: string, _password: string) => {
    const found = users.find((u) => u.email === email && !u.blocked);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }, [users]);

  const register = useCallback((data: RegisterData) => {
    if (users.find((u) => u.email === data.email)) return false;
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      hostel: data.hostel,
    };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return true;
  }, [users]);

  const logout = useCallback(() => setUser(null), []);
  const deleteUser = useCallback((id: string) => setUsers((prev) => prev.filter((u) => u.id !== id)), []);
  const blockUser = useCallback((id: string) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, blocked: !u.blocked } : u)), []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, allUsers: users, deleteUser, blockUser }}>
      {children}
    </AuthContext.Provider>
  );
};
