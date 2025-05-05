
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

const DashboardLayout = ({ children, sidebar }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        {sidebar}
        {children}
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
