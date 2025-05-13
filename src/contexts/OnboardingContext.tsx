
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

// Types
export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  department: string;
  required: boolean;
  order: number;
}

export interface UserOnboardingProgress {
  id: string;
  user_id: string;
  task_id: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  department: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface OnboardingContextType {
  onboardingTasks: OnboardingTask[];
  userProgress: UserOnboardingProgress[];
  loadingTasks: boolean;
  loadingProgress: boolean;
  completeTask: (taskId: string, notes?: string) => Promise<void>;
  uncompleteTask: (taskId: string) => Promise<void>;
  calculateProgress: () => {
    completedCount: number;
    totalCount: number;
    percentage: number;
  };
  refreshOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>([]);
  const [userProgress, setUserProgress] = useState<UserOnboardingProgress[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Fetch user profile
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Fetch onboarding tasks when department is known
  useEffect(() => {
    if (profile?.department) {
      fetchOnboardingTasks();
    }
  }, [profile]);

  // Fetch user progress when tasks are loaded
  useEffect(() => {
    if (user && onboardingTasks.length > 0) {
      fetchUserProgress();
    }
  }, [user, onboardingTasks]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchOnboardingTasks = async () => {
    try {
      setLoadingTasks(true);
      
      // Use a safer approach to call RPC functions
      const { data, error } = await supabase.functions.invoke('get_onboarding_tasks_by_department', {
        body: { department: profile?.department }
      });

      if (error) {
        console.error('Error fetching onboarding tasks:', error);
        return;
      }

      setOnboardingTasks(data || []);
    } catch (error) {
      console.error('Error fetching onboarding tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load onboarding tasks.',
        variant: 'destructive',
      });
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      setLoadingProgress(true);
      
      // Use a safer approach to call RPC functions
      const { data, error } = await supabase.functions.invoke('get_user_onboarding_progress', {
        body: { userId: user?.id }
      });

      if (error) {
        console.error('Error fetching user progress:', error);
        return;
      }

      setUserProgress(data || []);

      // Check if we need to create progress entries for tasks that don't have them yet
      const existingTaskIds = data?.map((progress: UserOnboardingProgress) => progress.task_id) || [];
      const missingTasks = onboardingTasks.filter(task => !existingTaskIds.includes(task.id));
      
      if (missingTasks.length > 0) {
        await createInitialProgressEntries(missingTasks);
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your onboarding progress.',
        variant: 'destructive',
      });
    } finally {
      setLoadingProgress(false);
    }
  };

  const createInitialProgressEntries = async (tasks: OnboardingTask[]) => {
    try {
      const progressEntries = tasks.map(task => ({
        user_id: user?.id,
        task_id: task.id,
        completed: false,
      }));
      
      for (const entry of progressEntries) {
        // Use a safer approach to call RPC functions
        const { error } = await supabase.functions.invoke('create_onboarding_progress', {
          body: entry
        });
        
        if (error) {
          console.error('Error creating progress entry:', error);
        }
      }
      
      // Refresh progress after creating new entries
      await fetchUserProgress();
    } catch (error) {
      console.error('Error creating initial progress entries:', error);
    }
  };

  const completeTask = async (taskId: string, notes?: string) => {
    try {
      const progressEntry = userProgress.find(p => p.task_id === taskId);
      
      if (!progressEntry) {
        console.error('Progress entry not found for task:', taskId);
        return;
      }
      
      // Use a safer approach to call RPC functions
      const { error } = await supabase.functions.invoke('update_onboarding_progress', {
        body: {
          progressId: progressEntry.id,
          completed: true,
          notes: notes || null
        }
      });
      
      if (error) {
        console.error('Error completing task:', error);
        toast({
          title: 'Error',
          description: 'Failed to mark task as completed.',
          variant: 'destructive',
        });
        return;
      }
      
      // Update local state
      setUserProgress(prev =>
        prev.map(p =>
          p.id === progressEntry.id
            ? { ...p, completed: true, completed_at: new Date().toISOString(), notes: notes || null }
            : p
        )
      );
      
      toast({
        title: 'Task Completed',
        description: 'Your progress has been updated.',
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark task as completed.',
        variant: 'destructive',
      });
    }
  };

  const uncompleteTask = async (taskId: string) => {
    try {
      const progressEntry = userProgress.find(p => p.task_id === taskId);
      
      if (!progressEntry) {
        console.error('Progress entry not found for task:', taskId);
        return;
      }
      
      // Use a safer approach to call RPC functions
      const { error } = await supabase.functions.invoke('update_onboarding_progress', {
        body: {
          progressId: progressEntry.id,
          completed: false,
          notes: null
        }
      });
      
      if (error) {
        console.error('Error uncompleting task:', error);
        toast({
          title: 'Error',
          description: 'Failed to mark task as not completed.',
          variant: 'destructive',
        });
        return;
      }
      
      // Update local state
      setUserProgress(prev =>
        prev.map(p =>
          p.id === progressEntry.id
            ? { ...p, completed: false, completed_at: null, notes: null }
            : p
        )
      );
      
      toast({
        title: 'Task Status Updated',
        description: 'Task marked as not completed.',
      });
    } catch (error) {
      console.error('Error uncompleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task status.',
        variant: 'destructive',
      });
    }
  };

  const calculateProgress = () => {
    const requiredTasks = onboardingTasks.filter(task => task.required);
    const completedRequiredTasks = userProgress.filter(
      progress => 
        progress.completed && 
        requiredTasks.some(task => task.id === progress.task_id)
    );
    
    const totalCount = requiredTasks.length;
    const completedCount = completedRequiredTasks.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    return { completedCount, totalCount, percentage };
  };

  const refreshOnboarding = async () => {
    await fetchOnboardingTasks();
    await fetchUserProgress();
  };

  const value = {
    onboardingTasks,
    userProgress,
    loadingTasks,
    loadingProgress,
    completeTask,
    uncompleteTask,
    calculateProgress,
    refreshOnboarding
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  
  return context;
};
