import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Package, AlertCircle, Heart, Lightbulb, TrendingUp, Home, History, User, Bell } from 'lucide-react';
import type { AppPage, User as UserType, Donation } from '../App';

interface DonorDashboardProps {
  user: UserType | null;
  donations: Donation[];
  onNavigate: (page: AppPage) => void;
}

export function DonorDashboard({ user, donations, onNavigate }: DonorDashboardProps) {
  if (!user) return null;

  const userDonations = donations.filter(d => d.donorId === user.id);
  const pendingDonations = userDonations.filter(d => d.status === 'pending');
  const approvedDonations = userDonations.filter(d => d.status === 'accepted');
  const deliveredDonations = userDonations.filter(d => d.status === 'delivered');
  
  // Calculate impact metrics
  const totalMealsProvided = deliveredDonations.reduce((sum, d) => sum + (d.estimatedMeals || 0), 0);
  const totalKgDonated = deliveredDonations.reduce((sum, d) => sum + parseFloat(d.quantity), 0);

  const getStatusColor = (status: Donation['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const donationTips = [
    "🥗 Fresh vegetables last longer when stored properly - check expiry dates before donating",
    "📦 Package food in clean, sealed containers to maintain freshness",
    "⏰ Schedule donations during NGO operating hours for faster pickup",
    "🏷️ Label food items clearly with preparation date and ingredients"
  ];

  const [currentTip, setCurrentTip] = useState(0);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold">Welcome back!</h1>
              <p className="text-green-100">{user.name}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
          </div>
          
          {/* Impact Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{totalMealsProvided}</div>
              <div className="text-sm text-green-100">Meals Provided</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{totalKgDonated.toFixed(1)}</div>
              <div className="text-sm text-green-100">kg Donated</div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Quick Actions */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <Button 
              onClick={() => onNavigate('create-donation')}
              className="w-full h-14 text-base bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post New Donation
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-12"
                onClick={() => onNavigate('donation-history')}
              >
                <Package className="w-4 h-4 mr-2" />
                My Donations
              </Button>
              <Button 
                variant="outline" 
                className="h-12"
                onClick={() => onNavigate('notifications')}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Updates
              </Button>
            </div>
          </div>

          {/* Donation Status Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <TrendingUp className="w-4 h-4 mr-2" />
                Donation Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{pendingDonations.length}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{approvedDonations.length}</div>
                  <div className="text-xs text-muted-foreground">Approved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{deliveredDonations.length}</div>
                  <div className="text-xs text-muted-foreground">Delivered</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Donations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Donations</CardTitle>
            </CardHeader>
            <CardContent>
              {userDonations.length > 0 ? (
                <div className="space-y-3">
                  {userDonations.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{donation.foodName}</h4>
                        <p className="text-xs text-muted-foreground">
                          {donation.quantity} • {formatDate(donation.createdAt)}
                        </p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </Badge>
                    </div>
                  ))}
                  {userDonations.length > 3 && (
                    <Button 
                      variant="ghost" 
                      className="w-full text-sm"
                      onClick={() => onNavigate('donation-history')}
                    >
                      View All Donations
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm mb-4">No donations yet</p>
                  <Button onClick={() => onNavigate('create-donation')}>
                    Make Your First Donation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Donation Tips */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base text-blue-800">
                <Lightbulb className="w-4 h-4 mr-2" />
                Donation Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-blue-700">{donationTips[currentTip]}</p>
                <div className="flex justify-center space-x-1">
                  {donationTips.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTip(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTip ? 'bg-blue-500' : 'bg-blue-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-5 gap-1">
              <Button
                variant="ghost"
                className="flex flex-col items-center py-3 px-1 h-auto rounded-none"
              >
                <Home className="w-5 h-5 mb-1 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Home</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center py-3 px-1 h-auto rounded-none"
                onClick={() => onNavigate('create-donation')}
              >
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-xs">Donate</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center py-3 px-1 h-auto rounded-none"
                onClick={() => onNavigate('donation-history')}
              >
                <History className="w-5 h-5 mb-1" />
                <span className="text-xs">History</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center py-3 px-1 h-auto rounded-none"
                onClick={() => onNavigate('notifications')}
              >
                <Bell className="w-5 h-5 mb-1" />
                <span className="text-xs">Alerts</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center py-3 px-1 h-auto rounded-none"
                onClick={() => onNavigate('donor-profile')}
              >
                <User className="w-5 h-5 mb-1" />
                <span className="text-xs">Profile</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
