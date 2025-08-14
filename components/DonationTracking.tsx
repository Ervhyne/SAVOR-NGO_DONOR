import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Package, Truck, CheckCircle, Users } from 'lucide-react';
import type { AppPage, Donation } from '../App';

interface DonationTrackingProps {
  donations: Donation[];
  onNavigate: (page: AppPage) => void;
}

export function DonationTracking({ donations, onNavigate }: DonationTrackingProps) {
  const getStatusColor = (status: Donation['status']) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'distributed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusSteps = (currentStatus: Donation['status']) => {
    const steps = [
      { id: 'submitted', label: 'Submitted', icon: Package },
      { id: 'in-transit', label: 'In Transit', icon: Truck },
      { id: 'received', label: 'Received', icon: CheckCircle },
      { id: 'distributed', label: 'Distributed', icon: Users }
    ];

    const statusOrder = ['submitted', 'in-transit', 'received', 'distributed'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeDonations = donations.filter(d => d.status !== 'distributed');

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
          <h1 className="text-xl font-semibold">Track Donations</h1>
        </div>

        {activeDonations.length > 0 ? (
          <div className="space-y-4">
            {activeDonations.map((donation) => {
              const steps = getStatusSteps(donation.status);
              
              return (
                <Card key={donation.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{donation.foodName}</CardTitle>
                      <Badge className={`text-xs ${getStatusColor(donation.status)}`}>
                        {donation.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {donation.quantity} {donation.units} • Created {formatDate(donation.createdAt)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {/* Status Timeline */}
                    <div className="space-y-4">
                      {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isLast = index === steps.length - 1;
                        
                        return (
                          <div key={step.id} className="flex items-start space-x-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step.completed 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-200 text-gray-400'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              {!isLast && (
                                <div className={`w-0.5 h-8 mt-1 ${
                                  step.completed ? 'bg-green-500' : 'bg-gray-200'
                                }`} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${
                                step.completed ? 'text-gray-900' : 'text-gray-400'
                              }`}>
                                {step.label}
                              </p>
                              {step.current && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {step.id === 'submitted' && 'Waiting for NGO confirmation'}
                                  {step.id === 'in-transit' && 'On the way to NGO'}
                                  {step.id === 'received' && 'Received by NGO, preparing for distribution'}
                                </p>
                              )}
                              {step.completed && step.id === 'received' && (
                                <p className="text-xs text-green-600 mt-1">
                                  Received by Hope Foundation
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Delivery Info */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-muted-foreground">Delivery Method:</span>
                          <span className="capitalize">{donation.deliveryMethod.replace('-', ' ')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Scheduled Date:</span>
                          <span>{new Date(donation.pickupDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {donation.status === 'submitted' && (
                      <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Contact NGO
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Modify Request
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Active Donations
              </h3>
              <p className="text-muted-foreground mb-6">
                You don't have any donations to track right now
              </p>
              <Button onClick={() => onNavigate('create-donation')}>
                Create New Donation
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="mt-6">
          <Button 
            variant="outline" 
                              onClick={() => onNavigate('donation-history')}
            className="w-full"
          >
            View All Donation History
          </Button>
        </div>
      </div>
    </div>
  );
}
