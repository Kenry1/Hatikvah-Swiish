
import { User, UserRole } from "../types";

// Helper function to create a User object from Supabase data
export const createUserFromSupabase = (supabaseUser: any, profile: any): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    role: profile?.role || 'user',
    name: profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}` 
      : profile?.name || supabaseUser.email.split('@')[0],
    profileImage: profile?.avatar_url
  };
};
