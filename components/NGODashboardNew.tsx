import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { CheckCircle, XCircle, Clock, Package, AlertTriangle, Eye, MapPin, Calendar, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage, User, Donation, StockItem } from '../App';

interface NGODashboardProps {
  user: User;
  donations: Donation[];
  stockItems: StockItem[];
  onNavigate: (page: AppPage) => void;
}

export function NGODashboard({ user, donations, stockItems, onNavigate }: NGODashboardProps) {
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  
  // Filter donations for this NGO
  const ngoDonations = donations.filter(d => d.ngoId === user.id || d.status === 'pending');
  const pendingDonations = ngoDonations.filter(d => d.status === 'pending');
  const approvedDonations = ngoDonations.filter(d => d.status === 'accepted');
  const deliveredDonations = ngoDonations.filter(d => d.status === 'delivered');

  // Stock alerts
  const lowStockItems = stockItems.filter(item => item.status === 'low');
  const expiredItems = stockItems.filter(item => item.status === 'expired');

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

  const handleApproveDonation = (_donationId: string) => {
    // In real app, this would update the database
    toast.success('Donation approved! Donor has been notified.');
    setSelectedDonation(null);
  };

  const handleRejectDonation = (_donationId: string) => {
    // In real app, this would update the database
    toast.success('Donation rejected. Donor has been notified.');
    setSelectedDonation(null);
  };

  const DonationDetailModal = ({ donation }: { donation: Donation }) => (
    <DialogContent className="max-w-md mx-auto">
      <DialogHeader>
        <DialogTitle>Donation Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        {/* Donor Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-sm mb-1">Donor Information</h4>
          <p className="text-sm">{donation.donorName}</p>
        </div>

        {/* Food Details */}
        <div>
          <h4 className="font-medium text-sm mb-2">Food Details</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Item:</strong> {donation.foodName}</div>
            <div><strong>Quantity:</strong> {donation.quantity} {donation.units}</div>
            <div><strong>Category:</strong> {donation.category}</div>
            {donation.estimatedMeals && (
              <div><strong>Estimated Meals:</strong> {donation.estimatedMeals}</div>
            )}
            {donation.expirationDate && (
              <div><strong>Expires:</strong> {formatDate(donation.expirationDate)}</div>
            )}
            {donation.description && (
              <div><strong>Description:</strong> {donation.description}</div>
            )}
          </div>
        </div>

        {/* Photos */}
        {donation.photos.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Photos</h4>
            <div className="grid grid-cols-2 gap-2">
              {donation.photos.map((photo, index) => (
                <img 
                  key={index}
                  src={photo} 
                  alt={`Food ${index + 1}`}
                  className="w-full h-20 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Pickup Details */}
        <div>
          <h4 className="font-medium text-sm mb-2">Pickup Information</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(donation.pickupDate)}
            </div>
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {donation.deliveryMethod === 'pickup' ? 'NGO Pickup' : `Drop-off: ${donation.dropOffLocation}`}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {donation.status === 'pending' && (
          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={() => handleApproveDonation(donation.id)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleRejectDonation(donation.id)}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        )}
      </div>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold">NGO Dashboard</h1>
              <p className="text-blue-100">{user.organizationName || user.name}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{pendingDonations.length}</div>
              <div className="text-sm text-blue-100">Pending</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{approvedDonations.length}</div>
              <div className="text-sm text-blue-100">Approved</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{deliveredDonations.length}</div>
              <div className="text-sm text-blue-100">Delivered</div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => onNavigate('ngo-donations')}
              className="h-12 bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              Review Donations
            </Button>
            <Button 
              variant="outline"
              onClick={() => onNavigate('ngo-stock')}
              className="h-12"
            >
              <Package className="w-4 h-4 mr-2" />
              Manage Stock
            </Button>
          </div>

          {/* Alerts */}
          {(pendingDonations.length > 0 || lowStockItems.length > 0 || expiredItems.length > 0) && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base text-orange-800">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Alerts & Actions Needed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingDonations.length > 0 && (
                  <div className="p-2 bg-white rounded-lg">
                    <p className="text-sm font-medium text-orange-800">
                      {pendingDonations.length} donation{pendingDonations.length > 1 ? 's' : ''} awaiting review
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-orange-700 p-0 h-auto"
                      onClick={() => onNavigate('ngo-donations')}
                    >
                      Review now →
                    </Button>
                  </div>
                )}
                {lowStockItems.length > 0 && (
                  <div className="p-2 bg-white rounded-lg">
                    <p className="text-sm font-medium text-orange-800">
                      {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} running low
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-orange-700 p-0 h-auto"
                      onClick={() => onNavigate('ngo-stock')}
                    >
                      Check stock →
                    </Button>
                  </div>
                )}
                {expiredItems.length > 0 && (
                  <div className="p-2 bg-white rounded-lg">
                    <p className="text-sm font-medium text-red-800">
                      {expiredItems.length} expired item{expiredItems.length > 1 ? 's' : ''} to remove
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-700 p-0 h-auto"
                      onClick={() => onNavigate('ngo-stock')}
                    >
                      Remove items →
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pending Donations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Pending Approvals
                </span>
                {pendingDonations.length > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {pendingDonations.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingDonations.length > 0 ? (
                <div className="space-y-3">
                  {pendingDonations.slice(0, 3).map((donation) => (
                    <Dialog key={donation.id}>
                      <DialogTrigger asChild>
                        <div 
                          className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 cursor-pointer hover:bg-yellow-100"
                          onClick={() => setSelectedDonation(donation)}
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{donation.foodName}</h4>
                            <p className="text-xs text-muted-foreground">
                              by {donation.donorName} • {donation.quantity} {donation.units}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Pickup: {formatDate(donation.pickupDate)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge className={`text-xs ${getStatusColor(donation.status)}`}>
                              {donation.status}
                            </Badge>
                            <Eye className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </DialogTrigger>
                      {selectedDonation && (
                        <DonationDetailModal donation={selectedDonation} />
                      )}
                    </Dialog>
                  ))}
                  {pendingDonations.length > 3 && (
                    <Button 
                      variant="ghost" 
                      className="w-full text-sm"
                      onClick={() => onNavigate('ngo-donations')}
                    >
                      View All Pending ({pendingDonations.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">All caught up!</p>
                  <p className="text-muted-foreground text-xs">No donations waiting for approval</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Machine Fill & Claims Tracking */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Machine Distribution
                </span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    4 Active
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Claim Activity Line Graph */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Claim Activity Today</span>
                  <span className="text-xs text-gray-500">9:00 AM</span>
                </div>
                
                {/* Smooth Curved Line Graph */}
                <div className="relative h-24 bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 overflow-hidden">
                  {/* Grid lines */}
                  <div className="absolute inset-0 p-4">
                    <div className="h-full border-l border-b border-gray-200 relative">
                      <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200"></div>
                      <div className="absolute bottom-1/3 left-0 w-full h-px bg-gray-100"></div>
                      <div className="absolute bottom-2/3 left-0 w-full h-px bg-gray-100"></div>
                    </div>
                  </div>
                  
                  {/* SVG for smooth curves */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 96" preserveAspectRatio="none">
                    {/* Single combined activity curve */}
                    <path
                      d="M20,75 Q60,65 100,45 T180,40 Q220,35 260,30"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                      opacity="0.9"
                    />
                    
                    {/* Current time indicator */}
                    <line
                      x1="200"
                      y1="10"
                      x2="200"
                      y2="85"
                      stroke="#6b7280"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                      opacity="0.5"
                    />
                  </svg>
                  
                  {/* Time labels */}
                  <div className="absolute bottom-0 left-0 w-full flex justify-between px-4 pb-1">
                    <span className="text-xs text-gray-400">6AM</span>
                    <span className="text-xs text-gray-400">8AM</span>
                    <span className="text-xs text-gray-400">10AM</span>
                    <span className="text-xs text-gray-400">12PM</span>
                  </div>
                  
                  {/* Legend */}
                  <div className="absolute top-2 right-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Claims</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-700">34</div>
                  <div className="text-xs text-blue-600">Items Active</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-700">2.3h</div>
                  <div className="text-xs text-orange-600">Avg. Claim Time</div>
                </div>
              </div>

              {/* Machine Status List - Simplified */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">Dispenser #2</h4>
                    <p className="text-xs text-muted-foreground">
                      12/15 items • Filled: 6:00 AM (3h ago)
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                      <span className="text-xs text-blue-600">5 claims</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">Dispenser #1</h4>
                    <p className="text-xs text-muted-foreground">
                      3/12 items • Filled: 5:30 AM (3.5h ago)
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-xs text-blue-600">9 claims</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">Dispenser #3</h4>
                    <p className="text-xs text-muted-foreground">
                      0/8 items • Last filled: Yesterday 4:00 PM
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-xs text-gray-600">0 claims</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                variant="outline" 
                className="w-full mt-4 text-sm"
                onClick={() => onNavigate('machine-monitoring')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Fresh Vegetables</h4>
                    <p className="text-xs text-muted-foreground">
                      Posted to Dispenser #1 • Aug 20, 8:00 AM
                    </p>
                  </div>
                  <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                    posted
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Dispenser #2</h4>
                    <p className="text-xs text-muted-foreground">
                      Low stock alert - requires refill • Aug 20, 7:30 AM
                    </p>
                  </div>
                  <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                    alert
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Canned Soup Variety</h4>
                    <p className="text-xs text-muted-foreground">
                      15 items claimed by beneficiaries • Aug 19, 6:45 PM
                    </p>
                  </div>
                  <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                    claimed
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Dispenser #3</h4>
                    <p className="text-xs text-muted-foreground">
                      Connection restored - back online • Aug 19, 5:20 PM
                    </p>
                  </div>
                  <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                    online
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Bread Loaves</h4>
                    <p className="text-xs text-muted-foreground">
                      Stock depleted - out of stock • Aug 19, 3:15 PM
                    </p>
                  </div>
                  <Badge className="text-xs bg-red-100 text-red-800 border-red-200">
                    empty
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Dispenser #4</h4>
                    <p className="text-xs text-muted-foreground">
                      Scheduled maintenance completed • Aug 19, 2:00 PM
                    </p>
                  </div>
                  <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                    maintenance
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
