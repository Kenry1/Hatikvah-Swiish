
import React from 'react';
import RoleDashboardLayout from '@/components/RoleDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart, CheckSquare, FolderOpen, Calendar, Users, PieChart } from 'lucide-react';

const PMDashboard = () => {
  const navigate = useNavigate();
  
  const newFeatures = [
    {
      title: "Project Overview",
      description: "View and track all current projects and their status.",
      icon: <FolderOpen className="h-6 w-6 text-primary" />,
      color: "bg-gradient-to-br from-blue-50 to-blue-100"
    },
    {
      title: "Request Approvals",
      description: "Approve requests after acknowledgment by Implementation Managers.",
      icon: <CheckSquare className="h-6 w-6 text-green-600" />,
      color: "bg-gradient-to-br from-green-50 to-green-100"
    },
    {
      title: "Task Assignments",
      description: "Assign and monitor tasks across your project teams.",
      icon: <Users className="h-6 w-6 text-amber-600" />,
      color: "bg-gradient-to-br from-amber-50 to-amber-100"
    }
  ];

  const projectStats = [
    { title: "Active Projects", value: "12", icon: <FolderOpen className="h-4 w-4 text-blue-600" /> },
    { title: "Pending Approvals", value: "7", icon: <CheckSquare className="h-4 w-4 text-amber-600" /> },
    { title: "Team Members", value: "24", icon: <Users className="h-4 w-4 text-indigo-600" /> },
    { title: "Due This Week", value: "5", icon: <Calendar className="h-4 w-4 text-red-600" /> }
  ];

  return (
    <RoleDashboardLayout
      pageTitle="Project Manager Dashboard"
      roleLabel="Project Manager"
      dashboardDescription="Oversee project status, approvals, and team coordination."
      newFeatures={newFeatures}
    >
      <div className="space-y-6 mt-8">
        <div className="grid gap-4 md:grid-cols-4">
          {projectStats.map((stat, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Project Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-b-lg">
              <p className="text-muted-foreground">Project progress chart will be displayed here</p>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-primary" />
                Resource Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-b-lg">
              <p className="text-muted-foreground">Resource allocation chart will be displayed here</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FolderOpen className="mr-2 h-4 w-4" />
              New Project
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckSquare className="mr-2 h-4 w-4" />
              Review Approvals
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Users className="mr-2 h-4 w-4" />
              Manage Teams
            </Button>
          </CardContent>
        </Card>
      </div>
    </RoleDashboardLayout>
  );
};

export default PMDashboard;
