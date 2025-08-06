import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Wifi,
  CreditCard,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export const CustomerLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const mockCustomers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+254 700 123 456',
      address: '123 Main St, Nairobi',
      status: 'active',
      plan: 'Premium 50Mbps',
      joinDate: '2023-01-15',
      lastPayment: '2024-01-01',
      tickets: 3,
      usage: '245 GB',
      accountBalance: 'KES 0'
    },
    {
      id: '2', 
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+254 700 789 012',
      address: '456 Oak Ave, Kisumu',
      status: 'active',
      plan: 'Basic 20Mbps',
      joinDate: '2023-06-20',
      lastPayment: '2023-12-28',
      tickets: 1,
      usage: '89 GB',
      accountBalance: 'KES -500'
    }
  ];

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'terminated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-orange-600" />
            Customer Lookup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Search Results ({filteredCustomers.length})
          </h3>
          
          {filteredCustomers.map((customer) => (
            <Card 
              key={customer.id} 
              className={`border-0 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                selectedCustomer?.id === customer.id ? 'ring-2 ring-orange-500' : ''
              }`}
              onClick={() => setSelectedCustomer(customer)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{customer.name}</h4>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    <span>{customer.plan}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {searchTerm && filteredCustomers.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Results Found</h3>
                <p className="text-gray-500">Try searching with a different term</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Customer Details */}
        <div>
          {selectedCustomer ? (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h3>{selectedCustomer.name}</h3>
                    <Badge className={getStatusColor(selectedCustomer.status)}>
                      {selectedCustomer.status}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedCustomer.address}</span>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    Account Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Plan:</span>
                      <div className="font-medium">{selectedCustomer.plan}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Usage:</span>
                      <div className="font-medium">{selectedCustomer.usage}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Join Date:</span>
                      <div className="font-medium">{selectedCustomer.joinDate}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Payment:</span>
                      <div className="font-medium">{selectedCustomer.lastPayment}</div>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Account Status
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Balance:</span>
                      <div className={`font-medium ${selectedCustomer.accountBalance.includes('-') ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedCustomer.accountBalance}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Open Tickets:</span>
                      <div className="font-medium">{selectedCustomer.tickets}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-800 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Create Ticket
                    </Button>
                    <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50">
                      <Phone className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="text-blue-600">Call Customer</span>
                    </Button>
                    <Button size="sm" variant="outline" className="border-green-200 hover:bg-green-50">
                      <CreditCard className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-green-600">View Billing</span>
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-200 hover:bg-red-50">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                      <span className="text-red-600">Report Issue</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Customer</h3>
                <p className="text-gray-500">Search and select a customer to view their details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};