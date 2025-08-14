import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Users, Heart } from 'lucide-react';
import type { AppPage, UserRole } from '../App';

interface RoleSelectionProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
  onNavigate: (page: AppPage) => void;
}

export function RoleSelection({ selectedRole, onRoleSelect, onNavigate }: RoleSelectionProps) {
  const handleContinue = () => {
    if (selectedRole) {
      onNavigate('registration');
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('welcome')}
            className="mr-2 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Choose Your Role</h1>
        </div>

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🍃</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Join SAVOR</h2>
          <p className="text-gray-600">How would you like to make a difference?</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4 mb-8">
          <Card 
            className={`cursor-pointer transition-all ${
              selectedRole === 'donor' 
                ? 'ring-2 ring-green-500 bg-green-50' 
                : 'hover:shadow-md border-gray-200'
            }`}
            onClick={() => onRoleSelect('donor')}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedRole === 'donor' ? 'bg-green-500' : 'bg-gray-100'
                }`}>
                  <Heart className={`w-6 h-6 ${
                    selectedRole === 'donor' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">I'm a Donor</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    I have surplus food to share - from restaurants, events, or personal surplus. 
                    I want to help reduce waste and feed those in need.
                  </p>
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Restaurants</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Events</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Households</span>
                    </div>
                  </div>
                </div>
                {selectedRole === 'donor' && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              selectedRole === 'ngo' 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:shadow-md border-gray-200'
            }`}
            onClick={() => onRoleSelect('ngo')}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedRole === 'ngo' ? 'bg-blue-500' : 'bg-gray-100'
                }`}>
                  <Users className={`w-6 h-6 ${
                    selectedRole === 'ngo' ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">I'm an NGO</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    I represent a non-profit organization that distributes food to those in need. 
                    I want to receive donations and manage food distribution.
                  </p>
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Food Banks</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Shelters</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Charities</span>
                    </div>
                  </div>
                </div>
                {selectedRole === 'ngo' && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          disabled={!selectedRole}
          className="w-full"
        >
          Continue as {selectedRole === 'donor' ? 'Donor' : selectedRole === 'ngo' ? 'NGO' : '...'}
        </Button>

        {/* Already have account */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Button 
              variant="link" 
              onClick={() => onNavigate('login')}
              className="text-sm p-0 h-auto"
            >
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
