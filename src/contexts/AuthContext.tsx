
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const mockUsers = {
  technician: {
    id: "tech-123",
    email: "tech@swiish.com",
    role: "technician" as UserRole,
    name: "Alex Technician"
  },
  warehouse: {
    id: "warehouse-123",
    email: "warehouse@swiish.com",
    role: "warehouse" as UserRole,
    name: "Sam Warehouse"
  },
  logistics: {
    id: "logistics-123",
    email: "logistics@swiish.com",
    role: "logistics" as UserRole,
    name: "Jordan Logistics"
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for saved user
    const savedUser = localStorage.getItem('swiishUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would make a Supabase call
      // For now, mock successful login with a demo user
      if (email === 'tech@swiish.com') {
        setUser(mockUsers.technician);
        localStorage.setItem('swiishUser', JSON.stringify(mockUsers.technician));
      } else if (email === 'warehouse@swiish.com') {
        setUser(mockUsers.warehouse);
        localStorage.setItem('swiishUser', JSON.stringify(mockUsers.warehouse));
      } else if (email === 'logistics@swiish.com') {
        setUser(mockUsers.logistics);
        localStorage.setItem('swiishUser', JSON.stringify(mockUsers.logistics));
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // In a real app, this would make a Supabase call
      // For now, mock successful registration
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        role,
        name: email.split('@')[0]
      };
      setUser(newUser);
      localStorage.setItem('swiishUser', JSON.stringify(newUser));
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    // In a real app, this would make a Supabase call
    localStorage.removeItem('swiishUser');
    setUser(null);
    return Promise.resolve();
  };

  const demoLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      // Use the mock user for the selected role
      const demoUser = mockUsers[role];
      setUser(demoUser);
      localStorage.setItem('swiishUser', JSON.stringify(demoUser));
    } catch (error) {
      console.error("Demo login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    demoLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
