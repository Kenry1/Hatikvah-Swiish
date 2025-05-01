
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
  requestId: string;
  userId: string;
  userName: string;
  vehicleId: string;
  vehiclePlate: string;
  requestDate: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

export interface MaterialRequest {
  id: string;
  requestId: string;
  userId: string;
  userName: string;
  siteName: string;
  siteLocation: string;
  requestDate: string;
  materials: MaterialItem[];
  status: 'pending' | 'approved' | 'ready' | 'delivered';
  priority: 'low' | 'medium' | 'high';
  approvedBy?: string;
  approvedDate?: string;
  readyBy?: string;
  readyDate?: string;
  deliveredBy?: string;
  deliveredDate?: string;
  notes?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
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
