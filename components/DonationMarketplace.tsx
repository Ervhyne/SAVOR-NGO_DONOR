import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  Package2, 
  Plus,
  Edit3,
  Trash2,
  MapPin,
  Clock,
  Calendar,
  Users,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage } from '../App';

interface MarketplaceDonation {
  id: string;
  foodName: string;
  category: 'perishable' | 'non-perishable' | 'cooked' | 'packaged';
  quantity: number;
  units: string;
  description: string;
  targetMachine: string;
  machineName: string;
  machineLocation: string;
  expirationDate?: string;
  datePosted: string;
  status: 'active' | 'low-stock' | 'out-of-stock' | 'expired';
  claimedCount: number;
  viewCount: number;
  proofImage?: string;
}

interface PostForm {
  foodName: string;
  category: 'perishable' | 'non-perishable' | 'cooked' | 'packaged';
  quantity: string;
  units: string;
  description: string;
  targetMachine: string;
  expirationDate: string;
}

export function DonationMarketplace({ onNavigate }: { onNavigate: (page: AppPage) => void }) {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<MarketplaceDonation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'low-stock' | 'out-of-stock'>('all');
  const [viewingDonation, setViewingDonation] = useState<MarketplaceDonation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const [postForm, setPostForm] = useState<PostForm>({
    foodName: '',
    category: 'packaged',
    quantity: '',
    units: 'pcs',
    description: '',
    targetMachine: '',
    expirationDate: ''
  });

  // Mock machine data
  const machines = [
    {
      id: 'dispenser-001',
      name: 'Downtown Dispenser #1',
      location: 'Main Street Plaza',
      status: 'online' as const,
      stockLevel: 85,
      maxCapacity: 40
    },
    {
      id: 'dispenser-002', 
      name: 'Community Center #2',
      location: 'Oak Avenue Center',
      status: 'online' as const,
      stockLevel: 23,
      maxCapacity: 40
    },
    {
      id: 'dispenser-003',
      name: 'University Campus #3',
      location: 'Campus Food Court',
      status: 'online' as const,
      stockLevel: 45,
      maxCapacity: 40
    }
  ];

  // Mock marketplace donations data
  const [marketplaceDonations, setMarketplaceDonations] = useState<MarketplaceDonation[]>([
    {
      id: 'md001',
      foodName: 'Fresh Vegetable Mix',
      category: 'perishable',
      quantity: 25,
      units: 'pcs',
      description: 'Fresh mixed vegetables perfect for families. Contains carrots, broccoli, and bell peppers.',
      targetMachine: 'dispenser-001',
      machineName: 'Downtown Dispenser #1',
      machineLocation: 'Main Street Plaza',
      expirationDate: '2025-08-20',
      datePosted: '2025-08-16T10:00:00',
      status: 'active',
      claimedCount: 8,
      viewCount: 45,
      proofImage: 'vegetables.jpg'
    },
    {
      id: 'md002',
      foodName: 'Canned Soup Variety',
      category: 'non-perishable',
      quantity: 5,
      units: 'pcs',
      description: 'Assorted canned soups including tomato, chicken, and vegetable varieties.',
      targetMachine: 'dispenser-002',
      machineName: 'Community Center #2',
      machineLocation: 'Oak Avenue Center',
      datePosted: '2025-08-15T14:30:00',
      status: 'low-stock',
      claimedCount: 15,
      viewCount: 78,
      proofImage: 'soup_cans.jpg'
    },
    {
      id: 'md003',
      foodName: 'Bread Loaves',
      category: 'perishable',
      quantity: 0,
      units: 'pcs',
      description: 'Freshly baked bread loaves from local bakery.',
      targetMachine: 'dispenser-001',
      machineName: 'Downtown Dispenser #1',
      machineLocation: 'Main Street Plaza',
      expirationDate: '2025-08-17',
      datePosted: '2025-08-15T08:00:00',
      status: 'out-of-stock',
      claimedCount: 25,
      viewCount: 102,
      proofImage: 'bread.jpg'
    }
  ]);

  // Filter donations based on status
  const filteredDonations = statusFilter === 'all' 
    ? marketplaceDonations 
    : marketplaceDonations.filter(donation => donation.status === statusFilter);

  const getStatusColor = (status: MarketplaceDonation['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out-of-stock': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'perishable': return '🥬';
      case 'non-perishable': return '🥫';
      case 'cooked': return '🍲';
      case 'packaged': return '📦';
      default: return '📦';
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

  const resetPostForm = () => {
    setPostForm({
      foodName: '',
      category: 'packaged',
      quantity: '',
      units: 'pcs',
      description: '',
      targetMachine: '',
      expirationDate: ''
    });
  };

  const handleCreatePost = () => {
    if (!postForm.foodName || !postForm.quantity || !postForm.description || !postForm.targetMachine) {
      toast.error('Please fill in all required fields');
      return;
    }

    const quantity = parseInt(postForm.quantity);
    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    const selectedMachine = machines.find(m => m.id === postForm.targetMachine);
    if (!selectedMachine) {
      toast.error('Please select a valid machine');
      return;
    }

    const newDonation: MarketplaceDonation = {
      id: `md${Date.now()}`,
      foodName: postForm.foodName,
      category: postForm.category,
      quantity: quantity,
      units: postForm.units,
      description: postForm.description,
      targetMachine: postForm.targetMachine,
      machineName: selectedMachine.name,
      machineLocation: selectedMachine.location,
      expirationDate: postForm.expirationDate || undefined,
      datePosted: new Date().toISOString(),
      status: 'active',
      claimedCount: 0,
      viewCount: 0
    };

    setMarketplaceDonations(prev => [newDonation, ...prev]);
    toast.success(`Successfully posted "${postForm.foodName}" to marketplace`);
    setIsPostDialogOpen(false);
    resetPostForm();
  };

  const handleEditDonation = (donation: MarketplaceDonation) => {
    setEditingDonation(donation);
    setPostForm({
      foodName: donation.foodName,
      category: donation.category,
      quantity: donation.quantity.toString(),
      units: donation.units,
      description: donation.description,
      targetMachine: donation.targetMachine,
      expirationDate: donation.expirationDate || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateDonation = () => {
    if (!editingDonation) return;

    if (!postForm.foodName || !postForm.quantity || !postForm.description || !postForm.targetMachine) {
      toast.error('Please fill in all required fields');
      return;
    }

    const quantity = parseInt(postForm.quantity);
    if (quantity < 0) {
      toast.error('Quantity cannot be negative');
      return;
    }

    const selectedMachine = machines.find(m => m.id === postForm.targetMachine);
    if (!selectedMachine) {
      toast.error('Please select a valid machine');
      return;
    }

    const status: MarketplaceDonation['status'] = 
      quantity === 0 ? 'out-of-stock' : 
      quantity <= 5 ? 'low-stock' : 'active';

    setMarketplaceDonations(prev =>
      prev.map(donation =>
        donation.id === editingDonation.id
          ? {
              ...donation,
              foodName: postForm.foodName,
              category: postForm.category,
              quantity: quantity,
              units: postForm.units,
              description: postForm.description,
              targetMachine: postForm.targetMachine,
              machineName: selectedMachine.name,
              machineLocation: selectedMachine.location,
              expirationDate: postForm.expirationDate || undefined,
              status: status
            }
          : donation
      )
    );

    toast.success(`Successfully updated "${postForm.foodName}"`);
    setIsEditDialogOpen(false);
    setEditingDonation(null);
    resetPostForm();
  };

  const handleViewDetails = (donation: MarketplaceDonation) => {
    setViewingDonation(donation);
    setIsViewDialogOpen(true);
  };

  const handleDeleteDonation = (donation: MarketplaceDonation) => {
    setMarketplaceDonations(prev => prev.filter(d => d.id !== donation.id));
    toast.success(`Removed "${donation.foodName}" from marketplace`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">{/* pb-20 for bottom navigation */}
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('ngo-dashboard')}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Package2 className="w-5 h-5 text-green-600" />
                <h1 className="text-lg font-semibold text-gray-900">Donation Marketplace</h1>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1 ml-11">
              Manage your posted donations for beneficiaries
            </p>
          </div>
        </div>

        <div className="p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Posts</p>
                  <p className="text-2xl font-bold text-green-600">
                    {marketplaceDonations.filter(d => d.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {marketplaceDonations.filter(d => d.status === 'low-stock').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {marketplaceDonations.reduce((sum, d) => sum + d.viewCount, 0)}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Claims</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {marketplaceDonations.reduce((sum, d) => sum + d.claimedCount, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
            className="text-xs"
          >
            All ({marketplaceDonations.length})
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('active')}
            className="text-xs"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Active ({marketplaceDonations.filter(d => d.status === 'active').length})
          </Button>
          <Button
            variant={statusFilter === 'low-stock' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('low-stock')}
            className="text-xs"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Low Stock ({marketplaceDonations.filter(d => d.status === 'low-stock').length})
          </Button>
          <Button
            variant={statusFilter === 'out-of-stock' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('out-of-stock')}
            className="text-xs"
          >
            <Package2 className="w-3 h-3 mr-1" />
            Out of Stock ({marketplaceDonations.filter(d => d.status === 'out-of-stock').length})
          </Button>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {statusFilter === 'all' ? 'Posted Donations' : 
             statusFilter === 'active' ? 'Active Donations' :
             statusFilter === 'low-stock' ? 'Low Stock Donations' :
             'Out of Stock Donations'} ({filteredDonations.length})
          </h2>
          <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetPostForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Post New Donation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Post New Donation</DialogTitle>
                <DialogDescription>
                  Create a new donation post for beneficiaries to claim
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Food Name */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 block mb-2">
                    Food Name *
                  </Label>
                  <Input
                    value={postForm.foodName}
                    onChange={(e) => setPostForm({...postForm, foodName: e.target.value})}
                    placeholder="Enter food name"
                  />
                </div>

                {/* Category and Quantity Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 block mb-2">
                      Category *
                    </Label>
                    <select
                      value={postForm.category}
                      onChange={(e) => setPostForm({...postForm, category: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="packaged">Packaged</option>
                      <option value="non-perishable">Non-Perishable</option>
                      <option value="perishable">Perishable</option>
                      <option value="cooked">Cooked</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 block mb-2">
                      Quantity *
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        value={postForm.quantity}
                        onChange={(e) => setPostForm({...postForm, quantity: e.target.value})}
                        placeholder="Amount"
                        className="flex-1"
                        min="1"
                      />
                      <select
                        value={postForm.units}
                        onChange={(e) => setPostForm({...postForm, units: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="pcs">pcs</option>
                        <option value="pieces">pieces</option>
                        <option value="servings">servings</option>
                        <option value="boxes">boxes</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Machine Selection */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 block mb-2">
                    Target Machine *
                  </Label>
                  <select
                    value={postForm.targetMachine}
                    onChange={(e) => setPostForm({...postForm, targetMachine: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select a machine</option>
                    {machines.map(machine => (
                      <option key={machine.id} value={machine.id}>
                        {machine.name} - {machine.location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expiration Date */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 block mb-2">
                    Expiration Date (Optional)
                  </Label>
                  <Input
                    type="datetime-local"
                    value={postForm.expirationDate}
                    onChange={(e) => setPostForm({...postForm, expirationDate: e.target.value})}
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 block mb-2">
                    Description *
                  </Label>
                  <Textarea
                    value={postForm.description}
                    onChange={(e) => setPostForm({...postForm, description: e.target.value})}
                    placeholder="Describe the food item for beneficiaries..."
                    className="min-h-[80px]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsPostDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    className="flex-1"
                  >
                    Post to Marketplace
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Donations List */}
        <div className="space-y-3">
          {filteredDonations.length > 0 ? (
            filteredDonations.map((donation) => (
              <Card key={donation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Food Icon */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{getCategoryIcon(donation.category)}</span>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm">{donation.foodName}</h3>
                        <Badge className={`text-xs ${getStatusColor(donation.status)}`}>
                          {donation.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center space-x-2">
                          <span>In Stock:</span>
                          <span className="font-medium text-blue-600">{donation.quantity} / {donation.quantity + donation.claimedCount} {donation.units}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3 h-3" />
                          <span>{donation.machineName}</span>
                        </div>
                        {donation.expirationDate && (
                          <div className="flex items-center space-x-2 text-orange-600">
                            <Clock className="w-3 h-3" />
                            <span>Expires: {formatDate(donation.expirationDate)}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span>Added: {formatDate(donation.datePosted)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(donation)}
                          className="flex-1 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDonation(donation)}
                          className="flex-1 text-xs"
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline" 
                              size="sm"
                              className="flex-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Donation</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{donation.foodName}"? This action cannot be undone and will remove the donation from the marketplace.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteDonation(donation)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Donation
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Package2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                {statusFilter === 'all' ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No donations posted</h3>
                    <p className="text-gray-600 mb-6">
                      Start by posting your first donation to help beneficiaries in need
                    </p>
                    <Button onClick={() => setIsPostDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Post Your First Donation
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No {statusFilter.replace('-', ' ')} donations found
                    </h3>
                    <p className="text-gray-600">
                      No donations match the selected filter
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              Complete information about this donation post
            </DialogDescription>
          </DialogHeader>
          
          {viewingDonation && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{getCategoryIcon(viewingDonation.category)}</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">{viewingDonation.foodName}</h3>
                  <Badge className={`text-xs ${getStatusColor(viewingDonation.status)}`}>
                    {viewingDonation.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Category</Label>
                    <p className="text-sm capitalize">{viewingDonation.category.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Available Stock</Label>
                    <p className="text-sm font-semibold text-green-600">
                      {viewingDonation.quantity} {viewingDonation.units}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Location</Label>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{viewingDonation.machineName} - {viewingDonation.machineLocation}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <p className="text-sm text-gray-700">{viewingDonation.description}</p>
                </div>

                {viewingDonation.expirationDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Expiration Date</Label>
                    <div className="flex items-center space-x-2 text-sm text-orange-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(viewingDonation.expirationDate)}</span>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-600">Posted Date</Label>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{formatDate(viewingDonation.datePosted)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Total Views</Label>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-semibold text-blue-600">{viewingDonation.viewCount}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Claims</Label>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-semibold text-purple-600">{viewingDonation.claimedCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEditDonation(viewingDonation);
                  }}
                  className="flex-1"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Donation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Donation</DialogTitle>
            <DialogDescription>
              Update your donation details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Food Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700 block mb-2">
                Food Name *
              </Label>
              <Input
                value={postForm.foodName}
                onChange={(e) => setPostForm({...postForm, foodName: e.target.value})}
                placeholder="Enter food name"
              />
            </div>

            {/* Category and Quantity Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 block mb-2">
                  Category *
                </Label>
                <select
                  value={postForm.category}
                  onChange={(e) => setPostForm({...postForm, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="packaged">Packaged</option>
                  <option value="non-perishable">Non-Perishable</option>
                  <option value="perishable">Perishable</option>
                  <option value="cooked">Cooked</option>
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 block mb-2">
                  Quantity *
                </Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={postForm.quantity}
                    onChange={(e) => setPostForm({...postForm, quantity: e.target.value})}
                    placeholder="Amount"
                    className="flex-1"
                    min="0"
                  />
                  <select
                    value={postForm.units}
                    onChange={(e) => setPostForm({...postForm, units: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pcs">pcs</option>
                    <option value="pieces">pieces</option>
                    <option value="servings">servings</option>
                    <option value="boxes">boxes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Machine Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700 block mb-2">
                Target Machine *
              </Label>
              <select
                value={postForm.targetMachine}
                onChange={(e) => setPostForm({...postForm, targetMachine: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a machine</option>
                {machines.map(machine => (
                  <option key={machine.id} value={machine.id}>
                    {machine.name} - {machine.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Expiration Date */}
            <div>
              <Label className="text-sm font-medium text-gray-700 block mb-2">
                Expiration Date (Optional)
              </Label>
              <Input
                type="datetime-local"
                value={postForm.expirationDate}
                onChange={(e) => setPostForm({...postForm, expirationDate: e.target.value})}
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm font-medium text-gray-700 block mb-2">
                Description *
              </Label>
              <Textarea
                value={postForm.description}
                onChange={(e) => setPostForm({...postForm, description: e.target.value})}
                placeholder="Describe the food item for beneficiaries..."
                className="min-h-[80px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingDonation(null);
                  resetPostForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="flex-1">
                    Update Donation
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to update this donation? The changes will be visible to all beneficiaries.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleUpdateDonation}>
                      Update Donation
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div> {/* Close mobile container */}
    </div>
  );
}
