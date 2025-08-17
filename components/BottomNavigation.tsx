import { Button } from './ui/button';
import { Home, Plus, History, User, Package, Package2, Settings, Bell } from 'lucide-react';
import type { AppPage, UserRole } from '../App';

interface BottomNavigationProps {
  currentPage: AppPage;
  userRole: UserRole;
  onNavigate: (page: AppPage) => void;
}

export function BottomNavigation({ currentPage, userRole, onNavigate }: BottomNavigationProps) {
  const donorNavItems = [
    { page: 'donor-dashboard' as AppPage, icon: Home, label: 'Home' },
    { page: 'post-donation' as AppPage, icon: Plus, label: 'Donate' },
    { page: 'donation-history' as AppPage, icon: History, label: 'History' },
    { page: 'notifications' as AppPage, icon: Bell, label: 'Updates' },
    { page: 'donor-profile' as AppPage, icon: User, label: 'Profile' },
  ];

  const ngoNavItems = [
    { page: 'ngo-dashboard' as AppPage, icon: Home, label: 'Home' },
    { page: 'ngo-donations' as AppPage, icon: Package, label: 'Donations' },
    { page: 'donation-marketplace' as AppPage, icon: Package2, label: 'Marketplace' },
    { page: 'ngo-profile' as AppPage, icon: Settings, label: 'Settings' },
  ];

  const navItems = userRole === 'donor' ? donorNavItems : ngoNavItems;
  const gridCols = userRole === 'donor' ? 'grid-cols-5' : 'grid-cols-4';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="max-w-md mx-auto">
        <div className={`grid gap-1 ${gridCols}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            
            return (
              <Button
                key={item.page}
                variant="ghost"
                className={`flex flex-col items-center py-3 px-1 h-auto rounded-none ${
                  isActive ? 'text-green-600' : 'text-gray-600'
                }`}
                onClick={() => onNavigate(item.page)}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-green-600' : ''}`} />
                <span className={`text-xs ${isActive ? 'text-green-600 font-medium' : ''}`}>
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
