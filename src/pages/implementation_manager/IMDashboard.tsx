
import RoleDashboardLayout from '@/components/RoleDashboardLayout';
import PendingRequests from '@/components/implementation_manager/PendingRequests';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Briefcase, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const IMDashboard = () => {
  const navigate = useNavigate();
  
  const newFeatures = [
    {
      title: "Implementation Projects",
      description: "Track and manage implementation project statuses and timelines.",
      icon: <Briefcase className="h-10 w-10 text-purple-500" />
    },
    {
      title: "EHS Requests",
      description: "Review and acknowledge safety equipment requests from technicians.",
      icon: <Shield className="h-10 w-10 text-blue-500" />,
      onClick: () => navigate('/implementation-manager/ehs-requests')
    },
    {
      title: "Resource Allocation",
      description: "Assign and manage resources for implementation projects.",
      icon: <Calendar className="h-10 w-10 text-green-500" />
    }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="Implementation Manager Dashboard"
      roleLabel="Implementation Manager"
      dashboardDescription="Oversee implementation projects and resource allocation."
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {newFeatures.map((feature, index) => (
            <Card 
              key={index}
              className={cn(
                "hover:shadow-lg transition-all border-l-4",
                feature.onClick ? "cursor-pointer" : "cursor-default"
              )}
              style={{ 
                borderLeftColor: index === 0 ? '#9b87f5' : index === 1 ? '#3b82f6' : '#22c55e' 
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
        
        {/* Add the pending requests component */}
        <PendingRequests />
      </div>
    </RoleDashboardLayout>
  );
};

export default IMDashboard;
