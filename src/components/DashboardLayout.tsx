
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Car, Package, Fuel, LogOut, Menu, X, User, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  // Define links based on user role
  const getNavLinks = () => {
    if (user?.role === 'technician') {
      return [
        { to: "/technician", icon: <User />, label: "Dashboard" },
        { to: "/technician/fuel-requests", icon: <Fuel />, label: "Fuel Requests" },
        { to: "/technician/vehicles", icon: <Car />, label: "Vehicles" },
        { to: "/technician/material-requests", icon: <Package />, label: "Materials" }
      ];
    }
    if (user?.role === 'warehouse') {
      return [
        { to: "/warehouse", icon: <User />, label: "Dashboard" },
        { to: "/warehouse/material-requests", icon: <Package />, label: "Material Requests" },
        { to: "/warehouse/inventory", icon: <Package />, label: "Inventory" }
      ];
    }
    if (user?.role === 'logistics') {
      return [
        { to: "/logistics", icon: <User />, label: "Dashboard" },
        { to: "/logistics/vehicles", icon: <Car />, label: "Vehicles" },
        { to: "/logistics/fuel-requests", icon: <Fuel />, label: "Fuel Requests" }
      ];
    }
    return [];
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
              <span className="font-bold text-xl text-primary">Swiish</span>
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
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center justify-start gap-3 text-sidebar-foreground hover:text-destructive",
              isCollapsed && "justify-center px-2"
            )}
            onClick={handleSignOut}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </Button>
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
