
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
import { Calendar, Map, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const PlanningSidebar = () => {
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
          <div className="font-bold text-xl">Planning Dashboard</div>
        </div>
        <div className="text-sm text-muted-foreground">
          {user?.name}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/planning"}
              onClick={() => navigate("/planning")}
              tooltip="Planning Dashboard"
            >
              <Calendar size={18} />
              <span>Planning Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/planning/resources"}
              onClick={() => navigate("/planning/resources")}
              tooltip="Resource Planning"
            >
              <Map size={18} />
              <span>Resource Planning</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/planning/manage-account"}
              onClick={() => navigate("/planning/manage-account")}
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
