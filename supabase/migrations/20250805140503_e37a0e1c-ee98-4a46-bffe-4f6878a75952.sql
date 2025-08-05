-- Fix any potential syntax issues and add comprehensive security features

-- Create security events table
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  description text NOT NULL,
  severity text NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address inet,
  user_agent text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create password policies table
CREATE TABLE IF NOT EXISTS public.password_policies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  min_length integer NOT NULL DEFAULT 12,
  require_uppercase boolean NOT NULL DEFAULT true,
  require_lowercase boolean NOT NULL DEFAULT true,
  require_numbers boolean NOT NULL DEFAULT true,
  require_symbols boolean NOT NULL DEFAULT true,
  max_age_days integer DEFAULT 90,
  history_count integer DEFAULT 5,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create failed login attempts table
CREATE TABLE IF NOT EXISTS public.failed_login_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  ip_address inet NOT NULL,
  user_agent text,
  attempt_time timestamp with time zone NOT NULL DEFAULT now(),
  reason text
);

-- Create user sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text NOT NULL UNIQUE,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_activity timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);

-- Enable RLS on all new tables
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own security events" ON public.security_events
  FOR SELECT USING (user_id = auth.uid() OR is_admin_or_support());

CREATE POLICY "System can insert security events" ON public.security_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage password policies" ON public.password_policies
  FOR ALL USING (is_admin_or_support());

CREATE POLICY "Everyone can view password policies" ON public.password_policies
  FOR SELECT USING (true);

CREATE POLICY "Admins can view failed attempts" ON public.failed_login_attempts
  FOR SELECT USING (is_admin_or_support());

CREATE POLICY "System can log failed attempts" ON public.failed_login_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (user_id = auth.uid() OR is_admin_or_support());

CREATE POLICY "Users can update own sessions" ON public.user_sessions
  FOR UPDATE USING (user_id = auth.uid());

-- Create security functions
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id uuid,
  p_event_type text,
  p_description text,
  p_severity text DEFAULT 'low'
) RETURNS void AS $$
BEGIN
  INSERT INTO public.security_events (user_id, event_type, description, severity)
  VALUES (p_user_id, p_event_type, p_description, p_severity);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_email text,
  p_ip_address inet
) RETURNS boolean AS $$
DECLARE
  attempt_count integer;
  window_start timestamp with time zone;
BEGIN
  window_start := now() - interval '15 minutes';
  
  SELECT COUNT(*) INTO attempt_count
  FROM public.failed_login_attempts
  WHERE (email = p_email OR ip_address = p_ip_address)
    AND attempt_time >= window_start;
  
  RETURN attempt_count < 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.log_failed_login(
  p_email text,
  p_ip_address inet,
  p_user_agent text
) RETURNS void AS $$
BEGIN
  INSERT INTO public.failed_login_attempts (email, ip_address, user_agent)
  VALUES (p_email, p_ip_address, p_user_agent);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_failed_attempts_email ON public.failed_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_failed_attempts_ip ON public.failed_login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_failed_attempts_time ON public.failed_login_attempts(attempt_time);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);

-- Insert default password policy
INSERT INTO public.password_policies (min_length, require_uppercase, require_lowercase, require_numbers, require_symbols)
VALUES (12, true, true, true, true)
ON CONFLICT DO NOTHING;

-- Add triggers for updated_at
CREATE TRIGGER update_password_policies_updated_at
  BEFORE UPDATE ON public.password_policies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_sessions_last_activity
  BEFORE UPDATE ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();