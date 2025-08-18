import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Progress } from './ui/progress';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Upload, FileText, CreditCard, Globe, Check, Building } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage, User, UserRole } from '../App';

interface RegistrationProps {
  selectedRole: UserRole;
  onNavigate: (page: AppPage) => void;
  onRegister: (userData: Partial<User>) => void;
}

export function Registration({ selectedRole, onNavigate, onRegister }: RegistrationProps) {
  // Step management for NGO registration
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = selectedRole === 'ngo' ? 3 : 1;
  
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
    
    // NGO Documentation fields
    ngoDocument: '' as string,
    ngoDocumentName: '' as string,
    identificationDocument: '' as string,
    identificationDocumentName: '' as string,
    website: '' as string,
    facebook: '' as string,
    instagram: '' as string,
    twitter: '' as string,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File) => {
    // In a real app, you would upload to a server/cloud storage
    // For now, we'll create a mock URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileUrl = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        [field]: fileUrl,
        [`${field}Name`]: file.name
      }));
      toast.success(`${file.name} uploaded successfully!`);
    };
    reader.readAsDataURL(file);
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    if (selectedRole !== 'ngo') return true;

    switch (currentStep) {
      case 1: // Basic Information
        if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.organizationName) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
      case 2: // Documentation
        if (!formData.ngoDocument || !formData.identificationDocument) {
          toast.error('Please upload all required documents');
          return false;
        }
        break;
      case 3: // Account Setup
        if (!formData.password || !formData.confirmPassword) {
          toast.error('Please set up your password');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return false;
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters long');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRole === 'ngo') {
      if (currentStep < totalSteps) {
        nextStep();
        return;
      }
    }

    // Final validation for non-NGO or final step
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedRole === 'ngo' && (!formData.organizationName || !formData.ngoDocument || !formData.identificationDocument)) {
      toast.error('Please complete all NGO registration requirements');
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
        ngoDocument: formData.ngoDocument,
        ngoDocumentName: formData.ngoDocumentName,
        identificationDocument: formData.identificationDocument,
        identificationDocumentName: formData.identificationDocumentName,
        website: formData.website,
        facebook: formData.facebook,
        instagram: formData.instagram,
        twitter: formData.twitter,
        pendingReview: true,
        adminApproved: false,
      }),
    };

    onRegister(userData);
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Organization Information';
      case 2: return 'Document Verification';
      case 3: return 'Account Setup';
      default: return 'Registration';
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Provide your organization details and contact information';
      case 2: return 'Upload required legal documents for verification';
      case 3: return 'Set up your account credentials and online presence';
      default: return '';
    }
  };

  const renderStepContent = () => {
    if (selectedRole === 'donor') {
      return renderDonorForm();
    }

    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  const renderDonorForm = () => (
    <div className="space-y-4">
      {/* Common Fields */}
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your full name"
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
          placeholder="Pickup/drop-off location"
        />
      </div>

      {/* Donor-Specific Fields */}
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
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-blue-600 mb-4">
        <Building className="w-5 h-5" />
        <span className="font-medium">Step 1: Organization Information</span>
      </div>

      <div>
        <Label htmlFor="name">Contact Person Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Primary contact person"
        />
      </div>

      <div>
        <Label htmlFor="email">Official Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="official@your-ngo.org"
        />
      </div>

      <div>
        <Label htmlFor="phone">Contact Phone Number *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div>
        <Label htmlFor="address">Organization Address *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Complete organization address"
        />
      </div>

      <div>
        <Label htmlFor="organizationName">Organization Name *</Label>
        <Input
          id="organizationName"
          value={formData.organizationName}
          onChange={(e) => handleInputChange('organizationName', e.target.value)}
          placeholder="Legal name of your NGO/charity"
        />
      </div>

      <div>
        <Label htmlFor="serviceAreas">Service Areas</Label>
        <Input
          id="serviceAreas"
          value={formData.serviceAreas.join(', ')}
          onChange={(e) => handleInputChange('serviceAreas', e.target.value.split(', ').filter(s => s.trim()))}
          placeholder="e.g., Food Distribution, Community Outreach, Child Welfare"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Separate multiple areas with commas
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-blue-600 mb-4">
        <FileText className="w-5 h-5" />
        <span className="font-medium">Step 2: Document Verification</span>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-800 mb-2">Required Documents</h4>
        <p className="text-sm text-blue-700">
          Please upload clear, legible copies of the following documents. All documents will be securely stored and reviewed by our verification team.
        </p>
      </div>
      
      {/* Official NGO Document */}
      <div className="space-y-3">
        <Label className="text-base font-medium">1. Official NGO Registration Certificate *</Label>
        <p className="text-sm text-muted-foreground">
          Government-issued registration certificate or incorporation documents
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            id="ngoDocument"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload('ngoDocument', file);
            }}
            className="hidden"
          />
          
          {formData.ngoDocument ? (
            <div className="space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">Document Uploaded Successfully</p>
                <p className="text-sm text-gray-600">{formData.ngoDocumentName}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('ngoDocument')?.click()}
                className="text-sm"
              >
                Replace Document
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="font-medium">Upload NGO Registration Certificate</p>
                <p className="text-sm text-muted-foreground">PDF or Image files accepted</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('ngoDocument')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ID Document */}
      <div className="space-y-3">
        <Label className="text-base font-medium">2. Contact Person ID Document *</Label>
        <p className="text-sm text-muted-foreground">
          Government-issued photo ID (Driver's License, Passport, or National ID)
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            id="identificationDocument"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload('identificationDocument', file);
            }}
            className="hidden"
          />
          
          {formData.identificationDocument ? (
            <div className="space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">ID Document Uploaded Successfully</p>
                <p className="text-sm text-gray-600">{formData.identificationDocumentName}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('identificationDocument')?.click()}
                className="text-sm"
              >
                Replace Document
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="font-medium">Upload Government-Issued ID</p>
                <p className="text-sm text-muted-foreground">PDF or Image files accepted</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('identificationDocument')?.click()}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-blue-600 mb-4">
        <Globe className="w-5 h-5" />
        <span className="font-medium">Step 3: Account Setup</span>
      </div>

      {/* Password Setup */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800">Account Credentials</h4>
        
        <div>
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a strong password (min 6 characters)"
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
      </div>

      {/* Online Presence */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium text-gray-800">Online Presence (Optional)</h4>
        <p className="text-sm text-muted-foreground">
          Help donors find and verify your organization online
        </p>
        
        <div>
          <Label htmlFor="website">Official Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://your-ngo-website.org"
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label htmlFor="facebook">Facebook Page</Label>
            <Input
              id="facebook"
              value={formData.facebook}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
              placeholder="https://facebook.com/your-ngo"
            />
          </div>

          <div>
            <Label htmlFor="instagram">Instagram Account</Label>
            <Input
              id="instagram"
              value={formData.instagram}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              placeholder="https://instagram.com/your-ngo"
            />
          </div>

          <div>
            <Label htmlFor="twitter">Twitter Account</Label>
            <Input
              id="twitter"
              value={formData.twitter}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
              placeholder="https://twitter.com/your-ngo"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              if (selectedRole === 'ngo' && currentStep > 1) {
                prevStep();
              } else {
                onNavigate('role-selection');
              }
            }}
            className="mr-2 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">
            {selectedRole === 'donor' ? 'Donor Registration' : 'NGO Registration'}
          </h1>
        </div>

        {/* Progress Bar for NGO */}
        {selectedRole === 'ngo' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedRole === 'donor' ? 'Join as a Food Donor' : getStepTitle(currentStep)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedRole === 'donor' 
                ? 'Help reduce food waste by sharing surplus food with those in need'
                : getStepDescription(currentStep)
              }
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {selectedRole === 'ngo' && currentStep > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                  >
                    Previous
                  </Button>
                )}
                
                <Button 
                  type="submit" 
                  className={`${selectedRole === 'ngo' && currentStep > 1 ? 'ml-auto' : 'w-full'}`}
                >
                  {selectedRole === 'ngo' ? (
                    currentStep === totalSteps ? (
                      'Submit for Review'
                    ) : (
                      <>
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>

              {selectedRole === 'ngo' && currentStep === totalSteps && (
                <p className="text-xs text-muted-foreground text-center">
                  Your application will be reviewed by our team. You'll receive an email notification once approved.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
