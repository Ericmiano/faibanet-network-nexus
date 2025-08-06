
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Download, Upload, Activity } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface UsageMonitorProps {
  customerAccountId: string;
}

export const UsageMonitor: React.FC<UsageMonitorProps> = ({ customerAccountId }) => {
  const [usageData, setUsageData] = useState<any[]>([]);
  const [totalUsage, setTotalUsage] = useState({ upload: 0, download: 0, total: 0 });
  const [period, setPeriod] = useState('7');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerAccountId) {
      fetchUsageData();
    }
  }, [customerAccountId, period]);

  const fetchUsageData = async () => {
    setLoading(true);
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(period));

      // Use usage_metrics table instead
      const { data, error } = await supabase
        .from('usage_metrics')
        .select('*')
        .eq('customer_id', customerAccountId)
        .gte('date', daysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedData = data?.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        upload: item.upload_mb / 1024, // Convert to GB
        download: item.download_mb / 1024,
        total: (item.upload_mb + item.download_mb) / 1024
      })) || [];

      setUsageData(formattedData);

      // Calculate totals
      const totals = (data || []).reduce((acc, curr) => ({
        upload: acc.upload + (curr.upload_mb || 0),
        download: acc.download + (curr.download_mb || 0),
        total: acc.total + ((curr.upload_mb || 0) + (curr.download_mb || 0))
      }), { upload: 0, download: 0, total: 0 });

      setTotalUsage(totals);
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Usage Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(totalUsage.total * 1024 * 1024)}</div>
            <p className="text-xs text-muted-foreground">
              Last {period} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloaded</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(totalUsage.download * 1024 * 1024)}</div>
            <p className="text-xs text-muted-foreground">
              {totalUsage.total > 0 ? ((totalUsage.download / totalUsage.total) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uploaded</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(totalUsage.upload * 1024 * 1024)}</div>
            <p className="text-xs text-muted-foreground">
              {totalUsage.total > 0 ? ((totalUsage.upload / totalUsage.total) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Usage History
          </CardTitle>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'GB', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)} GB`, '']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="download" stackId="a" fill="#3b82f6" name="Download" />
                <Bar dataKey="upload" stackId="a" fill="#10b981" name="Upload" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
