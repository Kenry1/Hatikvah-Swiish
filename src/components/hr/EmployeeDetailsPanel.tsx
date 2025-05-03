
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, CheckSquare, FileText, User, Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

type EmployeeDetailsProps = {
  employee: {
    id: number;
    name: string;
    department: string;
    role: string;
    joinDate: string;
    leaveDaysTaken: number;
    completedTasks: number;
    permissions: string[];
  };
};

export const EmployeeDetailsPanel = ({ employee }: EmployeeDetailsProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(employee.permissions);
  const [isEditing, setIsEditing] = useState(false);
  
  const calculateDaysInCompany = () => {
    const joinDate = new Date(employee.joinDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permission]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
    }
  };
  
  const savePermissions = () => {
    // In a real app, you'd save to an API
    toast({
      title: "Permissions updated",
      description: `Updated permissions for ${employee.name}`,
    });
    setIsEditing(false);
  };

  // Mock documents
  const documents = [
    { id: 1, name: "Employment Contract.pdf", type: "Contract", date: "2021-05-15" },
    { id: 2, name: "ID Documents.zip", type: "ID", date: "2021-05-15" },
    { id: 3, name: "Performance Review 2022.pdf", type: "Performance", date: "2022-12-10" },
    { id: 4, name: "Training Certifications.pdf", type: "Certification", date: "2022-08-23" }
  ];
  
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="space-y-4 mt-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{employee.name}</h3>
            <p className="text-muted-foreground">
              {employee.role} - {employee.department}
            </p>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Days in Company</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateDaysInCompany()}</div>
              <p className="text-xs text-muted-foreground">
                Joined {new Date(employee.joinDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Leave Days Taken</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.leaveDaysTaken}</div>
              <p className="text-xs text-muted-foreground">
                Out of 30 annual leave days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                Tasks completed to date
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="permissions" className="space-y-4 mt-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Access Rights</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
            <CardDescription>
              Manage user permissions and access rights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">System Access</h4>
                    <div className="space-y-2">
                      {[
                        'internal_systems',
                        'project_management',
                        'customer_data',
                        'financial_data',
                        'reporting'
                      ].map(permission => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox 
                            id={permission}
                            checked={selectedPermissions.includes(permission)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission, checked as boolean)
                            }
                          />
                          <Label htmlFor={permission}>
                            {permission.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Department Specific</h4>
                    <div className="space-y-2">
                      {[
                        'code_repository',
                        'sales_data',
                        'inventory',
                        'employee_records',
                        'recruitment'
                      ].map(permission => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox 
                            id={permission}
                            checked={selectedPermissions.includes(permission)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission, checked as boolean)
                            }
                          />
                          <Label htmlFor={permission}>
                            {permission.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={savePermissions}>
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {employee.permissions.map(permission => (
                  <Badge key={permission} variant="secondary">
                    {permission.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="documents" className="space-y-4 mt-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Employee Documents</CardTitle>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                Upload Document
              </Button>
            </div>
            <CardDescription>
              View and manage employee documents and certifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map(doc => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{new Date(doc.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

// Helper component for the Table in the Documents tab
const Table = ({ children }: { children: React.ReactNode }) => (
  <table className="w-full">
    {children}
  </table>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead>
    {children}
  </thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>
    {children}
  </tbody>
);

const TableRow = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`border-b ${className || ""}`} {...props}>
    {children}
  </tr>
);

const TableHead = ({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={`p-4 text-left text-sm font-medium text-muted-foreground ${className || ""}`} {...props}>
    {children}
  </th>
);

const TableCell = ({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={`p-4 ${className || ""}`} {...props}>
    {children}
  </td>
);
