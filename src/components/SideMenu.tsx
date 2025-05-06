
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import {
  Home, 
  Box, 
  Truck,
  Users,
  FileText,
  Settings,
  ShieldCheck,
  DollarSign,
  Clipboard,
  // Tool was removed as it's not available in lucide-react
  Wrench, // Adding this instead of Tool
  LogOut
} from "lucide-react";

const SideMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };
  
  const renderMenuItems = () => {
    // Base on user role, show different menu items
    if (!user?.role) return null;
    
    switch (user.role) {
      case 'technician':
        return (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/technician'}
                onClick={() => navigate('/technician')}
                tooltip="Dashboard"
              >
                <Home size={18} />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/technician/material-requests'}
                onClick={() => navigate('/technician/material-requests')}
                tooltip="Material Requests"
              >
                <Box size={18} />
                <span>Material Requests</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/technician/vehicles'}
                onClick={() => navigate('/technician/vehicles')}
                tooltip="Vehicles"
              >
                <Truck size={18} />
                <span>Vehicles</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/technician/safety-equipment'}
                onClick={() => navigate('/technician/safety-equipment')}
                tooltip="Safety Equipment"
              >
                <ShieldCheck size={18} />
                <span>Safety Equipment</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        );
      case 'logistics':
        return (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/logistics'}
                onClick={() => navigate('/logistics')}
                tooltip="Dashboard"
              >
                <Home size={18} />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/logistics/vehicles'}
                onClick={() => navigate('/logistics/vehicles')}
                tooltip="Vehicles"
              >
                <Truck size={18} />
                <span>Vehicles</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/logistics/fuel-requests'}
                onClick={() => navigate('/logistics/fuel-requests')}
                tooltip="Fuel Requests"
              >
                <Clipboard size={18} />
                <span>Fuel Requests</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        );
      case 'warehouse':
        return (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/warehouse'}
                onClick={() => navigate('/warehouse')}
                tooltip="Dashboard"
              >
                <Home size={18} />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/warehouse/inventory'}
                onClick={() => navigate('/warehouse/inventory')}
                tooltip="Inventory"
              >
                <Box size={18} />
                <span>Inventory</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/warehouse/material-requests'}
                onClick={() => navigate('/warehouse/material-requests')}
                tooltip="Material Requests"
              >
                <Clipboard size={18} />
                <span>Material Requests</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        );
      case 'hr':
        return (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/hr' || location.pathname === '/hr/employees'}
                onClick={() => navigate('/hr/employees')}
                tooltip="Employees"
              >
                <Users size={18} />
                <span>Employees</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname.includes('/hr/documents')}
                onClick={() => navigate('/hr/documents')}
                tooltip="Documents"
              >
                <FileText size={18} />
                <span>Documents</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        );
      case 'finance':
        return (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/finance'}
                onClick={() => navigate('/finance')}
                tooltip="Dashboard"
              >
                <DollarSign size={18} />
                <span>Finance Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/finance/reports'}
                onClick={() => navigate('/finance/reports')}
                tooltip="Reports"
              >
                <FileText size={18} />
                <span>Reports</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        );
      default:
        return (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === '/'}
                onClick={() => navigate('/')}
                tooltip="Dashboard"
              >
                <Home size={18} />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        );
    }
  };
  
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="font-bold text-xl">{user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Panel` : 'Navigation'}</div>
        </div>
        <div className="text-sm text-muted-foreground">
          {user?.name || 'Guest User'}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {renderMenuItems()}
          
          {user?.role && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname.includes('/manage-account')}
                onClick={() => navigate(`/${user.role}/manage-account`)}
                tooltip="Account Settings"
              >
                <Settings size={18} />
                <span>Account Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              tooltip="Sign Out"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideMenu;
