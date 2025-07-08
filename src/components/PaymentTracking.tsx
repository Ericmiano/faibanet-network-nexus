
import { useState } from "react";
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

// Mock data for payments
const mockPayments = [
  {
    id: 1,
    customer: "John Doe",
    phone: "+254712345678",
    amount: 250,
    package: "10 Mbps",
    method: "M-Pesa",
    transactionId: "QGX1234567",
    date: "2024-06-15",
    time: "14:30",
    status: "completed"
  },
  {
    id: 2,
    customer: "Sarah Wilson",
    phone: "+254723456789",
    amount: 400,
    package: "20 Mbps",
    method: "Airtel Money",
    transactionId: "ATM9876543",
    date: "2024-06-14",
    time: "10:15",
    status: "completed"
  },
  {
    id: 3,
    customer: "Mike Johnson",
    phone: "+254734567890",
    amount: 150,
    package: "5 Mbps",
    method: "Bank Transfer",
    transactionId: "BNK5555555",
    date: "2024-06-13",
    time: "16:45",
    status: "pending"
  },
  {
    id: 4,
    customer: "Emma Davis",
    phone: "+254745678901",
    amount: 800,
    package: "50 Mbps",
    method: "M-Pesa",
    transactionId: "QGX7777777",
    date: "2024-06-12",
    time: "09:20",
    status: "completed"
  }
];

export const PaymentTracking = () => {
  const [payments, setPayments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newPayment, setNewPayment] = useState({
    customer: "",
    phone: "",
    amount: "",
    package: "",
    method: "",
    transactionId: ""
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.phone.includes(searchTerm) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || payment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleAddPayment = () => {
    const payment = {
      id: payments.length + 1,
      ...newPayment,
      amount: parseInt(newPayment.amount),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      status: "completed"
    };
    
    setPayments([...payments, payment]);
    setNewPayment({ customer: "", phone: "", amount: "", package: "", method: "", transactionId: "" });
    setIsAddDialogOpen(false);
  };

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = payments.filter(p => p.status === "completed").length;
  const pendingPayments = payments.filter(p => p.status === "pending").length;

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
                <Input
                  id="customer"
                  value={newPayment.customer}
                  onChange={(e) => setNewPayment({ ...newPayment, customer: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input
                  id="phone"
                  value={newPayment.phone}
                  onChange={(e) => setNewPayment({ ...newPayment, phone: e.target.value })}
                  className="col-span-3"
                />
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
                <Label htmlFor="package" className="text-right">Package</Label>
                <Select onValueChange={(value) => setNewPayment({ ...newPayment, package: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5 Mbps">5 Mbps</SelectItem>
                    <SelectItem value="10 Mbps">10 Mbps</SelectItem>
                    <SelectItem value="20 Mbps">20 Mbps</SelectItem>
                    <SelectItem value="50 Mbps">50 Mbps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">Method</Label>
                <Select onValueChange={(value) => setNewPayment({ ...newPayment, method: value })}>
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
                  value={newPayment.transactionId}
                  onChange={(e) => setNewPayment({ ...newPayment, transactionId: e.target.value })}
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
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
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
                <p className="text-sm font-medium text-gray-600">Pending</p>
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
                <p className="text-sm font-medium text-gray-600">Avg. Payment</p>
                <p className="text-2xl font-bold">${Math.round(totalRevenue / payments.length)}</p>
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
                <TableHead>Package</TableHead>
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
                  <TableCell>
                    <Badge variant="outline">{payment.package}</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    ${payment.amount}
                  </TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {payment.transactionId}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{payment.date}</span>
                      <span className="text-xs text-gray-500">{payment.time}</span>
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
    </div>
  );
};
