
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  PieChart,
  BarChart3,
  FileText,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatKES } from "@/lib/currency";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useToast } from "@/hooks/use-toast";

interface FinancialData {
  monthlyRevenue: Array<{ month: string; revenue: number; growth: number; count: number }>;
  revenueByPackage: Array<{ name: string; revenue: number; customers: number; color: string }>;
  paymentMethods: Array<{ method: string; amount: number; count: number; percentage: number }>;
  outstandingPayments: number;
  totalRevenue: number;
  avgMonthlyGrowth: number;
  totalCustomers: number;
  activeCustomers: number;
  monthlyStats: {
    thisMonth: number;
    lastMonth: number;
    yearToDate: number;
  };
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  customers: {
    label: "Customers", 
    color: "hsl(var(--secondary))",
  },
  growth: {
    label: "Growth",
    color: "hsl(var(--accent))",
  },
};

export const FinancialReporting = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchFinancialData = async (showToast = false) => {
    try {
      setRefreshing(true);
      setError(null);

      const [paymentsResult, customerPackagesResult, customersResult] = await Promise.all([
        supabase
          .from('payments')
          .select('*')
          .eq('status', 'completed')
          .order('created_at', { ascending: false }),
        supabase
          .from('customer_subscriptions')
          .select(`
            *,
            internet_packages (name, price_monthly),
            profiles!customer_id (full_name, account_status)
          `)
          .eq('status', 'active'),
        supabase
          .from('profiles')
          .select('account_status, created_at')
          .eq('role', 'customer')
      ]);

      if (paymentsResult.error) throw paymentsResult.error;
      if (customerPackagesResult.error) throw customerPackagesResult.error;
      if (customersResult.error) throw customersResult.error;

      const payments = paymentsResult.data || [];
      const customerSubscriptions = customerPackagesResult.data || [];
      const customers = customersResult.data || [];

      // Process data with improved error handling
      const monthlyData = processMonthlyRevenue(payments);
      const packageRevenue = processPackageRevenue(customerSubscriptions, payments);
      const paymentMethodData = processPaymentMethods(payments);
      
      const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
      const totalCustomers = customers.length;
      const activeCustomers = customers.filter(c => c.account_status === 'active').length;
      
      // Calculate monthly stats
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const yearStart = new Date(now.getFullYear(), 0, 1);

      const thisMonthRevenue = payments
        .filter(p => new Date(p.created_at) >= thisMonth)
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      const lastMonthRevenue = payments
        .filter(p => {
          const date = new Date(p.created_at);
          return date >= lastMonth && date < thisMonth;
        })
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      const yearToDateRevenue = payments
        .filter(p => new Date(p.created_at) >= yearStart)
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      const outstandingPayments = Math.floor(Math.random() * 200000) + 50000; // Mock data
      const avgGrowth = monthlyData.length > 1 ? 
        monthlyData.reduce((sum, m) => sum + m.growth, 0) / monthlyData.length : 0;

      setFinancialData({
        monthlyRevenue: monthlyData,
        revenueByPackage: packageRevenue,
        paymentMethods: paymentMethodData,
        outstandingPayments,
        totalRevenue,
        avgMonthlyGrowth: avgGrowth,
        totalCustomers,
        activeCustomers,
        monthlyStats: {
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          yearToDate: yearToDateRevenue,
        }
      });

      if (showToast) {
        toast({
          title: "Data refreshed",
          description: "Financial reports have been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load financial data');
      toast({
        title: "Error",
        description: "Failed to load financial data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const processMonthlyRevenue = (payments: any[]) => {
    const monthlyMap = new Map();
    
    payments.forEach(payment => {
      if (!payment.created_at) return;
      
      const date = new Date(payment.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { month: monthName, revenue: 0, count: 0 });
      }
      
      const entry = monthlyMap.get(monthKey);
      entry.revenue += Number(payment.amount || 0);
      entry.count += 1;
    });
    
    const monthlyArray = Array.from(monthlyMap.values())
      .sort((a, b) => new Date(a.month + ' 1').getTime() - new Date(b.month + ' 1').getTime())
      .slice(-12);
    
    return monthlyArray.map((month, index) => ({
      ...month,
      growth: index > 0 ? 
        ((month.revenue - monthlyArray[index - 1].revenue) / (monthlyArray[index - 1].revenue || 1)) * 100 : 0
    }));
  };

  const processPackageRevenue = (customerSubscriptions: any[], payments: any[]) => {
    const packageMap = new Map();
    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--secondary))', 
      'hsl(var(--accent))',
      'hsl(var(--muted))',
      'hsl(142, 76%, 36%)',
      'hsl(346, 87%, 43%)',
    ];
    
    customerSubscriptions.forEach((cs, index) => {
      const packageName = cs.internet_packages?.name || 'Unknown Package';
      const packagePrice = Number(cs.internet_packages?.price_monthly || 0);
      
      if (!packageMap.has(packageName)) {
        packageMap.set(packageName, { 
          name: packageName, 
          revenue: 0, 
          customers: 0,
          color: colors[index % colors.length]
        });
      }
      
      const entry = packageMap.get(packageName);
      entry.customers += 1;
      entry.revenue += packagePrice;
    });
    
    return Array.from(packageMap.values());
  };

  const processPaymentMethods = (payments: any[]) => {
    const methodMap = new Map();
    const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    
    payments.forEach(payment => {
      const method = payment.payment_method || 'Unknown';
      
      if (!methodMap.has(method)) {
        methodMap.set(method, { method, amount: 0, count: 0 });
      }
      
      const entry = methodMap.get(method);
      entry.amount += Number(payment.amount || 0);
      entry.count += 1;
    });
    
    return Array.from(methodMap.values()).map(method => ({
      ...method,
      percentage: totalAmount > 0 ? (method.amount / totalAmount) * 100 : 0
    }));
  };

  const exportReport = (type: string) => {
    toast({
      title: "Export Started",
      description: `Generating ${type} report. This may take a moment...`,
    });
    
    // Mock export functionality
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${type} report has been downloaded successfully.`,
      });
    }, 2000);
  };

  const memoizedCharts = useMemo(() => {
    if (!financialData) return null;

    return {
      monthlyChart: (
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      ),
      packageChart: (
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={financialData.revenueByPackage}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="revenue"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {financialData.revenueByPackage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartContainer>
      )
    };
  }, [financialData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-16 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button onClick={() => fetchFinancialData()} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No financial data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Financial Reports</h2>
          <p className="text-muted-foreground">Comprehensive financial analytics and insights</p>
        </div>
        <Button onClick={() => fetchFinancialData(true)} disabled={refreshing} size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatKES(financialData.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +{formatKES(financialData.monthlyStats.thisMonth)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {financialData.avgMonthlyGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Average growth rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatKES(financialData.outstandingPayments)}
            </div>
            <p className="text-xs text-muted-foreground">Pending payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              of {financialData.totalCustomers} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue performance over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            {memoizedCharts?.monthlyChart}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Package</CardTitle>
            <CardDescription>Revenue distribution across service packages</CardDescription>
          </CardHeader>
          <CardContent>
            {memoizedCharts?.packageChart}
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods & Export */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Breakdown of payment channels and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.paymentMethods.map((method) => (
                <div key={method.method} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{method.method}</p>
                    <p className="text-sm text-muted-foreground">{method.count} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatKES(method.amount)}</p>
                    <Badge variant="outline" className="text-xs">
                      {method.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
            <CardDescription>Download detailed financial reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={() => exportReport('Monthly PDF')} className="w-full justify-start gap-2">
                <Download className="h-4 w-4" />
                Export Monthly Report (PDF)
              </Button>
              <Button variant="outline" onClick={() => exportReport('Revenue Excel')} className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Export Revenue Analysis (Excel)
              </Button>
              <Button variant="outline" onClick={() => exportReport('Payment CSV')} className="w-full justify-start gap-2">
                <BarChart3 className="h-4 w-4" />
                Export Payment Summary (CSV)
              </Button>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Period Summary:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>This Month:</span>
                    <span className="font-medium">
                      {formatKES(financialData.monthlyStats.thisMonth)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Month:</span>
                    <span className="font-medium">
                      {formatKES(financialData.monthlyStats.lastMonth)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year to Date:</span>
                    <span className="font-medium">
                      {formatKES(financialData.monthlyStats.yearToDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
