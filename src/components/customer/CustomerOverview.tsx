import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Wifi,
  Download,
  Upload,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export const CustomerOverview = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-blue-100 text-lg">
              Your internet is running smoothly. Here's your usage overview.
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">99.9%</div>
            <div className="text-blue-100">Uptime</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Internet Speed</CardTitle>
            <Wifi className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">50 Mbps</div>
            <p className="text-xs text-blue-600">Upload: 20 Mbps</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Data Used</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">245 GB</div>
            <Progress value={65} className="mt-2" />
            <p className="text-xs text-green-600 mt-1">65% of monthly limit</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Next Bill</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">KES 2,500</div>
            <p className="text-xs text-purple-600">Due in 12 days</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Support</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">24/7</div>
            <p className="text-xs text-orange-600">Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Usage Trend (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Usage chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-800">Payment Successful</p>
                  <p className="text-sm text-green-600">Monthly subscription renewed</p>
                </div>
                <span className="text-xs text-green-600">2 hours ago</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                <Wifi className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-800">Connection Stable</p>
                  <p className="text-sm text-blue-600">No interruptions detected</p>
                </div>
                <span className="text-xs text-blue-600">6 hours ago</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                <Upload className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <p className="font-medium text-purple-800">Speed Test</p>
                  <p className="text-sm text-purple-600">50.2 Mbps download speed</p>
                </div>
                <span className="text-xs text-purple-600">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <div className="text-center">
                <Wifi className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm">Run Speed Test</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-purple-200 hover:bg-purple-50">
              <div className="text-center">
                <CreditCard className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                <div className="text-sm text-purple-600">View Bills</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-green-200 hover:bg-green-50">
              <div className="text-center">
                <AlertCircle className="h-6 w-6 mx-auto mb-1 text-green-600" />
                <div className="text-sm text-green-600">Get Support</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};