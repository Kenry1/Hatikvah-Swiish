
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
import { ShoppingCart, Briefcase, Clock, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const ProcurementSidebar = () => {
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
          <div className="font-bold text-xl">Procurement</div>
        </div>
        <div className="text-sm text-muted-foreground">
          {user?.name}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/procurement"}
              onClick={() => navigate("/procurement")}
              tooltip="Procurement Dashboard"
            >
              <ShoppingCart size={18} />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/procurement/suppliers"}
              onClick={() => navigate("/procurement/suppliers")}
              tooltip="Suppliers"
            >
              <Briefcase size={18} />
              <span>Suppliers</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/procurement/orders"}
              onClick={() => navigate("/procurement/orders")}
              tooltip="Order Tracking"
            >
              <Clock size={18} />
              <span>Order Tracking</span>
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
