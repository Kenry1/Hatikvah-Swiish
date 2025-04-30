
import RoleDashboardLayout from '@/components/RoleDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartGantt, FileText, ListChecks } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const PMDashboard = () => {
  const navigate = useNavigate();
  
  const newFeatures = [
    {
      title: "Project Overview",
      description: "View and track all current projects and their status.",
      icon: <ChartGantt className="w-10 h-10 text-purple-500" />,
      onClick: () => navigate('/project-manager/overview')
    },
    {
      title: "Request Approvals",
      description: "Approve requests after acknowledgment by Implementation Managers.",
      icon: <FileText className="w-10 h-10 text-blue-500" />,
      onClick: () => navigate('/project-manager/approvals')
    },
    {
      title: "Task Assignments",
      description: "Assign and monitor tasks across your project teams.",
      icon: <ListChecks className="w-10 h-10 text-green-500" />,
      onClick: () => navigate('/project-manager/tasks')
    }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="Project Manager Dashboard"
      roleLabel="Project Manager"
      dashboardDescription="Oversee project status, approvals, and team coordination."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {newFeatures.map((feature, index) => (
          <Card 
            key={index}
            className="hover:shadow-lg transition-all cursor-pointer border-l-4"
            style={{ borderLeftColor: index === 0 ? '#9b87f5' : index === 1 ? '#33C3F0' : '#4ade80' }}
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

export default PMDashboard;
