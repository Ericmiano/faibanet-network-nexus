-- Fix search path security warnings for functions

-- Update existing security functions to include SET search_path
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id uuid,
  p_event_type text,
  p_description text,
  p_severity text DEFAULT 'low'
) RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.security_events (user_id, event_type, description, severity)
  VALUES (p_user_id, p_event_type, p_description, p_severity);
END;
$$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_email text,
  p_ip_address inet
) RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.log_failed_login(
  p_email text,
  p_ip_address inet,
  p_user_agent text
) RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.failed_login_attempts (email, ip_address, user_agent)
  VALUES (p_email, p_ip_address, p_user_agent);
END;
$$;