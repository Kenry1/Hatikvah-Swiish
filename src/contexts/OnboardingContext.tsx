
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

// Mock data for development until actual tables are created
const MOCK_TASKS: OnboardingTask[] = [
  {
    id: "task-1",
    department: "engineering",
    title: "Complete technical requirements form",
    description: "Fill out the technical requirements questionnaire for your role",
    estimated_time: "30 minutes",
    sequence_order: 1,
    is_required: true,
    created_at: new Date().toISOString()
  },
  {
    id: "task-2",
    department: "engineering",
    title: "Setup development environment",
    description: "Install necessary software and tools for development",
    estimated_time: "2 hours",
    sequence_order: 2,
    is_required: true,
    created_at: new Date().toISOString()
  },
  {
    id: "task-3",
    department: "engineering",
    title: "Review team coding standards",
    description: "Go through the coding standards document",
    estimated_time: "1 hour",
    sequence_order: 3,
    is_required: false,
    created_at: new Date().toISOString()
  }
];

const MOCK_PROGRESS: UserOnboardingProgress[] = [
  {
    id: "prog-1",
    user_id: "user-1",
    task_id: "task-1",
    completed: true,
    completed_at: new Date().toISOString(),
    notes: "Completed all requirements",
    created_at: new Date().toISOString()
  },
  {
    id: "prog-2",
    user_id: "user-1",
    task_id: "task-2",
    completed: false,
    completed_at: null,
    notes: null,
    created_at: new Date().toISOString()
  },
  {
    id: "prog-3",
    user_id: "user-1",
    task_id: "task-3",
    completed: false,
    completed_at: null,
    notes: null,
    created_at: new Date().toISOString()
  }
];

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
        email: data.email,
        department: data.department as DepartmentType | null,
        position: data.position || null,
        hire_date: data.hire_date || null,
        onboarding_completed: data.onboarding_completed || false,
        onboarding_step: data.onboarding_step || 0,
        avatar_url: data.avatar_url,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role || 'user',
        created_at: data.created_at,
        updated_at: data.updated_at,
        name: data.first_name ? `${data.first_name} ${data.last_name || ''}`.trim() : null,
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
      
      // Use mock data for now until the tables are created
      setTimeout(() => {
        // Filter tasks by department
        const filteredTasks = MOCK_TASKS.filter(
          task => task.department === profile?.department
        );
        setOnboardingTasks(filteredTasks);
        setLoadingTasks(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching onboarding tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load onboarding tasks.',
        variant: 'destructive',
      });
      setLoadingTasks(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      setLoadingProgress(true);
      
      // Use mock data for now until the tables are created
      setTimeout(() => {
        // Combine progress with tasks
        const progressWithTasks = MOCK_PROGRESS.map(progress => {
          const task = onboardingTasks.find(t => t.id === progress.task_id);
          return {
            ...progress,
            task
          };
        });
        
        setUserProgress(progressWithTasks);
        setLoadingProgress(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your onboarding progress.',
        variant: 'destructive',
      });
      setLoadingProgress(false);
    }
  };

  const createInitialProgressEntries = async (tasks: OnboardingTask[]) => {
    try {
      // For mock data implementation
      const newProgressEntries = tasks.map(task => ({
        id: `prog-${Date.now()}-${task.id}`,
        user_id: user?.id || '',
        task_id: task.id,
        completed: false,
        completed_at: null,
        notes: null,
        created_at: new Date().toISOString()
      }));
      
      setUserProgress(prev => [...prev, ...newProgressEntries]);
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
      
      // Update mock data for now
      const updatedProgress = userProgress.map(p => 
        p.task_id === taskId 
          ? { 
              ...p, 
              completed: true, 
              completed_at: new Date().toISOString(),
              notes: notes || null 
            }
          : p
      );
      
      setUserProgress(updatedProgress);
      
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
      
      // Update mock data for now
      const updatedProgress = userProgress.map(p => 
        p.task_id === taskId 
          ? { 
              ...p, 
              completed: false, 
              completed_at: null,
              notes: null
            }
          : p
      );
      
      setUserProgress(updatedProgress);
      
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
