
import React, { useState } from 'react';
import { DashboardOverview } from '@/components/DashboardOverview';
import { CustomerManagement } from '@/components/CustomerManagement';
import { AdminSecurityDashboard } from '@/components/admin/AdminSecurityDashboard';
import { UserRoleManager } from '@/components/admin/UserRoleManager';
import { MockDataSeeder } from '@/components/MockDataSeeder';
import { CollapsibleSidebar } from '@/components/ui/collapsible-sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  Users, 
  Shield, 
  Settings, 
  Crown,
  Database,
  LogOut,
  Wifi
} from 'lucide-react';

const Index = () => {
  const { signOut, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const sidebarItems = [
    {
      title: 'Overview',
      icon: BarChart3,
      onClick: () => setActiveTab('overview')
    },
    {
      title: 'Customers',
      icon: Users,
      onClick: () => setActiveTab('customers')
    },
    {
      title: 'Security',
      icon: Shield,
      onClick: () => setActiveTab('security')
    },
    {
      title: 'User Roles',
      icon: Crown,
      onClick: () => setActiveTab('roles')
    },
    {
      title: 'Mock Data',
      icon: Database,
      onClick: () => setActiveTab('mockdata')
    },
    {
      title: 'Settings',
      icon: Settings,
      onClick: () => setActiveTab('settings')
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'customers':
        return <CustomerManagement />;
      case 'security':
        return <AdminSecurityDashboard />;
      case 'roles':
        return <UserRoleManager />;
      case 'mockdata':
        return <MockDataSeeder />;
      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">System Settings</h3>
            <p className="text-muted-foreground">Advanced system configuration options coming soon.</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Collapsible Sidebar */}
      <CollapsibleSidebar 
        items={sidebarItems}
        onItemClick={(item) => item.onClick?.()}
        defaultCollapsed={false}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Crown className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Faibanet Admin Portal</h1>
                  <p className="text-muted-foreground">System Administration Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {profile?.full_name || 'Admin'}
              </span>
              <ThemeToggle />
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
