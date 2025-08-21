import { useState, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar,
  Minus,
  Plus,
  Receipt,
  Camera,
  AlertTriangle,
  Package2
} from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage } from '../App';

interface WarehouseItem {
  id: string;
  foodName: string;
  category: 'perishable' | 'non-perishable' | 'cooked' | 'packaged';
  totalQuantity: number;
  availableQuantity: number;
  units: string;
  expirationDate?: string;
  donorName: string;
  dateAdded: string;
  status: 'available' | 'low' | 'expired';
  proofImage?: string;
}

interface PendingDonation {
  id: string;
  foodName: string;
  category: 'perishable' | 'non-perishable' | 'cooked' | 'packaged';
  quantity: number;
  units: string;
  donorName: string;
  pickupDate: string;
  expirationDate?: string;
  description?: string;
  estimatedMeals?: number;
  status: 'pending' | 'approved-pending-verification' | 'verified';
}


export function NGODonations({ onNavigate }: { onNavigate: (page: AppPage) => void }) {
  const [activeTab, setActiveTab] = useState('warehouse');
  const [deductQuantity, setDeductQuantity] = useState<number>(1);
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [proofImages, setProofImages] = useState<Record<string, string>>({});
  const [uploadedFileNames, setUploadedFileNames] = useState<Record<string, string>>({});
  
  // Marketplace posting state
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [selectedItemForPost, setSelectedItemForPost] = useState<WarehouseItem | null>(null);
  const [postForm, setPostForm] = useState({
    machine: '',
    amount: '',
    description: ''
  });

  // Mock machine data
  const machines = [
    {
      id: 'dispenser-001',
      name: 'Dispenser #1',
      location: 'Main Street Plaza',
      status: 'online' as const,
      stockLevel: 85,
      maxCapacity: 40
    },
    {
      id: 'dispenser-002', 
      name: 'Dispenser #2',
      location: 'Oak Avenue Center',
      status: 'online' as const,
      stockLevel: 23,
      maxCapacity: 40
    },
    {
      id: 'dispenser-003',
      name: 'University Campus #3',
      location: 'Campus Food Court',
      status: 'offline' as const,
      stockLevel: 0,
      maxCapacity: 40
    }
  ];

  // Warehouse inventory items  
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([
    {
      id: 'wh001',
      foodName: 'Fresh Vegetables Mix',
      category: 'perishable',
      totalQuantity: 50,
      availableQuantity: 32,
      units: 'pcs',
      expirationDate: '2025-08-20',
      donorName: 'Green Garden Restaurant',
      dateAdded: '2025-08-14',
      status: 'available',
      proofImage: 'vegetables.jpg'
    },
    {
      id: 'wh002', 
      foodName: 'Canned Soup Variety',
      category: 'non-perishable',
      totalQuantity: 100,
      availableQuantity: 15,
      units: 'pcs',
      donorName: 'City Supermarket',
      dateAdded: '2025-08-10',
      status: 'low',
      proofImage: 'soup_cans.jpg'
    },
    {
      id: 'wh003',
      foodName: 'Bread Loaves',
      category: 'perishable', 
      totalQuantity: 25,
      availableQuantity: 25,
      units: 'pcs',
      expirationDate: '2025-08-17',
      donorName: 'Local Bakery',
      dateAdded: '2025-08-15',
      status: 'available',
      proofImage: 'bread.jpg'
    }
  ]);

  // Pending donations for approval/verification
  const [pendingDonations, setPendingDonations] = useState<PendingDonation[]>([
    {
      id: 'pen001',
      foodName: 'Rice Bags',
      category: 'non-perishable',
      quantity: 20,
      units: 'pcs',
      donorName: 'Community Center',
      pickupDate: '2025-08-16T10:00:00',
      description: 'High quality basmati rice, sealed bags',
      estimatedMeals: 80,
      status: 'pending'
    },
    {
      id: 'pen002',
      foodName: 'Cooked Meals',
      category: 'cooked',
      quantity: 50,
      units: 'pcs',
      donorName: 'Hotel Paradise',
      pickupDate: '2025-08-16T14:30:00',
      expirationDate: '2025-08-16T20:00:00',
      description: 'Freshly prepared vegetarian meals',
      estimatedMeals: 50,
      status: 'pending'
    },
    {
      id: 'pen003',
      foodName: 'Fresh Bread',
      category: 'perishable',
      quantity: 30,
      units: 'pcs',
      donorName: 'Bakery Corner',
      pickupDate: '2025-08-17T08:00:00',
      expirationDate: '2025-08-17T18:00:00',
      description: 'Freshly baked bread loaves',
      estimatedMeals: 60,
      status: 'approved-pending-verification'
    }
  ]);

  const getStatusColor = (status: WarehouseItem['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
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

  // Handle rejection reason change
  const handleRejectionReasonChange = useCallback((donationId: string, value: string) => {
    setRejectionReasons(prev => ({ ...prev, [donationId]: value }));
  }, []);

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

  const handleDeductQuantity = (item: WarehouseItem, quantity: number) => {
    if (quantity > item.availableQuantity) {
      toast.error('Cannot deduct more than available quantity');
      return;
    }

    setWarehouseItems(items => 
      items.map(i => {
        if (i.id === item.id) {
          const newAvailable = i.availableQuantity - quantity;
          const newStatus = newAvailable <= 5 ? 'low' : newAvailable === 0 ? 'expired' : 'available';
          return { ...i, availableQuantity: newAvailable, status: newStatus };
        }
        return i;
      })
    );

    toast.success(`Deducted ${quantity} ${item.units} from ${item.foodName}`);
    setDeductQuantity(1);
  };

  // Stage 1: Approve/Deny donation request
  const handleApproveDonationRequest = (donation: PendingDonation) => {
    setPendingDonations(donations => 
      donations.map(d => 
        d.id === donation.id 
          ? { ...d, status: 'approved-pending-verification' as const }
          : d
      )
    );
    toast.success(`✅ Donation request approved! Now awaiting verification.`);
  };

  const handleDenyDonationRequest = (donation: PendingDonation) => {
    const rejectionReason = rejectionReasons[donation.id] || '';
    if (!rejectionReason.trim()) {
      toast.error('Please provide reason for rejection');
      return;
    }

    setPendingDonations(donations => donations.filter(d => d.id !== donation.id));
    toast.error(`❌ Donation request denied: ${rejectionReason}`);
    setRejectionReasons(prev => ({ ...prev, [donation.id]: '' }));
  };

  // Stage 2: Verify donation (upload proof and mark as verified)
  const handleVerifyDonation = (donation: PendingDonation) => {
    const proofImage = proofImages[donation.id] || '';
    if (!proofImage.trim()) {
      toast.error('Please upload proof image before verifying');
      return;
    }

    // Add to warehouse inventory
    const newWarehouseItem: WarehouseItem = {
      id: `wh_${Date.now()}`,
      foodName: donation.foodName,
      category: donation.category,
      totalQuantity: donation.quantity,
      availableQuantity: donation.quantity,
      units: donation.units,
      expirationDate: donation.expirationDate,
      donorName: donation.donorName,
      dateAdded: new Date().toISOString(),
      status: 'available',
      proofImage: proofImage
    };

    setWarehouseItems(items => [...items, newWarehouseItem]);
    setPendingDonations(donations => donations.filter(d => d.id !== donation.id));
    
    toast.success(`✅ Donation verified and added to donations stock! Receipt generated for ${donation.donorName}`);
    setProofImages(prev => ({ ...prev, [donation.id]: '' }));
    setUploadedFileNames(prev => ({ ...prev, [donation.id]: '' }));
  };

  // Handle image upload
  const handleImageUpload = (donationId: string, file: File) => {
    // In a real app, you would upload to a server/cloud storage
    // For now, we'll create a mock URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setProofImages(prev => ({ ...prev, [donationId]: imageUrl }));
      setUploadedFileNames(prev => ({ ...prev, [donationId]: file.name }));
      toast.success('Image uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateReceipt = (item: WarehouseItem, quantity: number) => {
    const receiptData = {
      itemName: item.foodName,
      quantity: quantity,
      units: item.units,
      date: new Date().toISOString(),
      ngoName: 'Food Bank NGO'
    };
    
    toast.success(`📄 Receipt generated for ${quantity} ${item.units} of ${item.foodName}`);
    console.log('Receipt data:', receiptData);
  };

  const handleOpenPostDialog = (item: WarehouseItem) => {
    setSelectedItemForPost(item);
    setPostForm({
      machine: '',
      amount: '',
      description: ''
    });
    setIsPostDialogOpen(true);
  };

  const handlePostToMarketplace = () => {
    if (!selectedItemForPost) return;
    
    if (!postForm.machine || !postForm.amount || !postForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseInt(postForm.amount);
    if (amount <= 0 || amount > selectedItemForPost.availableQuantity) {
      toast.error(`Amount must be between 1 and ${selectedItemForPost.availableQuantity}`);
      return;
    }

    const selectedMachine = machines.find(m => m.id === postForm.machine);
    if (!selectedMachine) {
      toast.error('Please select a valid machine');
      return;
    }

    // Create new pending donation entry
    const newPendingDonation: PendingDonation = {
      id: `mp${Date.now()}`,
      foodName: selectedItemForPost.foodName,
      category: selectedItemForPost.category,
      quantity: amount,
      units: selectedItemForPost.units,
      donorName: `Posted to ${selectedMachine.name}`,
      pickupDate: new Date().toISOString(),
      expirationDate: selectedItemForPost.expirationDate,
      description: postForm.description,
      estimatedMeals: amount,
      status: 'pending'
    };

    // Add to pending donations
    setPendingDonations(prev => [newPendingDonation, ...prev]);

    // Reduce available quantity from warehouse
    setWarehouseItems(prev => 
      prev.map(item => 
        item.id === selectedItemForPost.id
          ? {
              ...item,
              availableQuantity: item.availableQuantity - amount,
              status: item.availableQuantity - amount <= 5 ? 'low' : item.status
            }
          : item
      )
    );

    toast.success(`Posted ${amount} ${selectedItemForPost.units} of ${selectedItemForPost.foodName} to marketplace`);
    setIsPostDialogOpen(false);
    setSelectedItemForPost(null);
  };

  const WarehouseCard = ({ item }: { item: WarehouseItem }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">{getCategoryIcon(item.category)}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm">{item.foodName}</h4>
              <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                {item.status}
              </Badge>
            </div>
            
            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <div className="flex items-center justify-between">
                <span>In Stock:</span>
                <span className="font-medium text-blue-600">{item.availableQuantity} {item.units}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3" />
                <span>Donated by: {item.donorName}</span>
              </div>
              {item.expirationDate && (
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-3 h-3 text-orange-500" />
                  <span className="text-orange-600">Expires: {formatDate(item.expirationDate)}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3" />
                <span>Added: {formatDate(item.dateAdded)}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs"
                  >
                    <User className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Donation Details</DialogTitle>
                    <DialogDescription>
                      Complete information about this approved donation
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* Food Item Header */}
                    <div className="text-center border-b pb-4">
                      <span className="text-4xl mb-2 block">{getCategoryIcon(item.category)}</span>
                      <h3 className="font-bold text-lg">{item.foodName}</h3>
                      <Badge className={`mt-1 ${
                        item.status === 'available' 
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : item.status === 'low'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'  
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {item.status}
                      </Badge>
                    </div>

                    {/* Donation Information */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Donor</p>
                          <p className="text-xs text-muted-foreground">{item.donorName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Package className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Quantity</p>
                          <p className="text-xs text-muted-foreground">
                            {item.availableQuantity} / {item.totalQuantity} {item.units} available
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium">Date Added</p>
                          <p className="text-xs text-muted-foreground">{formatDate(item.dateAdded)}</p>
                        </div>
                      </div>

                      {item.expirationDate && (
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <div>
                            <p className="text-sm font-medium">Expiration Date</p>
                            <p className="text-xs text-muted-foreground">{formatDate(item.expirationDate)}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Status</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            Verified & Added to Donations Stock
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Proof Image if available */}
                    {item.proofImage && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Proof of Receipt</p>
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={item.proofImage}
                            alt="Proof of donation receipt"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2 border-t">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            disabled={item.availableQuantity === 0}
                          >
                            <Minus className="w-3 h-3 mr-1" />
                            Distribute
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                          <DialogHeader>
                            <DialogTitle>Distribute Stock</DialogTitle>
                            <DialogDescription>
                              Remove quantity for distribution
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="text-center">
                              <span className="text-3xl">{getCategoryIcon(item.category)}</span>
                              <h3 className="font-semibold mt-2">{item.foodName}</h3>
                              <p className="text-sm text-muted-foreground">
                                Available Stock: {item.availableQuantity} {item.units}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="deduct-quantity">Quantity to Distribute</Label>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setDeductQuantity(Math.max(1, deductQuantity - 1))}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <Input
                                  id="deduct-quantity"
                                  type="number"
                                  value={deductQuantity}
                                  onChange={(e) => setDeductQuantity(Math.max(1, Math.min(item.availableQuantity, parseInt(e.target.value) || 1)))}
                                  className="text-center"
                                  min="1"
                                  max={item.availableQuantity}
                                />
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setDeductQuantity(Math.min(item.availableQuantity, deductQuantity + 1))}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Remaining after distribution: {item.availableQuantity - deductQuantity} {item.units}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="receipt-note">Distribution Note</Label>
                              <Input
                                id="receipt-note"
                                placeholder="e.g., Distributed to families in need..."
                                value={receiptImage}
                                onChange={(e) => setReceiptImage(e.target.value)}
                              />
                            </div>

                            <div className="flex space-x-2">
                              <Button 
                                onClick={() => handleDeductQuantity(item, deductQuantity)}
                                className="flex-1"
                              >
                                Distribute
                              </Button>
                              <Button 
                                onClick={() => handleGenerateReceipt(item, deductQuantity)}
                                variant="outline"
                                className="flex-1"
                              >
                                <Receipt className="w-3 h-3 mr-1" />
                                Receipt
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        onClick={() => handleGenerateReceipt(item, 0)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Receipt className="w-3 h-3 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                size="sm"
                className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                onClick={() => handleOpenPostDialog(item)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Post
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PendingCard = useMemo(() => ({ donation }: { donation: PendingDonation }) => (
    <Card className="hover:shadow-md transition-shadow border-orange-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">{getCategoryIcon(donation.category)}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm">{donation.foodName}</h4>
              <Badge className={`text-xs ${
                donation.status === 'pending' 
                  ? 'bg-orange-100 text-orange-800 border-orange-200'
                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
              }`}>
                {donation.status === 'pending' ? 'Pending Approval' : 'Awaiting Verification'}
              </Badge>
            </div>
            
            <div className="space-y-1 text-xs text-muted-foreground mb-3">
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3" />
                <span>Donor: {donation.donorName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-3 h-3" />
                <span className="font-medium text-blue-600">{donation.quantity} {donation.units}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3" />
                <span>Available: {formatPickupDate(donation.pickupDate)}</span>
              </div>
              {donation.estimatedMeals && (
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-medium">≈ {donation.estimatedMeals} meals</span>
                </div>
              )}
            </div>

            {donation.description && (
              <p className="text-xs text-gray-600 mb-3 line-clamp-2 bg-gray-50 p-2 rounded">
                "{donation.description}"
              </p>
            )}

            {/* Stage 1: Initial Approval/Denial */}
            {donation.status === 'pending' && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Stage 1: Approve or deny this donation request
                </p>
                
                {/* Rejection Reason for denial */}
                <Textarea
                  key={`rejection-${donation.id}-stage1`}
                  placeholder="Reason for rejection (if denying)..."
                  value={rejectionReasons[donation.id] || ''}
                  onChange={(e) => handleRejectionReasonChange(donation.id, e.target.value)}
                  className="text-xs min-h-[60px]"
                />

                {/* Stage 1 Action Buttons */}
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleApproveDonationRequest(donation)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-xs flex-1"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    onClick={() => handleDenyDonationRequest(donation)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 text-xs flex-1"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Deny
                  </Button>
                </div>
              </div>
            )}

            {/* Stage 2: Verification */}
            {donation.status === 'approved-pending-verification' && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Stage 2: Upload proof image and verify receipt
                </p>
                
                {/* Proof Image Upload */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="No image selected..."
                      value={uploadedFileNames[donation.id] || ''}
                      readOnly
                      className="flex-1 text-xs"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={() => {
                        const fileInput = document.getElementById(`file-upload-${donation.id}`) as HTMLInputElement;
                        fileInput?.click();
                      }}
                    >
                      <Camera className="w-3 h-3" />
                    </Button>
                    <input
                      id={`file-upload-${donation.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(donation.id, file);
                          // Clear the input so the same file can be selected again if needed
                          e.target.value = '';
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                  
                  {/* Show preview if image is uploaded */}
                  {proofImages[donation.id] && (
                    <div className="mt-2">
                      <img
                        src={proofImages[donation.id]}
                        alt="Proof of donation"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {/* Rejection Reason for verification stage */}
                <Textarea
                  key={`rejection-${donation.id}-stage2`}
                  placeholder="Reason for rejection (if denying)..."
                  value={rejectionReasons[donation.id] || ''}
                  onChange={(e) => handleRejectionReasonChange(donation.id, e.target.value)}
                  className="text-xs min-h-[60px]"
                />

                {/* Stage 2 Action Buttons */}
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleVerifyDonation(donation)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-xs flex-1"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verify & Complete
                  </Button>
                  <Button 
                    onClick={() => handleDenyDonationRequest(donation)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 text-xs flex-1"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Deny
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  ), [rejectionReasons, proofImages, uploadedFileNames, handleRejectionReasonChange, handleApproveDonationRequest, handleDenyDonationRequest, handleVerifyDonation, handleImageUpload, getCategoryIcon, formatPickupDate]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center p-4 border-b bg-white">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('ngo-dashboard')}
            className="mr-2 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Donations Management</h1>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 m-4">
            <TabsTrigger value="warehouse" className="text-xs">
              <Package2 className="w-4 h-4 mr-1" />
              Donations Stock
              <Badge className="ml-2 text-xs bg-blue-100 text-blue-800">
                {warehouseItems.reduce((sum, item) => sum + item.availableQuantity, 0)}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs relative">
              <Clock className="w-4 h-4 mr-1" />
              Pending Verification
              {pendingDonations.length > 0 && (
                <Badge className="ml-2 text-xs bg-orange-100 text-orange-800">
                  {pendingDonations.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="px-4">
            <TabsContent value="warehouse" className="mt-0">
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <Package2 className="w-4 h-4 inline mr-1" />
                  Total items in donations stock: {warehouseItems.length} types, 
                  {warehouseItems.reduce((sum, item) => sum + item.availableQuantity, 0)} units available
                </p>
              </div>

              <div className="space-y-3">
                {warehouseItems.length > 0 ? (
                  warehouseItems.map((item) => (
                    <WarehouseCard key={item.id} item={item} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Package2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No donated food items yet</h3>
                      <p className="text-muted-foreground">
                        Approved and verified donations will appear here as stock
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {pendingDonations.filter(d => d.status === 'pending').length} donations awaiting approval, 
                  {pendingDonations.filter(d => d.status === 'approved-pending-verification').length} awaiting verification.
                </p>
              </div>

              <div className="space-y-3">
                {pendingDonations.length > 0 ? (
                  pendingDonations.map((donation) => (
                    <div key={donation.id}>
                      {PendingCard({ donation })}
                    </div>
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">All donations processed</h3>
                      <p className="text-muted-foreground">
                        New donation requests will appear here for approval and verification
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Post to Marketplace Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Post to Marketplace</DialogTitle>
            <DialogDescription>
              Post {selectedItemForPost?.foodName} to a vending machine for distribution
            </DialogDescription>
          </DialogHeader>
          
          {selectedItemForPost && (
            <div className="space-y-4 py-4">
              {/* Item Info with Image */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{getCategoryIcon(selectedItemForPost.category)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{selectedItemForPost.foodName}</h4>
                  <p className="text-sm text-gray-600">
                    Available: {selectedItemForPost.availableQuantity} {selectedItemForPost.units}
                  </p>
                  {selectedItemForPost.proofImage && (
                    <p className="text-xs text-green-600 mt-1">
                      <Camera className="w-3 h-3 inline mr-1" />
                      Verification image: {selectedItemForPost.proofImage}
                    </p>
                  )}
                </div>
              </div>

              {/* Machine Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 block mb-2">
                  Target Machine *
                </Label>
                <select
                  value={postForm.machine}
                  onChange={(e) => setPostForm({...postForm, machine: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a machine</option>
                  {machines
                    .filter(m => m.status === 'online')
                    .map(machine => (
                      <option key={machine.id} value={machine.id}>
                        {machine.name} - {machine.location} (Stock: {machine.stockLevel}%)
                      </option>
                    ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <Label className="text-sm font-medium text-gray-700 block mb-2">
                  Amount *
                </Label>
                <Input
                  type="number"
                  value={postForm.amount}
                  onChange={(e) => setPostForm({...postForm, amount: e.target.value})}
                  placeholder="Enter amount"
                  min="1"
                  max={selectedItemForPost.availableQuantity}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max: {selectedItemForPost.availableQuantity} {selectedItemForPost.units}
                </p>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium text-gray-700 block mb-2">
                  Description *
                </Label>
                <Textarea
                  value={postForm.description}
                  onChange={(e) => setPostForm({...postForm, description: e.target.value})}
                  placeholder="Describe the food item for the marketplace..."
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
                  onClick={handlePostToMarketplace}
                  className="flex-1"
                >
                  Post to Marketplace
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
