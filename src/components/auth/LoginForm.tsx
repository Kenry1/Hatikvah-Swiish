
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error: string;
  loading: boolean;
}

const LoginForm = ({ onSubmit, error, loading }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="bg-[#334155] border-[#475569] focus-visible:ring-blue-500"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="bg-[#334155] border-[#475569] focus-visible:ring-blue-500"
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading} 
          className="bg-blue-600 hover:bg-blue-700 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
