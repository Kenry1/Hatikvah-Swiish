
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Box, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Mock data for inventory items
const mockInventoryItems = {
  connections: [
    { id: '1', name: 'Huawei ONT', quantity: 15, serialNumbers: [] },
    { id: '2', name: 'Nokia Router', quantity: 8, serialNumbers: [] },
    { id: '3', name: 'Fiber Cable (50m)', quantity: 25, serialNumbers: null }
  ],
  rollout: [
    { id: '4', name: 'Conduit Pipes', quantity: 30, serialNumbers: null },
    { id: '5', name: 'Wall Mounts', quantity: 45, serialNumbers: null },
    { id: '6', name: 'Cable Ties (Pack)', quantity: 50, serialNumbers: null }
  ],
  ehs: [
    { id: '7', name: 'Safety Helmets', quantity: 20, serialNumbers: null },
    { id: '8', name: 'Reflective Vests', quantity: 25, serialNumbers: null },
    { id: '9', name: 'Work Gloves (Pair)', quantity: 40, serialNumbers: null }
  ]
};

const Inventory = () => {
  const { toast } = useToast();
  const [category, setCategory] = useState('connections');
  const [restockItem, setRestockItem] = useState({
    name: '',
    quantity: 0,
    serialNumber: ''
  });

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if serial number is required and provided
    const requiresSerial = ['Huawei', 'Nokia'].some(brand => 
      restockItem.name.toLowerCase().includes(brand.toLowerCase())
    );
    
    if (requiresSerial && !restockItem.serialNumber) {
      toast({
        title: "Serial Number Required",
        description: "Please enter a serial number for Huawei or Nokia items.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Inventory Updated",
      description: `Added ${restockItem.quantity} units of ${restockItem.name} to inventory.`
    });
    
    // Reset form
    setRestockItem({
      name: '',
      quantity: 0,
      serialNumber: ''
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="mt-2 text-muted-foreground">Manage warehouse inventory and field materials.</p>
        </div>

        <Tabs defaultValue={category} onValueChange={setCategory}>
          <TabsList className="w-full border-b">
            <TabsTrigger value="connections" className="flex items-center">
              <Box className="mr-2 h-4 w-4" />
              Connections
            </TabsTrigger>
            <TabsTrigger value="rollout" className="flex items-center">
              <Box className="mr-2 h-4 w-4" />
              Rollout
            </TabsTrigger>
            <TabsTrigger value="ehs" className="flex items-center">
              <Box className="mr-2 h-4 w-4" />
              EHS
            </TabsTrigger>
          </TabsList>
          
          {(['connections', 'rollout', 'ehs'] as const).map(cat => (
            <TabsContent key={cat} value={cat} className="pt-4">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium capitalize">{cat} Materials</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add {cat.charAt(0).toUpperCase() + cat.slice(1)} Material
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Restock {cat.charAt(0).toUpperCase() + cat.slice(1)} Material</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleRestockSubmit}>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label htmlFor="material-name">Material Name</Label>
                          <Input
                            id="material-name"
                            value={restockItem.name}
                            onChange={(e) => setRestockItem({...restockItem, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={restockItem.quantity || ''}
                            onChange={(e) => setRestockItem({...restockItem, quantity: parseInt(e.target.value)})}
                            required
                          />
                        </div>
                        {cat === 'connections' && (
                          <div>
                            <Label htmlFor="serial-number">
                              Serial Number
                              {['Huawei', 'Nokia'].some(brand => 
                                restockItem.name.toLowerCase().includes(brand.toLowerCase())
                              ) ? ' (Required for Huawei/Nokia items)' : ' (Optional)'}
                            </Label>
                            <Input
                              id="serial-number"
                              value={restockItem.serialNumber}
                              onChange={(e) => setRestockItem({...restockItem, serialNumber: e.target.value})}
                            />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Add to Inventory</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableCaption>Current inventory of {cat} materials</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInventoryItems[cat].map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="mr-1 h-3 w-3" />
                              Restock
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Restock {item.name}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleRestockSubmit}>
                              <div className="grid gap-4 py-4">
                                <div>
                                  <Label htmlFor={`quantity-${item.id}`}>Additional Quantity</Label>
                                  <Input
                                    id={`quantity-${item.id}`}
                                    type="number"
                                    min="1"
                                    required
                                  />
                                </div>
                                {cat === 'connections' && ['Huawei', 'Nokia'].some(brand => 
                                  item.name.toLowerCase().includes(brand.toLowerCase())
                                ) && (
                                  <div>
                                    <Label htmlFor={`serial-${item.id}`}>
                                      Serial Number (Required)
                                    </Label>
                                    <Input
                                      id={`serial-${item.id}`}
                                      required
                                    />
                                  </div>
                                )}
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Restock</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
