import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { CheckCircle, XCircle, Clock, Package, AlertTriangle, Eye, MapPin, Calendar } from 'lucide-react';
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
              onClick={() => onNavigate('machine-monitoring')}
              className="h-12"
            >
              <Package className="w-4 h-4 mr-2" />
              IoT Machines
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => onNavigate('ngo-stock')}
              className="h-12 bg-green-600 hover:bg-green-700"
            >
              <Package className="w-4 h-4 mr-2" />
              Post Food
            </Button>
            <Button 
              variant="outline"
              onClick={() => onNavigate('ngo-stock')}
              className="h-12"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Stock Alerts
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

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {ngoDonations.length > 0 ? (
                <div className="space-y-3">
                  {ngoDonations.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{donation.foodName}</h4>
                        <p className="text-xs text-muted-foreground">
                          {donation.donorName} • {formatDate(donation.createdAt)}
                        </p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No recent donations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
