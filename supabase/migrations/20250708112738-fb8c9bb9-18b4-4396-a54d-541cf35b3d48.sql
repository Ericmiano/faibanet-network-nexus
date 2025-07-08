
-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  address TEXT,
  gps_location TEXT,
  installation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create packages table
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  speed TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  features TEXT[] DEFAULT '{}',
  bandwidth_cap INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customer_packages table (many-to-many relationship)
CREATE TABLE public.customer_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  phone_number TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create connectivity_logs table for monitoring
CREATE TABLE public.connectivity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'unstable')),
  checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  response_time INTEGER, -- in milliseconds
  notes TEXT
);

-- Create sms_notifications table
CREATE TABLE public.sms_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('payment_confirmation', 'payment_reminder', 'support_update', 'maintenance_notice')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample packages
INSERT INTO public.packages (name, speed, price, features) VALUES
('Basic Home', '5 Mbps', 150.00, ARRAY['5 Mbps Download', '1 Mbps Upload', 'Unlimited Data', '24/7 Support']),
('Standard Home', '10 Mbps', 250.00, ARRAY['10 Mbps Download', '2 Mbps Upload', 'Unlimited Data', '24/7 Support', 'Free Router']),
('Premium Home', '20 Mbps', 400.00, ARRAY['20 Mbps Download', '5 Mbps Upload', 'Unlimited Data', '24/7 Support', 'Free Router', 'Priority Support']),
('Business Elite', '50 Mbps', 800.00, ARRAY['50 Mbps Download', '10 Mbps Upload', 'Unlimited Data', '24/7 Support', 'Free Router', 'Dedicated Line', 'SLA Guarantee']);

-- Insert sample customers
INSERT INTO public.customers (name, phone, email, address) VALUES
('John Doe', '+254712345678', 'john@example.com', 'Nairobi CBD, Kenya'),
('Sarah Wilson', '+254723456789', 'sarah@example.com', 'Westlands, Nairobi'),
('Mike Johnson', '+254734567890', 'mike@example.com', 'Karen, Nairobi'),
('Emma Davis', '+254745678901', 'emma@example.com', 'Kilimani, Nairobi'),
('David Brown', '+254756789012', 'david@example.com', 'Parklands, Nairobi');

-- Assign customers to packages
INSERT INTO public.customer_packages (customer_id, package_id) 
SELECT c.id, p.id FROM public.customers c, public.packages p 
WHERE (c.name = 'John Doe' AND p.name = 'Standard Home')
   OR (c.name = 'Sarah Wilson' AND p.name = 'Premium Home')
   OR (c.name = 'Mike Johnson' AND p.name = 'Basic Home')
   OR (c.name = 'Emma Davis' AND p.name = 'Business Elite')
   OR (c.name = 'David Brown' AND p.name = 'Standard Home');

-- Insert sample payments
INSERT INTO public.payments (customer_id, amount, payment_method, transaction_id, phone_number) 
SELECT c.id, 250.00, 'M-Pesa', 'MP' || FLOOR(RANDOM() * 1000000), c.phone
FROM public.customers c WHERE c.name IN ('John Doe', 'David Brown');

INSERT INTO public.payments (customer_id, amount, payment_method, transaction_id, phone_number) 
SELECT c.id, 400.00, 'M-Pesa', 'MP' || FLOOR(RANDOM() * 1000000), c.phone
FROM public.customers c WHERE c.name = 'Sarah Wilson';

INSERT INTO public.payments (customer_id, amount, payment_method, transaction_id, phone_number) 
SELECT c.id, 150.00, 'Airtel Money', 'AM' || FLOOR(RANDOM() * 1000000), c.phone
FROM public.customers c WHERE c.name = 'Mike Johnson';

-- Insert sample support tickets
INSERT INTO public.support_tickets (customer_id, title, description, priority, status)
SELECT c.id, 'Slow internet connection', 'Internet speed is slower than expected during peak hours', 'medium', 'open'
FROM public.customers c WHERE c.name = 'John Doe';

INSERT INTO public.support_tickets (customer_id, title, description, priority, status)
SELECT c.id, 'No internet connection', 'Complete internet outage since yesterday', 'high', 'in_progress'
FROM public.customers c WHERE c.name = 'Sarah Wilson';

INSERT INTO public.support_tickets (customer_id, title, description, priority, status)
SELECT c.id, 'Router not working', 'Router keeps disconnecting every few minutes', 'medium', 'open'
FROM public.customers c WHERE c.name = 'Mike Johnson';

-- Create indexes for better performance
CREATE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_customers_status ON public.customers(status);
CREATE INDEX idx_payments_customer_id ON public.payments(customer_id);
CREATE INDEX idx_payments_date ON public.payments(payment_date);
CREATE INDEX idx_support_tickets_customer_id ON public.support_tickets(customer_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_connectivity_logs_customer_id ON public.connectivity_logs(customer_id);
CREATE INDEX idx_connectivity_logs_checked_at ON public.connectivity_logs(checked_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
