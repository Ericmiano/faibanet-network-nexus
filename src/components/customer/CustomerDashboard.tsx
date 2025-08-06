
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CollapsibleSidebar } from '@/components/ui/collapsible-sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  Shield, 
  Settings, 
  BarChart3, 
  Users, 
  CreditCard,
  LogOut,
  HeadphonesIcon,
  Package
} from 'lucide-react';
import { UsageMonitor } from './UsageMonitor';
import { DeviceManager } from './DeviceManager';
import { PackageUpgrade } from './PackageUpgrade';
import { PasswordManager } from './PasswordManager';
import { SupportTickets } from './SupportTickets';
import { toast } from 'sonner';

export const CustomerDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [customerAccount, setCustomerAccount] = useState<any>(null);
  const [currentPackage, setCurrentPackage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('usage');

  useEffect(() => {
    if (user) {
      fetchCustomerData();
    }
  }, [user]);

  const fetchCustomerData = async () => {
    try {
      // Fetch customer profile
      const { data: customerData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;
      setCustomerAccount(customerData);

      // Fetch current package
      const { data: packageData, error: packageError } = await supabase
        .from('customer_subscriptions')
        .select(`
          *,
          internet_packages (*)
        `)
        .eq('customer_id', user?.id)
        .eq('status', 'active')
        .maybeSingle();

      if (!packageError) {
        setCurrentPackage(packageData);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast.error('Failed to load account information');
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    {
      title: 'Usage Monitor',
      icon: BarChart3,
      onClick: () => setActiveTab('usage')
    },
    {
      title: 'Device Manager',
      icon: Users,
      onClick: () => setActiveTab('devices')
    },
    {
      title: 'Packages',
      icon: Package,
      onClick: () => setActiveTab('packages')
    },
    {
      title: 'Settings',
      icon: Settings,
      onClick: () => setActiveTab('settings')
    },
    {
      title: 'Support',
      icon: HeadphonesIcon,
      onClick: () => setActiveTab('support')
    },
    {
      title: 'Security',
      icon: Shield,
      onClick: () => setActiveTab('security')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'suspended': return 'bg-yellow-500';
      case 'terminated': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'usage':
        return <UsageMonitor customerAccountId={customerAccount?.id} />;
      case 'devices':
        return <DeviceManager customerAccountId={customerAccount?.id} />;
      case 'packages':
        return (
          <PackageUpgrade 
            customerAccountId={customerAccount?.id}
            currentPackage={currentPackage}
            onPackageChange={fetchCustomerData}
          />
        );
      case 'settings':
        return <PasswordManager />;
      case 'support':
        return <SupportTickets customerId={user?.id} />;
      case 'security':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Login Notifications</h3>
                    <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <UsageMonitor customerAccountId={customerAccount?.id} />;
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
                <Wifi className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Faibanet Customer Portal</h1>
                  <p className="text-muted-foreground">Welcome, {profile?.full_name || user?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`${getStatusColor(customerAccount?.account_status)} text-white`}>
                {customerAccount?.account_status?.toUpperCase()}
              </Badge>
              <ThemeToggle />
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Account Overview */}
        <div className="p-6 border-b bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Number</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customerAccount?.id?.slice(0, 8) || 'N/A'}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Package</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentPackage?.internet_packages?.name || 'No Package'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentPackage?.internet_packages?.speed_mbps ? `${currentPackage.internet_packages.speed_mbps} Mbps` : ''}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bandwidth Limit</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Unlimited
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
