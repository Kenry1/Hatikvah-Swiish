
export type UserRole = 
  | 'technician' 
  | 'warehouse' 
  | 'logistics' 
  | 'hr' 
  | 'implementation_manager' 
  | 'project_manager' 
  | 'planning' 
  | 'it' 
  | 'finance' 
  | 'management' 
  | 'ehs';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface Vehicle {
  id: string;
  model: string;
  registration: string;
  capacity: number;
  status: 'assigned' | 'unassigned' | 'maintenance';
  assignedTo?: string;
}

export interface FuelRequest {
  id: string;
  technicianId: string;
  technicianName?: string;
  fuelType: 'petrol' | 'diesel' | 'electric';
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
}

export interface MaterialRequest {
  id: string;
  technicianId: string;
  technicianName?: string;
  items: MaterialRequestItem[];
  status: 'pending' | 'approved' | 'rejected' | 'issued' | 'completed';
  comment?: string;
  createdAt: string;
}

export interface MaterialRequestItem {
  materialId: string;
  materialName: string;
  quantity: number;
}

export interface Material {
  id: string;
  name: string;
  stockQuantity: number;
  category: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'available' | 'in-use' | 'maintenance';
}

export interface VehicleAssignment {
  id: string;
  vehicleId: string;
  technicianId: string;
  assignedDate: string;
  status: 'active' | 'completed';
}
