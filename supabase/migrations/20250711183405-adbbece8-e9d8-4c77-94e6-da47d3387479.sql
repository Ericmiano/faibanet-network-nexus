
-- Improve user role management and add better structure
-- Create an enum for user roles
CREATE TYPE public.user_role AS ENUM ('customer', 'admin', 'support');

-- Update profiles table to use the enum and add more fields
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE public.user_role USING role::public.user_role;

-- Add admin management capabilities
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS promoted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS promoted_by UUID REFERENCES auth.users(id);

-- Create admin actions log table
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('promote_to_admin', 'demote_from_admin', 'suspend_user', 'activate_user')),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin actions
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin actions (only admins can view)
CREATE POLICY "Admins can view admin actions" ON public.admin_actions 
FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can insert admin actions" ON public.admin_actions 
FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

-- Create function for role management by admins
CREATE OR REPLACE FUNCTION public.change_user_role(
  target_user_id UUID,
  new_role public.user_role,
  reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_admin_role TEXT;
  old_role public.user_role;
BEGIN
  -- Check if current user is admin
  SELECT role INTO current_admin_role FROM public.profiles WHERE id = auth.uid();
  
  IF current_admin_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;
  
  -- Get current role
  SELECT role INTO old_role FROM public.profiles WHERE id = target_user_id;
  
  -- Update the role
  UPDATE public.profiles 
  SET 
    role = new_role,
    promoted_at = CASE WHEN new_role = 'admin' THEN now() ELSE promoted_at END,
    promoted_by = CASE WHEN new_role = 'admin' THEN auth.uid() ELSE promoted_by END
  WHERE id = target_user_id;
  
  -- Log the action
  INSERT INTO public.admin_actions (admin_id, target_user_id, action_type, reason)
  VALUES (
    auth.uid(), 
    target_user_id, 
    CASE 
      WHEN new_role = 'admin' THEN 'promote_to_admin'
      WHEN old_role = 'admin' THEN 'demote_from_admin'
      ELSE 'role_change'
    END,
    reason
  );
  
  RETURN TRUE;
END;
$$;

-- Insert mock data for testing
-- Note: We'll need to insert actual user IDs after users are created
-- This is just the structure - actual data will be inserted via the application

-- Create some sample packages first
INSERT INTO public.packages (name, speed, price, features, bandwidth_cap, status) VALUES
('Basic', '10 Mbps', 2500, ARRAY['Basic Support', '10GB Data'], 10, 'active'),
('Standard', '25 Mbps', 5000, ARRAY['24/7 Support', '50GB Data', 'WiFi Router'], 25, 'active'),
('Premium', '50 Mbps', 8500, ARRAY['Priority Support', '100GB Data', 'WiFi Router', 'Static IP'], 50, 'active'),
('Enterprise', '100 Mbps', 15000, ARRAY['Dedicated Support', 'Unlimited Data', 'WiFi Router', 'Static IP', 'SLA Guarantee'], 100, 'active')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_user ON public.admin_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON public.admin_actions(created_at);
