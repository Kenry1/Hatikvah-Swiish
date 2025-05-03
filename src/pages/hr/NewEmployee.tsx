
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const DEPARTMENTS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'HR' },
  { value: 'operations', label: 'Operations' },
  { value: 'finance', label: 'Finance' },
];

const ROLES = {
  engineering: [
    { value: 'developer', label: 'Developer' },
    { value: 'senior_developer', label: 'Senior Developer' },
    { value: 'tech_lead', label: 'Tech Lead' },
    { value: 'qa_engineer', label: 'QA Engineer' },
  ],
  marketing: [
    { value: 'marketing_specialist', label: 'Marketing Specialist' },
    { value: 'content_creator', label: 'Content Creator' },
    { value: 'social_media_manager', label: 'Social Media Manager' },
  ],
  sales: [
    { value: 'sales_representative', label: 'Sales Representative' },
    { value: 'account_manager', label: 'Account Manager' },
    { value: 'sales_director', label: 'Sales Director' },
  ],
  hr: [
    { value: 'hr_assistant', label: 'HR Assistant' },
    { value: 'hr_specialist', label: 'HR Specialist' },
    { value: 'hr_manager', label: 'HR Manager' },
  ],
  operations: [
    { value: 'operations_analyst', label: 'Operations Analyst' },
    { value: 'operations_manager', label: 'Operations Manager' },
    { value: 'logistics_coordinator', label: 'Logistics Coordinator' },
  ],
  finance: [
    { value: 'accountant', label: 'Accountant' },
    { value: 'financial_analyst', label: 'Financial Analyst' },
    { value: 'finance_manager', label: 'Finance Manager' },
  ],
};

const PERMISSIONS = [
  { id: 'internal_systems', label: 'Internal Systems' },
  { id: 'project_management', label: 'Project Management' },
  { id: 'customer_data', label: 'Customer Data' },
  { id: 'financial_data', label: 'Financial Data' },
  { id: 'reporting', label: 'Reporting' },
  { id: 'code_repository', label: 'Code Repository' },
  { id: 'sales_data', label: 'Sales Data' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'employee_records', label: 'Employee Records' },
  { id: 'recruitment', label: 'Recruitment' },
];

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  department: string;
  role: string;
  permissions: string[];
}

const NewEmployee = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: '',
    permissions: [],
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value, role: '' }));
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };
  
  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permission],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permission),
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.department || !formData.role) {
      toast({
        title: "Missing information",
        description: "Please select a department and role",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // In a real application, you would send this data to an API
    setTimeout(() => {
      toast({
        title: "Employee created",
        description: `${formData.username} has been added successfully`,
      });
      setIsSubmitting(false);
      navigate('/hr/employees');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Employee</h1>
            <p className="text-muted-foreground">
              Create a new employee account and set up access controls
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/hr/employees')}>
            Back to Employees
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Set up login credentials for the new employee
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="Enter username"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Department & Role</CardTitle>
                <CardDescription>
                  Assign the employee to a department and role
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select onValueChange={handleDepartmentChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map(dept => (
                          <SelectItem key={dept.value} value={dept.value}>
                            {dept.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      onValueChange={handleRoleChange} 
                      disabled={!formData.department}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          formData.department ? "Select role" : "Select department first"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.department && ROLES[formData.department as keyof typeof ROLES].map(role => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Permissions & Access Rights</CardTitle>
                <CardDescription>
                  Select the access permissions for this employee
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-3">General Permissions</h4>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {PERMISSIONS.slice(0, 5).map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={permission.id}>{permission.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Department-Specific Permissions</h4>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {PERMISSIONS.slice(5).map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={permission.id}>{permission.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/hr/employees')}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Employee"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default NewEmployee;
