
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
import { Package, Inventory, BoxesIcon, Clipboard, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const WarehouseSidebar = () => {
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
          <div className="font-bold text-xl">Warehouse Dashboard</div>
        </div>
        <div className="text-sm text-muted-foreground">
          {user?.name}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/warehouse"}
              onClick={() => navigate("/warehouse")}
              tooltip="Dashboard"
            >
              <Package size={18} />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/warehouse/material-requests"}
              onClick={() => navigate("/warehouse/material-requests")}
              tooltip="Material Requests"
            >
              <Clipboard size={18} />
              <span>Material Requests</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/warehouse/inventory"}
              onClick={() => navigate("/warehouse/inventory")}
              tooltip="Inventory"
            >
              <BoxesIcon size={18} />
              <span>Inventory</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/warehouse/assets"}
              onClick={() => navigate("/warehouse/assets")}
              tooltip="Assets"
            >
              <Inventory size={18} />
              <span>Assets</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/warehouse/all-requests"}
              onClick={() => navigate("/warehouse/all-requests")}
              tooltip="All Requests"
            >
              <Clipboard size={18} />
              <span>All Requests</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/warehouse/ehs-issuance"}
              onClick={() => navigate("/warehouse/ehs-issuance")}
              tooltip="EHS Issuance"
            >
              <Shield size={18} />
              <span>EHS Issuance</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/warehouse/manage-account"}
              onClick={() => navigate("/warehouse/manage-account")}
              tooltip="Account Settings"
            >
              <User size={18} />
              <span>Account Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
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

