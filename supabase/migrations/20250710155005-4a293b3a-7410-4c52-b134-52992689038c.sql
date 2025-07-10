
-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'support')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create customer_accounts table for service accounts
CREATE TABLE public.customer_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_number TEXT UNIQUE NOT NULL,
  internet_password TEXT NOT NULL,
  service_status TEXT DEFAULT 'active' CHECK (service_status IN ('active', 'suspended', 'terminated')),
  bandwidth_limit INTEGER, -- in Mbps
  data_quota BIGINT, -- in GB, null for unlimited
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create data_usage table for monitoring internet usage
CREATE TABLE public.data_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_account_id UUID REFERENCES public.customer_accounts(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  upload_mb BIGINT DEFAULT 0,
  download_mb BIGINT DEFAULT 0,
  total_mb BIGINT GENERATED ALWAYS AS (upload_mb + download_mb) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(customer_account_id, date)
);

-- Create blocked_devices table for access control
CREATE TABLE public.blocked_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_account_id UUID REFERENCES public.customer_accounts(id) ON DELETE CASCADE NOT NULL,
  device_mac TEXT NOT NULL,
  device_name TEXT,
  blocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  blocked_by_user BOOLEAN DEFAULT true, -- true if blocked by customer, false if by admin
  reason TEXT,
  UNIQUE(customer_account_id, device_mac)
);

-- Create service_requests table for package upgrades and service changes
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_account_id UUID REFERENCES public.customer_accounts(id) ON DELETE CASCADE NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('package_upgrade', 'package_downgrade', 'service_suspension', 'service_termination', 'bandwidth_change')),
  current_package_id UUID REFERENCES public.packages(id),
  requested_package_id UUID REFERENCES public.packages(id),
  current_bandwidth INTEGER,
  requested_bandwidth INTEGER,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create password_change_logs for security tracking
CREATE TABLE public.password_change_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  password_type TEXT NOT NULL CHECK (password_type IN ('account', 'internet')),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Create security_events table for enhanced security monitoring
CREATE TABLE public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('login_success', 'login_failure', 'password_change', 'suspicious_activity', 'admin_action')),
  description TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  severity TEXT DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_change_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for customer_accounts
CREATE POLICY "Users can view own account" ON public.customer_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own account" ON public.customer_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all accounts" ON public.customer_accounts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all accounts" ON public.customer_accounts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for data_usage
CREATE POLICY "Users can view own usage" ON public.data_usage FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.customer_accounts WHERE id = customer_account_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all usage" ON public.data_usage FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert usage data" ON public.data_usage FOR INSERT WITH CHECK (true);

-- Create RLS policies for blocked_devices
CREATE POLICY "Users can manage own blocked devices" ON public.blocked_devices FOR ALL USING (
  EXISTS (SELECT 1 FROM public.customer_accounts WHERE id = customer_account_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage all blocked devices" ON public.blocked_devices FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for service_requests
CREATE POLICY "Users can view own requests" ON public.service_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.customer_accounts WHERE id = customer_account_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create own requests" ON public.service_requests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.customer_accounts WHERE id = customer_account_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage all requests" ON public.service_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for password_change_logs
CREATE POLICY "Users can view own logs" ON public.password_change_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert logs" ON public.password_change_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all logs" ON public.password_change_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for security_events
CREATE POLICY "Admins can view all security events" ON public.security_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert security events" ON public.security_events FOR INSERT WITH CHECK (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'customer'
  );
  
  -- Create customer account with generated account number
  INSERT INTO public.customer_accounts (user_id, account_number, internet_password)
  VALUES (
    NEW.id,
    'ACC' || LPAD(FLOOR(RANDOM() * 999999)::text, 6, '0'),
    'default123' -- This should be changed by the customer
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_description TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_severity TEXT DEFAULT 'low'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (user_id, event_type, description, ip_address, user_agent, severity)
  VALUES (p_user_id, p_event_type, p_description, p_ip_address, p_user_agent, p_severity)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_data_usage_customer_date ON public.data_usage(customer_account_id, date);
CREATE INDEX idx_security_events_user_type ON public.security_events(user_id, event_type);
CREATE INDEX idx_service_requests_status ON public.service_requests(status, created_at);
CREATE INDEX idx_blocked_devices_customer ON public.blocked_devices(customer_account_id);

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_accounts_updated_at BEFORE UPDATE ON public.customer_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
