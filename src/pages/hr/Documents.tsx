
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, File, Folder } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data - would come from API in a real app
const employees = [
  { 
    id: 1, 
    name: 'John Doe', 
    department: 'Engineering', 
    role: 'Senior Developer',
    documentCount: 5
  },
  { 
    id: 2, 
    name: 'Sarah Smith', 
    department: 'Marketing', 
    role: 'Marketing Specialist',
    documentCount: 3
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    department: 'Sales', 
    role: 'Account Manager',
    documentCount: 7
  },
  { 
    id: 4, 
    name: 'Emma Brown', 
    department: 'HR', 
    role: 'HR Assistant',
    documentCount: 4
  },
  { 
    id: 5, 
    name: 'Alex Wilson', 
    department: 'Operations', 
    role: 'Operations Manager',
    documentCount: 2
  },
];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filteredEmployees = employees.filter(
    employee => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee Documents</h1>
          <p className="text-muted-foreground">
            Access and manage employee documents and records
          </p>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center sm:justify-between">
              <CardTitle>Document Directory</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <CardDescription>Select an employee to view or manage their documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Documents</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <TableRow 
                        key={employee.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/hr/documents/${employee.id}`)}
                      >
                        <TableCell className="font-medium flex items-center">
                          <Folder className="mr-2 h-4 w-4 text-blue-500" />
                          {employee.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{employee.department}</Badge>
                        </TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <File className="mr-2 h-4 w-4 text-muted-foreground" />
                            {employee.documentCount}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No employees found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
