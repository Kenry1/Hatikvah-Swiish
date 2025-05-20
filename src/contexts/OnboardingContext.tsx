import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { db } from '@/integrations/firebase/firebase'; // Import Firestore
import { doc, getDoc, updateDoc, collection, query, where, addDoc, deleteDoc, getDocs } from 'firebase/firestore'; // Import necessary Firestore functions, including getDocs
import { useAuth } from '@/contexts/AuthContext';
import { Profile, OnboardingTask, UserOnboardingProgress, DepartmentType } from '@/types/onboarding';
import { toast } from '@/hooks/use-toast';
import { serverTimestamp } from 'firebase/firestore';
import { serialize } from '../utils/serialize'; // Import serialize

interface OnboardingContextProps {
  profile: Profile | null;
  loading: boolean;
  tasks: OnboardingTask[];
  progress: UserOnboardingProgress[];
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  updateUserOnboardingStep: (step: number) => Promise<void>;
  completeUserOnboarding: () => Promise<void>;
  fetchOnboardingTasks: () => Promise<void>;
  fetchUserProgress: () => Promise<void>;
  startTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string, notes?: string) => Promise<void>;
  uncompleteTask: (taskId: string) => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<OnboardingTask[]>([]); // Initialize with empty array
  const [progress, setProgress] = useState<UserOnboardingProgress[]>([]); // Initialize with empty array

  // Fetch the user profile from Firestore
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!user?.uid) return;

      const profileRef = doc(db, 'profiles', user.uid);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        console.error('No profile found for user:', user.uid);
        setProfile(null);
        return;
      }

      // Map Firestore data to Profile type
      const data = profileSnap.data();
      const profileData: Profile = {
        id: user.uid,
        first_name: data?.first_name || null,
        last_name: data?.last_name || null,
        email: data?.email || user.email || null,
        department: data?.department as DepartmentType || null,
        role: data?.role || 'user',
        position: data?.position || null,
        hire_date: data?.hire_date || null,
        onboarding_completed: data?.onboarding_completed || false,
        onboarding_step: data?.onboarding_step || 0,
        avatar_url: data?.avatar_url || null,
        created_at: data?.created_at?.toDate()?.toISOString() || new Date().toISOString(), // Convert Firestore Timestamp to string
        updated_at: data?.updated_at?.toDate()?.toISOString() || new Date().toISOString(), // Convert Firestore Timestamp to string
        name: (data?.first_name && data?.last_name) ? `${data.first_name} ${data.last_name}` : null,
      };

      setProfile(profileData);
       // Return the profile data so the effect can use it
       return profileData; // Return the fetched profile data
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
       return null; // Return null on error
    }
  }, [user]); // Dependency: user

  // Update the user profile in Firestore
  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user?.uid || !profile) return;

      setLoading(true);

      const profileRef = doc(db, 'profiles', user.uid);
      const serializedData = serialize({
        ...data,
        updated_at: serverTimestamp(),
      });
      await updateDoc(profileRef, serializedData);

      // Update local state after successful Firestore update
      setProfile({ ...profile, ...data });

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });

    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Profile Update Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update the user onboarding step in Firestore
  const updateUserOnboardingStep = async (step: number) => {
    if (!user?.uid || !profile) return;

    await updateProfile({ onboarding_step: step });
  };

  // Complete user onboarding in Firestore
  const completeUserOnboarding = async () => {
    if (!user?.uid || !profile) return;

    await updateProfile({ onboarding_completed: true, onboarding_step: 100 }); // Assuming 100 means completed
  };

  // Fetch onboarding tasks from Firestore
  const fetchOnboardingTasks = useCallback(async () => {
    try {
      if (!profile || !profile.department) {
        setTasks([]);
        return;
      }

      console.log('Fetching onboarding tasks for department:', profile.department);
      const tasksColRef = collection(db, 'onboarding_tasks');
      const q = query(tasksColRef, where('department', '==', profile.department));
      const querySnapshot = await getDocs(q);
      const fetchedTasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as OnboardingTask
      }));
      setTasks(fetchedTasks);

    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]); // Clear tasks on error
    }
  }, [profile]); // Dependency: profile

  // Fetch user progress from Firestore
  const fetchUserProgress = useCallback(async () => {
    try {
      if (!user?.uid) {
        setProgress([]); // Clear progress if no user
        return;
      }
      console.log('Fetching user progress for user:', user.uid);
      const progressColRef = collection(db, 'user_onboarding_progress');
      const q = query(progressColRef, where('user_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedProgress = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as UserOnboardingProgress
      }));
      setProgress(fetchedProgress);

    } catch (error) {
      console.error('Error fetching user progress:', error);
      setProgress([]); // Clear progress on error
    }
  }, [user]); // Dependency: user

  // Start a task in Firestore
  const startTask = async (taskId: string) => {
    try {
      if (!user?.uid) return;

      // Check if progress already exists in state
      const existingProgress = progress.find(p => p.task_id === taskId && p.user_id === user.uid);
      if (existingProgress) {
         console.log(`Progress for task ${taskId} already exists.`);
         return; // Progress already exists, no need to create
      }

      console.log(`Starting task ${taskId} for user ${user.uid} in Firestore...`);
      const newProgressData = serialize({
        user_id: user.uid,
        task_id: taskId,
        completed: false,
        created_at: serverTimestamp(),
      });
      await addDoc(collection(db, 'user_onboarding_progress'), newProgressData);

      // After creating, refetch progress to update state
      await fetchUserProgress();

    } catch (error: any) {
      console.error('Error starting task:', error);
       toast({
        title: "Failed to Start Task",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Complete a task in Firestore
  const completeTask = async (taskId: string, notes?: string) => {
    try {
      if (!user?.uid) return;

      // Find the progress document (assuming you fetch progress into state)
      const progressItem = progress.find(p => p.task_id === taskId && p.user_id === user.uid);

       if (!progressItem) {
            // If progress item doesn't exist, create it and mark as completed
            console.log(`Progress for task ${taskId} not found, creating and completing.`);
             const newCompletedProgressData = serialize({
               user_id: user.uid,
               task_id: taskId,
               completed: true,
               completed_at: serverTimestamp(),
               notes: notes || null,
               created_at: serverTimestamp(),
             });
             await addDoc(collection(db, 'user_onboarding_progress'), newCompletedProgressData);
        } else {
             // If progress item exists, update it
            console.log(`Completing task ${taskId} for user ${user.uid} in Firestore...`);
            const updatedProgressData = serialize({
              completed: true,
              completed_at: serverTimestamp(),
              notes: notes || null,
            });
            // Assuming progressItem.id is the Firestore doc ID
            const progressDocRef = doc(db, 'user_onboarding_progress', progressItem.id);
            await updateDoc(progressDocRef, updatedProgressData);
        }

      // After completing/creating, refetch progress to update state
      await fetchUserProgress();

      // Show success toast
      toast({
        title: "Task Completed",
        description: "Your task has been marked as completed.",
      });

    } catch (error: any) {
      console.error('Error completing task:', error);
      toast({
        title: "Task Update Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
       // Revert local state if Firestore update fails (optional)
        // await fetchUserProgress(); // This is already done after successful update
    }
  };

  // Uncomplete a task in Firestore
  const uncompleteTask = async (taskId: string) => {
    try {
      if (!user?.uid) return;

       // Find the progress document (assuming you fetch progress into state)
      const progressItem = progress.find(p => p.task_id === taskId && p.user_id === user.uid);

       if (!progressItem) {
            console.warn(`Progress for task ${taskId} not found, cannot uncomplete.`);
            return;
       }

      console.log(`Uncompleting task ${taskId} for user ${user.uid} in Firestore...`);
      const updatedProgressData = serialize({
        completed: false,
        completed_at: null,
      });
      const progressDocRef = doc(db, 'user_onboarding_progress', progressItem.id); // Assuming progressItem.id is the Firestore doc ID
      await updateDoc(progressDocRef, updatedProgressData);

      // After updating, refetch progress to update state
      await fetchUserProgress();

      // Show success toast
      toast({
        title: "Task Updated",
        description: "Your task has been marked as incomplete.",
      });
    } catch (error: any) {
      console.error('Error uncompleting task:', error);
      toast({
        title: "Task Update Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
       // Revert local state if Firestore update fails (optional)
        // await fetchUserProgress(); // This is already done after successful update
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadOnboardingData = async () => {
      if (user) {
        setProfile(null); // Clear profile state when user changes, before fetching new one
        setLoading(true);
        try {
          const profileData = await fetchUserProfile(); // Await profile fetching and get returned data

          if (profileData) { // Only fetch tasks and progress if profile data is available
            await fetchOnboardingTasks(); // fetchOnboardingTasks now relies on the profile state
            await fetchUserProgress();
          }

        } catch (error) {
          console.error('Error during initial data fetch:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setTasks([]);
        setProgress([]);
        setLoading(false); // Ensure loading is set to false when no user
      }
    };

    loadOnboardingData();

  }, [user, fetchUserProfile, fetchOnboardingTasks, fetchUserProgress]); // Add all functions called inside as dependencies

  const value = {
    profile,
    loading,
    tasks,
    progress,
    updateProfile,
    fetchUserProfile,
    updateUserOnboardingStep,
    completeUserOnboarding,
    fetchOnboardingTasks,
    fetchUserProgress,
    startTask,
    completeTask,
    uncompleteTask
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }

  return context;
}
