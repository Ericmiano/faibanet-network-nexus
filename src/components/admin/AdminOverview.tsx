import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Shield,
  Activity,
  AlertTriangle,
  TrendingUp,
  Database,
  Wifi,
  DollarSign,
  Eye,
  Settings
} from 'lucide-react';

export const AdminOverview = () => {
  return (
    <div className="space-y-8">
      {/* System Status Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">System Command Center</h1>
            <p className="text-gray-300 text-lg">
              All systems operational. Monitor and control your network infrastructure.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-2xl font-bold">99.9%</span>
              </div>
              <div className="text-gray-400 text-sm">System Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-700/30 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-200">Active Users</CardTitle>
            <Users className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-100">2,847</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400">+12% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 border-orange-700/30 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-200">Security Alerts</CardTitle>
            <Shield className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-100">3</div>
            <div className="flex items-center gap-2 mt-2">
              <AlertTriangle className="h-3 w-3 text-red-400" />
              <span className="text-xs text-red-400">2 require attention</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/30 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Network Load</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-100">67%</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-blue-400 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/30 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-200">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-100">KES 892K</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400">+8% this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gray-800/50 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="h-5 w-5 text-blue-400" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Database Server</span>
              </div>
              <Badge className="bg-green-600 text-white">Healthy</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>API Gateway</span>
              </div>
              <Badge className="bg-green-600 text-white">Operational</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Cache Server</span>
              </div>
              <Badge className="bg-yellow-600 text-white">Warning</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Load Balancer</span>
              </div>
              <Badge className="bg-green-600 text-white">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/30">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="font-medium text-red-200">High CPU Usage</span>
              </div>
              <p className="text-sm text-red-300">Server load at 85% for 10+ minutes</p>
              <span className="text-xs text-red-400">2 minutes ago</span>
            </div>
            
            <div className="p-3 rounded-lg bg-yellow-900/30 border border-yellow-700/30">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-yellow-400" />
                <span className="font-medium text-yellow-200">Failed Login Attempts</span>
              </div>
              <p className="text-sm text-yellow-300">15 failed attempts from IP 192.168.1.100</p>
              <span className="text-xs text-yellow-400">15 minutes ago</span>
            </div>
            
            <div className="p-3 rounded-lg bg-green-900/30 border border-green-700/30">
              <div className="flex items-center gap-2 mb-1">
                <Wifi className="h-4 w-4 text-green-400" />
                <span className="font-medium text-green-200">Network Restored</span>
              </div>
              <p className="text-sm text-green-300">Connection to backup server established</p>
              <span className="text-xs text-green-400">1 hour ago</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Admin Actions */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button className="h-20 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-xs">User Management</span>
            </Button>
            
            <Button className="h-20 bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 flex-col gap-2">
              <Shield className="h-6 w-6" />
              <span className="text-xs">Security Center</span>
            </Button>
            
            <Button className="h-20 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex-col gap-2">
              <Activity className="h-6 w-6" />
              <span className="text-xs">Analytics</span>
            </Button>
            
            <Button className="h-20 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 flex-col gap-2">
              <Database className="h-6 w-6" />
              <span className="text-xs">System Status</span>
            </Button>
            
            <Button className="h-20 bg-gradient-to-br from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 flex-col gap-2">
              <Eye className="h-6 w-6" />
              <span className="text-xs">Monitor</span>
            </Button>
            
            <Button className="h-20 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 flex-col gap-2">
              <Settings className="h-6 w-6" />
              <span className="text-xs">Configuration</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};