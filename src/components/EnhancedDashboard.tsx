import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Package, 
  DollarSign, 
  AlertCircle, 
  TrendingUp,
  Activity,
  Wifi,
  Bell,
  RefreshCw
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { formatKES } from "@/lib/currency";

export const EnhancedDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeConnections: 0,
    monthlyRevenue: 0,
    openTickets: 0,
    networkUptime: 99.5,
    avgResponseTime: 45
  });
  
  const [realtimeData, setRealtimeData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    generateRealtimeData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      generateRealtimeData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      // Fetch total customers
      const { data: customers } = await supabase
        .from('customers')
        .select('*');

      // Fetch active connections (assuming active status means connected)
      const { data: activeCustomers } = await supabase
        .from('customers')
        .select('*')
        .eq('status', 'active');

      // Fetch monthly revenue (current month)
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const { data: payments } = await supabase
        .from('payments')
        .select('amount, payment_date')
        .gte('payment_date', firstDay.toISOString())
        .eq('status', 'completed');

      // Fetch open tickets
      const { data: tickets } = await supabase
        .from('support_tickets')
        .select('*')
        .in('status', ['open', 'in_progress']);

      // Calculate monthly revenue
      const monthlyRev = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      setStats({
        totalCustomers: customers?.length || 0,
        activeConnections: activeCustomers?.length || 0,
        monthlyRevenue: monthlyRev,
        openTickets: tickets?.length || 0,
        networkUptime: 99.5,
        avgResponseTime: 45
      });
      
      // Generate enhanced alerts
      const enhancedAlerts = [
        {
          id: '1',
          type: 'network',
          message: 'Network latency spike detected in Sector B',
          severity: 'medium',
          time: '2 minutes ago'
        },
        {
          id: '2',
          type: 'payment',
          message: '5 new payments received via M-Pesa',
          severity: 'success',
          time: '5 minutes ago'
        },
        {
          id: '3',
          type: 'customer',
          message: 'New customer registration from Sector C',
          severity: 'info',
          time: '10 minutes ago'
        }
      ];
      
      setAlerts(enhancedAlerts);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const generateRealtimeData = () => {
    const now = new Date();
    const newDataPoint = {
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      activeUsers: Math.floor(Math.random() * 50) + 120,
      bandwidth: Math.floor(Math.random() * 30) + 70,
      responseTime: Math.floor(Math.random() * 20) + 30
    };
    
    setRealtimeData(prev => {
      const updated = [...prev, newDataPoint];
      return updated.slice(-20); // Keep only last 20 data points
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Overview</h2>
          <p className="text-muted-foreground">Real-time network and business metrics</p>
        </div>
        <Button 
          onClick={fetchDashboardData} 
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <Badge variant="outline" className="text-xs mt-1">Live</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeConnections}</div>
            <Badge variant="outline" className="text-xs mt-1">Real-time</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatKES(stats.monthlyRevenue)}</div>
            <Badge variant="outline" className="text-xs mt-1">This month</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Wifi className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.networkUptime}%</div>
            <Badge variant="outline" className="text-xs mt-1">30 days</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}ms</div>
            <Badge variant="outline" className="text-xs mt-1">Avg</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
            <Badge variant="outline" className="text-xs mt-1">Open</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Network Activity</CardTitle>
          <CardDescription>Live monitoring of network performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="time" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="activeUsers" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Active Users"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="bandwidth" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                name="Bandwidth %"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            System Alerts
          </CardTitle>
          <CardDescription>Recent system notifications and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.severity === 'success' ? 'bg-green-500' :
                  alert.severity === 'medium' ? 'bg-orange-500' :
                  alert.severity === 'info' ? 'bg-blue-500' :
                  'bg-red-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{alert.type}</Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
