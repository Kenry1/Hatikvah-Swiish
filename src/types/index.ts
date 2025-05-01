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
  | 'ehs'
  | 'procurement';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  status: 'available' | 'assigned' | 'maintenance';
  assignedTo?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  location?: string;
  mileage: number;
}

export interface FuelRequest {
  id: string;
  technicianId?: string;
  technicianName: string;
  fuelType: 'petrol' | 'diesel' | 'electric';
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'acknowledged';
  createdAt: string;
}

export interface Material {
  id: string;
  name: string;
  stockQuantity: number;
  category: string;
}

export interface MaterialRequestItem {
  materialId: string;
  materialName: string;
  quantity: number;
}

export interface MaterialRequest {
  id: string;
  technicianId?: string;
  technicianName: string;
  items: MaterialRequestItem[];
  status: 'pending' | 'approved' | 'rejected' | 'issued' | 'completed';
  createdAt: string;
}

// Types for the Procurement system
export interface PurchaseRequest {
  id: string;
  requester: string;
  department: string;
  date: string;
  item: string;
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
  supplier?: string;
  justification: string;
  attachment?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  notes?: string;
}
