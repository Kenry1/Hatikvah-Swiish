
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { TaskList } from '@/components/onboarding/TaskList';
import { ProfileForm } from '@/components/onboarding/ProfileForm';
import { CheckCircle2, UserCircle, ListChecks } from 'lucide-react';
import { SidebarInset } from '@/components/ui/sidebar';

const OnboardingDashboard = () => {
  const { profile, tasks, progress } = useOnboarding();
  const navigate = useNavigate();
  
  // Calculate completion percentage
  const completedTasks = progress.filter(p => p.completed).length;
  const totalTasks = tasks.length;
  const isOnboardingComplete = totalTasks > 0 && completedTasks === totalTasks;
  
  // Prepare a display name using either name or first_name + last_name
  const displayName = profile?.name || 
    (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'New Employee');
  
  return (
    <DashboardLayout>
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Employee Onboarding</h1>
              <p className="text-muted-foreground">
                Complete your onboarding tasks and set up your profile
              </p>
            </div>
            {isOnboardingComplete && (
              <Button onClick={() => navigate('/')}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {displayName}!</CardTitle>
              <CardDescription>
                {profile?.department 
                  ? `Complete these tasks to finish your onboarding process` 
                  : 'Please select your department to begin onboarding'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OnboardingProgress />
            </CardContent>
          </Card>
          
          <Tabs defaultValue="tasks">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tasks">
                <ListChecks className="mr-2 h-4 w-4" />
                Onboarding Tasks
              </TabsTrigger>
              <TabsTrigger value="profile">
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="mt-4">
              <TaskList />
            </TabsContent>
            
            <TabsContent value="profile" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>
                    Update your personal information and department
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </DashboardLayout>
  );
};

export default OnboardingDashboard;
