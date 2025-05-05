import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ListChecks, Edit, Filter, UserPlus, BarChart, CheckCircle } from "lucide-react";
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

// Mock data for team members
const teamMembers = [
  { id: 'TM001', name: 'John Smith', role: 'Lead Technician' },
  { id: 'TM002', name: 'Maria Garcia', role: 'Senior Technician' },
  { id: 'TM003', name: 'David Johnson', role: 'Technician' },
  { id: 'TM004', name: 'Sarah Wilson', role: 'Implementation Manager' },
  { id: 'TM005', name: 'Robert Chen', role: 'Project Manager' },
  { id: 'TM006', name: 'Lisa Brown', role: 'Warehouse Manager' },
];

// Mock data for tasks
const mockTasks = [
  {
    id: 'T001',
    name: 'Site Survey at Northside Office',
    description: 'Complete a detailed site survey for the upcoming network installation',
    assignee: teamMembers[0],
    priority: 'High',
    startDate: '2025-05-15',
    deadline: '2025-05-20',
    progress: 25,
    status: 'In Progress',
    project: 'Network Infrastructure Upgrade'
  },
  {
    id: 'T002',
    name: 'Install Network Switches',
    description: 'Install and configure 5 new network switches at the main office',
    assignee: teamMembers[1],
    priority: 'Medium',
    startDate: '2025-05-20',
    deadline: '2025-05-25',
    progress: 0,
    status: 'Not Started',
    project: 'Network Infrastructure Upgrade'
  },
  {
    id: 'T003',
    name: 'Run Fiber Optic Cables',
    description: 'Install fiber optic cables between floors 1-3',
    assignee: teamMembers[2],
    priority: 'Medium',
    startDate: '2025-05-25',
    deadline: '2025-06-01',
    progress: 0,
    status: 'Not Started',
    project: 'Network Infrastructure Upgrade'
  },
  {
    id: 'T004',
    name: 'Setup Solar Panel Mounts',
    description: 'Prepare roof mounting system for solar panel installation',
    assignee: teamMembers[1],
    priority: 'High',
    startDate: '2025-05-10',
    deadline: '2025-05-17',
    progress: 75,
    status: 'In Progress',
    project: 'Solar Panel Installation'
  },
];

const completedTasks = [
  {
    id: 'T005',
    name: 'Initial Client Meeting',
    description: 'Meet with client to discuss requirements and expectations',
    assignee: teamMembers[4],
    priority: 'High',
    startDate: '2025-04-05',
    deadline: '2025-04-05',
    progress: 100,
    status: 'Completed',
    completionDate: '2025-04-05',
    project: 'Network Infrastructure Upgrade'
  },
  {
    id: 'T006',
    name: 'Create Project Plan',
    description: 'Develop a comprehensive project plan with timelines and resource allocation',
    assignee: teamMembers[4],
    priority: 'High',
    startDate: '2025-04-06',
    deadline: '2025-04-10',
    progress: 100,
    status: 'Completed',
    completionDate: '2025-04-09',
    project: 'Network Infrastructure Upgrade'
  },
];

