
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  PieChart,
  BarChart3,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatKES } from "@/lib/currency";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface FinancialData {
  monthlyRevenue: Array<{ month: string; revenue: number; growth: number }>;
  revenueByPackage: Array<{ name: string; revenue: number; customers: number }>;
  paymentMethods: Array<{ method: string; amount: number; count: number }>;
  outstandingPayments: number;
  totalRevenue: number;
  avgMonthlyGrowth: number;
}

export const FinancialReporting = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('12months');

  useEffect(() => {
    fetchFinancialData();
  }, [selectedPeriod]);

  const fetchFinancialData = async () => {
    try {
      // Fetch payments data
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'completed');

      // Fetch customers and packages data
      const { data: customerPackages } = await supabase
        .from('customer_packages')
        .select(`
          *,
          packages (name, price),
          customers (name)
        `)
        .eq('is_active', true);

      if (payments && customerPackages) {
        // Process monthly revenue data
        const monthlyData = processMonthlyRevenue(payments);
        
        // Process revenue by package
        const packageRevenue = processPackageRevenue(customerPackages, payments);
        
        // Process payment methods
        const paymentMethodData = processPaymentMethods(payments);
        
        // Calculate totals
        const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        
        // Calculate outstanding payments (mock data)
        const outstandingPayments = 150000; // This would be calculated from unpaid invoices
        
        // Calculate average growth
        const avgGrowth = monthlyData.length > 1 ? 
          monthlyData.reduce((sum, m) => sum + m.growth, 0) / monthlyData.length : 0;

        setFinancialData({
          monthlyRevenue: monthlyData,
          revenueByPackage: packageRevenue,
          paymentMethods: paymentMethodData,
          outstandingPayments,
          totalRevenue,
          avgMonthlyGrowth: avgGrowth
        });
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    }
  };

  const processMonthlyRevenue = (payments: any[]) => {
    const monthlyMap = new Map();
    
    payments.forEach(payment => {
      const date = new Date(payment.payment_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { month: monthName, revenue: 0 });
      }
      
      monthlyMap.get(monthKey).revenue += Number(payment.amount);
    });
    
    const monthlyArray = Array.from(monthlyMap.values())
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-12); // Last 12 months
    
    // Calculate growth rates
    return monthlyArray.map((month, index) => ({
      ...month,
      growth: index > 0 ? 
        ((month.revenue - monthlyArray[index - 1].revenue) / monthlyArray[index - 1].revenue) * 100 : 0
    }));
  };

  const processPackageRevenue = (customerPackages: any[], payments: any[]) => {
    const packageMap = new Map();
    
    customerPackages.forEach(cp => {
      const packageName = cp.packages?.name || 'Unknown';
      const packagePrice = Number(cp.packages?.price || 0);
      
      if (!packageMap.has(packageName)) {
        packageMap.set(packageName, { name: packageName, revenue: 0, customers: 0 });
      }
      
      packageMap.get(packageName).customers += 1;
      packageMap.get(packageName).revenue += packagePrice;
    });
    
    return Array.from(packageMap.values());
  };

  const processPaymentMethods = (payments: any[]) => {
    const methodMap = new Map();
    
    payments.forEach(payment => {
      const method = payment.payment_method || 'Unknown';
      
      if (!methodMap.has(method)) {
        methodMap.set(method, { method, amount: 0, count: 0 });
      }
      
      methodMap.get(method).amount += Number(payment.amount);
      methodMap.get(method).count += 1;
    });
    
    return Array.from(methodMap.values());
  };

  const exportFinancialReport = () => {
    // This would generate and download a financial report
    console.log('Exporting financial report...');
  };

  if (!financialData) {
    return <div>Loading financial data...</div>;
  }

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatKES(financialData.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">All-time earnings</p>
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
            <CardTitle className="text-sm font-medium">Revenue Sources</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.revenueByPackage.length}</div>
            <p className="text-xs text-muted-foreground">Active packages</p>
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financialData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  formatter={(value) => [formatKES(Number(value)), 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Package</CardTitle>
            <CardDescription>Revenue distribution across packages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatKES(Number(value)), 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods & Export */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Breakdown of payment channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.paymentMethods.map((method, index) => (
                <div key={method.method} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{method.method}</p>
                    <p className="text-sm text-muted-foreground">{method.count} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatKES(method.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {((method.amount / financialData.totalRevenue) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Reports</CardTitle>
            <CardDescription>Export detailed financial reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={exportFinancialReport} className="w-full justify-start gap-2">
                <Download className="h-4 w-4" />
                Export Monthly Report (PDF)
              </Button>
              <Button variant="outline" onClick={exportFinancialReport} className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Export Revenue Analysis (Excel)
              </Button>
              <Button variant="outline" onClick={exportFinancialReport} className="w-full justify-start gap-2">
                <BarChart3 className="h-4 w-4" />
                Export Payment Summary (CSV)
              </Button>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Quick Stats:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>This Month:</span>
                    <span className="font-medium">
                      {financialData.monthlyRevenue.length > 0 ? 
                        formatKES(financialData.monthlyRevenue[financialData.monthlyRevenue.length - 1].revenue) : 
                        formatKES(0)
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Month:</span>
                    <span className="font-medium">
                      {financialData.monthlyRevenue.length > 1 ? 
                        formatKES(financialData.monthlyRevenue[financialData.monthlyRevenue.length - 2].revenue) : 
                        formatKES(0)
                      }
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
