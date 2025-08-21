import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ArrowLeft, Wifi, WifiOff, Thermometer, AlertTriangle, MapPin, Calendar, Package, Power, Lock, Unlock, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage } from '../App';

interface FoodDispenser {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  stockLevel: number; // percentage 0-100
  foodAmount: number; // actual food items count
  maxCapacity: number; // maximum food items capacity
  temperature: number;
  lastUpdated: string;
  needsRefill: boolean;
  isLocked: boolean;
  voltage: number;
  model: string;
  serialNumber: string;
}

interface NGOStockProps {
  onNavigate: (page: AppPage) => void;
}

export function NGOStock({ onNavigate }: NGOStockProps) {
  const [selectedMachine, setSelectedMachine] = useState<FoodDispenser | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showScheduleRefill, setShowScheduleRefill] = useState(false);
  const [showPostDonation, setShowPostDonation] = useState(false);
  const [refillDate, setRefillDate] = useState('');
  const [refillTime, setRefillTime] = useState('');
  const [donationForm, setDonationForm] = useState({
    foodName: '',
    description: '',
    quantity: '',
    units: '',
    expirationDate: '',
    category: 'packaged' as const,
    targetMachine: ''
  });
  
  const [machines] = useState<FoodDispenser[]>([
    {
      id: 'dispenser-001',
      name: 'Dispenser #1',
      location: 'Main Street Plaza',
      status: 'online',
      stockLevel: 85,
      foodAmount: 34,
      maxCapacity: 40,
      temperature: 4.2,
      lastUpdated: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      needsRefill: false,
      isLocked: true,
      voltage: 12.4,
      model: 'FoodBank Pro X1',
      serialNumber: 'FB-2024-001'
    },
    {
      id: 'dispenser-002',
      name: 'Dispenser #2',
      location: 'Oak Avenue Center',
      status: 'online',
      stockLevel: 23,
      foodAmount: 9,
      maxCapacity: 40,
      temperature: 3.8,
      lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      needsRefill: true,
      isLocked: true,
      voltage: 12.1,
      model: 'FoodBank Pro X1',
      serialNumber: 'FB-2024-002'
    },
    {
      id: 'dispenser-003',
      name: 'Dispenser #3',
      location: 'Central Park East',
      status: 'offline',
      stockLevel: 0,
      foodAmount: 0,
      maxCapacity: 40,
      temperature: 0,
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      needsRefill: false,
      isLocked: false,
      voltage: 0,
      model: 'FoodBank Pro X1',
      serialNumber: 'FB-2024-003'
    }
  ]);

  // Helper function to determine if machine needs refill
  const machineNeedsRefill = (machine: FoodDispenser) => {
    return machine.stockLevel < 30 && machine.status === 'online';
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleScheduleRefill = (machine: FoodDispenser) => {
    setSelectedMachine(machine);
    setShowScheduleRefill(true);
  };

  const confirmScheduleRefill = () => {
    if (!refillDate || !refillTime || !selectedMachine) {
      toast.error('Please select both date and time for the refill');
      return;
    }

    const scheduledDateTime = new Date(`${refillDate}T${refillTime}`);
    const now = new Date();
    
    if (scheduledDateTime <= now) {
      toast.error('Please select a future date and time');
      return;
    }

    const timeString = scheduledDateTime.toLocaleString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    toast.success(`Refill scheduled for ${selectedMachine.name} at ${timeString}`, {
      description: "Volunteer team has been notified and will begin preparation.",
      duration: 4000,
    });

    setShowScheduleRefill(false);
    setRefillDate('');
    setRefillTime('');
    setSelectedMachine(null);
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

  const handleRemoteControl = (machine: FoodDispenser, action: string) => {
    if (machine.status !== 'online') {
      toast.error(`Cannot control ${machine.name} - machine is ${machine.status}`);
      return;
    }

    switch (action) {
      case 'lock':
        toast.success(`${machine.name} has been locked remotely`);
        break;
      case 'unlock':
        toast.success(`${machine.name} has been unlocked remotely`);
        break;
      case 'reboot':
        toast.success(`${machine.name} is rebooting...`);
        break;
      case 'dispense':
        toast.success(`Test dispense initiated on ${machine.name}`);
        break;
      default:
        toast.error('Unknown command');
    }
  };

  const handleViewDetails = (machine: FoodDispenser) => {
    setSelectedMachine(machine);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('ngo-dashboard')}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Stock</h1>
              </div>
            </div>
            <Button 
              onClick={handlePostDonation}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Food
            </Button>
          </div>
        </div>

        <div className="p-4">
          {/* Section Header */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Machines</h2>

        {/* Machine List */}
        <div className="space-y-4">
          {machines.map((machine) => (
            <Card key={machine.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{machine.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      {machine.location}
                    </div>
                  </div>
                  <Badge className={getStatusColor(machine.status)}>
                    {machine.status === 'online' && <Wifi className="w-3 h-3 mr-1" />}
                    {machine.status === 'offline' && <WifiOff className="w-3 h-3 mr-1" />}
                    {machine.status}
                  </Badge>
                </div>

                {/* Stock Level */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Stock Level</span>
                    <span className="text-sm font-bold text-gray-900">{machine.stockLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        machine.stockLevel >= 50 ? 'bg-green-500' : 
                        machine.stockLevel >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${machine.stockLevel}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-blue-600">
                      <Thermometer className="w-4 h-4" />
                      <span className="text-sm font-medium">{machine.temperature}°C</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <Package className="w-4 h-4" />
                      <span className="text-sm font-medium">{machine.foodAmount}/{machine.maxCapacity} items</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatLastUpdated(machine.lastUpdated)}
                  </div>
                </div>

                {/* Low Stock Alert */}
                {(machine.needsRefill || machineNeedsRefill(machine)) && machine.status === 'online' && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-orange-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Low stock - requires refill</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(machine)}
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  {(machine.needsRefill || machineNeedsRefill(machine)) && machine.status === 'online' && (
                    <Button 
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                      size="sm"
                      onClick={() => handleScheduleRefill(machine)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Refill
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedMachine && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-lg">{selectedMachine.name}</DialogTitle>
              <DialogDescription>
                View detailed information about this food dispenser machine
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={getStatusColor(selectedMachine.status)}>
                  {selectedMachine.status === 'online' && <Wifi className="w-3 h-3 mr-1" />}
                  {selectedMachine.status === 'offline' && <WifiOff className="w-3 h-3 mr-1" />}
                  {selectedMachine.status}
                </Badge>
              </div>

              {/* Location */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Location</span>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-3 h-3" />
                  {selectedMachine.location}
                </div>
              </div>

              {/* Stock Level */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Stock Level</span>
                  <span className="text-sm font-bold">{selectedMachine.stockLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      selectedMachine.stockLevel >= 50 ? 'bg-green-500' : 
                      selectedMachine.stockLevel >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${selectedMachine.stockLevel}%` }}
                  />
                </div>
              </div>

              {/* Food Amount & Temperature */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">{selectedMachine.foodAmount}/{selectedMachine.maxCapacity}</div>
                    <div className="text-xs text-gray-500">Food Items</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">{selectedMachine.temperature}°C</div>
                    <div className="text-xs text-gray-500">Temperature</div>
                  </div>
                </div>
              </div>

              {/* Machine Details */}
              <div className="space-y-3 pt-2 border-t">
                <h4 className="text-sm font-medium text-gray-700">Machine Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Model:</span>
                    <div className="font-medium">{selectedMachine.model}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Serial:</span>
                    <div className="font-medium">{selectedMachine.serialNumber}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Voltage:</span>
                    <div className="font-medium">{selectedMachine.voltage}V</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <div className={`font-medium flex items-center gap-1 ${
                      selectedMachine.isLocked ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {selectedMachine.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      {selectedMachine.isLocked ? 'Locked' : 'Unlocked'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Remote Control */}
              {selectedMachine.status === 'online' && (
                <div className="space-y-3 pt-2 border-t">
                  <h4 className="text-sm font-medium text-gray-700">Remote Control</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoteControl(selectedMachine, selectedMachine.isLocked ? 'unlock' : 'lock')}
                    >
                      {selectedMachine.isLocked ? <Unlock className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                      {selectedMachine.isLocked ? 'Unlock' : 'Lock'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoteControl(selectedMachine, 'reboot')}
                    >
                      <Power className="w-3 h-3 mr-1" />
                      Reboot
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoteControl(selectedMachine, 'dispense')}
                      className="col-span-2"
                    >
                      Test Dispense
                    </Button>
                  </div>
                </div>
              )}

              {/* Last Updated */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm">{formatLastUpdated(selectedMachine.lastUpdated)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {(selectedMachine.needsRefill || machineNeedsRefill(selectedMachine)) && selectedMachine.status === 'online' && (
                  <Button 
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                    onClick={() => {
                      handleScheduleRefill(selectedMachine);
                      setShowDetails(false);
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Refill
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetails(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Schedule Refill Modal */}
      {showScheduleRefill && selectedMachine && (
        <Dialog open={showScheduleRefill} onOpenChange={setShowScheduleRefill}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Schedule Refill</DialogTitle>
              <DialogDescription>
                Set a custom date and time for refilling {selectedMachine.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Refill Date
                </label>
                <input
                  type="date"
                  value={refillDate}
                  onChange={(e) => setRefillDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Refill Time
                </label>
                <input
                  type="time"
                  value={refillTime}
                  onChange={(e) => setRefillTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  The volunteer team will be automatically notified of the scheduled refill time.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowScheduleRefill(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmScheduleRefill}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Schedule Refill
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

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
                    <option value="pieces">pieces</option>
                    <option value="servings">servings</option>
                    <option value="boxes">boxes</option>
                    <option value="cans">cans</option>
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
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
    </div>
  );
}
