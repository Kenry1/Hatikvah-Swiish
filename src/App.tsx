import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { EHSProvider } from "./contexts/EHSContext";
import { ProcurementProvider } from "./contexts/ProcurementContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Technician Pages
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import FuelRequests from "./pages/technician/FuelRequests";
import MaterialRequests from "./pages/technician/MaterialRequests";
import Vehicles from "./pages/technician/Vehicles";
import SafetyEquipment from "./pages/technician/SafetyEquipment";

// Warehouse Pages
import WarehouseDashboard from "./pages/warehouse/WarehouseDashboard";
import WarehouseMaterialRequests from "./pages/warehouse/MaterialRequests";
import Inventory from "./pages/warehouse/Inventory";
import Assets from "./pages/warehouse/Assets";
import AllRequests from "./pages/warehouse/AllRequests";
import ManageAccount from "./pages/warehouse/ManageAccount";

// Logistics Pages
import LogisticsDashboard from "./pages/logistics/LogisticsDashboard";
import { default as LogisticsVehicles } from "./pages/logistics/Vehicles";
import LogisticsFuelRequests from "./pages/logistics/FuelRequests";
import AddVehicle from "./pages/logistics/AddVehicle";
import AssignVehicle from "./pages/logistics/AssignVehicle";
import LogisticsManageAccount from "./pages/logistics/ManageAccount";

// New Role Pages
import HRDashboard from "./pages/hr/HRDashboard";
import Employees from "./pages/hr/Employees";
import NewEmployee from "./pages/hr/NewEmployee";
import IMDashboard from "./pages/implementation_manager/IMDashboard";
import PMDashboard from "./pages/project_manager/PMDashboard";
import ProjectOverview from "./pages/project_manager/ProjectOverview";
import RequestApprovals from "./pages/project_manager/RequestApprovals";
import TaskAssignments from "./pages/project_manager/TaskAssignments";
import PlanningDashboard from "./pages/planning/PlanningDashboard";
import ITDashboard from "./pages/it/ITDashboard";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import ManagementDashboard from "./pages/management/ManagementDashboard";
import EHSDashboard from "./pages/ehs/EHSDashboard";

// New EHS System Pages
import EHSRequests from "./pages/implementation_manager/EHSRequests";
import EHSApprovals from "./pages/project_manager/EHSApprovals";
import EHSIssuance from "./pages/warehouse/EHSIssuance";
import EHSOverview from "./pages/ehs/EHSOverview";

