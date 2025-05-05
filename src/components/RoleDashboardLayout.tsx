
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { SidebarInset } from '@/components/ui/sidebar';

interface RoleDashboardLayoutProps {
  children?: ReactNode;
  pageTitle: string;
  roleLabel: string;
  dashboardDescription: string;
  newFeatures?: {
    title: string;
    description: string;
  }[];
  sidebar?: ReactNode;
}

const RoleDashboardLayout = ({ 
  children,
  pageTitle,
  roleLabel,
  dashboardDescription,
  newFeatures = [],
  sidebar
}: RoleDashboardLayoutProps) => {
  const { user } = useAuth();

  return (
    <DashboardLayout sidebar={sidebar}>
      <SidebarInset>
        <div className="flex flex-col space-y-8 p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}! 
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{roleLabel} Dashboard</CardTitle>
                <CardDescription>{dashboardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Access your {roleLabel.toLowerCase()} tools and resources from this dashboard.</p>
              </CardContent>
            </Card>
            
            {newFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {children}
        </div>
      </SidebarInset>
    </DashboardLayout>
  );
};

export default RoleDashboardLayout;
