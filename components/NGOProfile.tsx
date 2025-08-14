import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { ArrowLeft, Camera, Trash2, LogOut, Bell, Shield, HelpCircle, Download, Share2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage, User as UserType } from '../App';

interface NGOProfileProps {
  user: UserType | null;
  onNavigate: (page: AppPage) => void;
  onUpdateUser: (user: UserType) => void;
  onLogout: () => void;
}

export function NGOProfile({ user, onNavigate, onUpdateUser, onLogout }: NGOProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [notifications, setNotifications] = useState({
    newDonations: true,
    statusUpdates: true,
    lowStock: true,
    volunteerUpdates: false,
    reports: true
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
    toast.success('Organization profile updated successfully!');
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleDeleteAccount = () => {
    toast.error('Organization account deletion requires confirmation. Please contact support.');
  };

  const handleExportData = () => {
    const exportData = {
      organization: user,
      exportDate: new Date().toISOString(),
      note: 'This is your SAVOR organization data export'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `savor-ngo-data-${user.organizationName?.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Organization data exported successfully!');
  };

  const settingsMenuItems = [
    {
      icon: FileText,
      title: 'Organization Documents',
      description: 'View and update registration documents',
      action: () => toast.info('Document management coming soon!')
    },
    {
      icon: Download,
      title: 'Export Data',
      description: 'Download organization and donation data',
      action: handleExportData
    },
    {
      icon: Share2,
      title: 'Share SAVOR',
      description: 'Invite other NGOs to join',
      action: () => toast.success('NGO referral program coming soon!')
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Manage organization privacy settings',
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
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center p-4 border-b">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('ngo-dashboard')}
            className="mr-2 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Organization Profile</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Organization Profile
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
                  {/* Organization Logo */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={editedUser?.profilePicture} />
                      <AvatarFallback>{editedUser?.organizationName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Logo
                    </Button>
                  </div>

                  {/* Edit Form */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="editOrganization">Organization Name</Label>
                      <Input
                        id="editOrganization"
                        value={editedUser?.organizationName || ''}
                        onChange={(e) => setEditedUser(prev => prev ? {...prev, organization: e.target.value} : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editContactPerson">Contact Person</Label>
                      <Input
                        id="editContactPerson"
                        value={editedUser?.contactPerson || ''}
                        onChange={(e) => setEditedUser(prev => prev ? {...prev, contactPerson: e.target.value} : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editEmail">Contact Email</Label>
                      <Input
                        id="editEmail"
                        type="email"
                        value={editedUser?.email || ''}
                        onChange={(e) => setEditedUser(prev => prev ? {...prev, email: e.target.value} : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editPhone">Contact Phone</Label>
                      <Input
                        id="editPhone"
                        value={editedUser?.phone || ''}
                        onChange={(e) => setEditedUser(prev => prev ? {...prev, phone: e.target.value} : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editAddress">Organization Address</Label>
                      <Input
                        id="editAddress"
                        value={editedUser?.address || ''}
                        onChange={(e) => setEditedUser(prev => prev ? {...prev, address: e.target.value} : null)}
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
                      <AvatarFallback>{user.organizationName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{user.organizationName}</h3>
                      <p className="text-sm text-muted-foreground">Contact: {user.contactPerson}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {user.isVerified ? 'Verified NGO' : 'Pending Verification'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {membershipDuration === 0 ? 'New partner' : `${membershipDuration} days active`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Phone: {user.phone}</p>
                    <p>Address: {user.address}</p>
                    {user.accreditationDocs && (
                      <p>Documents: {user.accreditationDocs.length} files on record</p>
                    )}
                  </div>
                  
                  {/* Impact Summary */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Organization Impact</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-blue-600 font-medium">{user.totalDonations}</span>
                        <p className="text-blue-700">Donations Received</p>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">{user.totalMealsServed}</span>
                        <p className="text-blue-700">People Served</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings Menu */}
          <div className="space-y-3">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">New donations</p>
                  <p className="text-xs text-muted-foreground">Get notified when new donations arrive</p>
                </div>
                <Switch 
                  checked={notifications.newDonations}
                  onCheckedChange={(checked) => {
                    setNotifications(prev => ({...prev, newDonations: checked}));
                    toast.success(checked ? 'New donation notifications enabled' : 'New donation notifications disabled');
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Status updates</p>
                  <p className="text-xs text-muted-foreground">Updates on donation processing</p>
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
                  <p className="text-sm font-medium">Low stock alerts</p>
                  <p className="text-xs text-muted-foreground">Alerts when items are running low</p>
                </div>
                <Switch 
                  checked={notifications.lowStock}
                  onCheckedChange={(checked) => {
                    setNotifications(prev => ({...prev, lowStock: checked}));
                    toast.success(checked ? 'Low stock notifications enabled' : 'Low stock notifications disabled');
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Volunteer updates</p>
                  <p className="text-xs text-muted-foreground">Updates from volunteer activities</p>
                </div>
                <Switch 
                  checked={notifications.volunteerUpdates}
                  onCheckedChange={(checked) => {
                    setNotifications(prev => ({...prev, volunteerUpdates: checked}));
                    toast.success(checked ? 'Volunteer notifications enabled' : 'Volunteer notifications disabled');
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Monthly reports</p>
                  <p className="text-xs text-muted-foreground">Impact and activity summaries</p>
                </div>
                <Switch 
                  checked={notifications.reports}
                  onCheckedChange={(checked) => {
                    setNotifications(prev => ({...prev, reports: checked}));
                    toast.success(checked ? 'Report notifications enabled' : 'Report notifications disabled');
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-red-200">
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
                Delete Organization Account
              </Button>
            </CardContent>
          </Card>

          {/* App Info */}
          <div className="text-center text-xs text-muted-foreground">
            <p>SAVOR for NGOs v1.0.0</p>
            <p>Empowering organizations to fight hunger</p>
            <p className="mt-2">
              Questions? <Button variant="link" className="text-xs p-0 h-auto">Contact Support</Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
