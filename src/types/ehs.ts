
export interface SafetyEquipmentItem {
  id: string;
  name: string;
  quantity: number;
}

export interface SafetyEquipmentRequest {
  id: string;
  requestId: string;
  technicianId: string;
  technicianName: string;
  designation: 'engineer' | 'supervisor' | 'team_lead';
  reason: string;
  requestDate: string;
  equipment: SafetyEquipmentItem[];
  status: 'pending' | 'acknowledged' | 'approved' | 'issued' | 'closed';
  acknowledgedBy?: string;
  acknowledgedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  issuedBy?: string;
  issuedDate?: string;
  closedBy?: string;
  closedDate?: string;
  notes?: string;
}

export type EHSAllowedRole = 'implementation_manager' | 'project_manager' | 'warehouse' | 'ehs';
