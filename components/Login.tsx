import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage } from '../App';

interface LoginProps {
  onNavigate: (page: AppPage) => void;
  onLogin: (email: string, password: string) => boolean;
}

export function Login({ onNavigate, onLogin }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const success = onLogin(formData.email, formData.password);
      
      if (success) {
        onNavigate('dashboard');
      } else {
        toast.error('Invalid email or password. Try "demo" as password for any registered user.');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (userType: 'donor' | 'ngo' = 'donor') => {
    const demoAccounts = {
      donor: { email: 'john@demo.com', password: 'password123', dashboard: 'donor-dashboard' as AppPage },
      ngo: { email: 'contact@hopefoundation.org', password: 'password123', dashboard: 'ngo-dashboard' as AppPage }
    };
    
    const account = demoAccounts[userType];
    setFormData({
      email: account.email,
      password: account.password
    });
    
    setTimeout(() => {
      const success = onLogin(account.email, account.password);
      if (success) {
        onNavigate(account.dashboard);
      } else {
        toast.error('Demo login failed. Please try again.');
      }
    }, 500);
  };

  const handleDonorDemo = () => handleDemoLogin('donor');
  const handleNGODemo = () => handleDemoLogin('ngo');

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('welcome')}
            className="mr-2 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Sign In</h1>
        </div>

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🍃</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back to SAVOR</h2>
          <p className="text-gray-600 mt-2">Sign in to continue sharing food</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In to Your Account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-sm p-0 h-auto"
                >
                  Forgot password?
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleDonorDemo}
                  className="w-full"
                >
                  Demo Donor
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleNGODemo}
                  className="w-full"
                >
                  Demo NGO
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Button 
                  variant="link" 
                  onClick={() => onNavigate('registration')}
                  className="text-sm p-0 h-auto"
                >
                  Sign up
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Instructions */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-blue-900 mb-2">Demo Instructions</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Donor Account: john@demo.com / password123</p>
              <p>• NGO Account: contact@hopefoundation.org / password123</p>
              <p>• Or click the demo buttons above for instant access</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
