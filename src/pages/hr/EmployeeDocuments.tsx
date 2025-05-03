
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, Upload, ArrowLeft, Plus, Image } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';

// Mock data - in a real app this would come from an API
const employeesData = [
  { id: '1', name: 'John Doe', department: 'Engineering', role: 'Senior Developer' },
  { id: '2', name: 'Sarah Smith', department: 'Marketing', role: 'Marketing Specialist' },
  { id: '3', name: 'Mike Johnson', department: 'Sales', role: 'Account Manager' },
  { id: '4', name: 'Emma Brown', department: 'HR', role: 'HR Assistant' },
  { id: '5', name: 'Alex Wilson', department: 'Operations', role: 'Operations Manager' },
];

const documentTypes = [
  'Contract',
  'ID Documents',
  'Certifications',
  'Performance Reviews',
  'Training Records',
  'Other'
];

const mockDocuments = [
  { id: '1', employeeId: '1', name: 'Employment Contract.pdf', type: 'Contract', dateUploaded: '2023-05-15', size: '1.2 MB' },
  { id: '2', employeeId: '1', name: 'Driver License.jpg', type: 'ID Documents', dateUploaded: '2023-05-15', size: '0.8 MB' },
  { id: '3', employeeId: '1', name: 'Cybersecurity Certification.pdf', type: 'Certifications', dateUploaded: '2023-09-22', size: '2.1 MB' },
  { id: '4', employeeId: '1', name: 'Performance Review Q3 2023.docx', type: 'Performance Reviews', dateUploaded: '2023-10-05', size: '0.5 MB' },
  { id: '5', employeeId: '1', name: 'Tax Form.pdf', type: 'Other', dateUploaded: '2023-01-30', size: '0.9 MB' },
  { id: '6', employeeId: '2', name: 'Marketing Contract.pdf', type: 'Contract', dateUploaded: '2022-11-10', size: '1.5 MB' },
  { id: '7', employeeId: '3', name: 'Sales Training Certificate.pdf', type: 'Training Records', dateUploaded: '2023-07-12', size: '1.1 MB' },
];

const EmployeeDocuments = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
  const { toast } = useToast();
  
  const employee = employeesData.find(emp => emp.id === employeeId);
  const documents = mockDocuments.filter(doc => doc.employeeId === employeeId);
  
  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would handle the actual file upload
    toast({
      title: "Document uploaded",
      description: "The document has been successfully uploaded.",
    });
    
    setUploadDialogOpen(false);
  };
  
  if (!employee) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-2xl font-bold">Employee not found</h2>
          <Button onClick={() => navigate('/hr/documents')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documents
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/hr/documents')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">{employee.name}'s Documents</h1>
            </div>
            <p className="text-muted-foreground ml-9">
              {employee.role} · {employee.department}
            </p>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a new document for {employee.name}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFileUpload}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="docType" className="text-right">
                      Document Type
                    </Label>
                    <Select>
                      <SelectTrigger id="docType" className="col-span-3">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="file" className="text-right">
                      File
                    </Label>
                    <div className="col-span-3">
                      <Input id="file" type="file" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      placeholder="Optional description"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="gallery" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 mb-4">
            <TabsTrigger value="gallery">Gallery View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <File size={48} className="text-muted-foreground" />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base truncate">{doc.name}</CardTitle>
                      <CardDescription>{doc.type}</CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(doc.dateUploaded).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">{doc.size}</span>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <Image className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No documents yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Upload documents to get started
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead>Size</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.length > 0 ? (
                        documents.map((doc) => (
                          <TableRow key={doc.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium flex items-center">
                              <File className="mr-2 h-4 w-4 text-blue-500" />
                              {doc.name}
                            </TableCell>
                            <TableCell>{doc.type}</TableCell>
                            <TableCell>{new Date(doc.dateUploaded).toLocaleDateString()}</TableCell>
                            <TableCell>{doc.size}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                            No documents found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDocuments;
