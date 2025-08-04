-- Create payment_methods table for M-Pesa and card integration
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  method_type TEXT NOT NULL CHECK (method_type IN ('mpesa', 'card', 'bank_transfer')),
  provider TEXT NOT NULL, -- 'safaricom', 'visa', 'mastercard', etc.
  account_number TEXT, -- Phone number for M-Pesa, last 4 digits for cards
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Policies for payment methods
CREATE POLICY "Users can view own payment methods" 
ON public.payment_methods 
FOR SELECT 
USING (customer_id = auth.uid() OR is_admin_or_support());

CREATE POLICY "Users can manage own payment methods" 
ON public.payment_methods 
FOR ALL 
USING (customer_id = auth.uid() OR is_admin_or_support())
WITH CHECK (customer_id = auth.uid() OR is_admin_or_support());

-- Create real-time notifications system
CREATE TABLE public.real_time_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  channel TEXT NOT NULL, -- 'system', 'payment', 'network', 'support'
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  is_broadcast BOOLEAN DEFAULT false, -- For system-wide announcements
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.real_time_notifications ENABLE ROW LEVEL SECURITY;

-- Policies for real-time notifications
CREATE POLICY "Users can view own notifications" 
ON public.real_time_notifications 
FOR SELECT 
USING (user_id = auth.uid() OR is_broadcast = true OR is_admin_or_support());

CREATE POLICY "System can create notifications" 
ON public.real_time_notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update own notifications" 
ON public.real_time_notifications 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create analytics tables
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  user_id UUID,
  session_id TEXT,
  properties JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  page_url TEXT,
  referrer TEXT
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Policies for analytics
CREATE POLICY "Admins can view all analytics" 
ON public.analytics_events 
FOR ALL 
USING (is_admin_or_support());

-- Create system metrics table
CREATE TABLE public.system_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL, -- 'bandwidth', 'uptime', 'revenue', 'customers'
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT, -- 'mbps', 'percentage', 'currency', 'count'
  tags JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for system metrics
CREATE POLICY "Admins can manage system metrics" 
ON public.system_metrics 
FOR ALL 
USING (is_admin_or_support());

-- Create payment transactions table for comprehensive tracking
CREATE TABLE public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  invoice_id UUID,
  payment_method_id UUID,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'adjustment')),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'KES',
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  gateway_reference TEXT, -- External payment gateway reference
  gateway_response JSONB DEFAULT '{}',
  failure_reason TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for payment transactions
CREATE POLICY "Users can view own payment transactions" 
ON public.payment_transactions 
FOR SELECT 
USING (customer_id = auth.uid() OR is_admin_or_support());

CREATE POLICY "System can manage payment transactions" 
ON public.payment_transactions 
FOR ALL 
USING (is_admin_or_support())
WITH CHECK (is_admin_or_support());

-- Add triggers for updated_at
CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
BEFORE UPDATE ON public.payment_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_payment_methods_customer_id ON public.payment_methods(customer_id);
CREATE INDEX idx_real_time_notifications_user_id ON public.real_time_notifications(user_id);
CREATE INDEX idx_real_time_notifications_created_at ON public.real_time_notifications(created_at);
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_timestamp ON public.analytics_events(timestamp);
CREATE INDEX idx_system_metrics_recorded_at ON public.system_metrics(recorded_at);
CREATE INDEX idx_payment_transactions_customer_id ON public.payment_transactions(customer_id);