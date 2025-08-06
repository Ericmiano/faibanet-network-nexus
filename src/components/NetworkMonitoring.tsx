
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Wifi, 
  WifiOff,
  Zap,
  Clock,
  MapPin
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface NetworkDevice {
  id: string;
  name: string;
  ip_address: string;
  location: string;
  status: 'online' | 'offline' | 'warning';
  last_ping: string;
  response_time: number;
}

interface NetworkAlert {
  id: string;
  device_name: string;
  alert_type: 'outage' | 'slow_response' | 'device_offline';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export const NetworkMonitoring = () => {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [alerts, setAlerts] = useState<NetworkAlert[]>([]);
  const [networkStats, setNetworkStats] = useState({
    totalDevices: 0,
    onlineDevices: 0,
    avgResponseTime: 0,
    uptime: 99.5
  });
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    fetchNetworkData();
    // Set up real-time monitoring
    const interval = setInterval(fetchNetworkData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNetworkData = async () => {
    try {
      // Fetch network logs for network monitoring
      const { data: logs } = await supabase
        .from('network_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Generate mock network devices data
      const mockDevices: NetworkDevice[] = [
        {
          id: '1',
          name: 'Main Router',
          ip_address: '192.168.1.1',
          location: 'Data Center',
          status: 'online',
          last_ping: new Date().toISOString(),
          response_time: 12
        },
        {
          id: '2',
          name: 'Sector A Switch',
          ip_address: '192.168.1.10',
          location: 'Sector A',
          status: 'online',
          last_ping: new Date().toISOString(),
          response_time: 25
        },
        {
          id: '3',
          name: 'Sector B Router',
          ip_address: '192.168.1.20',
          location: 'Sector B',
          status: 'warning',
          last_ping: new Date().toISOString(),
          response_time: 150
        },
        {
          id: '4',
          name: 'Backup Gateway',
          ip_address: '192.168.1.254',
          location: 'Data Center',
          status: 'offline',
          last_ping: new Date(Date.now() - 300000).toISOString(),
          response_time: 0
        }
      ];

      // Generate mock alerts
      const mockAlerts: NetworkAlert[] = [
        {
          id: '1',
          device_name: 'Sector B Router',
          alert_type: 'slow_response',
          message: 'High response time detected (150ms)',
          severity: 'medium',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          device_name: 'Backup Gateway',
          alert_type: 'device_offline',
          message: 'Device is not responding to ping requests',
          severity: 'high',
          created_at: new Date(Date.now() - 180000).toISOString()
        }
      ];

      // Generate performance data for chart
      const now = new Date();
      const performanceData = Array.from({ length: 24 }, (_, i) => {
        const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
        return {
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          responseTime: Math.floor(Math.random() * 50) + 10,
          uptime: 99.9 - Math.random() * 0.5
        };
      });

      setDevices(mockDevices);
      setAlerts(mockAlerts);
      setPerformanceData(performanceData);
      
      // Calculate network stats
      const totalDevices = mockDevices.length;
      const onlineDevices = mockDevices.filter(d => d.status === 'online').length;
      const avgResponseTime = mockDevices
        .filter(d => d.response_time > 0)
        .reduce((sum, d) => sum + d.response_time, 0) / mockDevices.filter(d => d.response_time > 0).length;

      setNetworkStats({
        totalDevices,
        onlineDevices,
        avgResponseTime: Math.round(avgResponseTime),
        uptime: 99.5
      });

    } catch (error) {
      console.error('Error fetching network data:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'default',
      medium: 'secondary',
      high: 'destructive',
      critical: 'destructive'
    };
    return (
      <Badge variant={variants[severity] as any} className="text-xs">
        {severity.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Network Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkStats.totalDevices}</div>
            <p className="text-xs text-muted-foreground">Network infrastructure</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Devices</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{networkStats.onlineDevices}</div>
            <p className="text-xs text-muted-foreground">
              {((networkStats.onlineDevices / networkStats.totalDevices) * 100).toFixed(1)}% operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkStats.avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">Network latency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{networkStats.uptime}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Network Performance (24h)</CardTitle>
          <CardDescription>Response time and uptime trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
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
                dataKey="responseTime" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Response Time (ms)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Device Status and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Network Devices</CardTitle>
            <CardDescription>Current status of network infrastructure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(device.status)}
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-sm text-muted-foreground">{device.ip_address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{device.location}</span>
                    </div>
                    {device.response_time > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{device.response_time}ms</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>Recent network issues and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{alert.device_name}</p>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">No active alerts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
