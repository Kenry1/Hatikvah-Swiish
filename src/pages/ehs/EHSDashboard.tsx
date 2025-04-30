
import { useNavigate } from 'react-router-dom';
import RoleDashboardLayout from '@/components/RoleDashboardLayout';
import { Shield, FileText, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

const EHSDashboard = () => {
  const navigate = useNavigate();
  
  const newFeatures = [
    {
      title: "Safety Compliance",
      description: "Track compliance with safety regulations and standards.",
      icon: <Shield className="h-10 w-10 text-blue-500" />,
      onClick: () => navigate('/ehs/overview')
    },
    {
      title: "Incident Reports",
      description: "Monitor and manage workplace incidents and reports.",
      icon: <FileText className="h-10 w-10 text-purple-500" />
    },
    {
      title: "Equipment Inspections",
      description: "Schedule and track safety inspections for equipment and facilities.",
      icon: <Check className="h-10 w-10 text-green-500" />
    }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="EHS Dashboard"
      roleLabel="EHS"
      dashboardDescription="Manage environmental, health, and safety compliance."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {newFeatures.map((feature, index) => (
          <Card 
            key={index}
            className={cn(
              "hover:shadow-lg transition-all border-l-4",
              feature.onClick ? "cursor-pointer" : "cursor-default"
            )}
            style={{ 
              borderLeftColor: index === 0 ? '#3b82f6' : index === 1 ? '#8b5cf6' : '#22c55e' 
            }}
            onClick={feature.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              {feature.icon}
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </RoleDashboardLayout>
  );
};

export default EHSDashboard;
