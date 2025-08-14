import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ArrowLeft, Search, Wifi, WifiOff, Thermometer, AlertTriangle, RefreshCw, MapPin, Package, Settings, Eye, Power, Unlock, Camera, Users } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage } from '../App';

interface FoodDispenser {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  storageLevel: number; // percentage 0-100
  temperature: number; // room temperature
  lastUpdated: string;
  alerts: string[];
  capacity: {
    total: number;
    occupied: number;
    available: number;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  dispensedToday: number;
  totalDispensed: number;
  lastDispenseTime?: string;
}

interface NGOStockProps {
  onNavigate: (page: AppPage) => void;
}

export function NGOStock({ onNavigate }: NGOStockProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<FoodDispenser | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRemoteControl, setShowRemoteControl] = useState(false);

  // Mock Food Dispenser data
  const machines: FoodDispenser[] = [
    {
      id: 'dispenser-001',
      name: 'Food Bank Dispenser #1',
      location: 'Community Center A',
      status: 'online',
      storageLevel: 75,
      temperature: 22.1,
      lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      alerts: [],
      capacity: {
        total: 100,
        occupied: 75,
        available: 25
      },
      coordinates: { lat: 40.7128, lng: -74.0060 },
      dispensedToday: 12,
      totalDispensed: 1250,
      lastDispenseTime: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'dispenser-002',
      name: 'Food Bank Dispenser #2',
      location: 'Library Branch B',
      status: 'online',
      storageLevel: 15,
      temperature: 24.3,
      lastUpdated: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
      alerts: ['Low storage space', 'Needs restocking'],
      capacity: {
        total: 80,
        occupied: 68,
        available: 12
      },
      coordinates: { lat: 40.7589, lng: -73.9851 },
      dispensedToday: 8,
      totalDispensed: 945,
      lastDispenseTime: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: 'dispenser-003',
      name: 'Food Bank Dispenser #3',
      location: 'Mall Food Court',
      status: 'offline',
      storageLevel: 0,
      temperature: 0,
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      alerts: ['Connection lost', 'Requires maintenance'],
      capacity: {
        total: 120,
        occupied: 0,
        available: 120
      },
      dispensedToday: 0,
      totalDispensed: 2100
    }
  ];

  const getStatusColor = (status: FoodDispenser['status']) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStorageLevelColor = (level: number) => {
    if (level >= 70) return 'text-green-600';
    if (level >= 30) return 'text-yellow-600';
    return 'text-red-600';
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success('Machine data refreshed');
  };

