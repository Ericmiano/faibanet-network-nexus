import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Smartphone, Building2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  method_type: 'mpesa' | 'card' | 'bank_transfer';
  provider: string;
  account_number: string;
  is_default: boolean;
  is_active: boolean;
}

interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  gateway_reference: string;
  created_at: string;
}

export const PaymentIntegration: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [mpesaData, setMpesaData] = useState({ phone: '', amount: '' });
  const [cardData, setCardData] = useState({ amount: '', description: '' });
  const { toast } = useToast();

  React.useEffect(() => {
    fetchPaymentMethods();
    fetchTransactions();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentMethods((data || []) as PaymentMethod[]);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions((data || []) as PaymentTransaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleMpesaPayment = async () => {
    if (!mpesaData.phone || !mpesaData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          phone: mpesaData.phone,
          amount: parseFloat(mpesaData.amount),
          account_reference: 'FAIBANET',
          description: 'Internet package payment'
        }
      });

      if (error) throw error;

      toast({
        title: "Payment Initiated",
        description: data.message
      });

      setMpesaData({ phone: '', amount: '' });
      fetchTransactions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    if (!cardData.amount) {
      toast({
        title: "Error",
        description: "Please enter an amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-payment', {
        body: {
          amount: parseFloat(cardData.amount),
          currency: 'usd',
          description: cardData.description || 'FaibaNet Payment'
        }
      });

      if (error) throw error;

      // Open Stripe checkout in new tab
      if (data.url) {
        window.open(data.url, '_blank');
      }

      setCardData({ amount: '', description: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Integration</h2>
        <p className="text-muted-foreground">Manage payments via M-Pesa, cards, and bank transfers</p>
      </div>

      <Tabs defaultValue="make-payment" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="make-payment">Make Payment</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="make-payment" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* M-Pesa Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  M-Pesa Payment
                </CardTitle>
                <CardDescription>
                  Pay using your M-Pesa mobile money account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mpesa-phone">Phone Number</Label>
                  <Input
                    id="mpesa-phone"
                    placeholder="254XXXXXXXXX"
                    value={mpesaData.phone}
                    onChange={(e) => setMpesaData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mpesa-amount">Amount (KES)</Label>
                  <Input
                    id="mpesa-amount"
                    type="number"
                    placeholder="0.00"
                    value={mpesaData.amount}
                    onChange={(e) => setMpesaData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleMpesaPayment} 
                  disabled={loading} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Processing...' : 'Pay with M-Pesa'}
                </Button>
              </CardContent>
            </Card>

            {/* Card Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Card Payment
                </CardTitle>
                <CardDescription>
                  Pay using credit/debit card via Stripe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-amount">Amount (USD)</Label>
                  <Input
                    id="card-amount"
                    type="number"
                    placeholder="0.00"
                    value={cardData.amount}
                    onChange={(e) => setCardData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-description">Description (Optional)</Label>
                  <Input
                    id="card-description"
                    placeholder="Payment description"
                    value={cardData.description}
                    onChange={(e) => setCardData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleStripePayment} 
                  disabled={loading} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Processing...' : 'Pay with Card'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <div className="grid gap-4">
            {paymentMethods.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
                  <p className="text-muted-foreground">
                    Add a payment method to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              paymentMethods.map((method) => (
                <Card key={method.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {method.method_type === 'mpesa' && <Smartphone className="h-5 w-5 text-green-600" />}
                        {method.method_type === 'card' && <CreditCard className="h-5 w-5 text-blue-600" />}
                        {method.method_type === 'bank_transfer' && <Building2 className="h-5 w-5 text-purple-600" />}
                        <div>
                          <p className="font-medium">{method.provider}</p>
                          <p className="text-sm text-muted-foreground">
                            **** {method.account_number.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.is_default && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        <Badge variant={method.is_active ? "default" : "secondary"}>
                          {method.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Transactions</h3>
                  <p className="text-muted-foreground">
                    Your payment history will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              transactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(transaction.status)}
                        <div>
                          <p className="font-medium">
                            {transaction.currency} {transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.gateway_reference}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(transaction.status) as any}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};