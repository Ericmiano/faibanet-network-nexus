import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Star,
  Phone
} from 'lucide-react';

export const SupportOverview = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Support Dashboard</h1>
            <p className="text-orange-100 text-lg">
              Help customers succeed. Currently handling 12 active tickets.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">4.8⭐</div>
            <div className="text-orange-100">Customer Rating</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Active Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">12</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge className="bg-red-100 text-red-700 text-xs">3 urgent</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">24</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">+20% vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">2.3m</div>
            <p className="text-xs text-orange-600">Target: under 3 minutes</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">98%</div>
            <p className="text-xs text-purple-600">Based on 45 ratings</p>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Queue & Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              Priority Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-red-500 text-white">Urgent</Badge>
                <span className="text-sm text-gray-500">2 min ago</span>
              </div>
              <h4 className="font-medium text-gray-800">Internet Down - Business Customer</h4>
              <p className="text-sm text-gray-600">Complete outage affecting office operations</p>
              <div className="flex items-center gap-2 mt-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Acme Corp - Premium Plan</span>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-orange-500 bg-orange-50">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-orange-500 text-white">High</Badge>
                <span className="text-sm text-gray-500">15 min ago</span>
              </div>
              <h4 className="font-medium text-gray-800">Slow Connection Speed</h4>
              <p className="text-sm text-gray-600">Customer reporting 10% of expected speed</p>
              <div className="flex items-center gap-2 mt-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">John Doe - Standard Plan</span>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-yellow-500 text-white">Medium</Badge>
                <span className="text-sm text-gray-500">1 hr ago</span>
              </div>
              <h4 className="font-medium text-gray-800">Billing Inquiry</h4>
              <p className="text-sm text-gray-600">Question about recent charges</p>
              <div className="flex items-center gap-2 mt-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Jane Smith - Basic Plan</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Performance Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Resolution Rate</span>
                  <span className="text-sm text-gray-500">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">First Response Time</span>
                  <span className="text-sm text-gray-500">2.3 min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '77%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                  <span className="text-sm text-gray-500">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h5 className="font-medium mb-3">Recent Feedback</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-gray-600">"Quick and helpful resolution!"</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-gray-600">"Agent was very patient and knowledgeable"</span>
                  </div>
                </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              <div className="text-center">
                <MessageSquare className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm">New Ticket</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-blue-200 hover:bg-blue-50">
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                <div className="text-sm text-blue-600">Customer Lookup</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-green-200 hover:bg-green-50">
              <div className="text-center">
                <Phone className="h-6 w-6 mx-auto mb-1 text-green-600" />
                <div className="text-sm text-green-600">Call Customer</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-purple-200 hover:bg-purple-50">
              <div className="text-center">
                <AlertCircle className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                <div className="text-sm text-purple-600">Escalate Issue</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};