import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ArrowLeft, Camera, MapPin, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage, User, Donation } from '../App';

interface PostDonationProps {
  user: User;
  onNavigate: (page: AppPage) => void;
  onCreateDonation: (donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function PostDonation({ user, onNavigate, onCreateDonation }: PostDonationProps) {
  const [formData, setFormData] = useState({
    foodName: '',
    description: '',
    quantity: '',
    units: 'kg',
    category: 'perishable' as 'perishable' | 'non-perishable' | 'cooked' | 'packaged',
    expirationDate: '',
    pickupDate: '',
    deliveryMethod: 'pickup' as 'drop-off' | 'pickup',
    dropOffLocation: '',
    estimatedMeals: '',
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedNGO, setSelectedNGO] = useState('');

  // Mock NGO list - in real app, this would come from props or API
  const availableNGOs = [
    { id: 'ngo1', name: 'Food Bank Central', location: 'Downtown', distance: '2.3 km' },
    { id: 'ngo2', name: 'Community Kitchen', location: 'Uptown', distance: '4.1 km' },
    { id: 'ngo3', name: 'Hope Foundation', location: 'Westside', distance: '5.7 km' },
  ];

  const foodCategories = [
    { value: 'perishable', label: 'Fresh Produce', icon: '🥬', description: 'Fruits, vegetables, dairy' },
    { value: 'non-perishable', label: 'Packaged Foods', icon: '🥫', description: 'Canned goods, dry goods' },
    { value: 'cooked', label: 'Prepared Meals', icon: '🍽️', description: 'Ready-to-eat food' },
    { value: 'packaged', label: 'Bakery Items', icon: '🍞', description: 'Bread, pastries, baked goods' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push(e.target.result as string);
            if (newPhotos.length === files.length) {
              setPhotos(prev => [...prev, ...newPhotos].slice(0, 5)); // Limit to 5 photos
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.foodName || !formData.quantity || !formData.pickupDate || !selectedNGO) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (photos.length === 0) {
      toast.error('Please add at least one photo of the food');
      return;
    }

    const selectedNGOData = availableNGOs.find(ngo => ngo.id === selectedNGO);

    const donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'> = {
      donorId: user.id,
      donorName: user.name,
      foodName: formData.foodName,
      description: formData.description,
      quantity: formData.quantity,
      units: formData.units,
      category: formData.category,
      expirationDate: formData.expirationDate,
      photos: photos,
      pickupDate: formData.pickupDate,
      deliveryMethod: formData.deliveryMethod,
      dropOffLocation: formData.deliveryMethod === 'drop-off' ? formData.dropOffLocation : undefined,
      status: 'pending',
      ngoId: selectedNGO,
      ngoName: selectedNGOData?.name,
      estimatedMeals: formData.estimatedMeals ? parseInt(formData.estimatedMeals) : undefined,
      trackingNotes: [],
    };

    onCreateDonation(donation);
    toast.success('Donation posted! NGO will review your submission.');
    onNavigate('donor-dashboard');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center p-4 border-b bg-white">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('donor-dashboard')}
            className="mr-2 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Post Donation</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Food Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Food Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="foodName">Food Name *</Label>
                <Input
                  id="foodName"
                  value={formData.foodName}
                  onChange={(e) => handleInputChange('foodName', e.target.value)}
                  placeholder="e.g., Fresh vegetables, Cooked rice"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Additional details about the food..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="5"
                  />
                </div>
                <div>
                  <Label htmlFor="units">Units</Label>
                  <select 
                    value={formData.units}
                    onChange={(e) => handleInputChange('units', e.target.value)}
                    className="w-full p-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="kg">kg</option>
                    <option value="portions">portions</option>
                    <option value="packs">packs</option>
                    <option value="pieces">pieces</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="estimatedMeals">Estimated Meals</Label>
                <Input
                  id="estimatedMeals"
                  type="number"
                  value={formData.estimatedMeals}
                  onChange={(e) => handleInputChange('estimatedMeals', e.target.value)}
                  placeholder="How many people can this feed?"
                />
              </div>
            </CardContent>
          </Card>

          {/* Food Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Food Category *</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
                className="space-y-3"
              >
                {foodCategories.map(category => (
                  <div key={category.value} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value={category.value} id={category.value} />
                    <div className="flex-1">
                      <Label htmlFor={category.value} className="flex items-center cursor-pointer">
                        <span className="text-lg mr-2">{category.icon}</span>
                        <div>
                          <div className="font-medium">{category.label}</div>
                          <div className="text-xs text-muted-foreground">{category.description}</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Food Photos *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={photo} 
                      alt={`Food ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                
                {photos.length < 5 && (
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                    <Camera className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Add up to 5 photos. Clear photos help NGOs assess food quality.
              </p>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="pickupDate">Preferred Pickup Date *</Label>
                <Input
                  id="pickupDate"
                  type="datetime-local"
                  value={formData.pickupDate}
                  onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* NGO Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select NGO *</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedNGO} 
                onValueChange={setSelectedNGO}
                className="space-y-3"
              >
                {availableNGOs.map(ngo => (
                  <div key={ngo.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value={ngo.id} id={ngo.id} />
                    <div className="flex-1">
                      <Label htmlFor={ngo.id} className="cursor-pointer">
                        <div className="font-medium">{ngo.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {ngo.location} • {ngo.distance}
                        </div>
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Delivery Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Delivery Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={formData.deliveryMethod} 
                onValueChange={(value) => handleInputChange('deliveryMethod', value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="cursor-pointer flex-1">
                    <div className="font-medium">NGO Pickup</div>
                    <div className="text-xs text-muted-foreground">NGO team will collect from your location</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="drop-off" id="drop-off" />
                  <Label htmlFor="drop-off" className="cursor-pointer flex-1">
                    <div className="font-medium">Drop-off</div>
                    <div className="text-xs text-muted-foreground">You deliver to NGO location</div>
                  </Label>
                </div>
              </RadioGroup>

              {formData.deliveryMethod === 'drop-off' && (
                <div className="mt-4">
                  <Label htmlFor="dropOffLocation">Drop-off Location</Label>
                  <Input
                    id="dropOffLocation"
                    value={formData.dropOffLocation}
                    onChange={(e) => handleInputChange('dropOffLocation', e.target.value)}
                    placeholder="Specific location or address"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button type="submit" className="w-full h-12 text-base">
            <Upload className="w-4 h-4 mr-2" />
            Submit Donation
          </Button>
        </form>
      </div>
    </div>
  );
}
