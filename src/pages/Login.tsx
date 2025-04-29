
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/types';
import { Label } from '@/components/ui/label';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('technician');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp, demoLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: 'Success',
        description: 'Welcome back to Swiish!',
      });
      redirectBasedOnRole();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(email, password, selectedRole);
      toast({
        title: 'Success',
        description: 'Account created. Welcome to Swiish!',
      });
      redirectBasedOnRole();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      await demoLogin(role);
      redirectBasedOnRole();
      toast({
        title: 'Demo Login',
        description: `Logged in as ${role}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not login with demo account.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBasedOnRole = () => {
    // Will redirect based on the logged-in user's role
    // This is handled by the AuthProvider and ProtectedRoute
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Swiish</h1>
          <p className="text-muted-foreground mt-2">Fleet Control System</p>
        </div>
        
        <Card>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="your.email@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password"
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or try a demo account
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDemoLogin('technician')}
                    disabled={isLoading}
                  >
                    Technician
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDemoLogin('warehouse')}
                    disabled={isLoading}
                  >
                    Warehouse
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDemoLogin('logistics')}
                    disabled={isLoading}
                  >
                    Logistics
                  </Button>
                </div>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="register">
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your details to register</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email"
                      type="email" 
                      placeholder="your.email@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input 
                      id="register-password"
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <Input 
                      id="register-confirm-password"
                      type="password" 
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    >
                      <option value="technician">Technician</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="logistics">Logistics</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Register'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
