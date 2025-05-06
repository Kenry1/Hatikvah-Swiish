
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from '@/components/ui/sidebar';

const TopBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="font-semibold text-lg">ERP System</Link>
      </div>
      
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              <DropdownMenuItem>
                <span>New task assigned</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Request approved</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>System maintenance scheduled</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-1">
              <User className="h-5 w-5 mr-1" />
              <span className="hidden md:inline">{user?.name || 'User'}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopBar;
