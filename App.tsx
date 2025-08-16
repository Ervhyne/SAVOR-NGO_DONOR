import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RoleSelection } from './components/RoleSelection';
import { Login } from './components/Login';
import { Registration } from './components/Registration';
import { OTPVerification } from './components/OTPVerification';
import { DonorDashboard } from './components/DonorDashboard';
import { NGODashboard } from './components/NGODashboard';
import { CreateDonation } from './components/CreateDonation';
import { PostDonation } from './components/PostDonation';
import { MachineMonitoring } from './components/MachineMonitoring';
import { BottomNavigation } from './components/BottomNavigation';
import { DonationHistory } from './components/DonationHistory';
import { DonorProfile } from './components/DonorProfile';
import { NGODonations } from './components/NGODonations';
import { NGOStock } from './components/NGOStock';
import { NGOVolunteers } from './components/NGOVolunteers';
import { NGOProfile } from './components/NGOProfile';
import { Notifications } from './components/Notifications';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

export type UserRole = 'donor' | 'ngo';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  address: string;
  profilePicture?: string;
  
  // Common fields
  createdAt: string;
  totalDonations: number;
  totalMealsServed: number;
  isVerified: boolean;
  
  // Donor-specific fields
  donorType?: 'individual' | 'company';
  donationPreferences?: string[];
  companyName?: string;
  idDocument?: string;
  
  // NGO-specific fields
  organizationName?: string;
  contactPerson?: string;
  accreditationDocs?: string[];
  serviceAreas?: string[];
  adminApproved?: boolean;
  pendingReview?: boolean;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  foodName: string;
  description: string;
  quantity: string;
  units: string;
  expirationDate?: string;
  category: 'perishable' | 'non-perishable' | 'cooked' | 'packaged';
  photos: string[];
  pickupDate: string;
  deliveryMethod: 'drop-off' | 'pickup';
  dropOffLocation?: string;
  status: 'pending' | 'accepted' | 'in-transit' | 'delivered' | 'rejected' | 'submitted' | 'received' | 'distributed' | 'approved-pending-verification' | 'verified';
  createdAt: string;
  updatedAt: string;
  ngoId?: string;
  ngoName?: string;
  estimatedMeals?: number;
  trackingNotes: string[];
  assignedVolunteer?: string;
}

export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expirationDate?: string;
  location: string;
  status: 'available' | 'low' | 'expired';
  lastUpdated: string;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'available' | 'busy' | 'offline';
  currentTask?: string;
}

export interface Message {
  id: string;
  donationId?: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  timestamp: string;
  attachments?: string[];
  read: boolean;
}

export type AppPage = 
  | 'welcome' 
  | 'role-selection' 
  | 'login' 
  | 'registration' 
  | 'otp-verification'
  | 'donor-dashboard'
  | 'ngo-dashboard'
  | 'create-donation'
  | 'post-donation'
  | 'donation-history'
  | 'donation-tracking'
  | 'settings'
  | 'donor-profile'
  | 'ngo-donations'
  | 'ngo-stock'
  | 'machine-monitoring'
  | 'ngo-volunteers'
  | 'ngo-profile'
  | 'dashboard'
  | 'tracking'
  | 'history'
  | 'notifications';

// Mock Database Class
class MockDatabase {
  private static instance: MockDatabase;
  
  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  // Load data from localStorage or return defaults
  loadUsers(): User[] {
    const stored = localStorage.getItem('savor_users');
    return stored ? JSON.parse(stored) : this.getDefaultUsers();
  }

  loadDonations(): Donation[] {
    const stored = localStorage.getItem('savor_donations');
    return stored ? JSON.parse(stored) : this.getDefaultDonations();
  }

  loadStockItems(): StockItem[] {
    const stored = localStorage.getItem('savor_stock');
    return stored ? JSON.parse(stored) : this.getDefaultStock();
  }

  loadVolunteers(): Volunteer[] {
    const stored = localStorage.getItem('savor_volunteers');
    return stored ? JSON.parse(stored) : this.getDefaultVolunteers();
  }

  loadMessages(): Message[] {
    const stored = localStorage.getItem('savor_messages');
    return stored ? JSON.parse(stored) : [];
  }

