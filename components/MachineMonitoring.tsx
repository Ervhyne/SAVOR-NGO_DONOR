import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ArrowLeft, Wifi, WifiOff, AlertTriangle, RefreshCw, MapPin, Package, Thermometer } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage } from '../App';

interface Machine {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  stockLevel: number;
  foodAmount: number;
  maxCapacity: number;
  temperature: number;
  lastUpdate: string;
  alerts: string[];
  isLocked: boolean;
  voltage: number;
  model: string;
  serialNumber: string;
}

interface MachineMonitoringProps {
  onNavigate: (page: AppPage) => void;
}

export function MachineMonitoring({ onNavigate }: MachineMonitoringProps) {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Mock IoT machine data
  const [machines] = useState<Machine[]>([
    {
      id: 'machine1',
      name: 'Downtown Dispenser #1',
      location: 'Main Street Plaza',
      status: 'online',
      stockLevel: 85,
      foodAmount: 34,
      maxCapacity: 40,
      temperature: 4.2,
      lastUpdate: '2 minutes ago',
      alerts: [],
      isLocked: true,
      voltage: 12.4,
      model: 'FoodBank Pro X1',
      serialNumber: 'FB-2024-001'
    },
    {
      id: 'machine2',
      name: 'Community Center #2',
      location: 'Oak Avenue Center',
      status: 'online',
      stockLevel: 23,
      foodAmount: 9,
      maxCapacity: 40,
      temperature: 3.8,
      lastUpdate: '5 minutes ago',
      alerts: ['Low stock - requires refill'],
      isLocked: true,
      voltage: 12.1,
      model: 'FoodBank Pro X1',
      serialNumber: 'FB-2024-002'
    },
    {
      id: 'machine3',
      name: 'Park Entrance #3',
      location: 'Central Park East',
      status: 'offline',
      stockLevel: 67,
      foodAmount: 27,
      maxCapacity: 40,
      temperature: 12.1,
      lastUpdate: '2 hours ago',
      alerts: ['Temperature warning', 'Connection lost'],
      isLocked: false,
      voltage: 0,
      model: 'FoodBank Pro X1',
      serialNumber: 'FB-2024-003'
    },
    {
      id: 'machine4',
      name: 'School Campus #4',
      location: 'Lincoln Elementary',
      status: 'maintenance',
      stockLevel: 0,
      foodAmount: 0,
      maxCapacity: 40,
      temperature: 4.0,
      lastUpdate: '30 minutes ago',
      alerts: ['Scheduled maintenance'],
      isLocked: true,
      voltage: 12.0,
      model: 'FoodBank Pro X1',
      serialNumber: 'FB-2024-004'
    }
  ]);

  const onlineMachines = machines.filter(m => m.status === 'online');
  const lowStockMachines = machines.filter(m => m.stockLevel < 30);
  const alertMachines = machines.filter(m => m.alerts.length > 0);

  const getStatusColor = (status: Machine['status']) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRefreshAll = () => {
    toast.success('Refreshing all machine data...');
  };

  const handleViewDetails = (machine: Machine) => {
    setSelectedMachine(machine);
    setShowDetails(true);
  };

  const handleExportReport = () => {
    toast.success('Machine report exported successfully');
  };

  const MachineCard = ({ machine }: { machine: Machine }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{machine.name}</h4>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {machine.location}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs ${getStatusColor(machine.status)}`}>
                {machine.status === 'online' ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                {machine.status}
              </Badge>
            </div>
          </div>

          {/* Stock Level */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Stock Level</span>
              <span className="font-medium">{machine.stockLevel}%</span>
            </div>
            <Progress 
              value={machine.stockLevel} 
              className="h-2"
            />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-center space-x-1">
              <Thermometer className="w-3 h-3 text-blue-500" />
              <span>{machine.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="w-3 h-3 text-green-500" />
              <span>{machine.foodAmount}/{machine.maxCapacity}</span>
            </div>
            <div className="text-muted-foreground">
              {machine.lastUpdate}
            </div>
          </div>

          {/* Alerts */}
          {machine.alerts.length > 0 && (
            <div className="space-y-1">
              {machine.alerts.map((alert, index) => (
                <div key={index} className="flex items-center text-xs text-orange-600 bg-orange-50 p-2 rounded">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {alert}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => handleViewDetails(machine)}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
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
          <h1 className="text-xl font-semibold flex-1">Machine Monitoring</h1>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleRefreshAll}
            className="p-2"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{onlineMachines.length}</div>
                <div className="text-xs text-muted-foreground">Online</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{lowStockMachines.length}</div>
                <div className="text-xs text-muted-foreground">Low Stock</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{alertMachines.length}</div>
                <div className="text-xs text-muted-foreground">Alerts</div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Section */}
          {alertMachines.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base text-orange-800">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {alertMachines.map(machine => (
                  <div key={machine.id} className="p-2 bg-white rounded-lg">
                    <div className="font-medium text-sm text-orange-800">{machine.name}</div>
                    <div className="text-xs text-orange-600">
                      {machine.alerts.join(', ')}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Machines List */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">All Machines</h2>
            {machines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleExportReport}
            >
              Export Machine Report
            </Button>
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

              {/* Location Map */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Location Map</span>
                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
                  <img 
                    src="https://via.placeholder.com/400x200/4285f4/ffffff?text=Google+Maps+Location"
                    alt={`Map location of ${selectedMachine.location}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Map pin overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-500 rounded-full p-2 shadow-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                  </div>
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

              {/* Last Updated */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm">{selectedMachine.lastUpdate}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      </div>
    </div>
  );
}
