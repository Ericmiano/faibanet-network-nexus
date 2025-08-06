import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Users, Package, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const MockDataSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResults, setSeedResults] = useState({
    profiles: 0,
    packages: 0,
    subscriptions: 0,
    payments: 0,
    tickets: 0,
    usage: 0
  });
  const { toast } = useToast();

  const generateMockProfiles = () => {
    const names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Sarah Wilson', 'David Brown'];
    const locations = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'];
    
    return Array.from({ length: 5 }, (_, i) => ({
      full_name: names[i],
      email: `customer${i + 1}@example.com`,
      phone: `0712${String(i + 1).padStart(6, '0')}`,
      address: `${i + 1} Main St, ${locations[i]}`,
      role: 'customer' as const,
      account_status: 'active' as const,
      email_verified: true,
      phone_verified: true,
      onboarding_completed: true
    }));
  };

  const generateMockPackages = () => {
    return [
      {
        name: 'Basic Plan',
        description: 'Perfect for light internet users',
        speed_mbps: 10,
        price_monthly: 2500,
        is_active: true,
        features: ['10 Mbps speed', 'Unlimited data', '24/7 support']
      },
      {
        name: 'Standard Plan',
        description: 'Great for families and small businesses',
        speed_mbps: 25,
        price_monthly: 4500,
        is_active: true,
        features: ['25 Mbps speed', 'Unlimited data', 'Priority support', 'Free installation']
      },
      {
        name: 'Premium Plan',
        description: 'Ultimate performance for power users',
        speed_mbps: 50,
        price_monthly: 7500,
        is_active: true,
        features: ['50 Mbps speed', 'Unlimited data', 'VIP support', 'Free installation', 'Wi-Fi equipment']
      }
    ];
  };

  const seedDatabase = async () => {
    setIsSeeding(true);
    setSeedResults({ profiles: 0, packages: 0, subscriptions: 0, payments: 0, tickets: 0, usage: 0 });

    try {
      // Check existing data
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .limit(1);

      if (existingProfiles && existingProfiles.length > 0) {
        toast({
          title: "Data Already Exists",
          description: "Mock data has already been seeded. Database contains customer profiles.",
          variant: "default"
        });
        return;
      }

      // 1. Seed Profiles
      const mockProfiles = generateMockProfiles();
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .insert(mockProfiles)
        .select();

      if (profilesError) throw profilesError;
      setSeedResults(prev => ({ ...prev, profiles: profiles?.length || 0 }));

      // 2. Seed Internet Packages
      const mockPackages = generateMockPackages();
      const { data: packages, error: packagesError } = await supabase
        .from('internet_packages')
        .insert(mockPackages)
        .select();

      if (packagesError) throw packagesError;
      setSeedResults(prev => ({ ...prev, packages: packages?.length || 0 }));

      // 3. Create Customer Subscriptions
      if (profiles && packages) {
        const subscriptions = profiles.slice(0, 3).map((profile, index) => ({
          customer_id: profile.id,
          package_id: packages[index % packages.length].id,
          status: 'active' as const,
          start_date: new Date().toISOString(),
          auto_renewal: true
        }));

        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('customer_subscriptions')
          .insert(subscriptions)
          .select();

        if (subscriptionsError) throw subscriptionsError;
        setSeedResults(prev => ({ ...prev, subscriptions: subscriptionsData?.length || 0 }));

        // 4. Generate Mock Payments
        const payments = profiles.slice(0, 3).map((profile, index) => ({
          customer_id: profile.id,
          amount: packages[index % packages.length].price_monthly,
          payment_method: ['M-Pesa', 'Bank Transfer', 'Credit Card'][index % 3],
          status: 'completed' as const,
          currency: 'KES'
        }));

        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .insert(payments)
          .select();

        if (paymentsError) throw paymentsError;
        setSeedResults(prev => ({ ...prev, payments: paymentsData?.length || 0 }));

        // 5. Generate Support Tickets
        const tickets = profiles.slice(0, 2).map((profile) => ({
          customer_id: profile.id,
          subject: `Connection Issue - ${profile.full_name}`,
          description: 'Experiencing intermittent connectivity issues in my area.',
          priority: 'medium' as const,
          status: 'open' as const,
          category: 'technical_support' as const,
          ticket_number: `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        }));

        const { data: ticketsData, error: ticketsError } = await supabase
          .from('support_tickets')
          .insert(tickets)
          .select();

        if (ticketsError) throw ticketsError;
        setSeedResults(prev => ({ ...prev, tickets: ticketsData?.length || 0 }));

        // 6. Generate Usage Metrics
        const usageMetrics = profiles.slice(0, 3).map((profile) => ({
          customer_id: profile.id,
          date: new Date().toISOString().split('T')[0],
          download_mb: Math.floor(Math.random() * 5000) + 1000,
          upload_mb: Math.floor(Math.random() * 1000) + 200,
          session_duration_minutes: Math.floor(Math.random() * 480) + 60,
          average_speed_mbps: Math.floor(Math.random() * 30) + 10,
          peak_speed_mbps: Math.floor(Math.random() * 50) + 20
        }));

        const { data: usageData, error: usageError } = await supabase
          .from('usage_metrics')
          .insert(usageMetrics)
          .select();

        if (usageError) throw usageError;
        setSeedResults(prev => ({ ...prev, usage: usageData?.length || 0 }));
      }

      toast({
        title: "Database Seeded Successfully!",
        description: "All mock data has been created successfully.",
      });

    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        title: "Seeding Failed",
        description: error instanceof Error ? error.message : "Failed to seed database",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const totalRecords = Object.values(seedResults).reduce((sum, count) => sum + count, 0);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Mock Data Seeder
        </CardTitle>
        <CardDescription>
          Populate your database with sample data for testing and development
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{seedResults.profiles}</div>
            <div className="text-sm text-muted-foreground">Customer Profiles</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{seedResults.packages}</div>
            <div className="text-sm text-muted-foreground">Internet Packages</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{seedResults.subscriptions}</div>
            <div className="text-sm text-muted-foreground">Subscriptions</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <AlertCircle className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{seedResults.payments}</div>
            <div className="text-sm text-muted-foreground">Payments</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <AlertCircle className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{seedResults.tickets}</div>
            <div className="text-sm text-muted-foreground">Support Tickets</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Database className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{seedResults.usage}</div>
            <div className="text-sm text-muted-foreground">Usage Metrics</div>
          </div>
        </div>

        {totalRecords > 0 && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="font-semibold text-green-800 dark:text-green-200">
              Successfully created {totalRecords} records
            </div>
            <div className="text-sm text-green-600 dark:text-green-300">
              Your database is now populated with sample data
            </div>
          </div>
        )}

        <Button 
          onClick={seedDatabase} 
          disabled={isSeeding}
          className="w-full"
          size="lg"
        >
          {isSeeding ? (
            <>
              <Database className="h-4 w-4 mr-2 animate-spin" />
              Seeding Database...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Seed Database with Mock Data
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          This will create sample customers, packages, subscriptions, payments, tickets, and usage data.
          <br />
          Safe to run multiple times - will check for existing data first.
        </div>
      </CardContent>
    </Card>
  );
};