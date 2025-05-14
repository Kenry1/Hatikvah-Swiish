
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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

    // Check if user is approved
    const checkApprovalStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('approved, approval_pending')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // If approval is still pending, redirect to waiting page
        if (data && data.approval_pending) {
          navigate('/waiting-approval');
        }
        
        // If user is rejected, sign them out
        if (data && !data.approval_pending && !data.approved) {
          await supabase.auth.signOut();
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
      }
    };

    checkApprovalStatus();
  }, [user, navigate]);

  const completeOnboarding = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_step: 100
        })
        .eq('id', user.id);

      navigate(`/${user.role}`);
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
