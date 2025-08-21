import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { CheckCircle, XCircle, Clock, Package, Eye, MapPin, Calendar, Plus, Bell } from 'lucide-react';
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
  const [showPostDonation, setShowPostDonation] = useState(false);
  const [donationForm, setDonationForm] = useState({
    foodName: '',
    description: '',
    quantity: '',
    units: '',
    expirationDate: '',
    category: 'packaged' as const,
    targetMachine: ''
  });

  // Mock machine data (in real app, this would come from props or API)
  const machines = [
    {
      id: 'dispenser-001',
      name: 'Dispenser #1',
      location: 'Main Street Plaza',
      status: 'online' as const,
      stockLevel: 85,
      foodAmount: 34,
      maxCapacity: 40
    },
    {
      id: 'dispenser-002',
      name: 'Dispenser #2',
      location: 'Oak Avenue Center',
      status: 'online' as const,
      stockLevel: 23,
      foodAmount: 9,
      maxCapacity: 40
    },
    {
      id: 'dispenser-003',
      name: 'Dispenser #3',
      location: 'Central Park East',
      status: 'offline' as const,
      stockLevel: 67,
      foodAmount: 27,
      maxCapacity: 40
    }
  ];
  
  // Filter donations for this NGO
  const ngoDonations = donations.filter(d => d.ngoId === user.id || d.status === 'pending' || d.status === 'approved-pending-verification');
  const pendingDonations = ngoDonations.filter(d => d.status === 'pending' || d.status === 'approved-pending-verification');
  const deliveredDonations = ngoDonations.filter(d => d.status === 'delivered' || d.status === 'distributed');

  // Stock alerts
  const lowStockItems = stockItems.filter(item => item.status === 'low');
  const expiredItems = stockItems.filter(item => item.status === 'expired');

  // Memoize notification count to prevent flickering
  const totalNotifications = useMemo(() => {
    return lowStockItems.length + expiredItems.length + pendingDonations.length;
  }, [lowStockItems.length, expiredItems.length, pendingDonations.length]);

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

  const handlePostDonation = () => {
    setShowPostDonation(true);
  };

  const handleDonationSubmit = () => {
    if (!donationForm.foodName || !donationForm.quantity || !donationForm.targetMachine) {
      toast.error('Please fill in all required fields');
      return;
    }

    const targetMachine = machines.find(m => m.id === donationForm.targetMachine);
    if (!targetMachine) {
      toast.error('Please select a valid machine');
      return;
    }

    toast.success(`Food item "${donationForm.foodName}" posted to ${targetMachine.name}`, {
      description: `${donationForm.quantity} ${donationForm.units} available for distribution`,
      duration: 4000,
    });

    setDonationForm({
      foodName: '',
      description: '',
      quantity: '',
      units: '',
      expirationDate: '',
      category: 'packaged',
      targetMachine: ''
    });
    setShowPostDonation(false);
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
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('notifications')}
                className="relative w-10 h-10 bg-white/20 rounded-full hover:bg-white/30 p-0"
                key="notifications-header"
              >
                <Bell className="w-5 h-5" />
                {/* Notification badge - show if there are alerts */}
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {totalNotifications}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Critical Dashboard Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Urgent Actions Required */}
            <div className="bg-red-500/20 rounded-lg p-3 text-center border border-red-300">
              <div className="text-2xl font-bold text-red-200">{pendingDonations.length + expiredItems.length}</div>
              <div className="text-xs text-red-100">Urgent Actions</div>
            </div>
            {/* Active Machine Alerts */}
            <div className="bg-orange-500/20 rounded-lg p-3 text-center border border-orange-300">
              <div className="text-2xl font-bold text-orange-200">3</div>
              <div className="text-xs text-orange-100">Machine Alerts</div>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{stockItems.reduce((sum, item) => sum + item.quantity, 0)}</div>
              <div className="text-xs text-blue-100">Items in Stock</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">2</div>
              <div className="text-xs text-blue-100">Machines Online</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{deliveredDonations.length * 3}</div>
              <div className="text-xs text-blue-100">Meals Served</div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Action Buttons - Keep only Review Donations and Post Food */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button 
              onClick={() => onNavigate('ngo-donations')}
              className="h-12 bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              Review Donations
            </Button>
            <Button 
              onClick={handlePostDonation}
              className="h-12 bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Food
            </Button>
          </div>

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

      {/* Post Donation Modal */}
      {showPostDonation && (
        <Dialog open={showPostDonation} onOpenChange={setShowPostDonation}>
          <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Post Food to Machine</DialogTitle>
              <DialogDescription>
                Add available food items to dispensers for community access
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Food Name *
                </label>
                <input
                  type="text"
                  value={donationForm.foodName}
                  onChange={(e) => setDonationForm({...donationForm, foodName: e.target.value})}
                  placeholder="e.g., Fresh Sandwiches, Canned Soup"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Description
                </label>
                <textarea
                  value={donationForm.description}
                  onChange={(e) => setDonationForm({...donationForm, description: e.target.value})}
                  placeholder="Brief description of the food items..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={donationForm.quantity}
                    onChange={(e) => setDonationForm({...donationForm, quantity: e.target.value})}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Units
                  </label>
                  <select
                    value={donationForm.units}
                    onChange={(e) => setDonationForm({...donationForm, units: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select unit</option>
                    <option value="pcs">pcs</option>
                    <option value="pieces">pieces</option>
                    <option value="servings">servings</option>
                    <option value="boxes">boxes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Category
                </label>
                <select
                  value={donationForm.category}
                  onChange={(e) => setDonationForm({...donationForm, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="packaged">Packaged Food</option>
                  <option value="perishable">Perishable</option>
                  <option value="non-perishable">Non-Perishable</option>
                  <option value="cooked">Cooked Meals</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Target Machine *
                </label>
                <select
                  value={donationForm.targetMachine}
                  onChange={(e) => setDonationForm({...donationForm, targetMachine: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a machine</option>
                  {machines
                    .filter(m => m.status === 'online' && m.stockLevel < 90)
                    .map(machine => (
                      <option key={machine.id} value={machine.id}>
                        {machine.name} - {machine.location} ({machine.foodAmount}/{machine.maxCapacity} items)
                      </option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={donationForm.expirationDate}
                  onChange={(e) => setDonationForm({...donationForm, expirationDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-sm text-green-700">
                  <Package className="w-4 h-4 inline mr-2" />
                  Food items will be available for community members to access through the selected dispenser.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPostDonation(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDonationSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Post Food Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
