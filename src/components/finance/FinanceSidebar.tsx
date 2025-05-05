
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { DollarSign, LineChart, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const FinanceSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };
  
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="font-bold text-xl">Finance Dashboard</div>
        </div>
        <div className="text-sm text-muted-foreground">
          {user?.name}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/finance"}
              onClick={() => navigate("/finance")}
              tooltip="Finance Dashboard"
            >
              <DollarSign size={18} />
              <span>Finance Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/finance/reports"}
              onClick={() => navigate("/finance/reports")}
              tooltip="Reports"
            >
              <LineChart size={18} />
              <span>Reports</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/finance/manage-account"}
              onClick={() => navigate("/finance/manage-account")}
              tooltip="Account Settings"
            >
              <Settings size={18} />
              <span>Account Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
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
