
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Check, Clock, AlertCircle } from 'lucide-react';

const WaitingApproval = () => {
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
        
        // If user is approved, redirect them to their dashboard
        if (data && data.approved) {
          navigate(getRedirectPath(user.role));
        }
        
        // If user is rejected (not pending and not approved)
        if (data && !data.approval_pending && !data.approved) {
          // User was rejected, log them out
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
      }
    };

    // Poll for approval status every 30 seconds
    checkApprovalStatus();
    const interval = setInterval(checkApprovalStatus, 30000);
    
    return () => clearInterval(interval);
  }, [user, navigate]);

  // Get redirect path based on user role
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
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-yellow-500" />
            Account Waiting Approval
          </CardTitle>
          <CardDescription>
            Your account is pending approval by a department manager
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-muted-foreground">
              Thank you for signing up. A manager from your department needs to approve your account before you can access the system. 
              This page will automatically refresh when your account is approved.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              <span>Account created successfully</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-500" />
              <span>Waiting for department manager approval</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>Access to system (pending)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingApproval;
