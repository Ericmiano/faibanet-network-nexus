
-- Update packages table with new Kenyan internet package structure
DELETE FROM public.customer_packages;
DELETE FROM public.packages;

-- Insert new packages similar to Safaricom/Faiba structure
INSERT INTO public.packages (name, speed, price, features, bandwidth_cap) VALUES
('Starter', '20 Mbps', 2500.00, ARRAY['20 Mbps Download', '10 Mbps Upload', 'Unlimited Data', '24/7 Support'], NULL),
('Home Basic', '50 Mbps', 4500.00, ARRAY['50 Mbps Download', '25 Mbps Upload', 'Unlimited Data', '24/7 Support', 'Free Router'], NULL),
('Home Standard', '100 Mbps', 6500.00, ARRAY['100 Mbps Download', '50 Mbps Upload', 'Unlimited Data', '24/7 Support', 'Free Router', 'Priority Support'], NULL),
('Home Premium', '200 Mbps', 9500.00, ARRAY['200 Mbps Download', '100 Mbps Upload', 'Unlimited Data', '24/7 Support', 'Free Router', 'Priority Support', 'Static IP'], NULL),
('Business Lite', '300 Mbps', 15000.00, ARRAY['300 Mbps Download', '150 Mbps Upload', 'Unlimited Data', '24/7 Support', 'Free Router', 'Dedicated Line', 'SLA Guarantee'], NULL),
('Business Pro', '500 Mbps', 25000.00, ARRAY['500 Mbps Download', '250 Mbps Upload', 'Unlimited Data', '24/7 Support', 'Free Router', 'Dedicated Line', 'SLA Guarantee', 'Backup Connection'], NULL),
('Enterprise', '1 Gbps', 45000.00, ARRAY['1 Gbps Download', '500 Mbps Upload', 'Unlimited Data', '24/7 Support', 'Free Router', 'Dedicated Line', 'SLA Guarantee', 'Backup Connection', 'On-site Support'], NULL);

-- Add payment automation fields to payments table
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS mpesa_receipt_number TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS account_reference TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_source TEXT DEFAULT 'manual' CHECK (payment_source IN ('manual', 'mpesa_api', 'mpesa_sms', 'bank_transfer'));
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS reconciliation_status TEXT DEFAULT 'matched' CHECK (reconciliation_status IN ('matched', 'unmatched', 'pending', 'failed'));

-- Create payment processing queue table
CREATE TABLE IF NOT EXISTS public.payment_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  phone_number TEXT NOT NULL,
  account_reference TEXT,
  payment_source TEXT NOT NULL,
  raw_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create payment notifications table for SMS confirmations
CREATE TABLE IF NOT EXISTS public.payment_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_queue_status ON public.payment_queue(status);
CREATE INDEX IF NOT EXISTS idx_payment_queue_phone ON public.payment_queue(phone_number);
CREATE INDEX IF NOT EXISTS idx_payment_notifications_status ON public.payment_notifications(status);
CREATE INDEX IF NOT EXISTS idx_payments_mpesa_receipt ON public.payments(mpesa_receipt_number);
CREATE INDEX IF NOT EXISTS idx_payments_reconciliation_status ON public.payments(reconciliation_status);

-- Update existing sample data with new packages
INSERT INTO public.customer_packages (customer_id, package_id) 
SELECT c.id, p.id FROM public.customers c, public.packages p 
WHERE (c.name = 'John Doe' AND p.name = 'Home Standard')
   OR (c.name = 'Sarah Wilson' AND p.name = 'Home Premium')
   OR (c.name = 'Mike Johnson' AND p.name = 'Starter')
   OR (c.name = 'Emma Davis' AND p.name = 'Business Pro')
   OR (c.name = 'David Brown' AND p.name = 'Home Basic');

-- Update sample payments with KES amounts and new structure
UPDATE public.payments SET 
  amount = CASE 
    WHEN amount = 250.00 THEN 6500.00
    WHEN amount = 400.00 THEN 9500.00
    WHEN amount = 150.00 THEN 2500.00
    ELSE amount
  END,
  payment_source = 'mpesa_api',
  mpesa_receipt_number = 'QFR' || FLOOR(RANDOM() * 1000000)::TEXT,
  account_reference = 'FNET' || FLOOR(RANDOM() * 10000)::TEXT;
