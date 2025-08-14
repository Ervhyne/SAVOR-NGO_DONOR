import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { ArrowLeft, Camera, Trash2, LogOut, Bell, Shield, HelpCircle, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage, User } from '../App';

interface SettingsProps {
  user: User | null;
  onNavigate: (page: AppPage) => void;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

export function Settings({ user, onNavigate, onUpdateUser, onLogout }: SettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [notifications, setNotifications] = useState({
    statusUpdates: true,
    ngoFeedback: true,
    reminders: false,
    marketing: false
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Please sign in</h2>
            <Button onClick={() => onNavigate('welcome')} className="w-full">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveProfile = () => {
    if (!editedUser) return;
    
    onUpdateUser(editedUser);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation dialog
    toast.error('Account deletion requires confirmation. Please contact support.');
  };

  const handleExportData = () => {
    // Mock data export
    const exportData = {
      user: user,
      exportDate: new Date().toISOString(),
      note: 'This is your SAVOR data export'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `savor-data-${user.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const settingsMenuItems = [
    {
      icon: Download,
      title: 'Export Data',
      description: 'Download your donation history',
      action: handleExportData
    },
    {
      icon: Share2,
      title: 'Share SAVOR',
      description: 'Invite friends to join the mission',
      action: () => toast.success('Sharing feature coming soon!')
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Manage your privacy settings',
      action: () => toast.info('Privacy settings coming soon!')
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get help and contact support',
      action: () => toast.info('Support center coming soon!')
    }
  ];

  const membershipDuration = user.createdAt ? 
    Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-background px-4 py-6 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('donor-dashboard')}
            className="mr-2 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>

        {/* Profile Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Profile
              {!isEditing && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={editedUser?.profilePicture} />
                    <AvatarFallback>{editedUser?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>

                {/* Edit Form */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="editName">Full Name</Label>
                    <Input
                      id="editName"
                      value={editedUser?.name || ''}
                      onChange={(e) => setEditedUser((prev: User | null) => prev ? {...prev, name: e.target.value} : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editEmail">Email</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      value={editedUser?.email || ''}
                      onChange={(e) => setEditedUser((prev: User | null) => prev ? {...prev, email: e.target.value} : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editPhone">Phone</Label>
                    <Input
                      id="editPhone"
                      value={editedUser?.phone || ''}
                      onChange={(e) => setEditedUser((prev: User | null) => prev ? {...prev, phone: e.target.value} : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editAddress">Address</Label>
                    <Input
                      id="editAddress"
                      value={editedUser?.address || ''}
                      onChange={(e) => setEditedUser((prev: User | null) => prev ? {...prev, address: e.target.value} : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editOrganization">Organization (Optional)</Label>
                    <Input
                      id="editOrganization"
                      value={editedUser?.organizationName || ''}
                      onChange={(e) => setEditedUser((prev: User | null) => prev ? {...prev, organizationName: e.target.value} : null)}
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button onClick={handleSaveProfile} className="flex-1">
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUser(user);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.organizationName && (
                      <p className="text-sm text-muted-foreground">{user.organizationName}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {membershipDuration === 0 ? 'New member' : `${membershipDuration} days with us`}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Phone: {user.phone}</p>
                  <p>Address: {user.address}</p>
                </div>
                
                {/* Impact Summary */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Your Impact</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-green-600 font-medium">{user.totalDonations}</span>
                      <p className="text-green-700">Donations Made</p>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">{user.totalMealsServed}</span>
                      <p className="text-green-700">Meals Served</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Menu */}
        <div className="space-y-3 mb-6">
          {settingsMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={item.action}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Notification Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Donation status updates</p>
                <p className="text-xs text-muted-foreground">Get notified about donation progress</p>
              </div>
              <Switch 
                checked={notifications.statusUpdates}
                onCheckedChange={(checked) => {
                  setNotifications(prev => ({...prev, statusUpdates: checked}));
                  toast.success(checked ? 'Status notifications enabled' : 'Status notifications disabled');
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">NGO feedback</p>
                <p className="text-xs text-muted-foreground">Receive thank you messages</p>
              </div>
              <Switch 
                checked={notifications.ngoFeedback}
                onCheckedChange={(checked) => {
                  setNotifications(prev => ({...prev, ngoFeedback: checked}));
                  toast.success(checked ? 'Feedback notifications enabled' : 'Feedback notifications disabled');
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Pickup reminders</p>
                <p className="text-xs text-muted-foreground">Remind me about scheduled pickups</p>
              </div>
              <Switch 
                checked={notifications.reminders}
                onCheckedChange={(checked) => {
                  setNotifications(prev => ({...prev, reminders: checked}));
                  toast.success(checked ? 'Reminder notifications enabled' : 'Reminder notifications disabled');
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Tips and insights</p>
                <p className="text-xs text-muted-foreground">Food waste tips and success stories</p>
              </div>
              <Switch 
                checked={notifications.marketing}
                onCheckedChange={(checked) => {
                  setNotifications(prev => ({...prev, marketing: checked}));
                  toast.success(checked ? 'Tips notifications enabled' : 'Tips notifications disabled');
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-red-200 mb-6">
          <CardHeader>
            <CardTitle className="text-base text-red-600">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDeleteAccount}
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center text-xs text-muted-foreground">
          <p>SAVOR v1.0.0</p>
          <p>Made with ❤️ for ending food waste</p>
          <p className="mt-2">
            Questions? <Button variant="link" className="text-xs p-0 h-auto">Contact Support</Button>
          </p>
        </div>
      </div>
    </div>
  );
}