const TaskAssignments = () => {
  const [activeTasks, setActiveTasks] = useState([...mockTasks]);
  const [taskFilter, setTaskFilter] = useState('all');
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      assignee: '',
      priority: 'Medium',
      startDate: new Date(),
      deadline: new Date(),
      project: 'Network Infrastructure Upgrade'
    }
  };
  
  const handleFilterChange = (filter: string) => {
    setTaskFilter(filter);
    
    if (filter === 'all') {
      setActiveTasks([...mockTasks]);
    } else if (filter === 'high') {
      setActiveTasks(mockTasks.filter(task => task.priority === 'High'));
    } else if (filter === 'not-started') {
      setActiveTasks(mockTasks.filter(task => task.status === 'Not Started'));
    } else if (filter === 'in-progress') {
      setActiveTasks(mockTasks.filter(task => task.status === 'In Progress'));
    }
  };
  
  const viewTaskDetails = (task: any) => {
    setSelectedTask(task);
    setTaskDetailsOpen(true);
  };
  
  const handleEditTask = () => {
    if (selectedTask) {
      form.reset({
        name: selectedTask.name,
        description: selectedTask.description,
        assignee: selectedTask.assignee.id,
        priority: selectedTask.priority,
        startDate: new Date(selectedTask.startDate),
        deadline: new Date(selectedTask.deadline),
        project: selectedTask.project
      });
      
      setTaskDetailsOpen(false);
      setEditTaskDialogOpen(true);
    }
  };
  
  const handleAddTask = () => {
    form.reset({
      name: '',
      description: '',
      assignee: '',
      priority: 'Medium',
      startDate: new Date(),
      deadline: new Date(),
      project: 'Network Infrastructure Upgrade'
    });
    setAddTaskDialogOpen(true);
  };
  
  const onSubmitNewTask = (data: any) => {
    toast({
      title: "Task Created",
      description: `New task "${data.name}" has been created successfully.`,
    });
    setAddTaskDialogOpen(false);
    form.reset();
  };
  
  const onSubmitEditTask = (data: any) => {
    toast({
      title: "Task Updated",
      description: `Task "${data.name}" has been updated successfully.`,
    });
    setEditTaskDialogOpen(false);
    form.reset();
  };
  
  const handleCompleteTask = () => {
    toast({
      title: "Task Completed",
      description: `Task "${selectedTask?.name}" has been marked as completed.`,
    });
    setTaskDetailsOpen(false);
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-red-500">High</Badge>;
      case 'Medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'In Progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'Not Started':
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Task Assignments</h1>
          <div className="flex items-center space-x-2">
            <ListChecks className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-500">Task Management</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter tasks:</span>
            <div className="flex space-x-1">
              <Button 
                variant={taskFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('all')}
              >
                All
              </Button>
              <Button 
                variant={taskFilter === 'high' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('high')}
              >
                High Priority
              </Button>
              <Button 
                variant={taskFilter === 'not-started' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('not-started')}
              >
                Not Started
              </Button>
              <Button 
                variant={taskFilter === 'in-progress' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('in-progress')}
              >
                In Progress
              </Button>
            </div>
          </div>
          
          <Button onClick={handleAddTask}>
            <UserPlus className="h-4 w-4 mr-1" />
            Add New Task
          </Button>
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Tasks</CardTitle>
                <CardDescription>
                  Manage and monitor all ongoing and upcoming tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell>{task.project}</TableCell>
                        <TableCell>{task.assignee.name}</TableCell>
                        <TableCell>{task.deadline}</TableCell>
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell>
                          <div className="w-[100px] flex items-center gap-2">
                            <Progress value={task.progress} className="h-2" />
                            <span className="text-xs text-muted-foreground">{task.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewTaskDetails(task)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Completed Tasks</CardTitle>
                <CardDescription>
                  Review tasks that have been successfully completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Completed On</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell>{task.project}</TableCell>
                        <TableCell>{task.assignee.name}</TableCell>
                        <TableCell>{task.completionDate}</TableCell>
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Task Details Dialog */}
        <Dialog open={taskDetailsOpen} onOpenChange={setTaskDetailsOpen}>
          {selectedTask && (
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Task Details - {selectedTask.id}</DialogTitle>
                <DialogDescription>
                  View and manage task information
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 my-4">
                <div>
                  <h3 className="font-semibold mb-2">Task Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-medium">{selectedTask.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <p className="text-sm">{selectedTask.description}</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Project:</span>
                      <span>{selectedTask.project}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{getStatusBadge(selectedTask.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <span>{getPriorityBadge(selectedTask.priority)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Assignment Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assigned To:</span>
                      <span>{selectedTask.assignee.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span>{selectedTask.assignee.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span>{selectedTask.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span className="font-medium">{selectedTask.deadline}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-3 mb-4">
                <h3 className="font-semibold mb-2">Progress Tracking</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-blue-500" />
                    <span className="text-muted-foreground">Task Progress:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedTask.progress} className="h-2" />
                    <span className="text-sm">{selectedTask.progress}%</span>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between items-center">
                <div>
                  <Button 
                    variant="outline" 
                    onClick={() => setTaskDetailsOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="default"
                    onClick={handleCompleteTask}
                    disabled={selectedTask.status === 'Completed'}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Complete
                  </Button>
                  <Button onClick={handleEditTask}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Task
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
        
        {/* Add Task Dialog */}
        <Dialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task and assign it to a team member
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitNewTask)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter task name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project</FormLabel>
                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Network Infrastructure Upgrade">Network Infrastructure Upgrade</SelectItem>
                            <SelectItem value="Solar Panel Installation">Solar Panel Installation</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter task description" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="assignee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To</FormLabel>
                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teamMembers.map(member => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name} - {member.role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Deadline</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">Create Task</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Task Dialog */}
        <Dialog open={editTaskDialogOpen} onOpenChange={setEditTaskDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Update task details and assignments
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitEditTask)} className="space-y-4">
                {/* Same form fields as Add Task with pre-filled values */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter task name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project</FormLabel>
                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Network Infrastructure Upgrade">Network Infrastructure Upgrade</SelectItem>
                            <SelectItem value="Solar Panel Installation">Solar Panel Installation</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter task description" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="assignee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To</FormLabel>
                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teamMembers.map(member => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name} - {member.role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select defaultValue={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Deadline</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">Update Task</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TaskAssignments;
