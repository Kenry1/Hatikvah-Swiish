
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

  // Inspirational quotes array
  const quotes = [
    "The best way to predict the future is to invent it.",
    "Innovation distinguishes between a leader and a follower.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "The only way to do great work is to love what you do."
  ];
  
  // Randomly select a quote
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0f172a] text-white">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/3 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto border-none bg-[#1e293b] text-white">
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
      <div className="hidden md:flex md:w-2/3 bg-[#0f172a] relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-4/5 h-2/3 rounded-3xl bg-[#67e8f9] flex flex-col items-center justify-center p-10">
            <h2 className="text-5xl font-bold text-white mb-10 text-center">
              African electrical engineer picture
            </h2>
            <div className="bg-white rounded-full py-4 px-10 max-w-lg">
              <p className="text-black font-medium text-xl">
                {quote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
