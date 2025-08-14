import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Bell, CheckCircle, Truck, Heart } from 'lucide-react';
import type { AppPage } from '../App';

interface NotificationsProps {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
  }>;
  onNavigate: (page: AppPage) => void;
  onMarkAsRead: (id: string) => void;
}

export function Notifications({ notifications, onNavigate, onMarkAsRead }: NotificationsProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getNotificationIcon = (title: string) => {
    if (title.includes('Received') || title.includes('Delivered')) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (title.includes('Pickup') || title.includes('Transit')) {
      return <Truck className="w-5 h-5 text-blue-500" />;
    } else if (title.includes('Thank')) {
      return <Heart className="w-5 h-5 text-red-500" />;
    }
    return <Bell className="w-5 h-5 text-gray-500" />;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        onMarkAsRead(notification.id);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('donor-dashboard')}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={markAllAsRead}
              className="text-sm"
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`cursor-pointer transition-colors ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-medium ${
                          !notification.read ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className={`text-sm ${
                        !notification.read ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatTimeAgo(notification.date)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-muted-foreground mb-6">
                You'll receive updates about your donations here
              </p>
              <Button onClick={() => onNavigate('create-donation')}>
                Create Your First Donation
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Notification Settings */}
        {notifications.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Notification Preferences</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Donation status updates</span>
                  <div className="w-10 h-6 bg-green-500 rounded-full p-1">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>NGO feedback messages</span>
                  <div className="w-10 h-6 bg-green-500 rounded-full p-1">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pickup reminders</span>
                  <div className="w-10 h-6 bg-gray-300 rounded-full p-1">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
