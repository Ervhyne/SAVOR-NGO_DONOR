import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ArrowLeft, Search, Users, Plus, Phone, Mail, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage, Volunteer, Donation } from '../App';

interface NGOVolunteersProps {
  volunteers: Volunteer[];
  donations: Donation[];
  onNavigate: (page: AppPage) => void;
}

export function NGOVolunteers({ volunteers, donations, onNavigate }: NGOVolunteersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getStatusColor = (status: Volunteer['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Volunteer['status']) => {
    switch (status) {
      case 'available': return '🟢';
      case 'busy': return '🟡';
      case 'offline': return '⚫';
      default: return '⚫';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'busy', label: 'Busy' },
    { value: 'offline', label: 'Offline' }
  ];

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || volunteer.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const availableVolunteers = volunteers.filter(v => v.status === 'available');
  const busyVolunteers = volunteers.filter(v => v.status === 'busy');
  const activePickups = donations.filter(d => d.status === 'accepted' || d.status === 'in-transit');

  const handleAssignTask = () => {
    // In a real app, this would update the database
    toast.success('Task assigned to volunteer');
  };

  const handleContactVolunteer = (volunteer: Volunteer, method: 'phone' | 'email') => {
    if (method === 'phone') {
      window.open(`tel:${volunteer.phone}`);
    } else {
      window.open(`mailto:${volunteer.email}`);
    }
  };

  const VolunteerCard = ({ volunteer }: { volunteer: Volunteer }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-sm">{volunteer.name}</h4>
                <p className="text-xs text-muted-foreground">{volunteer.email}</p>
              </div>
              <Badge className={`text-xs ${getStatusColor(volunteer.status)}`}>
                {getStatusIcon(volunteer.status)} {volunteer.status}
              </Badge>
            </div>
            
            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-3 h-3" />
                <span>{volunteer.phone}</span>
              </div>
              {volunteer.currentTask && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{volunteer.currentTask}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContactVolunteer(volunteer, 'phone')}
                className="flex-1 text-xs"
              >
                <Phone className="w-3 h-3 mr-1" />
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContactVolunteer(volunteer, 'email')}
                className="flex-1 text-xs"
              >
                <Mail className="w-3 h-3 mr-1" />
                Email
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success('Assignment dialog would open here')}
                    className="text-xs"
                  >
                    Assign
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Assign Task to {volunteer.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Select a pickup task to assign to this volunteer
                    </p>
                    
                    {activePickups.length > 0 ? (
                      <div className="space-y-2">
                        {activePickups.map((donation) => (
                          <Card key={donation.id} className="cursor-pointer hover:bg-gray-50">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-sm">{donation.foodName}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    From: {donation.donorName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Pickup: {new Date(donation.pickupDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleAssignTask()}
                                  className="text-xs"
                                >
                                  Assign
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No active pickup tasks available
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
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
          <h1 className="text-xl font-semibold">Volunteers</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* Volunteer Overview */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{availableVolunteers.length}</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{busyVolunteers.length}</div>
                <div className="text-xs text-muted-foreground">Busy</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{activePickups.length}</div>
                <div className="text-xs text-muted-foreground">Active Tasks</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search volunteers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-background text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active Tasks Overview */}
          {activePickups.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base text-blue-800">
                  <Clock className="w-4 h-4 mr-2" />
                  Active Pickup Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {activePickups.slice(0, 3).map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{donation.foodName}</p>
                      <p className="text-xs text-muted-foreground">
                        {donation.donorName} • {new Date(donation.pickupDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(donation.status as any)}`}>
                      {donation.status}
                    </Badge>
                  </div>
                ))}
                {activePickups.length > 3 && (
                  <p className="text-xs text-blue-600 text-center pt-2">
                    +{activePickups.length - 3} more tasks
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Volunteers List */}
          <div className="space-y-3">
            {filteredVolunteers.length > 0 ? (
              filteredVolunteers.map((volunteer) => (
                <VolunteerCard key={volunteer.id} volunteer={volunteer} />
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || selectedStatus !== 'all' 
                      ? 'No matching volunteers' 
                      : 'No volunteers registered'
                    }
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || selectedStatus !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Volunteers who sign up will appear here'
                    }
                  </p>
                  {(!searchTerm && selectedStatus === 'all') && (
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Volunteer
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Volunteer
            </Button>
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Send Broadcast Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
