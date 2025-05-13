
import RoleDashboardLayout from '@/components/RoleDashboardLayout';
import PendingApprovals from '@/components/project_manager/PendingApprovals';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardCheck, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PMDashboard = () => {
  const navigate = useNavigate();
  
  const quickLinks = [
    { title: "Request Approvals", icon: <ClipboardCheck className="h-5 w-5" />, path: "/project-manager/approvals" },
    { title: "Task Assignments", icon: <Users className="h-5 w-5" />, path: "/project-manager/tasks" },
    { title: "Project Overview", icon: <Calendar className="h-5 w-5" />, path: "/project-manager/overview" },
  ];

  return (
    <RoleDashboardLayout
      pageTitle="Project Manager Dashboard"
      roleLabel="Project Manager"
      dashboardDescription="Manage projects, approve requests, and oversee tasks."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access commonly used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickLinks.map((link, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="flex justify-start gap-2 h-auto p-3"
                  onClick={() => navigate(link.path)}
                >
                  {link.icon}
                  <span>{link.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Add the pending approvals component */}
        <PendingApprovals />
      </div>
    </RoleDashboardLayout>
  );
};

export default PMDashboard;
