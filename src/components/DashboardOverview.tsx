
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Package, 
  DollarSign, 
  AlertCircle, 
  TrendingUp,
  UserCheck,
  UserX,
  Wifi
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

export const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeConnections: 0,
    monthlyRevenue: 0,
    openTickets: 0,
    highPriorityTickets: 0
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [packageDistribution, setPackageDistribution] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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

      // Fetch high priority tickets
      const highPriorityTickets = tickets?.filter(ticket => ticket.priority === 'high') || [];

      // Fetch recent payments with customer info
      const { data: recentPaymentsData } = await supabase
        .from('payments')
        .select(`
          *,
          customers (name)
        `)
        .order('payment_date', { ascending: false })
        .limit(4);

      // Fetch package distribution
      const { data: customerPackages } = await supabase
        .from('customer_packages')
        .select(`
          *,
          packages (name, speed)
        `)
        .eq('is_active', true);

      // Process package distribution
      const packageCounts = {};
      customerPackages?.forEach(cp => {
        const packageName = cp.packages?.speed || 'Unknown';
        packageCounts[packageName] = (packageCounts[packageName] || 0) + 1;
      });

      const packageDistData = Object.entries(packageCounts).map(([name, value], index) => ({
        name,
        value,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index] || '#6b7280'
      }));

      // Calculate monthly revenue
      const monthlyRev = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Generate sample monthly revenue data (you might want to implement actual monthly tracking)
      const monthlyRevenueData = [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 48000 },
        { month: 'Apr', revenue: 61000 },
        { month: 'May', revenue: 55000 },
        { month: 'Jun', revenue: monthlyRev },
      ];

      // Process recent payments
      const processedPayments = recentPaymentsData?.map(payment => ({
        customer: payment.customers?.name || 'Unknown',
        amount: Number(payment.amount),
        package: payment.transaction_id?.includes('MP') ? 'M-Pesa' : payment.payment_method,
        time: new Date(payment.payment_date).toLocaleString()
      })) || [];

      setStats({
        totalCustomers: customers?.length || 0,
        activeConnections: activeCustomers?.length || 0,
        monthlyRevenue: monthlyRev,
        openTickets: tickets?.length || 0,
        highPriorityTickets: highPriorityTickets.length
      });

      setMonthlyRevenue(monthlyRevenueData);
      setPackageDistribution(packageDistData);
      setRecentPayments(processedPayments);

      // Sample system alerts (you can make this dynamic later)
      setSystemAlerts([
        { type: "warning", message: "Router R001 connection unstable", time: "1 hour ago" },
        { type: "success", message: `Payment received from ${processedPayments.length} customers`, time: "2 hours ago" },
        { type: "info", message: "New customer registration", time: "4 hours ago" },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Live data</span> from database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Wifi className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConnections}</div>
            <div className="flex items-center gap-2 mt-1">
              <UserCheck className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">
                {stats.totalCustomers > 0 ? ((stats.activeConnections / stats.totalCustomers) * 100).toFixed(1) : 0}% uptime
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Current month</span> total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
            <div className="flex items-center gap-2 mt-1">
              {stats.highPriorityTickets > 0 && (
                <Badge variant="outline">{stats.highPriorityTickets} High Priority</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Package Distribution</CardTitle>
            <CardDescription>Customer distribution by package</CardDescription>
          </CardHeader>
          <CardContent>
            {packageDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={packageDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {packageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-gray-500">No package data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest customer payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{payment.customer}</p>
                      <p className="text-sm text-gray-600">{payment.package}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${payment.amount}</p>
                      <p className="text-xs text-gray-500">{payment.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No recent payments</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Recent system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'error' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-orange-500' :
                    alert.type === 'success' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
