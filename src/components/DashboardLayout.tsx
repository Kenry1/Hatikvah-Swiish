
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import TopBar from '@/components/TopBar';
import SideMenu from '@/components/SideMenu';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

const DashboardLayout = ({ children, sidebar }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen flex-col">
        <TopBar />
        <div className="flex flex-1 w-full">
          {sidebar || <SideMenu />}
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