  loadCurrentUser(): User | null {
    const stored = localStorage.getItem('savor_current_user');
    return stored ? JSON.parse(stored) : null;
  }

  loadSelectedRole(): UserRole | null {
    const stored = localStorage.getItem('savor_selected_role');
    return stored as UserRole | null;
  }

  // Save data to localStorage
  saveUsers(users: User[]): void {
    localStorage.setItem('savor_users', JSON.stringify(users));
  }

  saveDonations(donations: Donation[]): void {
    localStorage.setItem('savor_donations', JSON.stringify(donations));
  }

  saveStockItems(stock: StockItem[]): void {
    localStorage.setItem('savor_stock', JSON.stringify(stock));
  }

  saveVolunteers(volunteers: Volunteer[]): void {
    localStorage.setItem('savor_volunteers', JSON.stringify(volunteers));
  }

  saveMessages(messages: Message[]): void {
    localStorage.setItem('savor_messages', JSON.stringify(messages));
  }

  saveCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem('savor_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('savor_current_user');
    }
  }

  saveSelectedRole(role: UserRole | null): void {
    if (role) {
      localStorage.setItem('savor_selected_role', role);
    } else {
      localStorage.removeItem('savor_selected_role');
    }
  }

  // Authentication
  authenticateUser(email: string, password: string): User | null {
    const users = this.loadUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user && (password === 'password123' || password === 'demo')) {
      return user;
    }
    return null;
  }

  // Default data generators
  getDefaultUsers(): User[] {
    return [
      {
        id: '1',
        role: 'donor' as UserRole,
        name: 'John Doe',
        email: 'john@demo.com',
        phone: '+1-555-0123',
        address: '123 Main St, City, State',
        donorType: 'company' as const,
        companyName: 'Local Restaurant',
        donationPreferences: ['perishable', 'cooked'],
        createdAt: '2025-01-01T00:00:00Z',
        totalDonations: 12,
        totalMealsServed: 156,
        isVerified: true
      },
      {
        id: '2',
        role: 'ngo' as UserRole,
        name: 'Sarah Johnson',
        email: 'contact@hopefoundation.org',
        phone: '+1-555-0456',
        address: '456 Charity Ave, City, State',
        organizationName: 'Hope Foundation',
        contactPerson: 'Sarah Johnson',
        accreditationDocs: ['certificate.pdf', 'tax-exempt.pdf'],
        serviceAreas: ['Food Distribution', 'Community Outreach'],
        adminApproved: true,
        pendingReview: false,
        createdAt: '2025-01-01T00:00:00Z',
        totalDonations: 0,
        totalMealsServed: 2340,
        isVerified: true
      }
    ];
  }

  getDefaultDonations(): Donation[] {
    return [
      {
        id: '1',
        donorId: '1',
        donorName: 'John Doe',
        foodName: 'Fresh Vegetables',
        description: 'Mixed seasonal vegetables - carrots, lettuce, tomatoes',
        quantity: '5',
        units: 'kg',
        expirationDate: '2025-08-15',
        category: 'perishable',
        photos: [],
        pickupDate: '2025-08-14',
        deliveryMethod: 'pickup',
        status: 'delivered',
        createdAt: '2025-08-12T10:00:00Z',
        updatedAt: '2025-08-14T16:30:00Z',
        ngoId: '2',
        ngoName: 'Hope Foundation',
        estimatedMeals: 15,
        trackingNotes: [
          'Donation submitted successfully',
          'Hope Foundation accepted donation',
          'Volunteer assigned for pickup',
          'Items collected from donor location',
          'Delivered to NGO facility'
        ],
        assignedVolunteer: 'Mike Wilson'
      }
    ];
  }

  getDefaultStock(): StockItem[] {
    return [
      {
        id: '1',
        name: 'Rice',
        category: 'non-perishable',
        quantity: 50,
        unit: 'kg',
        location: 'Storage Room A',
        status: 'available',
        lastUpdated: '2025-08-13T10:00:00Z'
      },
      {
        id: '2',
        name: 'Canned Beans',
        category: 'non-perishable',
        quantity: 5,
        unit: 'cans',
        location: 'Storage Room B',
        status: 'low',
        lastUpdated: '2025-08-13T14:00:00Z'
      }
    ];
  }

  getDefaultVolunteers(): Volunteer[] {
    return [
      {
        id: '1',
        name: 'Mike Wilson',
        phone: '+1-555-0789',
        email: 'mike@volunteer.com',
        status: 'available'
      },
      {
        id: '2',
        name: 'Lisa Chen',
        phone: '+1-555-0012',
        email: 'lisa@volunteer.com',
        status: 'busy',
        currentTask: 'Pickup from Downtown Restaurant'
      }
    ];
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('welcome');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
  }>>([
    {
      id: '1',
      title: 'Donation Received',
      message: 'Your food donation has been received by Hope Foundation',
      date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: '2',
      title: 'Thank You Message',
      message: 'Thank you for your generous donation! It helped feed 15 families.',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: '3',
      title: 'Pickup Scheduled',
      message: 'Your donation pickup has been scheduled for tomorrow at 2 PM',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true
    }
  ]);
  const db = MockDatabase.getInstance();

  // Initialize app data
  useEffect(() => {
    // Check for saved user and auto-login
    const savedUser = db.loadCurrentUser();
    const savedRole = db.loadSelectedRole();
    
    if (savedUser) {
      setUser(savedUser);
      setSelectedRole(savedUser.role);
      if (savedUser.role === 'donor') {
        setCurrentPage('donor-dashboard');
      } else {
        setCurrentPage('ngo-dashboard');
      }
      loadUserData();
    } else if (savedRole) {
      setSelectedRole(savedRole);
      setCurrentPage('welcome');
    }
  }, []);

  const loadUserData = () => {
    setDonations(db.loadDonations());
    setStockItems(db.loadStockItems());
    setVolunteers(db.loadVolunteers());
  };

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    db.saveSelectedRole(role);
  };

  const loginUser = (email: string, password: string): boolean => {
    const authenticatedUser = db.authenticateUser(email, password);
    
    if (authenticatedUser) {
      db.saveCurrentUser(authenticatedUser);
      setUser(authenticatedUser);
      setSelectedRole(authenticatedUser.role);
      loadUserData();
      
      toast.success(`Welcome back, ${authenticatedUser.name}!`);
      return true;
    }
    
    return false;
  };

  const registerUser = (userData: any) => {
    setRegistrationData(userData);
    // In real app, this would send OTP
    setCurrentPage('otp-verification');
  };

  const verifyOTP = (otp: string): boolean => {
    // Mock OTP verification (accept 123456)
    if (otp === '123456') {
      const newUser: User = {
        ...registrationData,
        id: Date.now().toString(),
        role: selectedRole!,
        createdAt: new Date().toISOString(),
        totalDonations: 0,
        totalMealsServed: 0,
        isVerified: true
      };
      
      const users = db.loadUsers();
      users.push(newUser);
      db.saveUsers(users);
      db.saveCurrentUser(newUser);
      setUser(newUser);
      loadUserData();
      
      // Navigate to the appropriate dashboard based on role
      if (selectedRole === 'donor') {
        setCurrentPage('donor-dashboard');
      } else {
        setCurrentPage('ngo-dashboard');
      }
      
      toast.success('Account verified successfully!');
      return true;
    }
    return false;
  };

  const updateUser = (updatedUser: User) => {
    const users = db.loadUsers();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      db.saveUsers(users);
    }
    
    db.saveCurrentUser(updatedUser);
    setUser(updatedUser);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const addDonation = (donationData: any) => {
    const newDonation: Donation = {
      ...donationData,
      id: Date.now().toString(),
      donorId: user!.id,
      donorName: user!.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingNotes: ['Donation submitted successfully', 'Waiting for NGO acceptance']
    };

    const currentDonations = db.loadDonations();
    currentDonations.unshift(newDonation);
    db.saveDonations(currentDonations);
    setDonations(currentDonations);

    // Update user stats
    if (user) {
      const updatedUser = {
        ...user,
        totalDonations: user.totalDonations + 1
      };
      updateUser(updatedUser);
    }

    toast.success('Donation created successfully!');
  };

  const updateDonationStatus = (donationId: string, status: Donation['status'], note?: string) => {
    const updatedDonations = donations.map(donation => {
      if (donation.id === donationId) {
        const updatedNotes = [...donation.trackingNotes];
        if (note) updatedNotes.push(note);
        
        return {
          ...donation,
          status,
          updatedAt: new Date().toISOString(),
          trackingNotes: updatedNotes
        };
      }
      return donation;
    });
    
    setDonations(updatedDonations);
    db.saveDonations(updatedDonations);
    
    toast.success(`Donation ${status.replace('-', ' ')}`);
  };

  const logoutUser = () => {
    db.saveCurrentUser(null);
    db.saveSelectedRole(null);
    setUser(null);
    setSelectedRole(null);
    setDonations([]);
    setStockItems([]);
    setVolunteers([]);
    setCurrentPage('welcome');
    toast.success('Logged out successfully');
  };

  const handleNavigation = (page: AppPage) => {
    // Check authentication for protected pages
    const protectedPages: AppPage[] = [
      'donor-dashboard', 'ngo-dashboard', 'create-donation', 'donation-history', 
      'donor-profile', 'ngo-donations', 'ngo-stock', 'ngo-volunteers', 'ngo-profile'
    ];
    
    if (protectedPages.includes(page) && !user) {
      toast.error('Please sign in to access this page');
      setCurrentPage('welcome');
      return;
    }

    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomeScreen onNavigate={handleNavigation} />;
      case 'role-selection':
        return <RoleSelection selectedRole={selectedRole} onRoleSelect={handleRoleSelection} onNavigate={handleNavigation} />;
      case 'login':
        return <Login onNavigate={handleNavigation} onLogin={loginUser} />;
      case 'registration':
        return selectedRole ? 
          <Registration selectedRole={selectedRole} onNavigate={handleNavigation} onRegister={registerUser} /> :
          <RoleSelection selectedRole={selectedRole} onRoleSelect={handleRoleSelection} onNavigate={handleNavigation} />;
      case 'otp-verification':
        return <OTPVerification onNavigate={handleNavigation} onVerify={verifyOTP} email={registrationData?.email} />;
      case 'donor-dashboard':
        return user ? <DonorDashboard user={user} donations={donations} onNavigate={handleNavigation} /> : null;
      case 'ngo-dashboard':
        return user ? <NGODashboard user={user} donations={donations} stockItems={stockItems} onNavigate={handleNavigation} /> : null;
      case 'create-donation':
        return <CreateDonation onNavigate={handleNavigation} onCreateDonation={addDonation} />;
      case 'post-donation':
        return user ? <PostDonation user={user} onNavigate={handleNavigation} onCreateDonation={addDonation} /> : null;
      case 'donation-history':
        return <DonationHistory donations={donations.filter(d => d.donorId === user?.id)} onNavigate={handleNavigation} onCreateDonation={addDonation} />;
      case 'donor-profile':
        return <DonorProfile user={user} onNavigate={handleNavigation} onUpdateUser={updateUser} onLogout={logoutUser} />;
      case 'ngo-donations':
        return <NGODonations onNavigate={handleNavigation} />;
      case 'ngo-stock':
        return <NGOStock onNavigate={handleNavigation} />;
      case 'machine-monitoring':
        return <MachineMonitoring onNavigate={handleNavigation} />;
      case 'ngo-volunteers':
        return <NGOVolunteers volunteers={volunteers} donations={donations} onNavigate={handleNavigation} />;
      case 'ngo-profile':
        return <NGOProfile user={user} onNavigate={handleNavigation} onUpdateUser={updateUser} onLogout={logoutUser} />;
      case 'notifications':
        return <Notifications notifications={notifications} onNavigate={handleNavigation} onMarkAsRead={markNotificationAsRead} />;
      default:
        return <WelcomeScreen onNavigate={handleNavigation} />;
    }
  };

  // Determine if bottom navigation should be shown
  const shouldShowBottomNav = user && 
    currentPage !== 'welcome' && 
    currentPage !== 'role-selection' && 
    currentPage !== 'login' && 
    currentPage !== 'registration' && 
    currentPage !== 'otp-verification';

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentPage()}
      {shouldShowBottomNav && (
        <BottomNavigation 
          currentPage={currentPage}
          userRole={user!.role}
          onNavigate={handleNavigation}
        />
      )}
      <Toaster />
    </div>
  );
}
