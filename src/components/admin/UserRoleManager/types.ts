
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'customer' | 'admin' | 'support';
  is_active: boolean;
  created_at: string;
}
