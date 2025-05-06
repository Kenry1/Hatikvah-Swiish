
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Profile, OnboardingTask, UserOnboardingProgress, DepartmentType } from '@/types/onboarding';
import { useToast } from '@/hooks/use-toast';

interface OnboardingContextType {
  profile: Profile | null;
  loading: boolean;
  tasks: OnboardingTask[];
  progress: UserOnboardingProgress[];
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  completeTask: (taskId: string, notes?: string) => Promise<void>;
  uncompleteTask: (taskId: string) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [progress, setProgress] = useState<UserOnboardingProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        
        // If profile has a department, fetch tasks and progress
        if (data.department) {
          await Promise.all([
            fetchTasks(data.department),
            fetchProgress(user.id)
          ]);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  // Fetch onboarding tasks for a department
  const fetchTasks = async (department: DepartmentType) => {
    try {
      const { data, error } = await supabase
        .from('onboarding_tasks')
        .select('*')
        .eq('department', department)
        .order('sequence_order', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching onboarding tasks:', error);
    }
  };

  // Fetch user's onboarding progress
  const fetchProgress = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_onboarding_progress')
        .select(`
          *,
          task:task_id (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching onboarding progress:', error);
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      // If department was updated, fetch new tasks and progress
      if (data.department && profile?.department !== data.department) {
        await fetchTasks(data.department);
        await fetchProgress(user.id);
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Mark a task as complete
  const completeTask = async (taskId: string, notes?: string) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const now = new Date().toISOString();
      
      // Check if progress record exists
      const existingProgress = progress.find(p => p.task_id === taskId);
      
      if (existingProgress) {
        // Update existing progress
        const { error } = await supabase
          .from('user_onboarding_progress')
          .update({ 
            completed: true, 
            completed_at: now,
            ...(notes && { notes })
          })
          .eq('id', existingProgress.id);
        
        if (error) throw error;
      } else {
        // Create new progress record
        const { error } = await supabase
          .from('user_onboarding_progress')
          .insert({ 
            user_id: user.id, 
            task_id: taskId, 
            completed: true, 
            completed_at: now,
            ...(notes && { notes })
          });
        
        if (error) throw error;
      }
      
      // Refresh progress
      await fetchProgress(user.id);
      
      toast({
        title: "Task Completed",
        description: "Your progress has been updated."
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to update task progress.",
        variant: "destructive"
      });
    }
  };

  // Mark a task as incomplete
  const uncompleteTask = async (taskId: string) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // Find the progress record
      const existingProgress = progress.find(p => p.task_id === taskId);
      
      if (!existingProgress) return;
      
      // Update progress record
      const { error } = await supabase
        .from('user_onboarding_progress')
        .update({ 
          completed: false, 
          completed_at: null
        })
        .eq('id', existingProgress.id);
      
      if (error) throw error;
      
      // Refresh progress
      await fetchProgress(user.id);
      
      toast({
        title: "Task Marked Incomplete",
        description: "Your progress has been updated."
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task progress.",
        variant: "destructive"
      });
    }
  };

  // Refresh progress data
  const refreshProgress = async () => {
    if (!user) return;
    await fetchProgress(user.id);
  };

  const value = {
    profile,
    loading,
    tasks,
    progress,
    updateProfile,
    completeTask,
    uncompleteTask,
    refreshProgress
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
