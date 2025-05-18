
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
// import { supabase } from '@/integrations/supabase/client'; // Remove Supabase import
import { db, auth } from '@/integrations/firebase/firebase'; // Import db and auth from Firebase
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { signOut } from 'firebase/auth'; // Import signOut from Firebase Auth
import { Check, Clock, AlertCircle } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';
import { redirectBasedOnRole } from '@/utils/roleBasedRedirection';

const WaitingApproval = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Inspirational quotes array
  const quotes = [
    "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.",
    "The two most powerful warriors are patience and time.",
    "Patience is bitter, but its fruit is sweet.",
    "Patience is not simply the ability to wait - it's how we behave while we're waiting.",
    "Great works are performed not by strength but by perseverance."
  ];
  
  // Randomly select a quote
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user is approved using Firebase
    const checkApprovalStatus = async () => {
      try {
        if (!user?.uid) return; // Ensure user and uid exist

        const profileRef = doc(db, 'profiles', user.uid); // Assuming profile document ID is user's UID
        const profileSnap = await getDoc(profileRef);

        if (!profileSnap.exists()) {
          console.error('No profile found for user:', user.uid);
          // Handle case where profile doesn't exist (e.g., redirect to a profile creation page or logout)
           await signOut(auth); // Sign out if profile is unexpectedly missing
           navigate('/login');
          return;
        }

        const profileData = profileSnap.data();
        
        // If user is approved, redirect them to their dashboard
        if (profileData && profileData.approved) {
          // Assuming user.role is available in profileData
          navigate(redirectBasedOnRole(profileData.role));
        }
        
        // If user is rejected (not pending and not approved)
        if (profileData && !profileData.approval_pending && !profileData.approved) {
          console.log("User was rejected, logging out");
          await signOut(auth); // Use Firebase signOut
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
         // Consider adding a toast notification for the error
         await signOut(auth); // Optionally sign out on error
         navigate('/login');
      }
    };

    // Poll for approval status every 30 seconds
    checkApprovalStatus();
    const interval = setInterval(checkApprovalStatus, 30000);
    
    return () => clearInterval(interval);
  }, [user, navigate]); // Added navigate to dependencies

  // Get redirect path based on user role (This seems redundant with redirectBasedOnRole import)
  // Keeping it for now, but you might want to remove this local function
  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'hr': return '/hr';
      case 'technician': return '/technician';
      case 'warehouse': return '/warehouse';
      case 'logistics': return '/logistics';
      case 'implementation_manager': return '/implementation-manager';
      case 'project_manager': return '/project-manager';
      case 'planning': return '/planning';
      case 'it': return '/it';
      case 'finance': return '/finance';
      case 'management': return '/management';
      case 'ehs': return '/ehs';
      case 'procurement': return '/procurement';
      default: return '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0f172a] text-white">
      {/* Left side - Status card - Fills display */}
      <div className="w-full p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md border-none bg-[#1e293b] text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-yellow-500" />
              Account Waiting Approval
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your account is pending approval by a department manager
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-900/30 p-4 rounded-md border border-yellow-800">
              <p className="text-sm text-yellow-200">
                Thank you for signing up. A manager from your department needs to approve your account before you can access the system. 
                This page will automatically refresh when your account is approved.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Check className="h-5 w-5 mr-2 text-green-500" />
                <span>Account created successfully</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                <span>Waiting for department manager approval</span>
              </div>
              <div className="flex items-center text-gray-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Access to system (pending)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-[#0f172a] relative rounded-3xl overflow-hidden">
        <img
          src="/home-image.jpg"
          alt="A person looking at a home"
          className="object-cover w-full h-full rounded-3xl"
        />
        <div className="absolute top-0 left-0 right-0 p-4 text-center z-10">
          <p className="text-white text-lg font-semibold leading-tight">
            "{quote}"
          </p>
          <p className="text-white text-sm italic mt-1">
            — Elon Musk
          </p>
        </div>
      </div>
    </div>
  );
}

export default WaitingApproval;
