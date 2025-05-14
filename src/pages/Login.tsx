
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function Login() {
  const auth = useAuth();
  const { signIn, signUp, user } = auth;
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Shared state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Current app URL for QR code
  const appUrl = window.location.origin;

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
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-[#0f172a] text-white">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-sm mx-auto border-none bg-[#1e293b] text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Hatikvah Swiish</CardTitle>
            <CardDescription className="text-gray-300">Login or create an account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#334155]">
                <TabsTrigger value="login" className="data-[state=active]:bg-blue-600">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-blue-600">Sign Up</TabsTrigger>
              </TabsList>
              
              {error && (
                <Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-800">
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
                className="text-sm text-blue-400"
              >
                {showQRCode ? "Hide" : "Show"} QR code for mobile testing
              </Button>
              
              {showQRCode && <QRCodeDownload appUrl={appUrl} />}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Image and quote */}
      <div className="hidden md:flex md:w-1/2 bg-[#0f172a] relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-3xl h-auto" style={{ maxHeight: '90vh' }}>
            <AspectRatio ratio={16 / 9} className="bg-[#67e8f9] rounded-3xl h-full">
              <div className="flex flex-col items-center justify-center h-full p-6 md:p-10 overflow-y-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-10 text-center">
                  African electrical engineer picture
                </h2>
                <div className="bg-white rounded-full py-3 px-6 md:py-4 md:px-10 max-w-lg">
                  <p className="text-black font-medium text-lg md:text-xl">
                  </p>
                </div>
              </div>
            </AspectRatio>
          </div>
        </div>
      </div>
    </div>
  );
}
