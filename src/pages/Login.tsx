
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import QRCodeDownload from "@/components/QRCodeDownload";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import DemoLoginForm from "@/components/auth/DemoLoginForm";
import { redirectBasedOnRole } from "@/utils/roleBasedRedirection";

export default function Login() {
  const { signIn, signUp, demoLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Shared state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Current app URL for QR code
  const appUrl = window.location.origin;

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    const authContext = useAuth();
    if (authContext.user) {
      navigate(redirectBasedOnRole(authContext.user.role));
    }
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      
      // Get the updated user after sign-in
      const authContext = useAuth();
      if (authContext.user) {
        navigate(redirectBasedOnRole(authContext.user.role));
      }
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      // We'll use technician as a default role for now, the user can change it later
      await signUp(email, password, "technician");
      
      toast({
        title: "Account created!",
        description: "Your account has been successfully created. You can now log in.",
      });
      setActiveTab("login");
      
      // Get the updated user after sign-up
      const authContext = useAuth();
      if (authContext.user) {
        navigate(redirectBasedOnRole(authContext.user.role));
      }
    } catch (error: any) {
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setLoading(true);
    setError("");
    try {
      await demoLogin(role);
      
      toast({
        title: "Demo Login Success",
        description: `You are now logged in as a ${role}.`,
      });
      
      // Get the updated user after demo login
      const authContext = useAuth();
      if (authContext.user) {
        navigate(redirectBasedOnRole(authContext.user.role));
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
              <LoginForm onSubmit={handleSignIn} error={error} loading={loading} />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignUpForm onSubmit={handleSignUp} loading={loading} />
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
              <DemoLoginForm onDemoLogin={handleDemoLogin} loading={loading} />
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
