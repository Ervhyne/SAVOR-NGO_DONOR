import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Wifi, WifiOff, Thermometer, AlertTriangle, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage } from '../App';

interface FoodDispenser {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  stockLevel: number; // percentage 0-100
  temperature: number;
  lastUpdated: string;
  needsRefill: boolean;
  batteryLevel?: number; // Some might have backup battery
}

interface NGOStockProps {
  onNavigate: (page: AppPage) => void;
}

export function NGOStock({ onNavigate }: NGOStockProps) {
  const [machines] = useState<FoodDispenser[]>([
    {
      id: 'dispenser-001',
      name: 'Downtown Dispenser #1',
      location: 'Main Street Plaza',
      status: 'online',
      stockLevel: 85,
      temperature: 4.2,
      lastUpdated: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      needsRefill: false,
      batteryLevel: 92
    },
    {
      id: 'dispenser-002',
      name: 'Community Center #2',
      location: 'Oak Avenue Center',
      status: 'online',
      stockLevel: 23,
      temperature: 3.8,
      lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      needsRefill: true,
      batteryLevel: 76
    },
    {
      id: 'dispenser-003',
      name: 'Park Entrance #3',
      location: 'Central Park East',
      status: 'offline',
      stockLevel: 0,
      temperature: 0,
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      needsRefill: false,
      batteryLevel: 0
    }
  ]);

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
    toast.success(`Refill scheduled for ${machine.name}`);
  };

  const handleViewDetails = (machine: FoodDispenser) => {
    toast.info(`Viewing details for ${machine.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
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
                    {machine.batteryLevel && machine.batteryLevel > 0 && (
                      <div className="flex items-center gap-1 text-green-600">
                        <span className="text-sm">🔋</span>
                        <span className="text-sm font-medium">{machine.batteryLevel}%</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatLastUpdated(machine.lastUpdated)}
                  </div>
                </div>

                {/* Low Stock Alert */}
                {machine.needsRefill && machine.status === 'online' && (
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
                  {machine.needsRefill && machine.status === 'online' && (
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
    </div>
  );
}
