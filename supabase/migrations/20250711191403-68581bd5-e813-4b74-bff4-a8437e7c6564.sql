
-- Create an admin user with credentials
-- First, let's create a profile entry for an admin user
INSERT INTO public.profiles (
  id, 
  email, 
  full_name, 
  role, 
  promoted_at, 
  is_active
) VALUES (
  gen_random_uuid(),
  'admin@faibanet.com',
  'System Administrator',
  'admin',
  now(),
  true
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  promoted_at = now(),
  is_active = true;

-- Note: You'll need to sign up through the UI with these credentials:
-- Email: admin@faibanet.com
-- Password: Admin123!

-- Alternatively, if you want to promote an existing user to admin:
-- UPDATE public.profiles 
-- SET role = 'admin', promoted_at = now()
-- WHERE email = 'your-existing-email@example.com';
