
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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

// Warehouse Pages
import WarehouseDashboard from "./pages/warehouse/WarehouseDashboard";
import WarehouseMaterialRequests from "./pages/warehouse/MaterialRequests";
import Inventory from "./pages/warehouse/Inventory";

// Logistics Pages
import LogisticsDashboard from "./pages/logistics/LogisticsDashboard";
import { default as LogisticsVehicles } from "./pages/logistics/Vehicles";
import LogisticsFuelRequests from "./pages/logistics/FuelRequests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
            
            {/* Catch-all 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
