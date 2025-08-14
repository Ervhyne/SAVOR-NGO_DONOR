import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, Users, Truck } from 'lucide-react';
import type { AppPage } from '../App';

interface WelcomeScreenProps {
  onNavigate: (page: AppPage) => void;
}

export function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🍃</span>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">SAVOR</h1>
          <p className="text-gray-600 mt-2">Share food, spread hope</p>
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=250&fit=crop"
            alt="People sharing food"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        {/* Mission Statement */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Turn surplus food into hope
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Join our community of food donors making a real difference. Share your excess food with local NGOs and help fight hunger in your community.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Easy Donations</h3>
              <p className="text-sm text-gray-600">Simple process to donate food</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Flexible Pickup</h3>
              <p className="text-sm text-gray-600">Drop-off or pickup options</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Track Impact</h3>
              <p className="text-sm text-gray-600">See your donation journey</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => onNavigate('registration')}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Get Started - Sign Up
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onNavigate('login')}
            className="w-full"
          >
            Already have an account? Sign In
          </Button>
        </div>

        {/* Quick Demo Access */}
        <div className="mt-6">
          <Card className="bg-blue-50 border-blue-200 p-4">
            <div className="text-center">
              <p className="text-sm text-blue-800 mb-3">
                Want to see SAVOR in action?
              </p>
              <Button 
                variant="outline" 
                onClick={() => onNavigate('login')}
                className="text-blue-700 border-blue-300 hover:bg-blue-100"
                size="sm"
              >
                Try Demo Account
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
