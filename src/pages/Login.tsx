import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import QRCodeDownload from "@/components/QRCodeDownload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const { signIn, signUp, demoLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Sign up state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  
  // Shared state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoRole, setDemoRole] = useState<UserRole | "">("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Current app URL for QR code
  const appUrl = window.location.origin;

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    const { user } = useAuth();
    if (user) {
      redirectBasedOnRole(user.role);
    }
  }, []);

  // Function to handle redirection based on user role
  const redirectBasedOnRole = (role: UserRole) => {
    switch (role) {
      case 'technician':
        navigate('/technician');
        break;
      case 'warehouse':
        navigate('/warehouse');
        break;
      case 'logistics':
        navigate('/logistics');
        break;
      case 'hr':
        navigate('/hr');
        break;
      case 'implementation_manager':
        navigate('/implementation-manager');
        break;
      case 'project_manager':
        navigate('/project-manager');
        break;
      case 'planning':
        navigate('/planning');
        break;
      case 'it':
        navigate('/it');
        break;
      case 'finance':
        navigate('/finance');
        break;
      case 'management':
        navigate('/management');
        break;
      case 'ehs':
        navigate('/ehs');
        break;
      case 'procurement':
        navigate('/procurement');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const userData = await signIn(loginEmail, loginPassword);
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      if (userData && userData.user) {
        redirectBasedOnRole(userData.user.role);
      }
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupEmail || !signupPassword || !confirmPassword || !name) {
      setError("Please fill in all fields.");
      return;
    }

    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // We'll use technician as a default role for now, the user can change it later
      const userData = await signUp(signupEmail, signupPassword, "technician");
      toast({
        title: "Account created!",
        description: "Your account has been successfully created. You can now log in.",
      });
      setActiveTab("login");
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");
      setName("");
      
      if (userData && userData.user) {
        redirectBasedOnRole(userData.user.role);
      }
    } catch (error: any) {
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    if (!demoRole) {
      setError("Please select a role for demo login.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const userData = await demoLogin(demoRole as UserRole);
      toast({
        title: "Demo Login Success",
        description: `You are now logged in as a ${demoRole}.`,
      });
      
      if (userData && userData.user) {
        redirectBasedOnRole(userData.user.role);
      }
    } catch (error) {
      setError("Failed to login with demo account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">ERP System</CardTitle>
          <CardDescription>Login or create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="m@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="m@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="grid gap-4 mt-4">
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
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              onClick={() => setShowQRCode(!showQRCode)} 
              className="text-sm"
            >
              {showQRCode ? "Hide" : "Show"} QR code for mobile testing
            </Button>
            
            {showQRCode && <QRCodeDownload appUrl={appUrl} />}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground mt-4">
            For demo purposes, use these emails: tech@swiish.com, warehouse@swiish.com, 
            logistics@swiish.com, hr@swiish.com, im@swiish.com, pm@swiish.com, 
            planning@swiish.com, it@swiish.com, finance@swiish.com, 
            management@swiish.com, ehs@swiish.com, procurement@swiish.com. 
            Any password works.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
