
import { PurchaseRequest, Supplier } from '@/types';

export const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: 'PR-1234567890',
    requester: 'John Doe',
    department: 'it',
    date: '2025-04-15T10:30:00Z',
    item: 'Dell XPS 13 Laptop',
    quantity: 2,
    urgency: 'high',
    supplier: 'Dell Technologies',
    justification: 'Needed for new software developers starting next month.',
    status: 'pending'
  },
  {
    id: 'PR-2345678901',
    requester: 'Jane Smith',
    department: 'hr',
    date: '2025-04-10T09:15:00Z',
    item: 'Office Chairs',
    quantity: 5,
    urgency: 'medium',
    supplier: 'Office Depot',
    justification: 'Replacing old chairs in the conference room.',
    status: 'approved',
    approvedBy: 'John Doe',
    approvedDate: '2025-04-12T14:20:00Z'
  },
  {
    id: 'PR-3456789012',
    requester: 'Mike Johnson',
    department: 'marketing',
    date: '2025-04-05T15:45:00Z',
    item: 'Adobe Creative Cloud Licenses',
    quantity: 3,
    urgency: 'high',
    justification: 'Required for the design team to work on the new campaign.',
    status: 'rejected',
    approvedBy: 'John Doe',
    approvedDate: '2025-04-06T11:30:00Z',
    notes: 'Budget constraints. Please resubmit after Q2 budget approval.'
  },
  {
    id: 'PR-4567890123',
    requester: 'Sara Lee',
    department: 'finance',
    date: '2025-03-28T13:20:00Z',
    item: 'Financial Analysis Software',
    quantity: 1,
    urgency: 'medium',
    supplier: 'Bloomberg',
    justification: 'Need for quarterly financial reporting and analysis.',
    status: 'completed',
    approvedBy: 'John Doe',
    approvedDate: '2025-03-29T10:10:00Z',
    notes: 'License key delivered via email.'
  },
  {
    id: 'PR-5678901234',
    requester: 'Tom Wilson',
    department: 'logistics',
    date: '2025-04-18T11:00:00Z',
    item: 'Barcode Scanners',
    quantity: 10,
    urgency: 'medium',
    supplier: 'Zebra Technologies',
    justification: 'Needed for the new warehouse management system implementation.',
    status: 'pending'
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-1001',
    name: 'Dell Technologies',
    contact: 'Sarah Johnson',
    email: 'sarah.johnson@dell.example.com',
    phone: '+1 (555) 123-4567',
    address: '1 Dell Way, Round Rock, TX 78682',
    category: 'Computer Hardware',
    notes: 'Preferred supplier for laptops and workstations.'
  },
  {
    id: 'SUP-1002',
    name: 'Office Depot',
    contact: 'Michael Brown',
    email: 'mbrown@officedepot.example.com',
    phone: '+1 (555) 234-5678',
    address: '6600 North Military Trail, Boca Raton, FL 33496',
    category: 'Office Supplies',
    notes: 'Good pricing on bulk orders of office furniture and supplies.'
  },
  {
    id: 'SUP-1003',
    name: 'Adobe Inc.',
    contact: 'David Chen',
    email: 'dchen@adobe.example.com',
    phone: '+1 (555) 345-6789',
    address: '345 Park Avenue, San Jose, CA 95110',
    category: 'Software',
    notes: 'Enterprise discount available for bulk license purchases.'
  },
  {
    id: 'SUP-1004',
    name: 'Zebra Technologies',
    contact: 'Jennifer Smith',
    email: 'jsmith@zebra.example.com',
    phone: '+1 (555) 456-7890',
    address: '3 Overlook Point, Lincolnshire, IL 60069',
    category: 'Scanning Equipment',
    notes: 'Reliable supplier for all barcode and RFID equipment.'
  },
  {
    id: 'SUP-1005',
    name: 'Bloomberg L.P.',
    contact: 'Robert Taylor',
    email: 'rtaylor@bloomberg.example.com',
    phone: '+1 (555) 567-8901',
    address: '731 Lexington Avenue, New York, NY 10022',
    category: 'Financial Services',
    notes: 'Annual subscription model with premium support package.'
  }
];
