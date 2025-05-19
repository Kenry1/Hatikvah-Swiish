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

  const redirectToRoleDashboard = async (uid: string) => {
    const docRef = doc(db, "profiles", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as { role: string | undefined };
      const role = data?.role;

      if (!role) {
        console.warn("No role found for user. Redirecting to general dashboard.");
        navigate("/dashboard/general");
        return;
      }

      switch (role.toLowerCase()) {
        case "hr":
          navigate("/dashboard/hr");
          break;
        case "it":
          navigate("/dashboard/it");
          break;
        case "technician":
          navigate("/dashboard/technician");
          break;
        case "warehouse":
          navigate("/dashboard/warehouse");
          break;
        case "logistics":
          navigate("/dashboard/logistics");
          break;
        case "implementation_manager":
          navigate("/dashboard/implementation_manager");
          break;
        case "project_manager":
          navigate("/dashboard/project_manager");
          break;
        case "planning":
          navigate("/dashboard/planning");
          break;
        case "finance":
          navigate("/dashboard/finance");
          break;
        case "management":
          navigate("/dashboard/management");
          break;
        case "ehs":
          navigate("/dashboard/ehs");
          break;
        case "procurement":
          navigate("/dashboard/procurement");
          break;
        default:
          navigate("/dashboard/general");
          break;
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
      if (firebaseUser) {
        redirectToRoleDashboard(firebaseUser.uid);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      redirectToRoleDashboard(userCredential.user.uid);
    } catch (error: any) {
      console.error("Error during sign-in:", error);
      // Handle error appropriately, e.g., display an error message to the user
      throw error; // Re-throw the error to be caught by the LoginForm
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "profiles", userCredential.user.uid), {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name: name,
        role: role,
        created_at: serverTimestamp(),
      });
      redirectToRoleDashboard(userCredential.user.uid);
    } catch (error: any) {
      console.error("Error during sign-up:", error);
      // Handle error appropriately, e.g., display an error message to the user
      throw error; // Re-throw the error to be caught by the SignUpForm
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error("Error during sign-out:", error);
      // Handle error appropriately, e.g., display an error message to the user
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
