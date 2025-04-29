
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface FeatureItem {
  title: string;
  description: string;
  icon?: ReactNode;
  color?: string;
}

interface RoleDashboardLayoutProps {
  children?: ReactNode;
  pageTitle: string;
  roleLabel: string;
  dashboardDescription: string;
  newFeatures?: FeatureItem[];
}

const RoleDashboardLayout = ({ 
  children,
  pageTitle,
  roleLabel,
  dashboardDescription,
  newFeatures = []
}: RoleDashboardLayoutProps) => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">{pageTitle}</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, <span className="font-medium">{user?.name}</span>! {dashboardDescription}
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {newFeatures.map((feature, index) => (
            <Card key={index} className={`overflow-hidden transition-all hover:shadow-md ${feature.color || ''}`}>
              <CardHeader className="pb-2">
                {feature.icon && <div className="mb-2">{feature.icon}</div>}
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {children}
      </div>
    </DashboardLayout>
  );
};

export default RoleDashboardLayout;
