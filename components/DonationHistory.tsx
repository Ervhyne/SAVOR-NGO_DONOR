import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ArrowLeft, Search, Package, RotateCcw, Eye, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage, Donation } from '../App';

interface DonationHistoryProps {
  donations: Donation[];
  onNavigate: (page: AppPage) => void;
  onCreateDonation: (donation: Omit<Donation, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'trackingNotes'>) => void;
}

export function DonationHistory({ donations, onNavigate, onCreateDonation }: DonationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  const getStatusColor = (status: Donation['status']) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'received': return 'bg-green-100 text-green-800 border-green-200';
      case 'distributed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filterByDateRange = (donation: Donation) => {
    if (dateRange === 'all') return true;
    
    const donationDate = new Date(donation.createdAt);
    const now = new Date();
    
    switch (dateRange) {
      case 'week':
        return (now.getTime() - donationDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
      case 'month':
        return (now.getTime() - donationDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
      case '3months':
        return (now.getTime() - donationDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (donation.ngoName && donation.ngoName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || donation.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || donation.category === selectedCategory;
    const matchesDateRange = filterByDateRange(donation);
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDateRange;
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'in-transit', label: 'In Transit' },
    { value: 'received', label: 'Received' },
    { value: 'distributed', label: 'Distributed' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'fresh-produce', label: 'Fresh Produce' },
    { value: 'canned-goods', label: 'Canned Goods' },
    { value: 'bread-bakery', label: 'Bread & Bakery' },
    { value: 'cooked-food', label: 'Cooked Food' },
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'dry-goods', label: 'Dry Goods' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'Past Week' },
    { value: 'month', label: 'Past Month' },
    { value: '3months', label: 'Past 3 Months' }
  ];

  const duplicateDonation = (donation: Donation) => {
    const duplicateData = {
      donorId: donation.donorId,
      donorName: donation.donorName,
      foodName: donation.foodName,
      description: donation.description,
      quantity: donation.quantity,
      units: donation.units,
      expirationDate: donation.expirationDate,
      category: donation.category,
      photos: donation.photos,
      pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      deliveryMethod: donation.deliveryMethod
    };
    
    onCreateDonation(duplicateData);
    toast.success(`Duplicated "${donation.foodName}" donation`);
    onNavigate('create-donation');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedCategory('all');
    setDateRange('all');
  };

  const getTotalStats = () => {
    const totalMeals = donations.reduce((sum, donation) => 
      sum + (donation.estimatedMeals || 0), 0
    );
    const distributedDonations = donations.filter(d => d.status === 'distributed').length;
    const activeDonations = donations.filter(d => 
      d.status === 'submitted' || d.status === 'in-transit'
    ).length;

    return { totalMeals, distributedDonations, activeDonations };
  };

  const stats = getTotalStats();

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
          <h1 className="text-xl font-semibold">Donation History</h1>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search donations, NGOs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 p-2 border border-input rounded-md bg-background text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 p-2 border border-input rounded-md bg-background text-sm"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="flex-1 p-2 border border-input rounded-md bg-background text-sm"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-blue-600">{donations.length}</div>
                <div className="text-xs text-muted-foreground">Total Donations</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">{stats.distributedDonations}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-600">{stats.totalMeals}</div>
                <div className="text-xs text-muted-foreground">Meals Served</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        {filteredDonations.length !== donations.length && (
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredDonations.length} of {donations.length} donations
          </div>
        )}

        {/* Donations List */}
        {filteredDonations.length > 0 ? (
          <div className="space-y-3">
            {filteredDonations.map((donation) => (
              <Card key={donation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{donation.foodName}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {donation.quantity} {donation.units}
                        {donation.description && ` • ${donation.description}`}
                      </p>
                      {donation.ngoName && (
                        <p className="text-xs text-blue-600 mt-1">
                          NGO: {donation.ngoName}
                        </p>
                      )}
                    </div>
                    <Badge className={`text-xs ml-2 ${getStatusColor(donation.status)}`}>
                      {donation.status.replace('-', ' ')}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Created: {formatDate(donation.createdAt)}</span>
                    <span className="capitalize">{donation.deliveryMethod.replace('-', ' ')}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {donation.category.replace('-', ' ')}
                    </span>
                    {donation.estimatedMeals && (
                      <span className="text-green-600">
                        ~{donation.estimatedMeals} meals
                      </span>
                    )}
                  </div>

                  {donation.expirationDate && (
                    <div className="text-xs text-muted-foreground mb-3">
                      Expiry: {formatDate(donation.expirationDate)}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => duplicateDonation(donation)}
                      className="flex-1 text-xs"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Duplicate
                    </Button>
                    {(donation.status === 'submitted' || donation.status === 'in-transit' || donation.status === 'received') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onNavigate('donation-tracking')}
                        className="flex-1 text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Track
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all' || dateRange !== 'all' 
                  ? 'No matching donations' 
                  : 'No donations yet'
                }
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all' || dateRange !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start making a difference by creating your first donation'
                }
              </p>
              {(!searchTerm && selectedStatus === 'all' && selectedCategory === 'all' && dateRange === 'all') && (
                <Button onClick={() => onNavigate('create-donation')}>
                  Create First Donation
                </Button>
              )}
              {(searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all' || dateRange !== 'all') && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button 
            onClick={() => onNavigate('create-donation')}
            className="w-full"
          >
            Create New Donation
          </Button>
          <Button 
            variant="outline" 
                              onClick={() => onNavigate('donation-tracking')}
            className="w-full"
          >
            Track Active Donations
          </Button>
        </div>
      </div>
    </div>
  );
}
