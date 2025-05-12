
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
import { User, Lock, Bell, Palette } from 'lucide-react';

const TechnicianSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
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
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully."
    });
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">Update your account settings and preferences</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 border rounded-md p-2">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-2">Theme:</span>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TechnicianSettings;
