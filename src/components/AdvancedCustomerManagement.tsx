
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  Tag
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatKES } from "@/lib/currency";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  segment: string;
  lifetime_value: number;
  last_payment: string;
  package_name: string;
  tags: string[];
}

export const AdvancedCustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [customerStats, setCustomerStats] = useState({
    total: 0,
    active: 0,
    churned: 0,
    newThisMonth: 0
  });

  const segments = [
    { id: "all", label: "All Customers", color: "default" },
    { id: "premium", label: "Premium", color: "destructive" },
    { id: "standard", label: "Standard", color: "secondary" },
    { id: "basic", label: "Basic", color: "outline" },
    { id: "at-risk", label: "At Risk", color: "destructive" }
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, selectedSegment]);

  const fetchCustomers = async () => {
    try {
      const { data: customersData } = await supabase
        .from('profiles')
        .select(`
          *,
          customer_packages (
            packages (name, price)
          ),
          payments (amount, payment_date)
        `);

      if (customersData) {
        // Process customer data to add segments and lifetime value
        const processedCustomers: Customer[] = customersData.map(customer => {
          const payments = customer.payments || [];
          const lifetimeValue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
          const lastPayment = payments.length > 0 ? 
            Math.max(...payments.map(p => new Date(p.payment_date).getTime())) : 0;
          
          // Determine segment based on lifetime value
          let segment = "basic";
          if (lifetimeValue > 50000) segment = "premium";
          else if (lifetimeValue > 20000) segment = "standard";
          else if (lastPayment < Date.now() - (90 * 24 * 60 * 60 * 1000)) segment = "at-risk";

          const packageName = customer.customer_packages?.[0]?.packages?.name || "No Package";

          return {
            id: customer.id,
            name: customer.name,
            email: customer.email || "",
            phone: customer.phone,
            address: customer.address || "",
            status: customer.status,
            segment,
            lifetime_value: lifetimeValue,
            last_payment: lastPayment > 0 ? new Date(lastPayment).toISOString() : "",
            package_name: packageName,
            tags: [] // Could be extended to include actual tags
          };
        });

        setCustomers(processedCustomers);

        // Calculate stats
        const total = processedCustomers.length;
        const active = processedCustomers.filter(c => c.status === 'active').length;
        const churned = processedCustomers.filter(c => c.segment === 'at-risk').length;
        const newThisMonth = processedCustomers.filter(c => {
          const createdDate = new Date();
          return createdDate.getMonth() === new Date().getMonth();
        }).length;

        setCustomerStats({ total, active, churned, newThisMonth });
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );
    }

    // Filter by segment
    if (selectedSegment !== "all") {
      filtered = filtered.filter(customer => customer.segment === selectedSegment);
    }

    setFilteredCustomers(filtered);
  };

  const getSegmentBadge = (segment: string) => {
    const segmentConfig = segments.find(s => s.id === segment);
    return (
      <Badge variant={segmentConfig?.color as any} className="text-xs">
        {segmentConfig?.label || segment}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.total}</div>
            <p className="text-xs text-muted-foreground">All registered customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{customerStats.active}</div>
            <p className="text-xs text-muted-foreground">
              {customerStats.total > 0 ? ((customerStats.active / customerStats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk Customers</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{customerStats.churned}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">Recent acquisitions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>Search, filter, and manage your customer base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {segments.map((segment) => (
                <Button
                  key={segment.id}
                  variant={selectedSegment === segment.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSegment(segment.id)}
                  className="text-xs"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {segment.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Customer List */}
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{customer.name}</h3>
                      {getSegmentBadge(customer.segment)}
                      <Badge variant="outline" className="text-xs">
                        {customer.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{customer.email || 'No email'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span>{customer.package_name}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600 mb-1">
                    {formatKES(customer.lifetime_value)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {customer.last_payment ? `Last payment: ${new Date(customer.last_payment).toLocaleDateString()}` : 'No payments'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No customers found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
