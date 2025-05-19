import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, Auth, getAuth } from "firebase/auth";
import { User, UserRole } from "../types";
import { db } from "@/integrations/firebase/firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const auth = getAuth();

interface AuthContextType {
  user: FirebaseUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // The redirection logic based on profile data is now handled in the Login page's useEffect
  // const redirectToRoleDashboard = async (uid: string) => { ... };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
      // The Login page's useEffect now handles redirection based on user and profile state
    });
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        // Profile existence check and creation logic moved out of AuthContext
        // The Login page is responsible for fetching the profile and handling its absence.
      }
      // No explicit redirection here; the Login page handles it based on state changes

    } catch (error: any) {
      console.error("Error during sign-in:", error);
      throw error; // Re-throw the error to be caught by the LoginForm
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      if (firebaseUser) {
        await setDoc(doc(db, "profiles", firebaseUser.uid), {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: name,
          role: role,
          approval_pending: false, // New users are directly approved
          approved: true, // New users are directly approved
          created_at: serverTimestamp(),
        });
        // Redirection is now handled by the Login page based on the state
        // redirectToRoleDashboard(firebaseUser.uid);
      }
    } catch (error: any) {
      console.error("Error during sign-up:", error);
      throw error; // Re-throw the error to be caught by the SignUpForm
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error("Error during sign-out:", error);
      // Handle error appropriately
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
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
