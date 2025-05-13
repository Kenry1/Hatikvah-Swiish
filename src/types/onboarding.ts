
export type DepartmentType = 'engineering' | 'marketing' | 'sales' | 'hr' | 'operations' | 
  'finance' | 'it' | 'warehouse' | 'logistics' | 'ehs' | 'management' | 'planning' | 'procurement';

export interface Profile {
  id: string;
  name: string | null;
  email: string;
  department: DepartmentType | null;
  position: string | null;
  hire_date: string | null;
  onboarding_completed: boolean;
  onboarding_step: number;
  avatar_url: string | null;
  first_name?: string | null;
  last_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OnboardingTask {
  id: string;
  department: DepartmentType;
  title: string;
  description: string | null;
  estimated_time: string | null;
  sequence_order: number;
  is_required: boolean;
  required?: boolean; // Added for backward compatibility
  order?: number; // Added for backward compatibility
  created_at: string;
}

export interface UserOnboardingProgress {
  id: string;
  user_id: string;
  task_id: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  // Include the related task for convenience
  task?: OnboardingTask;
}

export interface DepartmentManager {
  id: string;
  user_id: string;
  department: DepartmentType;
  created_at: string;
}
