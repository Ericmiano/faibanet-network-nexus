import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail
} from 'lucide-react';

export const SupportQueue = () => {
  const tickets = [
    {
      id: 'TKT-001',
      customer: 'Acme Corp',
      email: 'admin@acme.com',
      subject: 'Complete Internet Outage',
      priority: 'urgent',
      category: 'network_issue',
      status: 'open',
      timeAgo: '2 min ago',
      description: 'All office locations experiencing complete internet outage since 2:30 PM'
    },
    {
      id: 'TKT-002', 
      customer: 'John Doe',
      email: 'john@example.com',
      subject: 'Slow Connection Speed',
      priority: 'high',
      category: 'technical_support',
      status: 'in_progress',
      timeAgo: '15 min ago',
      description: 'Customer reporting 10% of expected download speed'
    },
    {
      id: 'TKT-003',
      customer: 'Jane Smith',
      email: 'jane@example.com', 
      subject: 'Billing Question',
      priority: 'medium',
      category: 'billing',
      status: 'open',
      timeAgo: '1 hr ago',
      description: 'Question about additional charges on latest bill'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'network_issue': return 'bg-red-100 text-red-700';
      case 'technical_support': return 'bg-blue-100 text-blue-700';
      case 'billing': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Queue Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Support Queue</h2>
          <p className="text-gray-600">Active tickets requiring attention</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-red-500 text-white">3 Urgent</Badge>
          <Badge className="bg-orange-500 text-white">5 High</Badge>
          <Badge className="bg-yellow-500 text-white">4 Medium</Badge>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{ticket.subject}</h3>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{ticket.customer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{ticket.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{ticket.timeAgo}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{ticket.description}</p>

                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(ticket.category)}>
                      {ticket.category.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-500">#{ticket.id}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <Button size="sm" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  
                  <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                    <Phone className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-blue-600">Call</span>
                  </Button>

                  {ticket.status === 'open' && (
                    <Button size="sm" variant="outline" className="border-green-200 hover:bg-green-50">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-green-600">Take</span>
                    </Button>
                  )}

                  {ticket.priority === 'urgent' && (
                    <Button size="sm" variant="outline" className="border-red-200 hover:bg-red-50">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                      <span className="text-red-600">Escalate</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress bar for in-progress tickets */}
              {ticket.status === 'in_progress' && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-orange-800">In Progress</span>
                    <span className="text-sm text-orange-600">Assigned to you</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {tickets.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Tickets</h3>
            <p className="text-gray-500">All caught up! No tickets in the queue right now.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};