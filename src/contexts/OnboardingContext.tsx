
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
        
        // Convert profile data to match Profile type
        const profileData: Profile = {
          id: data.id,
          // Use first_name + last_name as name if available, otherwise use the name directly if it exists
          name: data.name || (data.first_name ? `${data.first_name} ${data.last_name || ''}`.trim() : null),
          email: data.email,
          department: data.department as DepartmentType | null,
          position: data.position || null,
          hire_date: data.hire_date || null,
          onboarding_completed: data.onboarding_completed || false,
          onboarding_step: data.onboarding_step || 0,
          avatar_url: data.avatar_url || null,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        setProfile(profileData);
        
        // If profile has a department, fetch tasks and progress
        if (profileData.department) {
          await Promise.all([
            fetchTasks(profileData.department),
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
      // Use a custom RPC call or direct SQL query to get the tasks
      // since we're having issues with the TypeScript types for supabase tables
      const { data, error } = await supabase
        .rpc('get_onboarding_tasks_by_department', { 
          department_param: department 
        });

      if (error) {
        console.error('Error fetching onboarding tasks:', error);
        return;
      }
      
      if (!data) {
        console.error('No data returned from onboarding tasks query');
        return;
      }

      // Convert the data to match OnboardingTask type
      const tasksData: OnboardingTask[] = data.map((item: any) => ({
        id: item.id,
        department: item.department as DepartmentType,
        title: item.title || '',
        description: item.description || null,
        estimated_time: item.estimated_time || null,
        sequence_order: item.sequence_order || 0,
        is_required: item.is_required || false,
        created_at: item.created_at
      }));
      
      setTasks(tasksData);
    } catch (error) {
      console.error('Error in fetchTasks:', error);
    }
  };

  // Fetch user's onboarding progress
  const fetchProgress = async (userId: string) => {
    try {
      // Use a custom RPC call or direct SQL query to get progress
      const { data, error } = await supabase
        .rpc('get_user_onboarding_progress', { 
          user_id_param: userId 
        });

      if (error) {
        console.error('Error fetching onboarding progress:', error);
        return;
      }
      
      if (!data) {
        console.error('No data returned from onboarding progress query');
        return;
      }
      
      // Convert the data to match UserOnboardingProgress type
      const progressData: UserOnboardingProgress[] = data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        task_id: item.task_id,
        completed: item.completed || false,
        completed_at: item.completed_at || null,
        notes: item.notes || null,
        created_at: item.created_at,
        task: item.task ? {
          id: item.task.id,
          department: item.task.department as DepartmentType,
          title: item.task.title || '',
          description: item.task.description || null,
          estimated_time: item.task.estimated_time || null,
          sequence_order: item.task.sequence_order || 0,
          is_required: item.task.is_required || false,
          created_at: item.task.created_at
        } : undefined
      }));
      
      setProgress(progressData);
    } catch (error) {
      console.error('Error in fetchProgress:', error);
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      setLoading(true);
      
      // Convert profile data to match the database schema
      const dbData: any = {
        ...data,
        first_name: data.name ? data.name.split(' ')[0] : undefined,
        last_name: data.name ? data.name.split(' ').slice(1).join(' ') : undefined
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(dbData)
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
        // Update existing progress via RPC
        const { error } = await supabase
          .rpc('update_onboarding_progress', {
            progress_id_param: existingProgress.id,
            completed_param: true,
            completed_at_param: now,
            notes_param: notes || null
          });
        
        if (error) {
          console.error('Error updating progress:', error);
          throw error;
        }
      } else {
        // Create new progress record via RPC
        const { error } = await supabase
          .rpc('create_onboarding_progress', {
            user_id_param: user.id,
            task_id_param: taskId,
            completed_param: true,
            completed_at_param: now,
            notes_param: notes || null
          });
        
        if (error) {
          console.error('Error creating progress:', error);
          throw error;
        }
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
      
      // Update progress record via RPC
      const { error } = await supabase
        .rpc('update_onboarding_progress', {
          progress_id_param: existingProgress.id,
          completed_param: false,
          completed_at_param: null,
          notes_param: existingProgress.notes
        });
      
      if (error) {
        console.error('Error updating progress:', error);
        throw error;
      }
      
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
