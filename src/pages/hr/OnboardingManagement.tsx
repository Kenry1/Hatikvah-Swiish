
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { HRSidebar } from '@/components/hr/HRSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { 
  Profile, 
  OnboardingTask, 
  UserOnboardingProgress, 
  DepartmentType 
} from '@/types/onboarding';
import { 
  PlusCircle, 
  Users, 
  ClipboardList, 
  Search,
  Edit,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DepartmentSelector } from '@/components/onboarding/DepartmentSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmployeeProgressProps {
  employeeId: string;
}

const EmployeeProgress: React.FC<EmployeeProgressProps> = ({ employeeId }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [progress, setProgress] = useState<UserOnboardingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', employeeId)
          .single();
          
        if (profileError) throw profileError;
        setProfile(profileData);
        
        if (profileData.department) {
          // Fetch tasks
          const { data: tasksData, error: tasksError } = await supabase
            .from('onboarding_tasks')
            .select('*')
            .eq('department', profileData.department)
            .order('sequence_order', { ascending: true });
            
          if (tasksError) throw tasksError;
          setTasks(tasksData || []);
          
          // Fetch progress
          const { data: progressData, error: progressError } = await supabase
            .from('user_onboarding_progress')
            .select(`
              *,
              task:task_id (*)
            `)
            .eq('user_id', employeeId);
            
          if (progressError) throw progressError;
          setProgress(progressData || []);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        toast({
          title: "Error",
          description: "Failed to load employee data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [employeeId, toast]);
  
  const completedTasks = progress.filter(p => p.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  return (
    <div className="space-y-4">
      {loading ? (
        <div>Loading employee data...</div>
      ) : profile ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.position} • {profile.email}</p>
            </div>
            <Badge variant={completionPercentage === 100 ? "success" : "secondary"}>
              {completionPercentage}% Complete
            </Badge>
          </div>
          
          <Progress value={completionPercentage} className="h-2" />
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completed On</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(task => {
                const taskProgress = progress.find(p => p.task_id === task.id);
                return (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>
                      {task.is_required ? 
                        <Badge variant="destructive">Required</Badge> : 
                        <Badge variant="outline">Optional</Badge>
                      }
                    </TableCell>
                    <TableCell>
                      {taskProgress?.completed ? 
                        <Badge variant="success">Completed</Badge> : 
                        <Badge variant="outline">Pending</Badge>
                      }
                    </TableCell>
                    <TableCell>
                      {taskProgress?.completed_at ? 
                        new Date(taskProgress.completed_at).toLocaleDateString() : 
                        '-'
                      }
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {taskProgress?.notes || '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Employee not found or has no department assigned.
        </div>
      )}
    </div>
  );
};

const NewTaskForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<{
    department: DepartmentType | '';
    title: string;
    description: string;
    estimated_time: string;
    sequence_order: number;
    is_required: boolean;
  }>({
    department: '',
    title: '',
    description: '',
    estimated_time: '',
    sequence_order: 1,
    is_required: true
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleDepartmentChange = (department: DepartmentType) => {
    setFormData(prev => ({ ...prev, department }));
  };
  
  const handleRequiredChange = (required: boolean) => {
    setFormData(prev => ({ ...prev, is_required: required }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.department || !formData.title) {
      toast({
        title: "Error",
        description: "Department and title are required.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('onboarding_tasks')
        .insert({
          department: formData.department,
          title: formData.title,
          description: formData.description,
          estimated_time: formData.estimated_time,
          sequence_order: formData.sequence_order,
          is_required: formData.is_required
        });
      
      if (error) throw error;
      
      toast({
        title: "Task Created",
        description: "The onboarding task has been created successfully."
      });
      
      // Reset form
      setFormData({
        department: '',
        title: '',
        description: '',
        estimated_time: '',
        sequence_order: 1,
        is_required: true
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create the onboarding task.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData.department}
          onValueChange={handleDepartmentChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="hr">Human Resources</SelectItem>
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
      
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimated_time">Estimated Time</Label>
          <Input
            id="estimated_time"
            name="estimated_time"
            value={formData.estimated_time}
            onChange={handleChange}
            placeholder="e.g. 30 minutes, 2 hours"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sequence_order">Sequence Order</Label>
          <Input
            id="sequence_order"
            name="sequence_order"
            type="number"
            value={formData.sequence_order}
            onChange={handleChange}
            min={1}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Required</Label>
        <Select
          value={formData.is_required ? "true" : "false"}
          onValueChange={(value) => handleRequiredChange(value === "true")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Is this task required?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes, required</SelectItem>
            <SelectItem value="false">No, optional</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
};

const OnboardingManagement = () => {
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType | 'all'>('all');
  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('department', { ascending: true })
        .order('name', { ascending: true });
        
      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_tasks')
        .select('*')
        .order('department', { ascending: true })
        .order('sequence_order', { ascending: true });
        
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    Promise.all([fetchEmployees(), fetchTasks()]);
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      (employee.name && employee.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.position && employee.position.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const filteredTasks = selectedDepartment === 'all' 
    ? tasks 
    : tasks.filter(task => task.department === selectedDepartment);

  const departmentCounts: Record<string, number> = {};
  employees.forEach(employee => {
    const dept = employee.department || 'unassigned';
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });

  return (
    <DashboardLayout sidebar={<HRSidebar />}>
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Employee Onboarding Management</h1>
              <p className="text-muted-foreground">
                Manage employee onboarding processes and tasks
              </p>
            </div>
            <Button onClick={() => {
              fetchEmployees();
              fetchTasks();
            }}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{employees.length}</div>
                <p className="text-muted-foreground text-sm mt-1">Across all departments</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Onboarding Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{tasks.length}</div>
                <p className="text-muted-foreground text-sm mt-1">Department-specific tasks</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Object.keys(departmentCounts).length}
                </div>
                <p className="text-muted-foreground text-sm mt-1">With assigned employees</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="employees">
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex">
              <TabsTrigger value="employees">
                <Users className="mr-2 h-4 w-4" />
                Employees
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <ClipboardList className="mr-2 h-4 w-4" />
                Onboarding Tasks
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="employees" className="space-y-4 mt-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-60">
                  <Select
                    value={selectedDepartment}
                    onValueChange={(value: DepartmentType | 'all') => setSelectedDepartment(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
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
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Hire Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Loading employees...
                          </TableCell>
                        </TableRow>
                      ) : filteredEmployees.length > 0 ? (
                        filteredEmployees.map(employee => (
                          <TableRow key={employee.id}>
                            <TableCell>{employee.name || '-'}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>
                              {employee.department ? (
                                <Badge variant="outline" className="capitalize">
                                  {employee.department}
                                </Badge>
                              ) : (
                                <Badge variant="destructive">Not Assigned</Badge>
                              )}
                            </TableCell>
                            <TableCell>{employee.position || '-'}</TableCell>
                            <TableCell>
                              {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setSelectedEmployeeId(employee.id)}
                                  >
                                    View Progress
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Onboarding Progress</DialogTitle>
                                    <DialogDescription>
                                      View this employee's onboarding progress
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedEmployeeId && (
                                    <EmployeeProgress employeeId={selectedEmployeeId} />
                                  )}
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No employees found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-4 mt-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="w-full md:w-60">
                  <Select
                    value={selectedDepartment}
                    onValueChange={(value: DepartmentType | 'all') => setSelectedDepartment(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
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
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Onboarding Task</DialogTitle>
                      <DialogDescription>
                        Add a new onboarding task for a department
                      </DialogDescription>
                    </DialogHeader>
                    <NewTaskForm />
                  </DialogContent>
                </Dialog>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Estimated Time</TableHead>
                        <TableHead>Sequence</TableHead>
                        <TableHead>Required</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Loading tasks...
                          </TableCell>
                        </TableRow>
                      ) : filteredTasks.length > 0 ? (
                        filteredTasks.map(task => (
                          <TableRow key={task.id}>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {task.department}
                              </Badge>
                            </TableCell>
                            <TableCell>{task.title}</TableCell>
                            <TableCell className="max-w-xs truncate">{task.description || '-'}</TableCell>
                            <TableCell>{task.estimated_time || '-'}</TableCell>
                            <TableCell>{task.sequence_order}</TableCell>
                            <TableCell>
                              {task.is_required ? (
                                <Badge variant="destructive">Required</Badge>
                              ) : (
                                <Badge variant="outline">Optional</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No tasks found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </DashboardLayout>
  );
};

export default OnboardingManagement;
