
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { User, Lock, Bell, Activity } from 'lucide-react';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';

const TechnicianSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profile, updateProfile } = useOnboarding();
  const { theme, setTheme } = useTheme();
  
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '123-456-7890', // Mock data
    position: 'Field Technician', // Mock data
  });
  
  const [password, setPassword] = React.useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [notifications, setNotifications] = React.useState({
    email: true,
    push: true,
    tasks: true,
    updates: false,
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profile) {
      updateProfile({
        ...profile,
        name: formData.name,
        position: formData.position
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully."
      });
    }
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.new !== password.confirm) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation password must match.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully."
    });
    
    setPassword({
      current: '',
      new: '',
      confirm: '',
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));

    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved."
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">Update your account settings and preferences</p>
          </div>
          <div className="flex items-center gap-2 border rounded-md px-4 py-2">
            <span className="text-sm text-muted-foreground mr-2">Theme:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTheme('light')}
                className={`rounded-md p-2 ${theme === 'light' ? 'bg-secondary text-secondary-foreground' : 'hover:bg-secondary/50'}`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`rounded-md p-2 ${theme === 'dark' ? 'bg-secondary text-secondary-foreground' : 'hover:bg-secondary/50'}`}
              >
                Dark
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`rounded-md p-2 ${theme === 'system' ? 'bg-secondary text-secondary-foreground' : 'hover:bg-secondary/50'}`}
              >
                System
              </button>
            </div>
          </div>
        </div>

        {profile && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Onboarding Progress</CardTitle>
              <CardDescription>
                Track your onboarding journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OnboardingProgress />
              <div className="mt-4">
                <Button variant="outline" onClick={() => window.location.href = '/onboarding'} className="w-full">
                  <Activity className="mr-2 h-4 w-4" />
                  Go to Onboarding Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <form onSubmit={handleProfileUpdate}>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input 
                      id="position" 
                      value={formData.position} 
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                    />
                  </div>

                  <Button type="submit">
                    <User className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </CardContent>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <form onSubmit={handlePasswordChange}>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password"
                      value={password.current}
                      onChange={(e) => setPassword({...password, current: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password"
                        value={password.new}
                        onChange={(e) => setPassword({...password, new: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password"
                        value={password.confirm}
                        onChange={(e) => setPassword({...password, confirm: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button type="submit">
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </CardContent>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications on your device
                      </p>
                    </div>
                    <Switch 
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="task-notifications">Task Assignments</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new task assignments
                      </p>
                    </div>
                    <Switch 
                      id="task-notifications"
                      checked={notifications.tasks}
                      onCheckedChange={(checked) => handleNotificationChange('tasks', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="update-notifications">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about system changes and updates
                      </p>
                    </div>
                    <Switch 
                      id="update-notifications"
                      checked={notifications.updates}
                      onCheckedChange={(checked) => handleNotificationChange('updates', checked)}
                    />
                  </div>
                </div>

                <Button>
                  <Bell className="mr-2 h-4 w-4" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TechnicianSettings;
