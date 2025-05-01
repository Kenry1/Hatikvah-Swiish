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
  },
  hr: {
    id: "hr-123",
    email: "hr@swiish.com",
    role: "hr" as UserRole,
    name: "Taylor HR"
  },
  implementation_manager: {
    id: "im-123",
    email: "im@swiish.com",
    role: "implementation_manager" as UserRole,
    name: "Morgan Implementation"
  },
  project_manager: {
    id: "pm-123",
    email: "pm@swiish.com",
    role: "project_manager" as UserRole,
    name: "Casey Project"
  },
  planning: {
    id: "planning-123",
    email: "planning@swiish.com",
    role: "planning" as UserRole,
    name: "Riley Planning"
  },
  it: {
    id: "it-123",
    email: "it@swiish.com",
    role: "it" as UserRole,
    name: "Quinn IT"
  },
  finance: {
    id: "finance-123",
    email: "finance@swiish.com",
    role: "finance" as UserRole,
    name: "Jamie Finance"
  },
  management: {
    id: "management-123",
    email: "management@swiish.com",
    role: "management" as UserRole,
    name: "Pat Management"
  },
  ehs: {
    id: "ehs-123",
    email: "ehs@swiish.com",
    role: "ehs" as UserRole,
    name: "Drew EHS"
  },
  procurement: {
    id: "procurement-123",
    email: "procurement@swiish.com",
    role: "procurement" as UserRole,
    name: "John Doe Procurement"
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
      } else if (email === 'hr@swiish.com') {
        setUser(mockUsers.hr);
        localStorage.setItem('swiishUser', JSON.stringify(mockUsers.hr));
      } else if (email === 'im@swiish.com') {
        setUser(mockUsers.implementation_manager);
        localStorage.setItem('swiishUser', JSON.stringify(mockUsers.implementation_manager));
      } else if (email === 'pm@swiish.com') {
        setUser(mockUsers.project_manager);
        localStorage.setItem('swiishUser', JSON.stringify(mockUsers.project_manager));
      } else if (email === 'planning@swiish.com') {
        setUser(mockUsers.planning);
        localStorage.setItem('swiishUser', JSON.stringify(mockUsers.planning));
      } else if (email === 'it@swiish.com') {
        setUser(mockUsers.it);
        localStorage.setItem('swiishUser', JSON.stringify(mockUsers.it));
      } else if (email === 'finance@swiish.com') {
        setUser(mockUsers.finance);
        localStorage.setItem('swiishUser', JSON.stringify(mockUsers.finance));
      } else if (email === 'management@swiish.com') {
        setUser(mockUsers.management);
        localStorage.setItem('swiishUser', JSON.stringify(mockUsers.management));
      } else if (email === 'ehs@swiish.com') {
        setUser(mockUsers.ehs);
        localStorage.setItem('swiishUser', JSON.stringify(mockUsers.ehs));
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
