
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, UserRole } from "../types";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create a User object from Supabase data
const createUserFromSupabase = (supabaseUser: any, profile: any): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    role: profile?.role || 'user',
    name: profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}` 
      : profile?.name || supabaseUser.email.split('@')[0],
    profileImage: profile?.avatar_url
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize with a null user and loading state
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effects must be inside the component body
  useEffect(() => {
    // Set up an auth state listener before checking current session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Handle auth state change synchronously first
        setIsLoading(true);
        
        if (session?.user) {
          try {
            // Fetch the user profile on auth state change
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            setUser(createUserFromSupabase(session.user, profile));
          } catch (error) {
            console.error("Error fetching user profile:", error);
          } finally {
            setIsLoading(false);
          }
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );
    
    // Check if the user is already logged in after setting up listener
    const checkCurrentUser = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // If there's a session, fetch the user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          // Create a User object
          setUser(createUserFromSupabase(session.user, profile));
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkCurrentUser();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // The auth state change listener will update the user state
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      // Don't set isLoading to false here - let the auth state change handle it
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, name: string) => {
    setIsLoading(true);
    try {
      // Extract first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            name,
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (error) throw error;
      
      // Create a profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email,
            role,
            first_name: firstName,
            last_name: lastName,
            name, // Add name field explicitly
            department: role, // Using role as the initial department
            approval_pending: true,
            approved: false,
            onboarding_completed: false,
            onboarding_step: 0
          });
        
        if (profileError) throw profileError;
        
        // Create a User object
        const newUser: User = {
          id: data.user.id,
          email,
          role,
          name
        };
        
        setUser(newUser);
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
    return Promise.resolve();
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut
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
