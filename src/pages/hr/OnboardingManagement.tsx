
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { HRSidebar } from '@/components/hr/HRSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { supabase } from '@/integrations/supabase/client';
import { 
  Profile, 
  OnboardingTask, 
  UserOnboardingProgress,
  DepartmentType
} from '@/types/onboarding';
import { 
  Trash2, 
  Plus, 
  PenLine, 
  ClipboardCheck, 
  Users, 
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

type SortDirection = 'asc' | 'desc';
type SortField = 'name' | 'department' | 'position' | 'hire_date' | 'progress';

const OnboardingManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Profile[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, UserOnboardingProgress[]>>({});
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>('hire_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Task dialog states
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<OnboardingTask | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDepartment, setTaskDepartment] = useState<DepartmentType | "">("");
  const [taskEstimatedTime, setTaskEstimatedTime] = useState("");
  const [taskRequired, setTaskRequired] = useState(true);
  const [taskOrder, setTaskOrder] = useState(1);
  
  // Fetch employees and onboarding data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all employees
        const { data: employeesData, error: employeesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (employeesError) throw employeesError;
        
        // Fetch all tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('onboarding_tasks')
          .select('*')
          .order('department', { ascending: true })
          .order('sequence_order', { ascending: true });
        
        if (tasksError) throw tasksError;
        
        // Fetch all progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_onboarding_progress')
          .select('*');
        
        if (progressError) throw progressError;
        
        // Group progress by user
        const progressByUser: Record<string, UserOnboardingProgress[]> = {};
        progressData.forEach(progress => {
          if (!progressByUser[progress.user_id]) {
            progressByUser[progress.user_id] = [];
          }
          progressByUser[progress.user_id].push(progress);
        });
        
        setEmployees(employeesData || []);
        setFilteredEmployees(employeesData || []);
        setTasks(tasksData || []);
        setProgressMap(progressByUser);
      } catch (error) {
        console.error('Error fetching onboarding data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch onboarding data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  // Apply filters and search
  useEffect(() => {
    let filtered = [...employees];
    
    // Apply department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        employee => employee.department === departmentFilter
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        employee =>
          (employee.name && employee.name.toLowerCase().includes(query)) ||
          (employee.email && employee.email.toLowerCase().includes(query)) ||
          (employee.position && employee.position.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortField === 'progress') {
        const aProgress = calculateProgress(a.id);
        const bProgress = calculateProgress(b.id);
        return sortDirection === 'asc' ? aProgress - bProgress : bProgress - aProgress;
      }
      
      // For other fields
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredEmployees(filtered);
  }, [employees, departmentFilter, searchQuery, sortField, sortDirection]);
  
  const calculateProgress = (userId: string): number => {
    const userProgress = progressMap[userId] || [];
    if (userProgress.length === 0) return 0;
    
    const completed = userProgress.filter(p => p.completed).length;
    return Math.round((completed / userProgress.length) * 100);
  };
  
  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const resetTaskDialog = () => {
    setSelectedTask(null);
    setTaskTitle("");
    setTaskDescription("");
    setTaskDepartment("");
    setTaskEstimatedTime("");
    setTaskRequired(true);
    setTaskOrder(1);
  };
  
  const openAddTaskDialog = () => {
    resetTaskDialog();
    setIsTaskDialogOpen(true);
  };
  
  const openEditTaskDialog = (task: OnboardingTask) => {
    setSelectedTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || "");
    setTaskDepartment(task.department);
    setTaskEstimatedTime(task.estimated_time || "");
    setTaskRequired(task.is_required || true);
    setTaskOrder(task.sequence_order);
    setIsTaskDialogOpen(true);
  };
  
  const handleSaveTask = async () => {
    if (!taskTitle || !taskDepartment) {
      toast({
        title: "Error",
        description: "Title and department are required.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const taskData = {
        title: taskTitle,
        description: taskDescription,
        department: taskDepartment,
        estimated_time: taskEstimatedTime,
        is_required: taskRequired,
        sequence_order: taskOrder
      };
      
      if (selectedTask) {
        // Update existing task
        const { error } = await supabase
          .from('onboarding_tasks')
          .update(taskData)
          .eq('id', selectedTask.id);
          
        if (error) throw error;
        
        toast({
          title: "Task Updated",
          description: "The onboarding task has been updated.",
          variant: "secondary",
        });
      } else {
        // Create new task
        const { error } = await supabase
          .from('onboarding_tasks')
          .insert([taskData]);
          
        if (error) throw error;
        
        toast({
          title: "Task Created",
          description: "New onboarding task has been created.",
          variant: "secondary",
        });
      }
      
      // Refresh tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('onboarding_tasks')
        .select('*')
        .order('department', { ascending: true })
        .order('sequence_order', { ascending: true });
      
      if (tasksError) throw tasksError;
      setTasks(tasksData || []);
      
      setIsTaskDialogOpen(false);
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: "Error",
        description: "Failed to save onboarding task.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('onboarding_tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
      
      setTasks(tasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Task Deleted",
        description: "The onboarding task has been deleted.",
        variant: "secondary",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete onboarding task.",
        variant: "destructive",
      });
    }
  };
  
  // Department options for filters and forms
  const departmentOptions: { value: string, label: string }[] = [
    { value: "all", label: "All Departments" },
    { value: "engineering", label: "Engineering" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "hr", label: "HR" },
    { value: "operations", label: "Operations" },
    { value: "finance", label: "Finance" },
    { value: "it", label: "IT" },
    { value: "warehouse", label: "Warehouse" },
    { value: "logistics", label: "Logistics" },
    { value: "ehs", label: "EHS" },
    { value: "management", label: "Management" },
    { value: "planning", label: "Planning" },
    { value: "procurement", label: "Procurement" }
  ];
  
  return (
    <DashboardLayout sidebar={<HRSidebar />}>
      <SidebarInset>
        <div className="flex flex-col space-y-6 p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Employee Onboarding</h1>
            <p className="text-muted-foreground">
              Manage onboarding tasks and track employee progress
            </p>
          </div>
          
          <Tabs defaultValue="employees">
            <TabsList>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="tasks">Onboarding Tasks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="employees" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Employee Onboarding Progress</CardTitle>
                  <CardDescription>
                    Track the onboarding progress of all employees
                  </CardDescription>
                  
                  <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search employees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Filter by Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center my-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left p-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleSort('name')}
                                className="flex items-center"
                              >
                                Name
                                {sortField === 'name' && (
                                  sortDirection === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                                )}
                              </Button>
                            </th>
                            <th className="text-left p-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleSort('department')}
                                className="flex items-center"
                              >
                                Department
                                {sortField === 'department' && (
                                  sortDirection === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                                )}
                              </Button>
                            </th>
                            <th className="text-left p-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleSort('position')}
                                className="flex items-center"
                              >
                                Position
                                {sortField === 'position' && (
                                  sortDirection === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                                )}
                              </Button>
                            </th>
                            <th className="text-left p-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleSort('hire_date')}
                                className="flex items-center"
                              >
                                Hire Date
                                {sortField === 'hire_date' && (
                                  sortDirection === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                                )}
                              </Button>
                            </th>
                            <th className="text-left p-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleSort('progress')}
                                className="flex items-center"
                              >
                                Progress
                                {sortField === 'progress' && (
                                  sortDirection === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                                )}
                              </Button>
                            </th>
                            <th className="text-left p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEmployees.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center py-4">
                                No employees found
                              </td>
                            </tr>
                          ) : (
                            filteredEmployees.map(employee => {
                              const progress = calculateProgress(employee.id);
                              return (
                                <tr key={employee.id} className="border-t">
                                  <td className="p-2">{employee.name || 'N/A'}</td>
                                  <td className="p-2">
                                    {employee.department ? (
                                      <Badge variant="outline">{employee.department}</Badge>
                                    ) : 'Not set'}
                                  </td>
                                  <td className="p-2">{employee.position || 'N/A'}</td>
                                  <td className="p-2">{employee.hire_date || 'N/A'}</td>
                                  <td className="p-2">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                          className={`h-2.5 rounded-full ${getProgressColor(progress)}`} 
                                          style={{width: `${progress}%`}}
                                        ></div>
                                      </div>
                                      <span className="text-sm font-medium">{progress}%</span>
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    {progress >= 100 ? (
                                      <Badge variant="secondary">Completed</Badge>
                                    ) : progress > 0 ? (
                                      <Badge variant="secondary">In Progress</Badge>
                                    ) : (
                                      <Badge variant="outline">Not Started</Badge>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Onboarding Tasks</CardTitle>
                      <CardDescription>
                        Manage tasks for employee onboarding
                      </CardDescription>
                    </div>
                    <Button onClick={openAddTaskDialog}>
                      <Plus className="mr-1 h-4 w-4" /> Add Task
                    </Button>
                  </div>
                  
                  <div className="flex gap-4 mt-4">
                    <Select 
                      value={departmentFilter === "all" ? "all" : departmentFilter} 
                      onValueChange={setDepartmentFilter}
                    >
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Filter by Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center my-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left p-2">#</th>
                            <th className="text-left p-2">Title</th>
                            <th className="text-left p-2">Department</th>
                            <th className="text-left p-2">Est. Time</th>
                            <th className="text-left p-2">Required</th>
                            <th className="text-left p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks
                            .filter(task => departmentFilter === "all" || task.department === departmentFilter)
                            .map((task, index) => (
                              <tr key={task.id} className="border-t">
                                <td className="p-2">{task.sequence_order}</td>
                                <td className="p-2">{task.title}</td>
                                <td className="p-2">
                                  <Badge variant="outline">{task.department}</Badge>
                                </td>
                                <td className="p-2">{task.estimated_time || 'N/A'}</td>
                                <td className="p-2">
                                  {task.is_required ? (
                                    <Badge variant="secondary">Required</Badge>
                                  ) : (
                                    <Badge variant="outline">Optional</Badge>
                                  )}
                                </td>
                                <td className="p-2">
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => openEditTaskDialog(task)}
                                    >
                                      <PenLine className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleDeleteTask(task.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          {tasks.filter(task => departmentFilter === "all" || task.department === departmentFilter).length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-4">
                                No tasks found for this department
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Task Dialog */}
          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{selectedTask ? "Edit Onboarding Task" : "Add Onboarding Task"}</DialogTitle>
                <DialogDescription>
                  {selectedTask 
                    ? "Edit the details of this onboarding task." 
                    : "Create a new onboarding task for employees."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department
                  </Label>
                  <Select
                    value={taskDepartment}
                    onValueChange={(value) => setTaskDepartment(value as DepartmentType)}
                  >
                    <SelectTrigger id="department" className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentOptions
                        .filter(option => option.value !== "all")
                        .map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="estimatedTime" className="text-right">
                    Est. Time
                  </Label>
                  <Input
                    id="estimatedTime"
                    value={taskEstimatedTime}
                    onChange={(e) => setTaskEstimatedTime(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. 30 minutes, 1 hour"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="order" className="text-right">
                    Sequence
                  </Label>
                  <Input
                    id="order"
                    type="number"
                    value={taskOrder}
                    onChange={(e) => setTaskOrder(parseInt(e.target.value) || 1)}
                    min="1"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="required" className="text-right">
                    Required
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="required"
                      checked={taskRequired}
                      onCheckedChange={setTaskRequired}
                    />
                    <Label htmlFor="required">Mark as required task</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTask}>
                  {selectedTask ? "Save Changes" : "Create Task"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
        </div>
      </SidebarInset>
    </DashboardLayout>
  );
};

export default OnboardingManagement;
