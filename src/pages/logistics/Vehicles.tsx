
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

// Mock data for vehicles
const vehicles = [
  { id: 1, name: 'Toyota Hilux', status: 'Active', mileage: 45000, expenses: 2800 },
  { id: 2, name: 'Ford Ranger', status: 'Active', mileage: 78000, expenses: 3500 },
  { id: 3, name: 'Isuzu D-Max', status: 'Needs Repair', mileage: 62000, expenses: 4200 },
  { id: 4, name: 'Toyota Land Cruiser', status: 'Active', mileage: 35000, expenses: 1800 },
  { id: 5, name: 'Nissan Navara', status: 'Under Maintenance', mileage: 28000, expenses: 1500 },
  { id: 6, name: 'Mitsubishi L200', status: 'Active', mileage: 52000, expenses: 2900 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Vehicles = () => {
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Function to handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  // Sort vehicles based on current sort state
  const sortedVehicles = [...vehicles].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;
    if (a[sortColumn] < b[sortColumn]) return -1 * modifier;
    if (a[sortColumn] > b[sortColumn]) return 1 * modifier;
    return 0;
  });
  
  // Transform data for pie chart
  const chartData = vehicles.map(vehicle => ({
    name: vehicle.name,
    value: vehicle.expenses
  }));
  
  // Calculate total expenses
  const totalExpenses = vehicles.reduce((sum, vehicle) => sum + vehicle.expenses, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Vehicle Management</h1>
            <p className="text-muted-foreground">Manage the company's vehicle fleet.</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => navigate('/logistics/vehicles/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Vehicle
            </Button>
            <Button variant="outline" onClick={() => navigate('/logistics/vehicles/assign')}>
              Assign Vehicle
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Vehicle Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('mileage')}
                    className="text-right"
                  >
                    Mileage {sortColumn === 'mileage' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('expenses')}
                    className="text-right"
                  >
                    Total Expenses {sortColumn === 'expenses' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          vehicle.status === 'Active' 
                            ? 'default' 
                            : vehicle.status === 'Needs Repair' 
                              ? 'destructive' 
                              : 'outline'
                        }
                      >
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{vehicle.mileage.toLocaleString()} km</TableCell>
                    <TableCell className="text-right">${vehicle.expenses.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/logistics/vehicles/${vehicle.id}`)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-lg font-semibold">Total Fleet Expenses</h4>
                <p className="text-3xl font-bold">${totalExpenses.toLocaleString()}</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Vehicles;
