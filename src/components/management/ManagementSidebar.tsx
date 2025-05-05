
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
import { BarChart, Users, ShoppingCart, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const ManagementSidebar = () => {
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
          <div className="font-bold text-xl">Management Dashboard</div>
        </div>
        <div className="text-sm text-muted-foreground">
          {user?.name}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/management"}
              onClick={() => navigate("/management")}
              tooltip="Management Dashboard"
            >
              <BarChart size={18} />
              <span>Management Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/procurement"}
              onClick={() => navigate("/procurement")}
              tooltip="Procurement"
            >
              <ShoppingCart size={18} />
              <span>Procurement</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/management/departments"}
              onClick={() => navigate("/management/departments")}
              tooltip="Departments"
            >
              <Users size={18} />
              <span>Departments</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/management/manage-account"}
              onClick={() => navigate("/management/manage-account")}
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