  const filteredMachines = machines.filter(machine => {
    const matchesSearch = machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         machine.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || machine.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalMachines = machines.length;
  const onlineMachines = machines.filter(m => m.status === 'online').length;
  const alertMachines = machines.filter(m => m.alerts.length > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('ngo-dashboard')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Food Bank Dispenser Monitoring</h1>
              <p className="text-gray-600">Real-time storage & status tracking</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{onlineMachines}</div>
              <div className="text-gray-600 mt-1">Online</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">{alertMachines}</div>
              <div className="text-gray-600 mt-1">Alerts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600">{totalMachines - onlineMachines}</div>
              <div className="text-gray-600 mt-1">Offline</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search dispensers or locations..."
              className="pl-10 h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-3 border border-gray-300 rounded-md bg-white"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* Alerts Section */}
        {alertMachines > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-medium text-orange-900">Active Alerts</h3>
              </div>
              <div className="grid gap-3">
                {machines.filter(m => m.alerts.length > 0).map(machine => (
                  <div key={machine.id} className="flex items-center justify-between bg-white rounded-lg p-4">
                    <div>
                      <span className="font-medium text-orange-900">{machine.name}</span>
                      <span className="text-orange-700 ml-3">{machine.alerts.join(', ')}</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                      {machine.alerts.length} alert{machine.alerts.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Machine Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMachines.map((machine) => (
            <Card key={machine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Package className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{machine.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {machine.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(machine.status)}>
                        {machine.status === 'online' && <Wifi className="w-4 h-4 mr-2" />}
                        {machine.status === 'offline' && <WifiOff className="w-4 h-4 mr-2" />}
                        {machine.status === 'maintenance' && <Settings className="w-4 h-4 mr-2" />}
                        {machine.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Machine Metrics */}
                  <div className="grid grid-cols-4 gap-6 mb-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getStorageLevelColor(machine.storageLevel)}`}>
                        {machine.storageLevel}%
                      </div>
                      <div className="text-sm text-gray-500 mb-2">Storage</div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            machine.storageLevel >= 70 ? 'bg-green-500' : 
                            machine.storageLevel >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${machine.storageLevel}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
                        <Thermometer className="w-5 h-5" />
                        {machine.temperature}°C
                      </div>
                      <div className="text-sm text-gray-500">Temperature</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {machine.dispensedToday}
                      </div>
                      <div className="text-sm text-gray-500">Today</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {machine.totalDispensed.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Total</div>
                    </div>
                  </div>

                  {/* Capacity Details */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">{machine.capacity.occupied}/{machine.capacity.total} slots</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available:</span>
                      <span className="font-medium text-green-600">{machine.capacity.available} slots</span>
                    </div>
                  </div>

                  {/* Alerts */}
                  {machine.alerts.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-900">Active Alerts</span>
                      </div>
                      <ul className="text-sm text-orange-700 space-y-1">
                        {machine.alerts.map((alert, index) => (
                          <li key={index}>• {alert}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Last updated: {formatLastUpdated(machine.lastUpdated)}
                      {machine.lastDispenseTime && (
                        <span className="ml-4">Last dispense: {formatLastUpdated(machine.lastDispenseTime)}</span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedMachine(machine);
                          setShowDetails(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                      {machine.status !== 'offline' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedMachine(machine);
                            setShowRemoteControl(true);
                          }}
                          className="flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Remote Control
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMachines.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No dispensers found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedMachine && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Package className="w-6 h-6 text-blue-600" />
                {selectedMachine.name} - Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Location & Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedMachine.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedMachine.status)}>
                        {selectedMachine.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{formatLastUpdated(selectedMachine.lastUpdated)}</span>
                    </div>
                    {selectedMachine.coordinates && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coordinates:</span>
                        <span className="font-medium">{selectedMachine.coordinates.lat}, {selectedMachine.coordinates.lng}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Performance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Storage Level:</span>
                      <span className="font-medium">{selectedMachine.storageLevel}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature:</span>
                      <span className="font-medium">{selectedMachine.temperature}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dispensed Today:</span>
                      <span className="font-medium">{selectedMachine.dispensedToday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Dispensed:</span>
                      <span className="font-medium">{selectedMachine.totalDispensed.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Capacity Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{selectedMachine.capacity.total}</div>
                      <div className="text-sm text-gray-500">Total Slots</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{selectedMachine.capacity.occupied}</div>
                      <div className="text-sm text-gray-500">Occupied</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{selectedMachine.capacity.available}</div>
                      <div className="text-sm text-gray-500">Available</div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedMachine.alerts.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Active Alerts</h4>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <ul className="space-y-1">
                      {selectedMachine.alerts.map((alert: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-orange-700">
                          <AlertTriangle className="w-4 h-4" />
                          {alert}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Remote Control Modal */}
      {showRemoteControl && selectedMachine && (
        <Dialog open={showRemoteControl} onOpenChange={setShowRemoteControl}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-600" />
                {selectedMachine.name} - Remote Control
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-2"
                  onClick={() => {
                    toast.success('Dispenser unlocked for 30 seconds');
                  }}
                >
                  <Unlock className="w-6 h-6" />
                  Unlock Dispenser
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-2"
                  onClick={() => {
                    toast.success('Test dispensing initiated');
                  }}
                >
                  <Package className="w-6 h-6" />
                  Test Dispense
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-2"
                  onClick={() => {
                    toast.success('Camera feed opened');
                  }}
                >
                  <Camera className="w-6 h-6" />
                  View Camera
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-2"
                  onClick={() => {
                    toast.success('Usage stats downloaded');
                  }}
                >
                  <Users className="w-6 h-6" />
                  Usage Stats
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Emergency Controls</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="destructive"
                    className="h-16 flex flex-col items-center gap-2"
                    onClick={() => {
                      toast.success('Emergency shutdown initiated');
                    }}
                  >
                    <Power className="w-5 h-5" />
                    Emergency Stop
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex flex-col items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
                    onClick={() => {
                      toast.success('Maintenance mode activated');
                    }}
                  >
                    <Settings className="w-5 h-5" />
                    Maintenance Mode
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
