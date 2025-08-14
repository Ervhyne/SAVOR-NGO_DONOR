import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Bell, Plus, History, Settings, Truck, Package, CheckCircle } from 'lucide-react';
import type { AppPage, User, Donation } from '../App';

interface DashboardProps {
  user: User | null;
  donations: Donation[];
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
  }>;
  onNavigate: (page: AppPage) => void;
}

export function Dashboard({ user, donations, notifications, onNavigate }: DashboardProps) {
  const getStatusColor = (status: Donation['status']) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'distributed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Donation['status']) => {
    switch (status) {
      case 'submitted': return <Package className="w-4 h-4" />;
      case 'in-transit': return <Truck className="w-4 h-4" />;
      case 'received': 
      case 'distributed': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const recentDonations = donations.slice(0, 3);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Welcome to FoodShare</h2>
            <p className="text-muted-foreground mb-6">Please sign in to continue</p>
            <Button onClick={() => onNavigate('welcome')} className="w-full">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold">Hello, {user.name.split(' ')[0]}</h1>
              <p className="text-sm text-muted-foreground">Ready to share some food?</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('notifications')}
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Quick Action */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-2">Make a Donation</h2>
              <p className="text-green-100 mb-4">Share your surplus food with those in need</p>
              <Button 
                onClick={() => onNavigate('create-donation')}
                className="bg-white text-green-600 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Donation
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-semibold text-green-600">{donations.length}</div>
                <div className="text-sm text-muted-foreground">Total Donations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-semibold text-purple-600">
                  {donations.filter(d => d.status === 'distributed').length}
                </div>
                <div className="text-sm text-muted-foreground">Meals Served</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Donations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Recent Donations</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('history')}
              >
                <History className="w-4 h-4 mr-1" />
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentDonations.length > 0 ? (
                recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getStatusIcon(donation.status)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{donation.foodName}</p>
                        <p className="text-xs text-muted-foreground">
                          {donation.quantity} {donation.units} • {formatDate(donation.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(donation.status)}`}>
                      {donation.status.replace('-', ' ')}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted-foreground">No donations yet</p>
                  <Button 
                    variant="link" 
                    onClick={() => onNavigate('create-donation')}
                    className="mt-2"
                  >
                    Make your first donation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => onNavigate('tracking')}
              className="h-16 flex flex-col"
            >
              <Truck className="w-5 h-5 mb-1" />
              <span className="text-sm">Track Donations</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('history')}
              className="h-16 flex flex-col"
            >
              <History className="w-5 h-5 mb-1" />
              <span className="text-sm">View History</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
