# SAVOR - Food Donation App

A React TypeScript mobile application for connecting food donors with NGOs to reduce food waste and help feed those in need. Share food, spread hope.

## Features

### **Donor Features**
- **Post Donations**: Create food donations with photos, categories, and details
- **Track History**: Monitor donation status from submission to delivery  
- **Impact Metrics**: See meals provided and food donated statistics
- **NGO Selection**: Choose from nearby verified NGOs
- **Smart Tips**: Get helpful donation guidelines and best practices

### **NGO Features** 
- **Donation Management**: Review and approve incoming food donations
- **IoT Machine Monitoring**: Real-time tracking of food dispenser machines
- **Stock Management**: Inventory tracking with low-stock alerts
- **Volunteer Coordination**: Manage team assignments and schedules
- **Analytics Dashboard**: Track distribution impact and trends

### **Mobile-First Design**
- **Bottom Navigation**: Role-specific navigation for donors and NGOs
- **Real-time Updates**: Live status tracking and notifications
- **Photo Upload**: Multi-image support for food verification
- **Responsive UI**: Optimized for mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "Food Donation Donor App"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
├── components/           # React components
│   ├── ui/              # Reusable UI components (Radix UI based)
│   ├── figma/           # Figma-specific components
│   └── *.tsx            # Feature components
├── styles/              # Global styles
├── guidelines/          # Project guidelines
├── App.tsx              # Main application component
├── main.tsx            # Application entry point
└── index.html          # HTML template
```

## Demo Accounts

For testing purposes, you can use these demo accounts:

**Donor Account:**
- Email: john@demo.com
- Password: password123

**NGO Account:**  
- Email: contact@hopefoundation.org
- Password: password123

## App Navigation

### **Donor Interface**
- 🏠 **Home**: Dashboard with impact metrics and quick actions
- ➕ **Donate**: Post new food donations with photos
- 📋 **History**: Track all donation submissions and status
- 🔔 **Updates**: Receive NGO responses and delivery notifications  
- 👤 **Profile**: Manage account settings and preferences

### **NGO Interface**
- 🏠 **Home**: Dashboard with pending approvals and alerts
- 📦 **Donations**: Review and approve donor submissions
- 📊 **Stock**: Manage inventory and IoT machine monitoring
- 🔔 **Messages**: Communication hub for donor coordination
- ⚙️ **Settings**: Organization profile and team management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
