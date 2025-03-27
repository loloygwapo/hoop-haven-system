
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Define user types
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Mock data for users
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    email: "user@example.com",
    password: "user123",
    name: "Regular User",
    role: "user" as UserRole,
  },
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is already logged in via localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("basketballUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function - in a real app, this would connect to a backend
  const login = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Find user with matching credentials
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Extract user data without the password
      const { password: _, ...userData } = foundUser;
      
      // Set user state and store in localStorage
      setUser(userData);
      localStorage.setItem("basketballUser", JSON.stringify(userData));
      
      toast.success(`Welcome back, ${userData.name}`);
      return true;
    }

    toast.error("Invalid email or password");
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("basketballUser");
    toast.success("Successfully logged out");
  };

  // Register function - in a real app, this would connect to a backend
  const register = async (email: string, password: string, name: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if user already exists
    if (MOCK_USERS.some((u) => u.email === email)) {
      toast.error("Email already in use");
      return false;
    }

    // Create a new user and log them in
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      email,
      name,
      role: "user" as UserRole,
    };

    setUser(newUser);
    localStorage.setItem("basketballUser", JSON.stringify(newUser));
    
    toast.success("Registration successful");
    return true;
  };

  // Admin check
  const isAdmin = user?.role === "admin";

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
