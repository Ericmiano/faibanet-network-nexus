
-- Fix the infinite recursion in RLS policies by creating security definer functions
-- This is critical for the system to function properly

-- Create a security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all accounts" ON public.customer_accounts;
DROP POLICY IF EXISTS "Admins can manage all accounts" ON public.customer_accounts;
DROP POLICY IF EXISTS "Admins can view all usage" ON public.data_usage;
DROP POLICY IF EXISTS "Users can manage own blocked devices" ON public.blocked_devices;
DROP POLICY IF EXISTS "Admins can manage all blocked devices" ON public.blocked_devices;
DROP POLICY IF EXISTS "Admins can manage all requests" ON public.service_requests;
DROP POLICY IF EXISTS "Admins can view all logs" ON public.password_change_logs;
DROP POLICY IF EXISTS "Admins can view all security events" ON public.security_events;

-- Recreate policies using the security definer function
CREATE POLICY "Admins can view all profiles" ON public.profiles 
FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update all profiles" ON public.profiles 
FOR UPDATE USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can view all accounts" ON public.customer_accounts 
FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage all accounts" ON public.customer_accounts 
FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can view all usage" ON public.data_usage 
FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Users can manage own blocked devices" ON public.blocked_devices 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.customer_accounts WHERE id = customer_account_id AND user_id = auth.uid())
);

CREATE POLICY "Admins can manage all blocked devices" ON public.blocked_devices 
FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage all requests" ON public.service_requests 
FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can view all logs" ON public.password_change_logs 
FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can view all security events" ON public.security_events 
FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Add additional security enhancements
-- Create table for failed login attempts (rate limiting)
CREATE TABLE IF NOT EXISTS public.failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address INET NOT NULL,
  attempt_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_agent TEXT
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_failed_login_email_time ON public.failed_login_attempts(email, attempt_time);
CREATE INDEX IF NOT EXISTS idx_failed_login_ip_time ON public.failed_login_attempts(ip_address, attempt_time);

-- Create function to check rate limiting
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_email TEXT, p_ip_address INET)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  email_attempts INTEGER;
  ip_attempts INTEGER;
BEGIN
  -- Check attempts from same email in last 15 minutes
  SELECT COUNT(*) INTO email_attempts
  FROM public.failed_login_attempts
  WHERE email = p_email 
    AND attempt_time > NOW() - INTERVAL '15 minutes';
  
  -- Check attempts from same IP in last 15 minutes
  SELECT COUNT(*) INTO ip_attempts
  FROM public.failed_login_attempts
  WHERE ip_address = p_ip_address 
    AND attempt_time > NOW() - INTERVAL '15 minutes';
  
  -- Return false if too many attempts (more than 5 from email or 10 from IP)
  RETURN (email_attempts < 5 AND ip_attempts < 10);
END;
$$;

-- Create function to log failed attempts
CREATE OR REPLACE FUNCTION public.log_failed_login(p_email TEXT, p_ip_address INET, p_user_agent TEXT DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.failed_login_attempts (email, ip_address, user_agent)
  VALUES (p_email, p_ip_address, p_user_agent);
  
  -- Clean up old attempts (keep only last 24 hours)
  DELETE FROM public.failed_login_attempts 
  WHERE attempt_time < NOW() - INTERVAL '24 hours';
END;
$$;

-- Add session management table for enhanced security
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days'),
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for session management
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON public.user_sessions(expires_at);

-- Enable RLS on new tables
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Only system can manage failed login attempts" ON public.failed_login_attempts FOR ALL USING (false);
CREATE POLICY "Users can view own sessions" ON public.user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage sessions" ON public.user_sessions FOR ALL USING (true);

-- Add notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT true,
  security_alerts BOOLEAN DEFAULT true,
  usage_alerts BOOLEAN DEFAULT true,
  payment_reminders BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS and create policies
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own preferences" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_notification_preferences_updated_at 
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add API rate limiting table
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for API rate limiting
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_user_endpoint ON public.api_rate_limits(user_id, endpoint, window_start);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_ip_endpoint ON public.api_rate_limits(ip_address, endpoint, window_start);

-- Enable RLS
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "System can manage rate limits" ON public.api_rate_limits FOR ALL USING (true);
