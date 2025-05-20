import { useState, useEffect, useRef } from "react";
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
// import { supabase } from "@/integrations/supabase/client"; // Removed Supabase import
import { db } from "@/integrations/firebase/firebase"; // Import Firestore
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Loader2 } from "lucide-react"; // Import Loader2
import { serialize } from "../../utils/serialize";

export default function Login() {
  const auth = useAuth();
  const { signIn, signUp, user, isLoading: isAuthLoading } = auth; // Get isAuthLoading from useAuth
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Shared state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [isProfileLoading, setIsProfileLoading] = useState(false); // Initialize as false

  const hasRedirected = useRef(false); // Use a ref to track if navigation has been *attempted*

  // Current app URL for QR code
  const appUrl = window.location.origin;

  useEffect(() => {
    // Trigger redirection logic when auth is loaded, user is present, and we haven't started the process
    if (!isAuthLoading && user && !isProfileLoading && !hasRedirected.current) {
      console.log("Auth loading complete and user is authenticated. Initiating profile check and redirection for user:", user.uid);
      // Set hasRedirected.current to true here to prevent immediate re-triggering of handleUserRedirection by state updates within it
      hasRedirected.current = true;
      handleUserRedirection(user.uid);
    } else if (!isAuthLoading && !user) {
      // If auth loading complete and no user, ensure profile loading is false and reset redirected ref
      setIsProfileLoading(false); // Ensure loader is off if no user logs in
      hasRedirected.current = false; // Reset ref if user logs out
    }
    // Dependencies: React to changes in user and auth loading state.
    // navigate is a dependency because handleUserRedirection uses it.
    // isProfileLoading is NOT a dependency here; it's managed by the effect/handler.
  }, [user, isAuthLoading, navigate]);

  const handleUserRedirection = async (userId: string) => {
    setIsProfileLoading(true); // Start loader
    try {
      console.log("Checking profile status for user:", userId);
      const profileRef = doc(db, 'profiles', userId);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        console.error('No profile found for user:', userId);
        setError("Profile not found. Please contact support or try signing up again.");
        await auth.signOut();
        hasRedirected.current = false; // Reset ref on error or missing profile
      } else {
        const profileData = serialize(profileSnap.data());
        console.log("Profile status:", profileData);

        if (profileData && profileData.approved) {
          const userRole = profileData.role as UserRole;
          const redirectPath = redirectBasedOnRole(userRole);
          console.log(`User approved, redirecting to ${redirectPath} based on role ${userRole}`);
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          // hasRedirected.current is already set to true in useEffect
          navigate(redirectPath, { replace: true }); // Use replace: true
        } else {
          console.log("User was not approved, logging out");
          setError("Your account is not approved. Please contact support.");
          await auth.signOut();
          hasRedirected.current = false; // Reset ref on logout
        }
      }
    } catch (err) {
      console.error('Error in user redirection:', err);
      setError("An error occurred during login. Please try again.");
      await auth.signOut();
      hasRedirected.current = false; // Reset ref on error
    } finally {
      setIsProfileLoading(false); // Always stop loader
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      console.log("Attempting to sign in user:", email);
      await signIn(email, password);
      console.log("Sign in successful");
      // Redirection and success toast are handled by the useEffect watching the user state
    } catch (error: any) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    setError("");
    try {
      console.log("Starting signup process for:", email, "with role:", role);
      // When removing approval, new users should be marked as approved directly
      await signUp(email, password, role, name); // Keep the sign-up logic as is for now, will adjust profile creation next
      
      console.log("Signup successful, showing success toast");
      toast({
        title: "Account created!",
        description: "You can now log in.", // Updated message
      });

      // No redirection after signup, user stays on the login page to sign in
      console.log("No redirection after signup");

    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to create account. Please try again.");
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Failed to create account.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show a loading indicator while authentication or profile is being checked
  if (isAuthLoading || (user && isProfileLoading)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row w-full bg-[#0f172a] text-white">
        {/* Left side - Login form */}
        <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center justify-center">
          <Card className="w-full max-w-sm mx-auto border-none bg-[#1e293b] text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Hatikvah Swiish</CardTitle>
              <CardDescription className="text-gray-300">Login or create an account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}> {/* Corrected typo here */}
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
        <div className="hidden md:flex md:w-1/2 bg-[#0f172a] relative overflow-hidden">
          <AspectRatio ratio={16/9} className="h-full w-full">
            <img
              src="/home-image.jpg"
              alt="A person looking at a home"
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          <div className="absolute top-0 left-0 right-0 p-8 text-center z-10 bg-gradient-to-b from-[#0f172a]/80 to-transparent">
            <p className="text-white text-xl font-semibold leading-tight">
              "Any product that needs a manual to work is broken."
            </p>
            <p className="text-white text-sm italic mt-2">
              — Elon Musk
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
