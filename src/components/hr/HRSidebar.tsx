
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Users, FolderOpen, Settings, LogOut, ClipboardList } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const HRSidebar = () => {
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
          <div className="font-bold text-xl">HR Dashboard</div>
        </div>
        <div className="text-sm text-muted-foreground">
          {user?.name}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/hr/employees" || location.pathname === "/hr"}
              onClick={() => navigate("/hr/employees")}
              tooltip="Employees"
            >
              <Users size={18} />
              <span>Employees</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname.includes("/hr/onboarding")}
              onClick={() => navigate("/hr/onboarding")}
              tooltip="Onboarding"
            >
              <ClipboardList size={18} />
              <span>Onboarding</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname.includes("/hr/documents")}
              onClick={() => navigate("/hr/documents")}
              tooltip="Documents"
            >
              <FolderOpen size={18} />
              <span>Documents</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/hr/manage-account"}
              onClick={() => navigate("/hr/manage-account")}
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
