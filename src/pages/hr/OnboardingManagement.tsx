import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Filter, Plus, Trash2 } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { DepartmentType, OnboardingTask, UserOnboardingProgress } from "@/types/onboarding";
import RoleDashboardLayout from "@/components/RoleDashboardLayout";
import { Progress } from "@/components/ui/progress";

export default function OnboardingManagement() {
  const { toast } = useToast();
  const { profile, tasks, progress, loading } = useOnboarding();
  
  // Mock data for HR management view
  const [employees, setEmployees] = useState<Array<{
    id: string;
    name: string;
    department: DepartmentType;
    position: string;
    progress: Array<{taskId: string; completed: boolean}>
  }>>([
    {
      id: '1',
      name: 'John Doe',
      department: 'engineering',
      position: 'Frontend Developer',
      progress: [{taskId: 'task-1', completed: true}, {taskId: 'task-2', completed: false}]
    },
    {
      id: '2',
      name: 'Jane Smith',
      department: 'hr',
      position: 'HR Assistant',
      progress: [{taskId: 'task-3', completed: true}, {taskId: 'task-4', completed: true}]
    }
  ]);
  
  // New task state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDepartment, setNewTaskDepartment] = useState<DepartmentType | ''>('');
  const [newTaskEstimatedTime, setNewTaskEstimatedTime] = useState('');
  const [newTaskRequired, setNewTaskRequired] = useState(true);

  // Filter state
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock functions for HR management
  const addTask = (task: OnboardingTask) => {
    toast({
      title: "Task Added",
      description: `Added task: ${task.title}`,
    });
  };
  
  const removeTask = (taskId: string) => {
    toast({
      title: "Task Removed",
      description: `Removed task ID: ${taskId}`,
    });
  };
  
  const updateTaskCompletion = (employeeId: string, taskId: string, completed: boolean) => {
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp.id === employeeId 
          ? {
              ...emp,
              progress: emp.progress.map(p => 
                p.taskId === taskId ? {...p, completed} : p
              )
            }
          : emp
      )
    );
  };
  
  // Add new task
  const handleAddTask = () => {
    if (!newTaskTitle || !newTaskDepartment) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newTask: OnboardingTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDescription,
      department: newTaskDepartment as DepartmentType,
      estimated_time: newTaskEstimatedTime,
      is_required: newTaskRequired,
      sequence_order: 0,
      created_at: new Date().toISOString()
    };
    
    addTask(newTask);
    
    // Reset form
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskDepartment('');
    setNewTaskEstimatedTime('');
    setNewTaskRequired(true);
    
    toast({
      title: "Success",
      description: "Onboarding task added successfully",
    });
  };
  
  // Delete task
  const handleDeleteTask = (taskId: string) => {
    removeTask(taskId);
    toast({
      title: "Success",
      description: "Onboarding task deleted",
    });
  };
  
  // Calculate completion rates
  const calculateDepartmentCompletion = (dept: DepartmentType) => {
    const deptEmployees = employees.filter(emp => emp.department === dept);
    if (deptEmployees.length === 0) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    deptEmployees.forEach(employee => {
      const employeeTasks = tasks.filter(task => task.department === dept);
      totalTasks += employeeTasks.length;
      completedTasks += employee.progress.filter(p => p.completed).length;
    });
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };
  
  // Filter tasks based on department and search query
  const filteredTasks = tasks.filter(task => {
    const matchesDepartment = departmentFilter === 'all' || task.department === departmentFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDepartment && matchesSearch;
  });
  
  // Filter employees based on department
  const filteredEmployees = employees.filter(emp => 
    departmentFilter === 'all' || emp.department === departmentFilter
  );

  return (
    <RoleDashboardLayout 
      pageTitle="Onboarding Management"
      roleLabel="HR"
      dashboardDescription="Manage employee onboarding tasks and progress"
    >
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Onboarding Management</h1>
        
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Onboarding Task</CardTitle>
                <CardDescription>Create tasks for new employees to complete during onboarding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-title">Task Title *</Label>
                      <Input 
                        id="task-title" 
                        placeholder="Enter task title" 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-department">Department *</Label>
                      <Select 
                        value={newTaskDepartment}
                        onValueChange={(value) => setNewTaskDepartment(value as DepartmentType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="it">IT</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="logistics">Logistics</SelectItem>
                          <SelectItem value="ehs">EHS</SelectItem>
                          <SelectItem value="management">Management</SelectItem>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="procurement">Procurement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estimated-time">Estimated Time</Label>
                      <Input 
                        id="estimated-time" 
                        placeholder="e.g., 30 minutes, 1 hour" 
                        value={newTaskEstimatedTime}
                        onChange={(e) => setNewTaskEstimatedTime(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="required" 
                          checked={newTaskRequired}
                          onCheckedChange={(checked) => setNewTaskRequired(checked === true)}
                        />
                        <Label htmlFor="required">Required Task</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea 
                      id="task-description" 
                      placeholder="Describe what the task involves" 
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddTask} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Onboarding Tasks</CardTitle>
                  <CardDescription>Manage all onboarding tasks across departments</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select 
                      value={departmentFilter}
                      onValueChange={(value) => setDepartmentFilter(value as DepartmentType | 'all')}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                        <SelectItem value="ehs">EHS</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="procurement">Procurement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    placeholder="Search tasks..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[200px]"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No tasks found. Create a new task above.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTasks.map(task => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">
                            <div>
                              {task.title}
                              {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{task.department}</Badge>
                          </TableCell>
                          <TableCell>{task.estimated_time || 'N/A'}</TableCell>
                          <TableCell>{task.is_required ? 'Yes' : 'No'}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Employee Onboarding Progress</CardTitle>
                  <CardDescription>Track onboarding progress for all employees</CardDescription>
                </div>
                <Select
                  value={departmentFilter}
                  onValueChange={(value) => setDepartmentFilter(value as DepartmentType | 'all')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="ehs">EHS</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="procurement">Procurement</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {filteredEmployees.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No employees found in this department.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredEmployees.map(employee => {
                        // Calculate employee completion
                        const employeeTasks = tasks.filter(t => t.department === employee.department);
                        const completedTasks = employee.progress.filter(p => p.completed).length;
                        const completionPercentage = employeeTasks.length > 0 
                          ? Math.round((completedTasks / employeeTasks.length) * 100)
                          : 0;
                        
                        return (
                          <Card key={employee.id} className="border border-muted">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle>{employee.name}</CardTitle>
                                  <CardDescription className="flex items-center mt-1">
                                    <Badge variant="outline" className="mr-2">{employee.department}</Badge>
                                    {employee.position && employee.position}
                                  </CardDescription>
                                </div>
                                <Badge variant={completionPercentage === 100 ? "default" : "outline"}>
                                  {completionPercentage}% Complete
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="mb-4">
                                <Progress value={completionPercentage} className="h-2" />
                              </div>
                              
                              <div className="space-y-2">
                                {employeeTasks.map(task => {
                                  const taskProgress = employee.progress.find(p => p.taskId === task.id);
                                  return (
                                    <div key={task.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                                      <div className="flex items-center">
                                        <Checkbox 
                                          checked={taskProgress?.completed || false}
                                          onCheckedChange={(checked) => {
                                            updateTaskCompletion(employee.id, task.id, checked === true);
                                          }}
                                          className="mr-2"
                                        />
                                        <span className={taskProgress?.completed ? "line-through text-muted-foreground" : ""}>
                                          {task.title}
                                        </span>
                                      </div>
                                      {task.is_required && (
                                        <Badge variant="outline">Required</Badge>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Completion by Department</CardTitle>
                <CardDescription>Overview of onboarding progress across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {['engineering', 'marketing', 'sales', 'hr', 'operations', 'finance', 'it', 'warehouse', 'logistics', 'ehs', 'management', 'planning', 'procurement'].map(dept => {
                    const completionRate = calculateDepartmentCompletion(dept as DepartmentType);
                    
                    // Count employees in department
                    const deptEmployeeCount = employees.filter(emp => emp.department === dept).length;
                    
                    return (
                      <div key={dept} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">{dept}</Badge>
                            <span className="text-sm text-muted-foreground">
                              ({deptEmployeeCount} {deptEmployeeCount === 1 ? 'employee' : 'employees'})
                            </span>
                          </div>
                          <Badge variant="default">
                            {completionRate}%
                          </Badge>
                        </div>
                        <Progress value={completionRate} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleDashboardLayout>
  );
}
