
import { UserRole } from "@/types";

export const redirectBasedOnRole = (role: UserRole): string => {
  switch (role) {
    case 'technician':
      return '/technician';
    case 'warehouse':
      return '/warehouse';
    case 'logistics':
      return '/logistics';
    case 'hr':
      return '/hr';
    case 'implementation_manager':
      return '/implementation-manager';
    case 'project_manager':
      return '/project-manager';
    case 'planning':
      return '/planning';
    case 'it':
      return '/it';
    case 'finance':
      return '/finance';
    case 'management':
      return '/management';
    case 'ehs':
      return '/ehs';
    case 'procurement':
      return '/procurement';
    default:
      return '/';
  }
};
