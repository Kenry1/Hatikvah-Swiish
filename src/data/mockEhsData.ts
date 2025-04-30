
import { SafetyEquipmentRequest } from "@/types/ehs";

// Mock data for safety equipment requests
export const mockSafetyRequests: SafetyEquipmentRequest[] = [
  {
    id: "sr-001",
    requestId: "SR-2025-001",
    technicianId: "TECH-123",
    technicianName: "John Smith",
    designation: "engineer",
    reason: "Site inspection at North Tower requires safety equipment",
    requestDate: "2025-04-25",
    equipment: [
      { id: "eq-001", name: "Safety Helmet", quantity: 1 },
      { id: "eq-002", name: "High Visibility Vest", quantity: 1 },
      { id: "eq-003", name: "Safety Boots", quantity: 1 }
    ],
    status: "pending"
  },
  {
    id: "sr-002",
    requestId: "SR-2025-002",
    technicianId: "TECH-456",
    technicianName: "Sarah Johnson",
    designation: "supervisor",
    reason: "Team conducting electrical work at East Campus building",
    requestDate: "2025-04-26",
    equipment: [
      { id: "eq-004", name: "Insulated Gloves", quantity: 5 },
      { id: "eq-005", name: "Face Shield", quantity: 5 },
      { id: "eq-006", name: "Ear Protection", quantity: 5 }
    ],
    status: "acknowledged",
    acknowledgedBy: "Michael Brown",
    acknowledgedDate: "2025-04-27"
  },
  {
    id: "sr-003",
    requestId: "SR-2025-003",
    technicianId: "TECH-789",
    technicianName: "David Wilson",
    designation: "team_lead",
    reason: "Height work at Central Tower maintenance",
    requestDate: "2025-04-27",
    equipment: [
      { id: "eq-007", name: "Safety Harness", quantity: 2 },
      { id: "eq-008", name: "Hard Hat", quantity: 2 }
    ],
    status: "approved",
    acknowledgedBy: "Michael Brown",
    acknowledgedDate: "2025-04-28",
    approvedBy: "Jennifer Lee",
    approvedDate: "2025-04-29"
  },
  {
    id: "sr-004",
    requestId: "SR-2025-004",
    technicianId: "TECH-321",
    technicianName: "Emily Parker",
    designation: "engineer",
    reason: "Chemical handling at treatment facility",
    requestDate: "2025-04-28",
    equipment: [
      { id: "eq-009", name: "Chemical Resistant Gloves", quantity: 1 },
      { id: "eq-010", name: "Safety Goggles", quantity: 1 },
      { id: "eq-011", name: "Respirator", quantity: 1 }
    ],
    status: "issued",
    acknowledgedBy: "Michael Brown",
    acknowledgedDate: "2025-04-29",
    approvedBy: "Jennifer Lee",
    approvedDate: "2025-04-30",
    issuedBy: "Robert Chen",
    issuedDate: "2025-05-01"
  },
  {
    id: "sr-005",
    requestId: "SR-2025-005",
    technicianId: "TECH-654",
    technicianName: "Thomas Green",
    designation: "team_lead",
    reason: "Confined space entry for inspection",
    requestDate: "2025-04-29",
    equipment: [
      { id: "eq-012", name: "Gas Detector", quantity: 1 },
      { id: "eq-013", name: "Emergency Escape Respirator", quantity: 1 },
      { id: "eq-014", name: "Full Body Harness", quantity: 1 }
    ],
    status: "closed",
    acknowledgedBy: "Michael Brown",
    acknowledgedDate: "2025-04-30",
    approvedBy: "Jennifer Lee",
    approvedDate: "2025-05-01",
    issuedBy: "Robert Chen",
    issuedDate: "2025-05-02",
    closedBy: "Amanda White",
    closedDate: "2025-05-03"
  }
];
