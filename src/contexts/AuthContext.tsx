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
      const data = docSnap.data() as { role: string | undefined, approval_pending?: boolean, approved?: boolean }; // Added approval_pending and approved types
      const role = data?.role;
      const approvalPending = data?.approval_pending;
      const approved = data?.approved;

      if (approvalPending) {
        console.log("User pending approval, redirecting to waiting approval page");
        navigate('/waiting-approval');
      } else if (approved) {
         if (!role) {
           console.warn("No role found for approved user. Redirecting to general dashboard.");
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
      } else {
         // User was rejected or in an unknown state, log them out or show error
         console.log("User was rejected or in unknown profile state.");
         // Optionally sign out or show an error message on the login page
         navigate('/login'); // Redirect back to login
      }
    } else {
      // No profile exists, redirect to a profile creation/onboarding page or handle as needed
      console.log("No profile found for user, redirecting to initial setup.");
      // Depending on your flow, you might redirect to a page to create the profile
      // For now, let's just log a warning, as the login page should handle missing profiles
       console.warn("Profile document does not exist for user:", uid);
        // We won't redirect here, letting the Login page handle the absence of a profile initially.
        // The Login page will detect no profile and can show an error or redirect to signup if needed.
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
      // Redirection logic is now handled in the Login page based on user and profile state
      // if (firebaseUser) {
      //   redirectToRoleDashboard(firebaseUser.uid);
      // }
    });
    return () => unsubscribe();
  }, []); // Removed navigate dependency as redirection is not happening here anymore

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        const profileRef = doc(db, "profiles", firebaseUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (!profileSnap.exists()) {
          console.log("No profile found after sign-in, creating a basic one.");
          // Create a basic profile if it doesn't exist
          await setDoc(profileRef, {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            role: "user", // Assign a default role
            approval_pending: true, // Default to pending approval
            approved: false,
            created_at: serverTimestamp(),
          });
        }
        // Redirection is now handled by the Login page based on the state
        // redirectToRoleDashboard(firebaseUser.uid);
      }
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
          approval_pending: true, // New users are pending approval
          approved: false,
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
