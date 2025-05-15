
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { UserRole } from "@/types";

interface SignUpFormProps {
  onSubmit: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  loading: boolean;
}

const SignUpForm = ({ onSubmit, loading }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("technician");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !name) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setError("");
    setIsSubmitting(true);
    
    try {
      await onSubmit(name, email, password, role);
      // Form submission was successful
    } catch (error: any) {
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use either the parent component's loading state or this component's submission state
  const isLoading = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#334155] border-[#475569] focus-visible:ring-blue-500"
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#334155] border-[#475569] focus-visible:ring-blue-500"
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select 
          value={role} 
          onValueChange={(value) => setRole(value as UserRole)}
          disabled={isLoading}
        >
          <SelectTrigger className="bg-[#334155] border-[#475569] focus-visible:ring-blue-500">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e293b] text-white border-[#475569]">
            <SelectItem value="technician">Technician</SelectItem>
            <SelectItem value="warehouse">Warehouse Manager</SelectItem>
            <SelectItem value="logistics">Logistics Manager</SelectItem>
            <SelectItem value="hr">HR Manager</SelectItem>
            <SelectItem value="implementation_manager">Implementation Manager</SelectItem>
            <SelectItem value="project_manager">Project Manager</SelectItem>
            <SelectItem value="planning">Planning Manager</SelectItem>
            <SelectItem value="it">IT Manager</SelectItem>
            <SelectItem value="finance">Finance Manager</SelectItem>
            <SelectItem value="management">Management</SelectItem>
            <SelectItem value="ehs">EHS Manager</SelectItem>
            <SelectItem value="procurement">Procurement Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#334155] border-[#475569] focus-visible:ring-blue-500"
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-[#334155] border-[#475569] focus-visible:ring-blue-500"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 w-full mt-2"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};

export default SignUpForm;
