-- Security improvements and database enhancements

-- 1. Add security event logging
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Create policies for security events
CREATE POLICY "Admins can view security events" ON public.security_events
  FOR SELECT USING (is_admin_or_support());

CREATE POLICY "System can insert security events" ON public.security_events
  FOR INSERT WITH CHECK (true);

-- 2. Add password policy table
CREATE TABLE IF NOT EXISTS public.password_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_length INTEGER DEFAULT 12,
  require_uppercase BOOLEAN DEFAULT true,
  require_lowercase BOOLEAN DEFAULT true,
  require_numbers BOOLEAN DEFAULT true,
  require_symbols BOOLEAN DEFAULT true,
  max_age_days INTEGER DEFAULT 90,
  history_count INTEGER DEFAULT 5,
  max_attempts INTEGER DEFAULT 5,
  lockout_duration_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default password policy
INSERT INTO public.password_policies (min_length, require_uppercase, require_lowercase, require_numbers, require_symbols)
VALUES (12, true, true, true, true)
ON CONFLICT DO NOTHING;

-- 3. Add failed login attempts tracking
CREATE TABLE IF NOT EXISTS public.failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  attempt_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  INDEX (email, attempt_time),
  INDEX (ip_address, attempt_time)
);

-- Enable RLS on failed login attempts
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for failed login attempts
CREATE POLICY "Admins can view failed attempts" ON public.failed_login_attempts
  FOR SELECT USING (is_admin_or_support());

CREATE POLICY "System can log failed attempts" ON public.failed_login_attempts
  FOR INSERT WITH CHECK (true);

-- 4. Add session management
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on user sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage sessions" ON public.user_sessions
  FOR ALL USING (is_admin_or_support());

-- 5. Create security functions
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID DEFAULT NULL,
  p_event_type TEXT,
  p_description TEXT,
  p_severity TEXT DEFAULT 'low'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (user_id, event_type, description, severity, ip_address, user_agent)
  VALUES (p_user_id, p_event_type, p_description, p_severity, inet_client_addr(), current_setting('request.headers', true)::json->>'user-agent')
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_email TEXT,
  p_ip_address INET
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  attempt_count INTEGER;
  policy_max_attempts INTEGER;
  policy_lockout_minutes INTEGER;
BEGIN
  -- Get current password policy
  SELECT max_attempts, lockout_duration_minutes
  INTO policy_max_attempts, policy_lockout_minutes
  FROM public.password_policies
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Count recent failed attempts
  SELECT COUNT(*)
  INTO attempt_count
  FROM public.failed_login_attempts
  WHERE (email = p_email OR ip_address = p_ip_address)
    AND attempt_time > now() - INTERVAL '1 minute' * policy_lockout_minutes;
  
  -- Return false if too many attempts
  RETURN attempt_count < policy_max_attempts;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_failed_login(
  p_email TEXT,
  p_ip_address INET,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.failed_login_attempts (email, ip_address, user_agent)
  VALUES (p_email, p_ip_address, p_user_agent);
  
  -- Log security event
  PERFORM public.log_security_event(
    NULL,
    'failed_login',
    'Failed login attempt for email: ' || p_email,
    'medium'
  );
END;
$$;

-- 6. Add trigger for updated_at on security tables
CREATE TRIGGER update_password_policies_updated_at
  BEFORE UPDATE ON public.password_policies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Clean up old failed attempts (function to be called periodically)
CREATE OR REPLACE FUNCTION public.cleanup_old_failed_attempts()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.failed_login_attempts
  WHERE attempt_time < now() - INTERVAL '24 hours';
END;
$$;

-- 8. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_failed_attempts_email_time ON public.failed_login_attempts(email, attempt_time);
CREATE INDEX IF NOT EXISTS idx_failed_attempts_ip_time ON public.failed_login_attempts(ip_address, attempt_time);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON public.user_sessions(expires_at);