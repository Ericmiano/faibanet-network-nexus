
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  Shield, 
  Settings, 
  BarChart3, 
  AlertTriangle, 
  Users, 
  CreditCard,
  LogOut
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

  useEffect(() => {
    if (user) {
      fetchCustomerData();
    }
  }, [user]);

  const fetchCustomerData = async () => {
    try {
      // Fetch customer account
      const { data: account, error: accountError } = await supabase
        .from('customer_accounts')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (accountError) throw accountError;
      setCustomerAccount(account);

      // Fetch current package
      const { data: packageData, error: packageError } = await supabase
        .from('customer_packages')
        .select(`
          *,
          packages (*)
        `)
        .eq('customer_id', user?.id)
        .eq('is_active', true)
        .single();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            <Badge className={`${getStatusColor(customerAccount?.service_status)} text-white`}>
              {customerAccount?.service_status?.toUpperCase()}
            </Badge>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Number</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerAccount?.account_number}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Package</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentPackage?.packages?.name || 'No Package'}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentPackage?.packages?.speed}
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
                {customerAccount?.bandwidth_limit || 'Unlimited'} 
                {customerAccount?.bandwidth_limit && ' Mbps'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="usage" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="usage">
            <UsageMonitor customerAccountId={customerAccount?.id} />
          </TabsContent>

          <TabsContent value="devices">
            <DeviceManager customerAccountId={customerAccount?.id} />
          </TabsContent>

          <TabsContent value="packages">
            <PackageUpgrade 
              customerAccountId={customerAccount?.id}
              currentPackage={currentPackage}
              onPackageChange={fetchCustomerData}
            />
          </TabsContent>

          <TabsContent value="settings">
            <PasswordManager />
          </TabsContent>

          <TabsContent value="support">
            <SupportTickets customerId={user?.id} />
          </TabsContent>

          <TabsContent value="security">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
