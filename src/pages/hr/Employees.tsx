
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, UserPlus, FileUp } from "lucide-react";
import { EmployeeDetailsPanel } from '@/components/hr/EmployeeDetailsPanel';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock data - in a real app this would come from an API
const employees = [
  { 
    id: 1, 
    name: 'John Doe', 
    department: 'Engineering', 
    role: 'Senior Developer',
    joinDate: '2021-05-15',
    leaveDaysTaken: 12,
    completedTasks: 87,
    permissions: ['code_repository', 'project_management', 'internal_systems']
  },
  { 
    id: 2, 
    name: 'Sarah Smith', 
    department: 'Marketing', 
    role: 'Marketing Specialist',
    joinDate: '2022-01-10',
    leaveDaysTaken: 7,
    completedTasks: 54,
    permissions: ['social_media', 'content_management', 'customer_data']
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    department: 'Sales', 
    role: 'Account Manager',
    joinDate: '2020-11-20',
    leaveDaysTaken: 15,
    completedTasks: 123,
    permissions: ['sales_data', 'customer_management', 'quotations']
  },
  { 
    id: 4, 
    name: 'Emma Brown', 
    department: 'HR', 
    role: 'HR Assistant',
    joinDate: '2023-02-05',
    leaveDaysTaken: 3,
    completedTasks: 42,
    permissions: ['employee_records', 'recruitment', 'training']
  },
  { 
    id: 5, 
    name: 'Alex Wilson', 
    department: 'Operations', 
    role: 'Operations Manager',
    joinDate: '2019-08-12',
    leaveDaysTaken: 10,
    completedTasks: 210,
    permissions: ['facilities', 'inventory', 'scheduling']
  },
];

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const filteredEmployees = employees.filter(
    employee => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">
              Manage employee records and permissions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => window.location.href = '/hr/employees/new'}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Employee
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center sm:justify-between">
              <CardTitle>Employee Directory</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSearchTerm("Engineering")}>
                      Engineering
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSearchTerm("Marketing")}>
                      Marketing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSearchTerm("Sales")}>
                      Sales
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSearchTerm("HR")}>
                      HR
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSearchTerm("Operations")}>
                      Operations
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="hidden md:table-cell">Leave Days</TableHead>
                    <TableHead className="hidden md:table-cell">Tasks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id} className="cursor-pointer hover:bg-muted/50" onClick={() => {
                        setSelectedEmployee(employee);
                        setIsDetailsOpen(true);
                      }}>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{employee.department}</Badge>
                        </TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell className="hidden md:table-cell">{employee.leaveDaysTaken}</TableCell>
                        <TableCell className="hidden md:table-cell">{employee.completedTasks}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm">
                                <FileUp className="h-4 w-4" />
                                <span className="sr-only">Upload Documents</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Upload Employee Documents</DialogTitle>
                                <DialogDescription>
                                  Upload documents for {employee.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-1 gap-2">
                                  <label htmlFor="document-type" className="text-sm font-medium">
                                    Document Type
                                  </label>
                                  <select
                                    id="document-type"
                                    className="rounded-md border border-input p-2"
                                  >
                                    <option value="contract">Contract</option>
                                    <option value="id">ID Documents</option>
                                    <option value="certification">Certifications</option>
                                    <option value="performance">Performance Review</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                  <label htmlFor="file-upload" className="text-sm font-medium">
                                    Upload File
                                  </label>
                                  <Input id="file-upload" type="file" />
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                  <label htmlFor="notes" className="text-sm font-medium">
                                    Notes (Optional)
                                  </label>
                                  <textarea
                                    id="notes"
                                    rows={3}
                                    className="rounded-md border border-input p-2"
                                    placeholder="Add notes about this document"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <Button>Upload Document</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No employees found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {selectedEmployee && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Employee Details</DialogTitle>
                <DialogDescription>
                  View and manage employee profile information
                </DialogDescription>
              </DialogHeader>
              <EmployeeDetailsPanel employee={selectedEmployee} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Employees;
