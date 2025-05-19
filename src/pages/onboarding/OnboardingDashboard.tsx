
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
// import { supabase } from '@/integrations/supabase/client'; // Remove Supabase import
import { auth, db } from '@/integrations/firebase/firebase'; // Import auth and db from your Firebase setup
import { signOut } from 'firebase/auth'; // Import signOut from Firebase Auth
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { TaskList } from '@/components/onboarding/TaskList';
import { Loader2 } from 'lucide-react';

const OnboardingDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user is rejected using Firebase
    const checkApprovalStatus = async () => {
      try {
        if (!user?.uid) return; // Ensure user and uid exist

        const profileRef = doc(db, 'profiles', user.uid); // Assuming profile document ID is user's UID
        const profileSnap = await getDoc(profileRef);

        if (!profileSnap.exists()) {
          console.error('No profile found for user:', user.uid);
          // Handle case where profile doesn't exist (e.g., redirect or show error)
          return;
        }

        const profileData = profileSnap.data();

        // If user is rejected, sign them out
        if (profileData && !profileData.approval_pending && !profileData.approved) {
          await signOut(auth); // Use Firebase signOut
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
      }
    };

    checkApprovalStatus();
    // Removed interval check for approval as the waiting page is removed
  }, [user, navigate]);

  const completeOnboarding = async () => {
    if (!user?.uid) return; // Ensure user and uid exist
    
    try {
      const profileRef = doc(db, 'profiles', user.uid); // Reference to the user's profile document
      await updateDoc(profileRef, { // Use Firestore updateDoc
        onboarding_completed: true,
        onboarding_step: 100
      });

      // Assuming user.role is available in the Auth context or profile data
      // You might need to fetch the profile data here if user.role is not in Auth context
      // For now, I'll assume user.role is available.
      // Fetch profile data to get the role after completing onboarding
      const profileSnap = await getDoc(doc(db, 'profiles', user.uid));
      const profileData = profileSnap.data();
      
      if (profileData && profileData.role) {
         navigate(`/${profileData.role}`);
      } else {
         console.error("Profile data or role not found after completing onboarding.");
         // Fallback to a default route or show an error
         navigate('/'); // Redirect to home/login or a generic dashboard
      }

    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground mt-2">Complete these steps to setup your account.</p>
        </div>

        <OnboardingProgress />
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Tasks</CardTitle>
              <CardDescription>Complete these tasks to finish your onboarding</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Complete your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Make sure to complete your profile information to help your team members identify you.
              </p>
              <Button onClick={() => navigate('/setup')}>
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={completeOnboarding}>
            Complete Onboarding
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OnboardingDashboard;
