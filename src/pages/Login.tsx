
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
import { redirectBasedOnRole } from "@/utils/roleBasedRedirection";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const auth = useAuth();
  const { signIn, signUp, user } = auth;
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
    if (user) {
      // Check if user is approved
      const checkApprovalStatus = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('approved, approval_pending')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          
          if (data) {
            if (data.approval_pending) {
              navigate('/waiting-approval');
            } else if (data.approved) {
              navigate(redirectBasedOnRole(user.role));
            } else {
              // User was rejected, log them out
              await auth.signOut();
              setError("Your account has been rejected. Please contact support.");
            }
          }
        } catch (error) {
          console.error('Error checking approval status:', error);
        }
      };

      checkApprovalStatus();
    }
  }, [user, navigate]);

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
      
      // The user state will be updated via the useEffect hook
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    setError("");
    try {
      await signUp(email, password, role, name);
      
      toast({
        title: "Account created!",
        description: "Your account is now pending approval by a department manager.",
      });

      navigate('/waiting-approval');
    } catch (error: any) {
      setError(error.message || "Failed to create account. Please try again.");
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
      </Card>
    </div>
  );
}
