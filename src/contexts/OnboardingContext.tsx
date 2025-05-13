
import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Profile, OnboardingTask, UserOnboardingProgress, DepartmentType } from '@/types/onboarding';
import { toast } from '@/hooks/use-toast';

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

// Mock data for development
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
  const [tasks, setTasks] = useState<OnboardingTask[]>(mockTasks);
  const [progress, setProgress] = useState<UserOnboardingProgress[]>(mockProgress);

  // Fetch the user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      // Create a default profile if some fields are missing
      const profileData: Profile = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        department: data.department as DepartmentType | null,
        role: data.role || 'user',
        position: data.position || null,
        hire_date: data.hire_date || null,
        onboarding_completed: data.onboarding_completed || false,
        onboarding_step: data.onboarding_step || 0,
        avatar_url: data.avatar_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        name: data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : null,
      };
      
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user]);

  // Update the user profile
  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user || !profile) return;

      setLoading(true);
      
      // For now, just update the local state for development
      setProfile({ ...profile, ...data });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });

      // Uncomment this when Supabase tables are ready
      /*
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      
      if (error) {
        toast({
          title: "Profile Update Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setProfile({ ...profile, ...data });
      */
      
    } catch (error: any) {
      toast({
        title: "Profile Update Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update the user onboarding step
  const updateUserOnboardingStep = async (step: number) => {
    if (!user || !profile) return;
    
    await updateProfile({ onboarding_step: step });
  };

  // Complete user onboarding
  const completeUserOnboarding = async () => {
    if (!user || !profile) return;
    
    await updateProfile({ onboarding_completed: true, onboarding_step: 3 });
  };

  // Fetch onboarding tasks
  const fetchOnboardingTasks = async () => {
    try {
      if (!user || !profile || !profile.department) return;
      
      // For now, just filter mock tasks for the user's department
      const filteredTasks = mockTasks.filter(
        task => task.department === profile.department
      );
      
      setTasks(filteredTasks);
      
      // Uncomment this when Supabase tables are ready
      /*
      const { data, error } = await supabase
        .from('onboarding_tasks')
        .select('*')
        .eq('department', profile.department);
      
      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }
      
      // Map the data to match our OnboardingTask type
      const tasks: OnboardingTask[] = data.map(task => ({
        id: String(task.id),
        department: task.department as DepartmentType,
        title: task.title,
        description: task.description,
        estimated_time: task.estimated_time,
        sequence_order: task.sequence_order,
        is_required: task.is_required,
        required: task.is_required, // For backward compatibility
        order: task.sequence_order, // For backward compatibility
        created_at: task.created_at,
      }));
      
      setTasks(tasks);
      */
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Fetch user progress
  const fetchUserProgress = async () => {
    try {
      if (!user) return;
      
      // For demo, set mock progress data
      const mockProgressWithTasks = mockProgress.map(p => {
        const task = mockTasks.find(t => t.id === p.task_id);
        return { ...p, task };
      });
      
      setProgress(mockProgressWithTasks);
      
      // Uncomment this when Supabase tables are ready
      /*
      const { data, error } = await supabase
        .from('user_onboarding_progress')
        .select('*, task:task_id(*)')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching progress:', error);
        return;
      }
      
      // Map the data to match our UserOnboardingProgress type
      const progress: UserOnboardingProgress[] = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        task_id: item.task_id,
        completed: item.completed,
        completed_at: item.completed_at,
        notes: item.notes,
        created_at: item.created_at,
        task: item.task ? {
          id: String(item.task.id),
          department: item.task.department as DepartmentType,
          title: item.task.title,
          description: item.task.description,
          estimated_time: item.task.estimated_time,
          sequence_order: item.task.sequence_order,
          is_required: item.task.is_required,
          required: item.task.is_required,
          order: item.task.sequence_order,
          created_at: item.task.created_at,
        } : undefined,
      }));
      
      setProgress(progress);
      */
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  // Start a task
  const startTask = async (taskId: string) => {
    try {
      if (!user) return;
      
      // Check if progress already exists
      const existingProgress = progress.find(p => p.task_id === taskId);
      
      if (existingProgress) return; // Progress already exists, no need to create
      
      const newProgress = {
        id: `${Date.now()}`,
        user_id: user.id,
        task_id: taskId,
        completed: false,
        completed_at: null,
        notes: null,
        created_at: new Date().toISOString(),
      };
      
      // For development, just update local state
      setProgress([...progress, newProgress]);
      
      // Uncomment this when Supabase tables are ready
      /*
      const { data, error } = await supabase
        .from('user_onboarding_progress')
        .insert([newProgress])
        .select('*');
      
      if (error) {
        console.error('Error starting task:', error);
        return;
      }
      
      // Refresh progress
      await fetchUserProgress();
      */
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };

  // Complete a task
  const completeTask = async (taskId: string, notes?: string) => {
    try {
      if (!user) return;
      
      // Check if the progress exists
      const existingProgress = progress.find(p => p.task_id === taskId);
      
      if (!existingProgress) {
        // Create new progress and mark as completed
        await startTask(taskId);
      }
      
      // Update local state for development
      const updatedProgress = progress.map(p => 
        p.task_id === taskId 
          ? { 
              ...p, 
              completed: true, 
              completed_at: new Date().toISOString(),
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

      // Uncomment this when Supabase tables are ready
      /*
      // Update the progress
      const { error } = await supabase
        .from('user_onboarding_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          notes: notes || null,
        })
        .eq('user_id', user.id)
        .eq('task_id', taskId);
      
      if (error) {
        console.error('Error completing task:', error);
        return;
      }
      
      // Refresh progress
      await fetchUserProgress();
      */
    } catch (error: any) {
      toast({
        title: "Task Update Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Uncomplete a task
  const uncompleteTask = async (taskId: string) => {
    try {
      if (!user) return;
      
      // Update local state for development
      const updatedProgress = progress.map(p => 
        p.task_id === taskId 
          ? { 
              ...p, 
              completed: false, 
              completed_at: null 
            } 
          : p
      );
      
      setProgress(updatedProgress);
      
      // Uncomment this when Supabase tables are ready
      /*
      // Update the progress
      const { error } = await supabase
        .from('user_onboarding_progress')
        .update({
          completed: false,
          completed_at: null
        })
        .eq('user_id', user.id)
        .eq('task_id', taskId);
      
      if (error) {
        console.error('Error uncompleting task:', error);
        return;
      }
      
      // Refresh progress
      await fetchUserProgress();
      */
      
      // Show success toast
      toast({
        title: "Task Updated",
        description: "Your task has been marked as incomplete.",
      });
    } catch (error: any) {
      toast({
        title: "Task Update Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Initial data loading
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetchUserProfile(),
        fetchOnboardingTasks(),
        fetchUserProgress(),
      ]).finally(() => {
        setLoading(false);
      });
    } else {
      setProfile(null);
      setTasks([]);
      setProgress([]);
    }
  }, [user, fetchUserProfile]);

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
