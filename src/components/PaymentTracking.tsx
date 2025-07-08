import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter,
  DollarSign,
  Calendar,
  TrendingUp,
  Users
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatKES } from "@/lib/currency";

export const PaymentTracking = () => {
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newPayment, setNewPayment] = useState({
    customer_id: "",
    amount: "",
    payment_method: "",
    transaction_id: ""
  });

  useEffect(() => {
    fetchPayments();
    fetchCustomers();
    fetchPackages();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          customers (name, phone)
        `)
        .order('payment_date', { ascending: false });

      if (error) throw error;

      const processedPayments = data?.map(payment => ({
        ...payment,
        amount: Number(payment.amount),
        customer: payment.customers?.name || 'Unknown',
        phone: payment.customers?.phone || '',
        date: new Date(payment.payment_date).toLocaleDateString(),
        time: new Date(payment.payment_date).toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      })) || [];

      setPayments(processedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, phone')
        .eq('status', 'active');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('id, name, speed')
        .eq('status', 'active');

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.phone.includes(searchTerm) ||
                         payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || payment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleAddPayment = async () => {
    try {
      // Get customer phone number for the payment
      const customer = customers.find(c => c.id === newPayment.customer_id);
      
      const { error } = await supabase
        .from('payments')
        .insert([{
          customer_id: newPayment.customer_id,
          amount: parseFloat(newPayment.amount),
          payment_method: newPayment.payment_method,
          transaction_id: newPayment.transaction_id,
          phone_number: customer?.phone,
          status: 'completed'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });

      setNewPayment({ customer_id: "", amount: "", payment_method: "", transaction_id: "" });
      setIsAddDialogOpen(false);
      fetchPayments(); // Refresh the list
    } catch (error) {
      console.error('Error adding payment:', error);
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
    }
  };

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = payments.filter(p => p.status === "completed").length;
  const pendingPayments = payments.filter(p => p.status === "pending").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Tracking</h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
              <DialogDescription>
                Manually record a customer payment transaction.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer" className="text-right">Customer</Label>
                <Select onValueChange={(value) => setNewPayment({ ...newPayment, customer_id: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">Method</Label>
                <Select onValueChange={(value) => setNewPayment({ ...newPayment, payment_method: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                    <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transactionId" className="text-right">Transaction ID</Label>
                <Input
                  id="transactionId"
                  value={newPayment.transaction_id}
                  onChange={(e) => setNewPayment({ ...newPayment, transaction_id: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddPayment}>Record Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatKES(totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedPayments}</p>
              </div>
              <div className="text-green-600 text-sm">✓ Verified</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{pendingPayments}</p>
              </div>
              <div className="text-orange-600 text-sm">⏳ Processing</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Payment</p>
                <p className="text-2xl font-bold">
                  {payments.length > 0 ? formatKES(Math.round(totalRevenue / payments.length)) : formatKES(0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.customer}</TableCell>
                  <TableCell>{payment.phone}</TableCell>
                  <TableCell className="font-bold text-green-600">
                    {formatKES(payment.amount)}
                  </TableCell>
                  <TableCell>{payment.payment_method}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {payment.transaction_id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{payment.date}</span>
                      <span className="text-xs text-muted-foreground">{payment.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredPayments.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500">No payments found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
