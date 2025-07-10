
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, AlertTriangle, Users, Activity, Search, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

export const AdminSecurityDashboard = () => {
  const [securityEvents, setSecurityEvents] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: 'all',
    eventType: 'all',
    timeRange: '24h'
  });

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [filters]);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      
      // Fetch security events
      let eventsQuery = supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (filters.severity !== 'all') {
        eventsQuery = eventsQuery.eq('severity', filters.severity);
      }

      if (filters.eventType !== 'all') {
        eventsQuery = eventsQuery.eq('event_type', filters.eventType);
      }

      const { data: events } = await eventsQuery;
      setSecurityEvents(events || []);

      // Fetch recent failed login attempts
      const { data: attempts } = await supabase
        .from('failed_login_attempts')
        .select('*')
        .order('attempt_time', { ascending: false })
        .limit(20);
      setFailedAttempts(attempts || []);

      // Fetch active sessions
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select(`
          *,
          profiles (full_name, email)
        `)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });
      setActiveSessions(sessions || []);

    } catch (error) {
      console.error('Error fetching security data:', error);
      toast.error('Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const exportSecurityReport = async () => {
    try {
      const { data } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        const csv = convertToCSV(data);
        downloadCSV(csv, 'security-report.csv');
        toast.success('Security report exported successfully');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export security report');
    }
  };

  const convertToCSV = (data: any[]) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    return csvContent;
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Security Dashboard</h2>
        <Button onClick={exportSecurityReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins (24h)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedAttempts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityEvents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Activity className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filters.severity} onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.eventType} onValueChange={(value) => setFilters(prev => ({ ...prev, eventType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="login_success">Login Success</SelectItem>
                <SelectItem value="login_failure">Login Failure</SelectItem>
                <SelectItem value="password_change">Password Change</SelectItem>
                <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.timeRange} onValueChange={(value) => setFilters(prev => ({ ...prev, timeRange: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents.map((event: any) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant={getSeverityColor(event.severity)}>
                    {event.severity?.toUpperCase()}
                  </Badge>
                  <div>
                    <p className="font-medium">{event.event_type?.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                  {event.ip_address && (
                    <p className="text-xs text-muted-foreground">IP: {event.ip_address}</p>
                  )}
                </div>
              </div>
            ))}
            {securityEvents.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No security events found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
