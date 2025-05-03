
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter, 
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Building, User, ArrowRight, ArrowLeft, ArrowUpDown, Trash2, Plus } from 'lucide-react';

// Mock data for company assets
const mockAssets = [
  { id: '1', name: 'Dell Laptop XPS 15', assignedTo: 'John Doe', department: 'Field Operations', serialNumber: 'DL-XPS15-001' },
  { id: '2', name: 'Huawei P40 Pro', assignedTo: 'Jane Smith', department: 'Customer Support', serialNumber: 'HP-P40P-002' },
  { id: '3', name: 'iPad Pro 12.9', assignedTo: 'Alex Johnson', department: 'Technical Support', serialNumber: 'IP-PRO-003' },
  { id: '4', name: 'Fiber Optic Tool Kit', assignedTo: null, department: null, serialNumber: 'FO-TK-004' },
  { id: '5', name: 'Network Tester', assignedTo: 'Michael Brown', department: 'Network Operations', serialNumber: 'NT-001' },
];

// Mock data for users
const mockUsers = [
  { id: '1', name: 'John Doe', department: 'Field Operations' },
  { id: '2', name: 'Jane Smith', department: 'Customer Support' },
  { id: '3', name: 'Alex Johnson', department: 'Technical Support' },
  { id: '4', name: 'Michael Brown', department: 'Network Operations' },
  { id: '5', name: 'Sarah Wilson', department: 'Administration' },
];

const Assets = () => {
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetSerial, setNewAssetSerial] = useState('');

  // Calculate assigned and unassigned assets
  const assignedAssets = mockAssets.filter(asset => asset.assignedTo);
  const unassignedAssets = mockAssets.filter(asset => !asset.assignedTo);

  const handleAssetAssign = () => {
    if (!selectedAsset || !selectedUser) {
      toast({
        title: "Missing Information",
        description: "Please select both an asset and a user",
        variant: "destructive"
      });
      return;
    }
    
    const user = mockUsers.find(u => u.id === selectedUser);
    
    toast({
      title: "Asset Assigned",
      description: `${selectedAsset.name} has been assigned to ${user?.name}`
    });
    
    // Reset selections
    setSelectedAsset(null);
    setSelectedUser('');
  };

  const handleAssetUnassign = (asset: any) => {
    toast({
      title: "Asset Unassigned",
      description: `${asset.name} has been unassigned from ${asset.assignedTo}`
    });
  };

  const handleAssetTransfer = (asset: any) => {
    if (!selectedUser) {
      toast({
        title: "Missing Information",
        description: "Please select a user to transfer to",
        variant: "destructive"
      });
      return;
    }
    
    const user = mockUsers.find(u => u.id === selectedUser);
    
    toast({
      title: "Asset Transferred",
      description: `${asset.name} has been transferred from ${asset.assignedTo} to ${user?.name}`
    });
    
    setSelectedUser('');
  };

  const handleAssetDelete = (asset: any) => {
    toast({
      title: "Deletion Request Sent",
      description: `Request to delete ${asset.name} has been sent to management for approval`,
    });
  };

  const handleAddAsset = () => {
    if (!newAssetName || !newAssetSerial) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and serial number",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Asset Added",
      description: `${newAssetName} has been added to company assets`
    });
    
    // Reset form
    setNewAssetName('');
    setNewAssetSerial('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Company Assets</h1>
          <p className="mt-2 text-muted-foreground">Manage and track company equipment and assets.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold">{mockAssets.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Assets</div>
          </div>
          
          <div className="bg-card border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold">{assignedAssets.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Assigned Assets</div>
          </div>
          
          <div className="bg-card border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold">{unassignedAssets.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Available Assets</div>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Asset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Asset</DialogTitle>
                  <DialogDescription>Enter the details for the new company asset</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="asset-name">Asset Name</Label>
                    <Input 
                      id="asset-name"
                      value={newAssetName}
                      onChange={(e) => setNewAssetName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="serial-number">Serial Number</Label>
                    <Input 
                      id="serial-number"
                      value={newAssetSerial}
                      onChange={(e) => setNewAssetSerial(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddAsset}>Add Asset</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Asset Assignment</h2>
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <div>
                <Label>Select Asset</Label>
                <Select onValueChange={(value) => setSelectedAsset(unassignedAssets.find(a => a.id === value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an unassigned asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {unassignedAssets.map(asset => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Assign To</Label>
                <Select onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full" onClick={handleAssetAssign}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Assign Asset
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Asset Inventory</h2>
            
            <Table>
              <TableCaption>Complete list of company assets</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{asset.serialNumber}</TableCell>
                    <TableCell>{asset.assignedTo ? 'Assigned' : 'Available'}</TableCell>
                    <TableCell>{asset.assignedTo || '—'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {asset.assignedTo ? (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <ArrowUpDown className="mr-1 h-3 w-3" />
                                  Transfer
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Transfer Asset</DialogTitle>
                                  <DialogDescription>
                                    Transfer {asset.name} from {asset.assignedTo} to another user
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <Label>Transfer To</Label>
                                  <Select onValueChange={setSelectedUser}>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {mockUsers
                                        .filter(user => user.name !== asset.assignedTo)
                                        .map(user => (
                                          <SelectItem key={user.id} value={user.id}>
                                            {user.name} ({user.department})
                                          </SelectItem>
                                        ))
                                      }
                                    </SelectContent>
                                  </Select>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button onClick={() => handleAssetTransfer(asset)}>Transfer</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAssetUnassign(asset)}
                            >
                              <ArrowLeft className="mr-1 h-3 w-3" />
                              Unassign
                            </Button>
                          </>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <ArrowRight className="mr-1 h-3 w-3" />
                                Assign
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Asset</DialogTitle>
                                <DialogDescription>
                                  Assign {asset.name} to a user
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <Label>Assign To</Label>
                                <Select onValueChange={setSelectedUser}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select a user" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mockUsers.map(user => (
                                      <SelectItem key={user.id} value={user.id}>
                                        {user.name} ({user.department})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={handleAssetAssign}>Assign</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Asset</DialogTitle>
                              <DialogDescription>
                                This will send a deletion request to management for approval.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="text-destructive">
                                Are you sure you want to request deletion of {asset.name}?
                              </p>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button 
                                variant="destructive"
                                onClick={() => handleAssetDelete(asset)}
                              >
                                Request Deletion
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Assets;
