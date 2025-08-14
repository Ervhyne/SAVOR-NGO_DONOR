import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage, User, UserRole } from '../App';

interface RegistrationProps {
  selectedRole: UserRole;
  onNavigate: (page: AppPage) => void;
  onRegister: (userData: Partial<User>) => void;
}

export function Registration({ selectedRole, onNavigate, onRegister }: RegistrationProps) {
  // Common form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    
    // Donor-specific fields
    donorType: 'individual' as 'individual' | 'company',
    companyName: '',
    
    // NGO-specific fields
    organizationName: '',
    contactPerson: '',
    serviceAreas: [] as string[],
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedRole === 'ngo' && (!formData.organizationName || !formData.contactPerson)) {
      toast.error('Please fill in all organization details');
      return;
    }

    if (selectedRole === 'donor' && formData.donorType === 'company' && !formData.companyName) {
      toast.error('Please enter your company name');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    const userData: Partial<User> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      role: selectedRole,
      
      // Donor-specific data
      ...(selectedRole === 'donor' && {
        donorType: formData.donorType,
        companyName: formData.donorType === 'company' ? formData.companyName : undefined,
      }),
      
      // NGO-specific data
      ...(selectedRole === 'ngo' && {
        organizationName: formData.organizationName,
        contactPerson: formData.contactPerson,
        serviceAreas: formData.serviceAreas,
        pendingReview: true,
        adminApproved: false,
      }),
    };

    onRegister(userData);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('role-selection')}
            className="mr-2 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">
            {selectedRole === 'donor' ? 'Donor Registration' : 'NGO Registration'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedRole === 'donor' ? 'Join as a Food Donor' : 'Register Your Organization'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedRole === 'donor' 
                ? 'Help reduce food waste by sharing surplus food with those in need'
                : 'Connect with food donors to support your community outreach programs'
              }
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Common Fields */}
              <div>
                <Label htmlFor="name">{selectedRole === 'ngo' ? 'Contact Person Name' : 'Full Name'} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={selectedRole === 'ngo' ? 'Primary contact person' : 'Enter your full name'}
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={selectedRole === 'donor' ? 'Pickup/drop-off location' : 'Organization address'}
                />
              </div>

              {/* Donor-Specific Fields */}
              {selectedRole === 'donor' && (
                <>
                  <div>
                    <Label>Donor Type *</Label>
                    <RadioGroup 
                      value={formData.donorType} 
                      onValueChange={(value) => handleInputChange('donorType', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual">Individual</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="company" id="company" />
                        <Label htmlFor="company">Restaurant/Company</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.donorType === 'company' && (
                    <div>
                      <Label htmlFor="companyName">Company/Restaurant Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Enter your business name"
                      />
                    </div>
                  )}
                </>
              )}

              {/* NGO-Specific Fields */}
              {selectedRole === 'ngo' && (
                <>
                  <div>
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      placeholder="Enter your NGO/charity name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceAreas">Service Areas</Label>
                    <Input
                      id="serviceAreas"
                      value={formData.serviceAreas.join(', ')}
                      onChange={(e) => handleInputChange('serviceAreas', e.target.value.split(', ').filter(s => s.trim()))}
                      placeholder="e.g., Food Distribution, Community Outreach"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Separate multiple areas with commas
                    </p>
                  </div>
                </>
              )}

              {/* Password Fields */}
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a strong password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                {selectedRole === 'ngo' ? 'Submit for Review' : 'Create Account'}
              </Button>

              {selectedRole === 'ngo' && (
                <p className="text-xs text-muted-foreground text-center">
                  NGO accounts require admin approval. You'll receive an email once your application is reviewed.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
