import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, Auth, getAuth } from "firebase/auth";
import { User, UserRole } from "../types"; // Assuming you still have your User type
import { db } from "@/integrations/firebase/firebase"; // Import the initialized Firebase app and db
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // Import Firestore functions

// Removed getAuth(app) as db is already imported from firebase.ts
const auth = getAuth(); // Initialize Firebase Auth using the default app

interface AuthContextType {
  user: FirebaseUser | null; // Use Firebase's User type
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, role: UserRole, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    if (firebaseUser) {
      // Create a profile document in Firestore
      await setDoc(doc(db, "profiles", firebaseUser.uid), {
        id: firebaseUser.uid, // Store UID as 'id' field
        email: firebaseUser.email, // Store email
        name: name,
        role: role,
        approved: false, // New users are initially not approved
        approval_pending: true, // New users are initially pending approval
        onboarding_completed: false, // New users haven't completed onboarding
        onboarding_step: 0, // Start at step 0
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        // Add other profile fields as needed (e.g., first_name, last_name, department, position, hire_date, avatar_url)
      });
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
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
