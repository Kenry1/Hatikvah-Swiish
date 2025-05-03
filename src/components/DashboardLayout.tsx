import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Car, Package, Fuel, LogOut, Menu, X, User, ChevronRight, 
  FileText, Users, Briefcase, Calendar, Settings, Database, 
  Shield, LayoutDashboard, FolderOpen, ChartGantt, ListChecks,
  Building, UserCog, List, Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { ThemeToggle } from './ThemeToggle';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 py-3 px-4 transition-all hover:bg-sidebar-accent rounded-md",
        isActive ? "bg-sidebar-accent text-primary font-medium" : "text-sidebar-foreground"
      )}
    >
      <div className="text-lg">{icon}</div>
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your Swiish account",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get base path for the current role
  const getBasePath = (): string => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'technician': return '/technician';
      case 'warehouse': return '/warehouse';
      case 'logistics': return '/logistics';
      case 'hr': return '/hr';
      case 'implementation_manager': return '/implementation-manager';
      case 'project_manager': return '/project-manager';
      case 'planning': return '/planning';
      case 'it': return '/it';
      case 'finance': return '/finance';
      case 'management': return '/management';
      case 'ehs': return '/ehs';
      case 'procurement': return '/procurement';
      default: return '/';
    }
  };

  // Define links based on user role
  const getNavLinks = () => {
    if (!user) return [];
    
    const basePath = getBasePath();
    
    // Common links that appear in all dashboards
    const commonLinks = [
      { to: basePath, icon: <LayoutDashboard />, label: "Dashboard" }
    ];
    
    // Role-specific links
    const roleLinks = {
      technician: [
        { to: `${basePath}/fuel-requests`, icon: <Fuel />, label: "Fuel Requests" },
        { to: `${basePath}/vehicles`, icon: <Car />, label: "Vehicles" },
        { to: `${basePath}/material-requests`, icon: <Package />, label: "Materials" },
        { to: `${basePath}/safety-equipment`, icon: <Shield />, label: "Safety Equipment" }
      ],
      warehouse: [
        { to: `${basePath}/material-requests`, icon: <List />, label: "Material Requests" },
        { to: `${basePath}/inventory`, icon: <Package />, label: "Inventory" },
        { to: `${basePath}/assets`, icon: <Building />, label: "Company Assets" },
        { to: `${basePath}/all-requests`, icon: <FileText />, label: "View All Requests" },
        { to: `${basePath}/ehs-issuance`, icon: <Shield />, label: "EHS Issuance" },
        { to: `${basePath}/manage-account`, icon: <UserCog />, label: "Manage Account" }
      ],
      logistics: [
        { to: `${basePath}/vehicles`, icon: <Car />, label: "Vehicles" },
        { to: `${basePath}/fuel-requests`, icon: <Fuel />, label: "Fuel Requests" },
        { to: `${basePath}/manage-account`, icon: <UserCog />, label: "Manage Account" }
      ],
      hr: [
        { to: `${basePath}`, icon: <Users />, label: "Employees" },
        { to: `${basePath}`, icon: <FileText />, label: "Documents" }
      ],
      implementation_manager: [
        { to: `${basePath}`, icon: <Briefcase />, label: "Projects" },
        { to: `${basePath}/ehs-requests`, icon: <Shield />, label: "EHS Requests" },
        { to: `${basePath}`, icon: <Calendar />, label: "Schedule" }
      ],
      project_manager: [
        { to: `${basePath}/overview`, icon: <ChartGantt />, label: "Project Overview" },
        { to: `${basePath}/approvals`, icon: <FileText />, label: "Request Approvals" },
        { to: `${basePath}/ehs-approvals`, icon: <Shield />, label: "EHS Approvals" },
        { to: `${basePath}/tasks`, icon: <ListChecks />, label: "Task Assignments" }
      ],
      planning: [
        { to: `${basePath}`, icon: <Car />, label: "Vehicles" },
        { to: `${basePath}`, icon: <Calendar />, label: "Schedules" }
      ],
      it: [
        { to: `${basePath}`, icon: <Database />, label: "Systems" },
        { to: `${basePath}`, icon: <Settings />, label: "Configuration" }
      ],
      finance: [
        { to: `${basePath}`, icon: <FileText />, label: "Reports" },
        { to: `${basePath}`, icon: <FolderOpen />, label: "Budgets" }
      ],
      management: [
        { to: `${basePath}`, icon: <Users />, label: "Departments" },
        { to: `${basePath}`, icon: <FileText />, label: "Reports" }
      ],
      ehs: [
        { to: `${basePath}`, icon: <Shield />, label: "Dashboard" },
        { to: `${basePath}/overview`, icon: <FileText />, label: "Safety Requests" }
      ],
      procurement: [
        { to: `${basePath}`, icon: <Briefcase />, label: "Dashboard" }
      ]
    };

    return [...commonLinks, ...(roleLinks[user.role] || [])];
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 h-screen sticky top-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center">
            {!isCollapsed && (
              <div className="flex items-center">
                <span className="text-xs text-primary mr-1 mt-1.5">Hatikvah</span>
                <span className="font-bold text-xl text-primary">Swiish</span>
              </div>
            )}
            {isCollapsed && (
              <span className="font-bold text-xl text-primary">S</span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        
        <nav className="flex-1 p-2">
          {navLinks.map((link, index) => (
            <SidebarLink
              key={index}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
        
        <div className="p-4 border-t border-sidebar-border mt-auto">
          <div className="flex items-center justify-between mb-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              className="text-sidebar-foreground hover:text-destructive"
              size="icon"
              onClick={handleSignOut}
            >
              <LogOut size={20} />
            </Button>
          </div>
          {!isCollapsed && (
            <div className="text-xs text-sidebar-foreground/70 text-center">
              Swiish Fleet Management v1.0
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
