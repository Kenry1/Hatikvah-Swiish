
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChartGantt, Users, PieChart, BarChart2 } from "lucide-react";
import DashboardLayout from '@/components/DashboardLayout';

// Mock data for projects
const projects = [
  {
    id: 'p1',
    name: 'Network Infrastructure Upgrade',
    description: 'Upgrading network infrastructure across all locations',
    status: 'On Track',
    progress: 65,
    budget: { total: 150000, spent: 97500 },
    milestones: [
      { id: 'm1', name: 'Requirements Gathering', dueDate: '2025-05-10', status: 'Completed', completionDate: '2025-05-08' },
      { id: 'm2', name: 'Design Phase', dueDate: '2025-05-25', status: 'Completed', completionDate: '2025-05-23' },
      { id: 'm3', name: 'Implementation Phase', dueDate: '2025-06-15', status: 'In Progress', progress: 45 },
      { id: 'm4', name: 'Testing Phase', dueDate: '2025-06-30', status: 'Not Started', progress: 0 }
    ],
    stakeholders: [
      { name: 'John Doe', role: 'Project Sponsor', email: 'john@example.com' },
      { name: 'Jane Smith', role: 'Technical Lead', email: 'jane@example.com' },
      { name: 'Mike Johnson', role: 'Client Representative', email: 'mike@example.com' }
    ],
    risks: [
      { description: 'Hardware delivery delay', impact: 'High', mitigation: 'Alternative supplier identified' },
      { description: 'Staff availability', impact: 'Medium', mitigation: 'Cross-training team members' }
    ]
  },
  {
    id: 'p2',
    name: 'Solar Panel Installation',
    description: 'Installing solar panels at the main headquarters',
    status: 'Delayed',
    progress: 35,
    budget: { total: 250000, spent: 112500 },
    milestones: [
      { id: 'm1', name: 'Site Assessment', dueDate: '2025-04-10', status: 'Completed', completionDate: '2025-04-15' },
      { id: 'm2', name: 'Material Procurement', dueDate: '2025-05-01', status: 'Completed', completionDate: '2025-05-10' },
      { id: 'm3', name: 'Installation Phase', dueDate: '2025-05-30', status: 'In Progress', progress: 30 },
      { id: 'm4', name: 'Testing & Certification', dueDate: '2025-06-15', status: 'Not Started', progress: 0 }
    ],
    stakeholders: [
      { name: 'Sarah Williams', role: 'Project Sponsor', email: 'sarah@example.com' },
      { name: 'Tom Brown', role: 'Technical Lead', email: 'tom@example.com' },
      { name: 'Lisa Davis', role: 'Sustainability Manager', email: 'lisa@example.com' }
    ],
    risks: [
      { description: 'Weather delays', impact: 'High', mitigation: 'Flexible schedule with buffer days' },
      { description: 'Permit delays', impact: 'Medium', mitigation: 'Early application and followup' }
    ]
  }
];

const ProjectOverview = () => {
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'bg-green-500';
      case 'Delayed': return 'bg-amber-500';
      case 'At Risk': return 'bg-red-500';
      case 'Completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Project Overview</h1>
          <div className="flex items-center space-x-2">
            <ChartGantt className="h-5 w-5 text-purple-500" />
            <span className="font-medium text-purple-500">Project Management</span>
          </div>
        </div>

        <Tabs defaultValue="project1" className="w-full">
          <TabsList className="mb-4">
            {projects.map(project => (
              <TabsTrigger 
                key={project.id} 
                value={project.id}
                onClick={() => setSelectedProject(project)}
              >
                {project.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {projects.map(project => (
            <TabsContent key={project.id} value={project.id}>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    <Badge className={`text-white ${getStatusColor(project.status)}`}>{project.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Overall Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Budget: ${project.budget.spent.toLocaleString()} / ${project.budget.total.toLocaleString()}</span>
                        <span>{Math.round((project.budget.spent / project.budget.total) * 100)}% Used</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <BarChart2 className="h-5 w-5 text-blue-500" />
                      <span>Project Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center border rounded bg-slate-50">
                      <p className="text-muted-foreground">Project metrics visualization</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 mt-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <ChartGantt className="h-5 w-5 text-purple-500" />
                      <span>Milestones</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[300px] overflow-auto">
                    <div className="space-y-4">
                      {project.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{milestone.name}</span>
                            <Badge className={getMilestoneStatusColor(milestone.status)}>
                              {milestone.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex justify-between">
                            <span>Due: {milestone.dueDate}</span>
                            {milestone.completionDate && (
                              <span>Completed: {milestone.completionDate}</span>
                            )}
                          </div>
                          {milestone.progress !== undefined && (
                            <div className="mt-2">
                              <Progress value={milestone.progress} className="h-1" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Users className="h-5 w-5 text-green-500" />
                      <span>Stakeholders</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[300px] overflow-auto">
                    <div className="space-y-3">
                      {project.stakeholders.map((stakeholder, index) => (
                        <div key={index} className="flex justify-between border-b pb-2 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{stakeholder.name}</p>
                            <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                          </div>
                          <div className="text-sm text-blue-600">{stakeholder.email}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 mt-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-red-500" />
                      <span>Risk Assessment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.risks.map((risk, index) => (
                        <div key={index} className="border-b pb-2 last:border-0 last:pb-0">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{risk.description}</span>
                            <Badge variant={risk.impact === 'High' ? 'destructive' : 'outline'}>
                              {risk.impact} Impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Mitigation: {risk.mitigation}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <ChartGantt className="h-5 w-5 text-indigo-500" />
                      <span>Project Timeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center border rounded bg-slate-50">
                      <p className="text-muted-foreground">Gantt chart visualization</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProjectOverview;
