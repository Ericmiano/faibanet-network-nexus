-- Fix RLS policies for user profile creation during signup
-- Allow users to insert their own profile during signup
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;

-- Create a policy that allows users to insert their own profile
CREATE POLICY "Users can insert own profile during signup" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Also allow admins to insert profiles for management
CREATE POLICY "Admins can insert any profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (is_admin_or_support());

-- Update the trigger function to ensure it sets the correct user ID
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert into profiles table with the new user's ID
  INSERT INTO public.profiles (id, email, full_name, role, account_status)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    CASE 
      WHEN NEW.email = 'admin@faibanet.com' THEN 'admin'::user_role
      ELSE 'customer'::user_role
    END,
    'pending'::account_status
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = now();
  
  RETURN NEW;
END;
$function$;