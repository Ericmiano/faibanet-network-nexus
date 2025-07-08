
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Eye
} from "lucide-react";
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

export const PaymentReconciliation = () => {
  const [queuedPayments, setQueuedPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch payment queue
      const { data: queueData, error: queueError } = await supabase
        .from('payment_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (queueError) throw queueError;

      // Fetch notifications
      const { data: notificationData, error: notificationError } = await supabase
        .from('payment_notifications')
        .select(`
          *,
          customers (name, phone),
          payments (amount, transaction_id)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (notificationError) throw notificationError;

      setQueuedPayments(queueData || []);
      setNotifications(notificationData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reconciliation data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const retryPayment = async (paymentId: string) => {
    try {
      const response = await fetch('/api/retry-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paymentId })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment retry initiated",
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error retrying payment:', error);
      toast({
        title: "Error",
        description: "Failed to retry payment",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading reconciliation data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Reconciliation</h2>
        <Button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Payment Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Processing Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queuedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">{payment.transaction_id}</TableCell>
                  <TableCell>{payment.phone_number}</TableCell>
                  <TableCell className="font-bold text-green-600">
                    {formatKES(payment.amount)}
                  </TableCell>
                  <TableCell>{payment.payment_source}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{new Date(payment.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    {payment.status === 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryPayment(payment.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>SMS Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>{notification.customers?.name || 'Unknown'}</TableCell>
                  <TableCell>{notification.phone_number}</TableCell>
                  <TableCell className="font-bold text-green-600">
                    {notification.payments?.amount ? formatKES(notification.payments.amount) : 'N/A'}
                  </TableCell>
                  <TableCell>{getStatusBadge(notification.status)}</TableCell>
                  <TableCell>
                    {notification.sent_at ? new Date(notification.sent_at).toLocaleString() : 'Not sent'}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
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
