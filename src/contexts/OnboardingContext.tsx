
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { OnboardingTask, UserOnboardingProgress, Profile, DepartmentType } from '@/types/onboarding';

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
  // Add these properties to match usage in components
  tasks: OnboardingTask[];
  progress: UserOnboardingProgress[];
  profile: Profile | null;
  loading: boolean;
  updateProfile: (updatedProfile: Partial<Profile>) => Promise<void>;
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
  const [loading, setLoading] = useState(true); // Added for backward compatibility

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
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      // Convert database profile to expected Profile type
      const convertedProfile: Profile = {
        id: data.id,
        name: data.first_name ? `${data.first_name} ${data.last_name || ''}`.trim() : null,
        email: data.email,
        department: data.department as DepartmentType | null,
        position: data.position || null,
        hire_date: data.hire_date || null,
        onboarding_completed: data.onboarding_completed || false,
        onboarding_step: data.onboarding_step || 0,
        avatar_url: data.avatar_url,
        first_name: data.first_name,
        last_name: data.last_name,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setProfile(convertedProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: Partial<Profile>) => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      // Convert updatedProfile to match database schema
      const dbProfile: any = { ...updatedProfile };
      
      // Handle name special case - split into first_name and last_name
      if (updatedProfile.name) {
        const nameParts = updatedProfile.name.split(' ');
        dbProfile.first_name = nameParts[0];
        dbProfile.last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;
        delete dbProfile.name; // Remove name as it doesn't exist in DB schema
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(dbProfile)
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to update profile.',
          variant: 'destructive',
        });
        return;
      }
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOnboardingTasks = async () => {
    try {
      setLoadingTasks(true);
      
      // Use a direct query instead of RPC
      const { data, error } = await supabase
        .from('onboarding_tasks')
        .select('*')
        .eq('department', profile?.department)
        .order('sequence_order', { ascending: true });

      if (error) {
        console.error('Error fetching onboarding tasks:', error);
        return;
      }

      // Normalize the data to match our OnboardingTask type
      const normalizedTasks: OnboardingTask[] = data ? data.map(task => ({
        id: task.id,
        department: task.department as DepartmentType,
        title: task.title,
        description: task.description,
        estimated_time: task.estimated_time,
        sequence_order: task.sequence_order,
        is_required: task.is_required,
        required: task.is_required, // For backward compatibility
        order: task.sequence_order, // For backward compatibility
        created_at: task.created_at
      })) : [];

      setOnboardingTasks(normalizedTasks);
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
      
      // Use a direct query instead of RPC
      const { data, error } = await supabase
        .from('user_onboarding_progress')
        .select('*, task:task_id(*)') // Join with tasks
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error fetching user progress:', error);
        return;
      }

      // Normalize the data to match our UserOnboardingProgress type
      const normalizedProgress: UserOnboardingProgress[] = data ? data.map(progress => ({
        id: progress.id,
        user_id: progress.user_id,
        task_id: progress.task_id,
        completed: progress.completed,
        completed_at: progress.completed_at,
        notes: progress.notes,
        created_at: progress.created_at,
        task: progress.task ? {
          id: progress.task.id,
          department: progress.task.department as DepartmentType,
          title: progress.task.title,
          description: progress.task.description,
          estimated_time: progress.task.estimated_time,
          sequence_order: progress.task.sequence_order,
          is_required: progress.task.is_required,
          created_at: progress.task.created_at
        } : undefined
      })) : [];

      setUserProgress(normalizedProgress);

      // Check if we need to create progress entries for tasks that don't have them yet
      const existingTaskIds = normalizedProgress.map(progress => progress.task_id);
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
      // Create progress entries one by one
      for (const task of tasks) {
        const { error } = await supabase
          .from('user_onboarding_progress')
          .insert({
            user_id: user?.id,
            task_id: task.id,
            completed: false
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
      
      // Update progress entry directly
      const { error } = await supabase
        .from('user_onboarding_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          notes: notes || null
        })
        .eq('id', progressEntry.id);
      
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
      
      // Update progress entry directly
      const { error } = await supabase
        .from('user_onboarding_progress')
        .update({
          completed: false,
          completed_at: null,
          notes: null
        })
        .eq('id', progressEntry.id);
      
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
    const requiredTasks = onboardingTasks.filter(task => task.is_required);
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
    refreshOnboarding,
    // Add these mappings for backward compatibility
    tasks: onboardingTasks,
    progress: userProgress,
    profile,
    loading: loadingTasks || loadingProgress || loading,
    updateProfile
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