// Procurement Pages
import ProcurementDashboard from "./pages/procurement/ProcurementDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <EHSProvider>
          <ProcurementProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Home - redirects to role-specific dashboard */}
                  <Route path="/" element={<Home />} />
                  
                  {/* Technician Routes */}
                  <Route 
                    path="/technician" 
                    element={
                      <ProtectedRoute allowedRoles={['technician']}>
                        <TechnicianDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/technician/fuel-requests" 
                    element={
                      <ProtectedRoute allowedRoles={['technician']}>
                        <FuelRequests />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/technician/material-requests" 
                    element={
                      <ProtectedRoute allowedRoles={['technician']}>
                        <MaterialRequests />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/technician/vehicles" 
                    element={
                      <ProtectedRoute allowedRoles={['technician']}>
                        <Vehicles />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/technician/safety-equipment" 
                    element={
                      <ProtectedRoute allowedRoles={['technician']}>
                        <SafetyEquipment />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Warehouse Routes */}
                  <Route 
                    path="/warehouse" 
                    element={
                      <ProtectedRoute allowedRoles={['warehouse']}>
                        <WarehouseDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/warehouse/material-requests" 
                    element={
                      <ProtectedRoute allowedRoles={['warehouse']}>
                        <WarehouseMaterialRequests />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/warehouse/inventory" 
                    element={
                      <ProtectedRoute allowedRoles={['warehouse']}>
                        <Inventory />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/warehouse/assets" 
                    element={
                      <ProtectedRoute allowedRoles={['warehouse']}>
                        <Assets />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/warehouse/all-requests" 
                    element={
                      <ProtectedRoute allowedRoles={['warehouse']}>
                        <AllRequests />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/warehouse/manage-account" 
                    element={
                      <ProtectedRoute allowedRoles={['warehouse']}>
                        <ManageAccount />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/warehouse/ehs-issuance" 
                    element={
                      <ProtectedRoute allowedRoles={['warehouse']}>
                        <EHSIssuance />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Logistics Routes */}
                  <Route 
                    path="/logistics" 
                    element={
                      <ProtectedRoute allowedRoles={['logistics']}>
                        <LogisticsDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/logistics/vehicles" 
                    element={
                      <ProtectedRoute allowedRoles={['logistics']}>
                        <LogisticsVehicles />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/logistics/fuel-requests" 
                    element={
                      <ProtectedRoute allowedRoles={['logistics']}>
                        <LogisticsFuelRequests />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/logistics/vehicles/new" 
                    element={
                      <ProtectedRoute allowedRoles={['logistics']}>
                        <AddVehicle />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/logistics/vehicles/assign" 
                    element={
                      <ProtectedRoute allowedRoles={['logistics']}>
                        <AssignVehicle />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/logistics/manage-account" 
                    element={
                      <ProtectedRoute allowedRoles={['logistics']}>
                        <LogisticsManageAccount />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* HR Routes */}
                  <Route 
                    path="/hr" 
                    element={
                      <ProtectedRoute allowedRoles={['hr']}>
                        <HRDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/hr/employees" 
                    element={
                      <ProtectedRoute allowedRoles={['hr']}>
                        <Employees />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/hr/employees/new" 
                    element={
                      <ProtectedRoute allowedRoles={['hr']}>
                        <NewEmployee />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Implementation Manager Routes */}
                  <Route 
                    path="/implementation-manager" 
                    element={
                      <ProtectedRoute allowedRoles={['implementation_manager']}>
                        <IMDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/implementation-manager/ehs-requests" 
                    element={
                      <ProtectedRoute allowedRoles={['implementation_manager']}>
                        <EHSRequests />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Project Manager Routes */}
                  <Route 
                    path="/project-manager" 
                    element={
                      <ProtectedRoute allowedRoles={['project_manager']}>
                        <PMDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/project-manager/overview" 
                    element={
                      <ProtectedRoute allowedRoles={['project_manager']}>
                        <ProjectOverview />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/project-manager/approvals" 
                    element={
                      <ProtectedRoute allowedRoles={['project_manager']}>
                        <RequestApprovals />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/project-manager/tasks" 
                    element={
                      <ProtectedRoute allowedRoles={['project_manager']}>
                        <TaskAssignments />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/project-manager/ehs-approvals" 
                    element={
                      <ProtectedRoute allowedRoles={['project_manager']}>
                        <EHSApprovals />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Planning Routes */}
                  <Route 
                    path="/planning" 
                    element={
                      <ProtectedRoute allowedRoles={['planning']}>
                        <PlanningDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* IT Routes */}
                  <Route 
                    path="/it" 
                    element={
                      <ProtectedRoute allowedRoles={['it']}>
                        <ITDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Finance Routes */}
                  <Route 
                    path="/finance" 
                    element={
                      <ProtectedRoute allowedRoles={['finance']}>
                        <FinanceDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Management Routes */}
                  <Route 
                    path="/management" 
                    element={
                      <ProtectedRoute allowedRoles={['management']}>
                        <ManagementDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* EHS Routes */}
                  <Route 
                    path="/ehs" 
                    element={
                      <ProtectedRoute allowedRoles={['ehs']}>
                        <EHSDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/ehs/overview" 
                    element={
                      <ProtectedRoute allowedRoles={['ehs']}>
                        <EHSOverview />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Procurement Routes */}
                  <Route 
                    path="/procurement" 
                    element={
                      <ProtectedRoute allowedRoles={['procurement', 'it', 'finance', 'management']}>
                        <ProcurementDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Catch-all 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ProcurementProvider>
        </EHSProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
