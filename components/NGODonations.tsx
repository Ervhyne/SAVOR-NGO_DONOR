import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, User, Calendar, MapPin, Phone, Eye } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage, Donation } from '../App';

interface NGODonationsProps {
  donations: Donation[];
  onNavigate: (page: AppPage) => void;
  onUpdateStatus: (donationId: string, status: Donation['status'], note?: string) => void;
}

export function NGODonations({ donations, onNavigate, onUpdateStatus }: NGODonationsProps) {
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  const getStatusColor = (status: Donation['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-transit': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'perishable': return '🥬';
      case 'non-perishable': return '🥫';
      case 'cooked': return '🍲';
      case 'packaged': return '📦';
      default: return '🍽️';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPickupDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAcceptDonation = (donation: Donation) => {
    onUpdateStatus(donation.id, 'accepted', 'Donation accepted by NGO - preparing for pickup');
    toast.success(`Accepted donation from ${donation.donorName}`);
  };

  const handleRejectDonation = (donation: Donation) => {
    onUpdateStatus(donation.id, 'rejected', 'Donation rejected - unable to process at this time');
    toast.error(`Rejected donation from ${donation.donorName}`);
  };

  const handleMarkInTransit = (donation: Donation) => {
    onUpdateStatus(donation.id, 'in-transit', 'Volunteer dispatched for pickup');
    toast.success('Donation marked as in transit');
  };

  const handleMarkDelivered = (donation: Donation) => {
    onUpdateStatus(donation.id, 'delivered', 'Donation successfully received at NGO facility');
    toast.success('Donation marked as delivered');
  };

  const filterDonations = (status: string) => {
    if (status === 'all') return donations;
    return donations.filter(d => d.status === status);
  };

  const pendingDonations = filterDonations('pending');
  const acceptedDonations = filterDonations('accepted');
  const inTransitDonations = filterDonations('in-transit');
  const deliveredDonations = filterDonations('delivered');

  const DonationCard = ({ donation }: { donation: Donation }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">{getCategoryIcon(donation.category)}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm">{donation.foodName}</h4>
              <Badge className={`text-xs ${getStatusColor(donation.status)}`}>
                {donation.status}
              </Badge>
            </div>
            
            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3" />
                <span>From: {donation.donorName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-3 h-3" />
                <span>{donation.quantity} {donation.units}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3" />
                <span>Pickup: {formatPickupDate(donation.pickupDate)}</span>
              </div>
              {donation.deliveryMethod === 'pickup' && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span>Pickup required</span>
                </div>
              )}
            </div>

            {donation.description && (
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{donation.description}</p>
            )}

            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedDonation(donation)}
                    className="flex-1 text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Donation Details</DialogTitle>
                  </DialogHeader>
                  {selectedDonation && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">{getCategoryIcon(selectedDonation.category)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{selectedDonation.foodName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedDonation.quantity} {selectedDonation.units}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Donor Information</label>
                          <div className="text-sm text-muted-foreground">
                            <p>{selectedDonation.donorName}</p>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Category</label>
                          <p className="text-sm text-muted-foreground capitalize">
                            {selectedDonation.category.replace('-', ' ')}
                          </p>
                        </div>

                        {selectedDonation.description && (
                          <div>
                            <label className="text-sm font-medium">Description</label>
                            <p className="text-sm text-muted-foreground">{selectedDonation.description}</p>
                          </div>
                        )}

                        {selectedDonation.expirationDate && (
                          <div>
                            <label className="text-sm font-medium">Expiration Date</label>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(selectedDonation.expirationDate)}
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="text-sm font-medium">Pickup/Delivery</label>
                          <p className="text-sm text-muted-foreground capitalize">
                            {selectedDonation.deliveryMethod.replace('-', ' ')} on {formatPickupDate(selectedDonation.pickupDate)}
                          </p>
                        </div>

                        {selectedDonation.estimatedMeals && (
                          <div>
                            <label className="text-sm font-medium">Estimated Meals</label>
                            <p className="text-sm text-green-600 font-medium">
                              ~{selectedDonation.estimatedMeals} meals
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="text-sm font-medium">Status Timeline</label>
                          <div className="space-y-1">
                            {selectedDonation.trackingNotes.map((note, index) => (
                              <p key={index} className="text-xs text-muted-foreground">
                                • {note}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons based on status */}
                      <div className="space-y-2">
                        {selectedDonation.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button 
                              onClick={() => handleAcceptDonation(selectedDonation)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              onClick={() => handleRejectDonation(selectedDonation)}
                              variant="outline"
                              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                              size="sm"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        
                        {selectedDonation.status === 'accepted' && (
                          <Button 
                            onClick={() => handleMarkInTransit(selectedDonation)}
                            className="w-full"
                            size="sm"
                          >
                            Mark as In Transit
                          </Button>
                        )}
                        
                        {selectedDonation.status === 'in-transit' && (
                          <Button 
                            onClick={() => handleMarkDelivered(selectedDonation)}
                            className="w-full bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {donation.status === 'pending' && (
                <>
                  <Button 
                    onClick={() => handleAcceptDonation(donation)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-xs"
                  >
                    <CheckCircle className="w-3 h-3" />
                  </Button>
                  <Button 
                    onClick={() => handleRejectDonation(donation)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                  >
                    <XCircle className="w-3 h-3" />
                  </Button>
                </>
              )}

              {donation.status === 'accepted' && (
                <Button 
                  onClick={() => handleMarkInTransit(donation)}
                  size="sm"
                  className="flex-1 text-xs"
                >
                  Mark Transit
                </Button>
              )}

              {donation.status === 'in-transit' && (
                <Button 
                  onClick={() => handleMarkDelivered(donation)}
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-xs"
                >
                  Mark Delivered
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
          <h1 className="text-xl font-semibold">Donations</h1>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 m-4">
            <TabsTrigger value="pending" className="text-xs relative">
              Pending
              {pendingDonations.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{pendingDonations.length}</span>
                </div>
              )}
            </TabsTrigger>
            <TabsTrigger value="accepted" className="text-xs">
              Accepted
            </TabsTrigger>
            <TabsTrigger value="in-transit" className="text-xs">
              Transit
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs">
              Delivered
            </TabsTrigger>
          </TabsList>

          <div className="px-4">
            <TabsContent value="pending" className="mt-0">
              <div className="space-y-3">
                {pendingDonations.length > 0 ? (
                  pendingDonations.map((donation) => (
                    <DonationCard key={donation.id} donation={donation} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No pending donations</h3>
                      <p className="text-muted-foreground">
                        New donation requests will appear here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="accepted" className="mt-0">
              <div className="space-y-3">
                {acceptedDonations.length > 0 ? (
                  acceptedDonations.map((donation) => (
                    <DonationCard key={donation.id} donation={donation} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No accepted donations</h3>
                      <p className="text-muted-foreground">
                        Accepted donations ready for pickup will appear here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="in-transit" className="mt-0">
              <div className="space-y-3">
                {inTransitDonations.length > 0 ? (
                  inTransitDonations.map((donation) => (
                    <DonationCard key={donation.id} donation={donation} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No items in transit</h3>
                      <p className="text-muted-foreground">
                        Donations being transported will appear here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="delivered" className="mt-0">
              <div className="space-y-3">
                {deliveredDonations.length > 0 ? (
                  deliveredDonations.map((donation) => (
                    <DonationCard key={donation.id} donation={donation} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No delivered donations</h3>
                      <p className="text-muted-foreground">
                        Successfully received donations will appear here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
