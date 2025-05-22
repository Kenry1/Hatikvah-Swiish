import { UserRole } from "@/types";

export const redirectBasedOnRole = (role: UserRole): string => {
  switch (role) {
    case 'technician':
      return '/technician/dashboard';
    case 'warehouse':
      return '/warehouse/dashboard';
    case 'logistics':
      return '/logistics/dashboard';
    case 'hr':
      return '/hr/dashboard';
    case 'implementation_manager':
      return '/implementation-manager/dashboard';
    case 'project_manager':
      return '/project-manager/dashboard';
    case 'planning':
      return '/planning/dashboard';
    case 'it':
      return '/it/dashboard';
    case 'finance':
      return '/finance/dashboard';
    case 'management':
      return '/1'; // Temporarily redirecting management to /1
    case 'ehs':
      return '/ehs/dashboard';
    case 'procurement':
      return '/procurement/dashboard';
    default:
      return '/';
  }
};
