
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types";

interface DemoLoginFormProps {
  onDemoLogin: (role: UserRole) => Promise<void>;
  loading: boolean;
}

const DemoLoginForm = ({ onDemoLogin, loading }: DemoLoginFormProps) => {
  const [demoRole, setDemoRole] = useState<UserRole | "">("");

  const handleDemoLogin = async () => {
    if (!demoRole) return;
    await onDemoLogin(demoRole as UserRole);
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="demo-role">Select Role for Demo</Label>
        <Select value={demoRole} onValueChange={(value) => setDemoRole(value as UserRole)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technician">Technician</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
            <SelectItem value="logistics">Logistics</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
            <SelectItem value="implementation_manager">Implementation Manager</SelectItem>
            <SelectItem value="project_manager">Project Manager</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="it">IT</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="management">Management</SelectItem>
            <SelectItem value="ehs">EHS</SelectItem>
            <SelectItem value="procurement">Procurement</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" onClick={handleDemoLogin} disabled={loading || !demoRole}>
        {loading ? "Logging in..." : "Login as Demo User"}
      </Button>
    </div>
  );
};

export default DemoLoginForm;
