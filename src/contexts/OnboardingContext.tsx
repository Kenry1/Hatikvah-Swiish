
import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Profile, OnboardingTask, UserOnboardingProgress, DepartmentType } from '@/types/onboarding';
import { toast } from '@/hooks/use-toast';

interface OnboardingContextProps {
  profile: Profile | null;
  loading: boolean;
  onboardingTasks: OnboardingTask[];
  userProgress: UserOnboardingProgress[];
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  updateUserOnboardingStep: (step: number) => Promise<void>;
  completeUserOnboarding: () => Promise<void>;
  fetchOnboardingTasks: () => Promise<void>;
  fetchUserProgress: () => Promise<void>;
  startTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string, notes?: string) => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>([]);
  const [userProgress, setUserProgress] = useState<UserOnboardingProgress[]>([]);

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
      
      // Make sure we convert the data to match our Profile type
      const profileData: Profile = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        department: data.department as DepartmentType | null,
        role: data.role,
        position: data.position || null, // Use null if position doesn't exist
        hire_date: data.hire_date || null, // Use null if hire_date doesn't exist
        onboarding_completed: data.onboarding_completed || false, // Default to false
        onboarding_step: data.onboarding_step || 0, // Default to 0
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
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
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
      
      setOnboardingTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Fetch user progress
  const fetchUserProgress = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_onboarding_progress')
        .select('*, task:task_id(*)') // Join with tasks table
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
      
      setUserProgress(progress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  // Start a task
  const startTask = async (taskId: string) => {
    try {
      if (!user) return;
      
      // Check if progress already exists
      const existingProgress = userProgress.find(p => p.task_id === taskId);
      
      if (existingProgress) return; // Progress already exists, no need to create
      
      const newProgress = {
        user_id: user.id,
        task_id: taskId,
        completed: false,
        created_at: new Date().toISOString(),
      };
      
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
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };

  // Complete a task
  const completeTask = async (taskId: string, notes?: string) => {
    try {
      if (!user) return;
      
      // Check if the progress exists
      const existingProgress = userProgress.find(p => p.task_id === taskId);
      
      if (!existingProgress) {
        // Create new progress and mark as completed
        await startTask(taskId);
      }
      
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
      
      // Show success toast
      toast({
        title: "Task Completed",
        description: "Your task has been marked as completed.",
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
      setOnboardingTasks([]);
      setUserProgress([]);
    }
  }, [user, fetchUserProfile]);

  const value = {
    profile,
    loading,
    onboardingTasks,
    userProgress,
    updateProfile,
    fetchUserProfile,
    updateUserOnboardingStep,
    completeUserOnboarding,
    fetchOnboardingTasks,
    fetchUserProgress,
    startTask,
    completeTask,
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
