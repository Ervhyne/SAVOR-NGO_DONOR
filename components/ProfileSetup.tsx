import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage, User } from '../App';

interface ProfileSetupProps {
  user: User | null;
  onNavigate: (page: AppPage) => void;
  onUpdateUser: (user: User) => void;
}

export function ProfileSetup({ user, onNavigate, onUpdateUser }: ProfileSetupProps) {
  const [formData, setFormData] = useState({
    organization: '',
    donationTypes: [] as string[],
    donationFrequency: '',
    profilePicture: ''
  });

  const donationTypeOptions = [
    { id: 'fresh-produce', label: 'Fresh Produce (fruits, vegetables)' },
    { id: 'canned-goods', label: 'Canned Goods' },
    { id: 'bread-bakery', label: 'Bread & Bakery Items' },
    { id: 'cooked-food', label: 'Cooked Food' },
    { id: 'dairy', label: 'Dairy Products' },
    { id: 'dry-goods', label: 'Dry Goods (rice, pasta, etc.)' }
  ];

  const handleDonationTypeChange = (typeId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      donationTypes: checked 
        ? [...prev.donationTypes, typeId]
        : prev.donationTypes.filter(t => t !== typeId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const updatedUser: User = {
      ...user,
      organization: formData.organization,
      donationPreferences: formData.donationTypes,
      profilePicture: formData.profilePicture
    };

    onUpdateUser(updatedUser);
    toast.success('Profile setup completed!');
    onNavigate('dashboard');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('registration')}
            className="mr-2 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Complete Your Profile</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.name}!</CardTitle>
            <p className="text-sm text-muted-foreground">
              Let's personalize your donation experience
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Upload */}
              <div>
                <Label>Profile Picture (Optional)</Label>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    {formData.profilePicture ? (
                      <img 
                        src={formData.profilePicture} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <Upload className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>

              {/* Organization */}
              <div>
                <Label htmlFor="organization">Organization (Optional)</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  placeholder="e.g., Restaurant, Grocery Store, Corporate Office"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave blank if you're an individual donor
                </p>
              </div>

              {/* Donation Preferences */}
              <div>
                <Label>What types of food do you typically donate?</Label>
                <div className="mt-3 space-y-3">
                  {donationTypeOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={formData.donationTypes.includes(option.id)}
                        onCheckedChange={(checked) => 
                          handleDonationTypeChange(option.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={option.id} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donation Frequency */}
              <div>
                <Label htmlFor="frequency">How often do you plan to donate?</Label>
                <select 
                  id="frequency"
                  value={formData.donationFrequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, donationFrequency: e.target.value }))}
                  className="w-full mt-1 p-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select frequency</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="one-time">One-time donation</option>
                </select>
              </div>

              <div className="space-y-3">
                <Button type="submit" className="w-full">
                  Complete Setup
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onNavigate('dashboard')}
                  className="w-full"
                >
                  Skip for now
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
