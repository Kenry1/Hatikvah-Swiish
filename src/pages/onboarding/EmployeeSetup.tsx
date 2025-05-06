
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { ProfileForm } from '@/components/onboarding/ProfileForm';

const EmployeeSetup = () => {
  const { user } = useAuth();
  const { profile, loading } = useOnboarding();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If profile has department set, redirect to onboarding dashboard
  if (profile?.department) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Our Company!</h1>
          <p className="text-muted-foreground">
            Let's set up your employee profile
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Employee Setup</CardTitle>
            <CardDescription>
              Please complete your profile information to begin the onboarding process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
            
            {profile?.department && (
              <div className="mt-6">
                <Button className="w-full" onClick={() => window.location.href = '/onboarding'}>
                  Continue to Onboarding
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground">
          Need help? Contact HR at help@company.com
        </p>
      </div>
    </div>
  );
};

export default EmployeeSetup;
