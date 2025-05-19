import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
// import { supabase } from '@/integrations/supabase/client'; // Remove Supabase import
import { db } from '@/integrations/firebase/firebase'; // Import Firestore
import { doc, getDoc, updateDoc, collection, query, where, addDoc, deleteDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import { useAuth } from '@/contexts/AuthContext';
import { Profile, OnboardingTask, UserOnboardingProgress, DepartmentType } from '@/types/onboarding';
import { toast } from '@/hooks/use-toast';
import { serverTimestamp } from 'firebase/firestore';

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

// Mock data for development (will be replaced with Firebase fetches)
const mockTasks: OnboardingTask[] = [
  {
    id: '1',
    department: 'engineering',
    title: 'Complete company orientation',
    description: 'Learn about company history, values, and policies',
    estimated_time: '2 hours',
    sequence_order: 1,
    is_required: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    department: 'engineering',
    title: 'Set up development environment',
    description: 'Install necessary tools and gain access to repositories',
    estimated_time: '3 hours',
    sequence_order: 2,
    is_required: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    department: 'engineering',
    title: 'Meet with team members',
    description: 'Schedule 1:1 meetings with each team member',
    estimated_time: '1 hour',
    sequence_order: 3,
    is_required: false,
    created_at: new Date().toISOString()
  }
];

const mockProgress: UserOnboardingProgress[] = [
  {
    id: '1',
    user_id: '1',
    task_id: '1',
    completed: true,
    completed_at: new Date().toISOString(),
    notes: 'Completed orientation with HR',
    created_at: new Date().toISOString()
  }
];

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<OnboardingTask[]>(mockTasks); // Using mock data initially
  const [progress, setProgress] = useState<UserOnboardingProgress[]>(mockProgress); // Using mock data initially

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
      await updateDoc(profileRef, {
        ...data,
        updated_at: serverTimestamp(), // Update timestamp on change
      });

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

  // Fetch onboarding tasks from Firestore (replace mock data logic)
  const fetchOnboardingTasks = useCallback(async () => {
    try {
      // We now rely on the profile state being set by fetchUserProfile in the effect
      if (!profile || !profile.department) {
         // If no profile or department, clear tasks and return
        setTasks([]);
        return;
      }

      console.log('Fetching onboarding tasks for department:', profile.department);
      // TODO: Implement fetching tasks from Firestore based on profile.department
      // Example: const tasksColRef = collection(db, 'onboarding_tasks');
      // const q = query(tasksColRef, where('department', '==', profile.department));
      // const querySnapshot = await getDocs(q);
      // const fetchedTasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as OnboardingTask }));
      // setTasks(fetchedTasks);

      // For now, continue using filtered mock tasks
      const filteredTasks = mockTasks.filter(
        task => task.department === profile.department
      );
      setTasks(filteredTasks);

    } catch (error) {
      console.error('Error fetching tasks:', error);
       setTasks([]); // Clear tasks on error
    }
  }, [profile]); // Dependency: profile

  // Fetch user progress from Firestore (replace mock data logic)
  const fetchUserProgress = useCallback(async () => {
    try {
      if (!user?.uid) {
        setProgress([]); // Clear progress if no user
        return;
      }
      console.log('Fetching user progress for user:', user.uid);
      // TODO: Implement fetching user progress from Firestore
      // Example: const progressColRef = collection(db, 'user_onboarding_progress');
      // const q = query(progressColRef, where('user_id', '==', user.uid));
      // const querySnapshot = await getDocs(q);
      // const fetchedProgress = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as UserOnboardingProgress }));
      // setProgress(fetchedProgress);

      // For now, continue using mock progress data (consider filtering by user.id if mock data had more users)
       setProgress(mockProgress); // Using mock data initially

    } catch (error) {
      console.error('Error fetching user progress:', error);
      setProgress([]); // Clear progress on error
    }
  }, [user]); // Dependency: user

  // Start a task in Firestore (replace mock data logic)
  const startTask = async (taskId: string) => {
    try {
      if (!user?.uid) return;

      // Check if progress already exists locally (for immediate UI update)
      const existingProgress = progress.find(p => p.task_id === taskId && p.user_id === user.uid);
      if (existingProgress) return; // Progress already exists, no need to create

      console.log(`Starting task ${taskId} for user ${user.uid} in Firestore...`);
      // TODO: Implement creating user onboarding progress document in Firestore
      // Example: await addDoc(collection(db, 'user_onboarding_progress'), {
      //   user_id: user.uid,
      //   task_id: taskId,
      //   completed: false,
      //   created_at: serverTimestamp(),
      //   // Add other relevant fields
      // });

       // Optimistically update local state (will be overridden by fetchUserProgress later)
       const newProgressItem = { // Create a temporary ID
            id: `${taskId}-${user.uid}-${Date.now()}`,
            user_id: user.uid,
            task_id: taskId,
            completed: false,
            completed_at: null,
            notes: null,
            created_at: new Date().toISOString(), // Use current date for local state
            // task: {} as OnboardingTask // You might need to fetch or include task details
        };
       setProgress(prev => [...prev, newProgressItem]);

    } catch (error) {
      console.error('Error starting task:', error);
       // Revert local state if Firestore update fails (optional but good practice)
       setProgress(prev => prev.filter(p => p.task_id !== taskId || p.user_id !== user.uid || p.completed !== false)); // Basic revert
    }
  };

  // Complete a task in Firestore (replace mock data logic)
  const completeTask = async (taskId: string, notes?: string) => {
    try {
      if (!user?.uid) return;

      // Find the progress document (assuming you fetch progress into state)
      const progressItem = progress.find(p => p.task_id === taskId && p.user_id === user.uid);

       if (!progressItem) {
            // If progress item doesn't exist, create it and mark as completed
            console.log(`Progress for task ${taskId} not found, creating and completing.`);
             // TODO: Implement creating a completed progress document in Firestore
             // Example: await addDoc(collection(db, 'user_onboarding_progress'), {
             //   user_id: user.uid,
             //   task_id: taskId,
             //   completed: true,
             //   completed_at: serverTimestamp(),
             //   notes: notes || null,
             //   created_at: serverTimestamp(),
             // });
        } else {
             // If progress item exists, update it
            console.log(`Completing task ${taskId} for user ${user.uid} in Firestore...`);
            // TODO: Implement updating user onboarding progress document in Firestore
            // Example: const progressDocRef = doc(db, 'user_onboarding_progress', progressItem.id); // Assuming progressItem.id is the Firestore doc ID
            // await updateDoc(progressDocRef, {
            //   completed: true,
            //   completed_at: serverTimestamp(),
            //   notes: notes || null,
            // });
        }

      // Optimistically update local state
      const updatedProgress = progress.map(p =>
        p.task_id === taskId && p.user_id === user.uid
          ? {
              ...p,
              completed: true,
              completed_at: new Date().toISOString(), // Use current date for local state
              notes: notes || p.notes
            }
          : p
      );
      setProgress(updatedProgress);

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
        await fetchUserProgress(); // Fetch the actual state from Firestore
    }
  };

  // Uncomplete a task in Firestore (replace mock data logic)
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
      // TODO: Implement updating user onboarding progress document in Firestore to mark as incomplete
      // Example: const progressDocRef = doc(db, 'user_onboarding_progress', progressItem.id); // Assuming progressItem.id is the Firestore doc ID
      // await updateDoc(progressDocRef, {
      //   completed: false,
      //   completed_at: null,
      // });

      // Optimistically update local state
      const updatedProgress = progress.map(p =>
        p.task_id === taskId && p.user_id === user.uid
          ? {
              ...p,
              completed: false,
              completed_at: null
            }
          : p
      );
      setProgress(updatedProgress);

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
        await fetchUserProgress(); // Fetch the actual state from Firestore
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
