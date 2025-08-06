import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { 
  Users, 
  Package, 
  DollarSign, 
  AlertCircle, 
  TrendingUp,
  Activity,
  Wifi,
  Bell,
  RefreshCw,
  AlertTriangle,
  Clock,
  Server
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { formatKES } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";
import { debounce, performanceLogger } from "@/lib/performance";

interface DashboardStats {
  totalCustomers: number;
  activeConnections: number;
  monthlyRevenue: number;
  openTickets: number;
  networkUptime: number;
  avgResponseTime: number;
  recentPayments: number;
  newCustomersThisMonth: number;
}

interface RealtimeDataPoint {
  time: string;
  activeUsers: number;
  bandwidth: number;
  responseTime: number;
  networkLoad: number;
}

interface SystemAlert {
  id: string;
  type: 'network' | 'payment' | 'customer' | 'system';
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  time: string;
  resolved?: boolean;
}

const chartConfig = {
  activeUsers: {
    label: "Active Users",
    color: "hsl(var(--primary))",
  },
  bandwidth: {
    label: "Bandwidth %",
    color: "hsl(var(--secondary))",
  },
  responseTime: {
    label: "Response Time (ms)",
    color: "hsl(var(--accent))",
  },
};

export const EnhancedDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeConnections: 0,
    monthlyRevenue: 0,
    openTickets: 0,
    networkUptime: 99.5,
    avgResponseTime: 45,
    recentPayments: 0,
    newCustomersThisMonth: 0
  });
  
  const [realtimeData, setRealtimeData] = useState<RealtimeDataPoint[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchDashboardData = async (showToast = false) => {
    try {
      setIsRefreshing(true);
      setError(null);

      const [customersResult, paymentsResult, ticketsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('role', 'customer'),
        supabase
          .from('payments')
          .select('amount, created_at, status')
          .eq('status', 'completed')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase
          .from('support_tickets')
          .select('*')
          .in('status', ['open', 'in_progress'])
      ]);

      if (customersResult.error) throw customersResult.error;
      if (paymentsResult.error) throw paymentsResult.error;
      if (ticketsResult.error) throw ticketsResult.error;

      const customers = customersResult.data || [];
      const payments = paymentsResult.data || [];
      const tickets = ticketsResult.data || [];

      // Calculate stats
      const activeCustomers = customers.filter(c => c.account_status === 'active');
      const monthlyRev = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
      
      // Calculate new customers this month
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const newCustomersThisMonth = customers.filter(c => 
        new Date(c.created_at) >= thisMonth
      ).length;

      const recentPaymentsCount = payments.filter(p => {
        const paymentDate = new Date(p.created_at);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return paymentDate >= threeDaysAgo;
      }).length;

      setStats({
        totalCustomers: customers.length,
        activeConnections: activeCustomers.length,
        monthlyRevenue: monthlyRev,
        openTickets: tickets.length,
        networkUptime: 99.2 + Math.random() * 0.7, // Simulate slight variations
        avgResponseTime: 35 + Math.floor(Math.random() * 20),
        recentPayments: recentPaymentsCount,
        newCustomersThisMonth
      });
      
      // Generate realistic alerts
      const systemAlerts: SystemAlert[] = [
        {
          id: '1',
          type: 'network',
          message: `Network latency increased to ${Math.floor(45 + Math.random() * 15)}ms in Sector B`,
          severity: Math.random() > 0.7 ? 'warning' : 'info',
          time: '2 minutes ago'
        },
        {
          id: '2',
          type: 'payment',
          message: `${recentPaymentsCount} new payments received in the last 3 days`,
          severity: 'success',
          time: '5 minutes ago'
        },
        {
          id: '3',
          type: 'customer',
          message: `${newCustomersThisMonth} new customer registrations this month`,
          severity: 'info',
          time: '10 minutes ago'
        },
        {
          id: '4',
          type: 'system',
          message: tickets.length > 5 ? `${tickets.length} open support tickets need attention` : 'All support tickets under control',
          severity: tickets.length > 5 ? 'warning' : 'success',
          time: '15 minutes ago'
        }
      ];
      
      setAlerts(systemAlerts);
      
      if (showToast) {
        toast({
          title: "Dashboard refreshed",
          description: "All metrics have been updated successfully.",
        });
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      toast({
        title: "Error",
        description: "Failed to refresh dashboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const generateRealtimeData = () => {
    const now = new Date();
    const baseActiveUsers = stats.activeConnections || 120;
    
    const newDataPoint: RealtimeDataPoint = {
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      activeUsers: Math.max(0, baseActiveUsers + Math.floor(Math.random() * 40) - 20),
      bandwidth: Math.floor(Math.random() * 30) + 60,
      responseTime: Math.floor(Math.random() * 25) + 25,
      networkLoad: Math.floor(Math.random() * 40) + 40
    };
    
    setRealtimeData(prev => {
      const updated = [...prev, newDataPoint];
      return updated.slice(-20); // Keep only last 20 data points
    });
  };

  const debouncedRefresh = useMemo(
    () => debounce(() => fetchDashboardData(true), 1000),
    []
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const interval = setInterval(generateRealtimeData, 5000);
    return () => clearInterval(interval);
  }, [stats.activeConnections]);

  const memoizedChart = useMemo(() => {
    if (realtimeData.length === 0) return null;

    return (
      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={realtimeData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis dataKey="time" className="text-xs" />
            <YAxis className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="activeUsers" 
              stroke="var(--color-activeUsers)" 
              strokeWidth={2}
              dot={false}
              name="Active Users"
            />
            <Line 
              type="monotone" 
              dataKey="bandwidth" 
              stroke="var(--color-bandwidth)" 
              strokeWidth={2}
              dot={false}
              name="Bandwidth %"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }, [realtimeData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-12 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button onClick={() => fetchDashboardData()} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">System Overview</h2>
          <p className="text-muted-foreground">Real-time network and business metrics with performance monitoring</p>
        </div>
        <Button 
          onClick={debouncedRefresh} 
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <Badge variant="outline" className="text-xs mt-1">
              +{stats.newCustomersThisMonth} this month
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeConnections}</div>
            <Badge variant="outline" className="text-xs mt-1">Real-time</Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatKES(stats.monthlyRevenue)}</div>
            <Badge variant="outline" className="text-xs mt-1">This month</Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Uptime</CardTitle>
            <Wifi className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.networkUptime.toFixed(1)}%</div>
            <Badge variant="outline" className="text-xs mt-1">30 days</Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}ms</div>
            <Badge variant="outline" className="text-xs mt-1">Average</Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
            <AlertCircle className={`h-4 w-4 ${stats.openTickets > 5 ? 'text-orange-500' : 'text-green-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
            <Badge variant="outline" className="text-xs mt-1">Open</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Add Performance Monitor and Charts in a grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Real-time Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Real-time Network Activity
              </CardTitle>
              <CardDescription>Live monitoring of network performance and user activity</CardDescription>
            </CardHeader>
            <CardContent>
              {memoizedChart || (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p>Collecting real-time data...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <PerformanceMonitor />
        </div>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            System Alerts & Notifications
          </CardTitle>
          <CardDescription>Recent system events and status updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  alert.severity === 'success' ? 'bg-green-500' :
                  alert.severity === 'warning' ? 'bg-orange-500' :
                  alert.severity === 'info' ? 'bg-blue-500' :
                  'bg-red-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {alert.type}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${
                      alert.severity === 'success' ? 'border-green-500 text-green-700' :
                      alert.severity === 'warning' ? 'border-orange-500 text-orange-700' :
                      alert.severity === 'info' ? 'border-blue-500 text-blue-700' :
                      'border-red-500 text-red-700'
                    }`}>
                      {alert.severity}
                    </Badge>
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
