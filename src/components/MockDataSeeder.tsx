
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Database, Users, Package, CreditCard, MessageSquare, BarChart3 } from 'lucide-react';

export const MockDataSeeder = () => {
  const { profile } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [progress, setProgress] = useState(0);

  const seedMockData = async () => {
    if (profile?.role !== 'admin') {
      toast.error('Only admins can seed mock data');
      return;
    }

    setSeeding(true);
    setProgress(0);

    try {
      // Create test users with profiles
      const testUsers = [
        { email: 'john.customer@example.com', password: 'password123', full_name: 'John Customer', role: 'customer' },
        { email: 'jane.admin@example.com', password: 'password123', full_name: 'Jane Admin', role: 'admin' },
        { email: 'mike.support@example.com', password: 'password123', full_name: 'Mike Support', role: 'support' },
        { email: 'alice.customer@example.com', password: 'password123', full_name: 'Alice Customer', role: 'customer' },
        { email: 'bob.customer@example.com', password: 'password123', full_name: 'Bob Customer', role: 'customer' },
      ];

      for (let i = 0; i < testUsers.length; i++) {
        const user = testUsers[i];
        
        // Sign up user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.full_name
          }
        });

        if (authError) {
          console.error(`Failed to create user ${user.email}:`, authError);
          continue;
        }

        // Update profile role
        if (authData.user) {
          await supabase
            .from('profiles')
            .update({ role: user.role })
            .eq('id', authData.user.id);
        }

        setProgress(((i + 1) / testUsers.length) * 30);
      }

      // Fetch existing customer accounts to seed data for
      const { data: accounts } = await supabase
        .from('customer_accounts')
        .select('*')
        .limit(5);

      if (accounts && accounts.length > 0) {
        // Seed data usage for accounts
        const usageData = [];
        const today = new Date();
        
        for (const account of accounts) {
          for (let i = 30; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            usageData.push({
              customer_account_id: account.id,
              date: date.toISOString().split('T')[0],
              download_mb: Math.floor(Math.random() * 5000) + 1000,
              upload_mb: Math.floor(Math.random() * 1000) + 200,
              total_mb: 0
            });
          }
        }

        // Calculate total_mb
        usageData.forEach(record => {
          record.total_mb = record.download_mb + record.upload_mb;
        });

        const { error: usageError } = await supabase
          .from('data_usage')
          .upsert(usageData, { onConflict: 'customer_account_id,date' });

        if (usageError) {
          console.error('Error seeding usage data:', usageError);
        }

        setProgress(60);

        // Seed support tickets
        const ticketTitles = [
          'Internet connection slow',
          'Cannot access email',
          'WiFi password not working',
          'Billing inquiry',
          'Upgrade package request',
          'Technical support needed',
          'Connection dropping frequently',
          'Cannot stream videos',
        ];

        const supportTickets = accounts.slice(0, 3).map((account, index) => ({
          customer_id: account.user_id,
          title: ticketTitles[index % ticketTitles.length],
          description: `Sample support ticket for testing purposes. Customer needs assistance with ${ticketTitles[index % ticketTitles.length].toLowerCase()}.`,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          status: ['open', 'in_progress', 'resolved'][Math.floor(Math.random() * 3)]
        }));

        const { error: ticketsError } = await supabase
          .from('support_tickets')
          .insert(supportTickets);

        if (ticketsError) {
          console.error('Error seeding support tickets:', ticketsError);
        }

        setProgress(80);

        // Seed some payment records
        const payments = accounts.slice(0, 3).map(account => ({
          customer_id: account.user_id,
          amount: [2500, 5000, 8500][Math.floor(Math.random() * 3)],
          payment_method: 'mpesa',
          payment_source: 'mpesa',
          transaction_id: `MP${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          phone_number: '+254700000000',
          status: 'completed',
          reconciliation_status: 'matched'
        }));

        const { error: paymentsError } = await supabase
          .from('payments')
          .insert(payments);

        if (paymentsError) {
          console.error('Error seeding payments:', paymentsError);
        }

        setProgress(100);
      }

      toast.success('Mock data seeded successfully! You can now test the system with sample data.');
    } catch (error) {
      console.error('Error seeding mock data:', error);
      toast.error('Failed to seed mock data');
    } finally {
      setSeeding(false);
      setProgress(0);
    }
  };

  if (profile?.role !== 'admin') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Mock Data Seeder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Seed the database with mock data for testing purposes. This will create sample users, 
          data usage records, support tickets, and payment records.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-sm font-medium">Test Users</div>
            <div className="text-xs text-muted-foreground">5 sample users</div>
          </div>
          <div className="text-center">
            <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-sm font-medium">Usage Data</div>
            <div className="text-xs text-muted-foreground">30 days history</div>
          </div>
          <div className="text-center">
            <MessageSquare className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-sm font-medium">Support Tickets</div>
            <div className="text-xs text-muted-foreground">Sample tickets</div>
          </div>
          <div className="text-center">
            <CreditCard className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-sm font-medium">Payments</div>
            <div className="text-xs text-muted-foreground">Sample transactions</div>
          </div>
        </div>

        {seeding && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Seeding progress...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        <Button 
          onClick={seedMockData} 
          disabled={seeding}
          className="w-full"
        >
          {seeding ? 'Seeding Data...' : 'Seed Mock Data'}
        </Button>

        <div className="text-xs text-muted-foreground">
          <strong>Test credentials:</strong><br />
          Admin: jane.admin@example.com / password123<br />
          Customer: john.customer@example.com / password123<br />
          Support: mike.support@example.com / password123
        </div>
      </CardContent>
    </Card>
  );
};
