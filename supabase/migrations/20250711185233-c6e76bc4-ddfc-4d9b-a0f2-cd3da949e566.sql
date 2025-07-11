
-- Create admin_actions table for logging role changes
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('promote_to_admin', 'demote_from_admin', 'promote_to_support', 'demote_from_support', 'role_change')),
  old_role TEXT,
  new_role TEXT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin actions
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin actions (only admins can view and insert)
CREATE POLICY "Admins can view admin actions" ON public.admin_actions 
FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can insert admin actions" ON public.admin_actions 
FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

-- Add promoted_at and promoted_by fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS promoted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS promoted_by UUID REFERENCES auth.users(id);

-- Create function for role management by admins
CREATE OR REPLACE FUNCTION public.change_user_role(
  target_user_id UUID,
  new_role TEXT,
  reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_admin_role TEXT;
  old_role TEXT;
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
  INSERT INTO public.admin_actions (admin_id, target_user_id, action_type, old_role, new_role, reason)
  VALUES (
    auth.uid(), 
    target_user_id, 
    CASE 
      WHEN new_role = 'admin' AND old_role != 'admin' THEN 'promote_to_admin'
      WHEN old_role = 'admin' AND new_role != 'admin' THEN 'demote_from_admin'
      WHEN new_role = 'support' AND old_role != 'support' THEN 'promote_to_support'
      WHEN old_role = 'support' AND new_role != 'support' THEN 'demote_from_support'
      ELSE 'role_change'
    END,
    old_role,
    new_role,
    reason
  );
  
  RETURN TRUE;
END;
$$;

-- Create function to get admin actions with user details
CREATE OR REPLACE FUNCTION public.get_admin_actions_with_profiles()
RETURNS TABLE (
  id UUID,
  admin_id UUID,
  target_user_id UUID,
  action_type TEXT,
  old_role TEXT,
  new_role TEXT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  admin_name TEXT,
  admin_email TEXT,
  target_name TEXT,
  target_email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is admin
  IF public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Only admins can view admin actions';
  END IF;
  
  RETURN QUERY
  SELECT 
    aa.id,
    aa.admin_id,
    aa.target_user_id,
    aa.action_type,
    aa.old_role,
    aa.new_role,
    aa.reason,
    aa.created_at,
    ap.full_name as admin_name,
    ap.email as admin_email,
    tp.full_name as target_name,
    tp.email as target_email
  FROM public.admin_actions aa
  LEFT JOIN public.profiles ap ON aa.admin_id = ap.id
  LEFT JOIN public.profiles tp ON aa.target_user_id = tp.id
  ORDER BY aa.created_at DESC;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_user ON public.admin_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON public.admin_actions(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
