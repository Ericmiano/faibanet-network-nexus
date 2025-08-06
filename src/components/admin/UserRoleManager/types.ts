
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'customer' | 'admin' | 'support';
  account_status: 'active' | 'suspended' | 'terminated' | 'pending';
  created_at: string;
  promoted_at?: string;
  promoted_by?: string;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  target_user_id: string;
  action_type: string;
  old_role: string;
  new_role: string;
  reason: string;
  created_at: string;
  admin_name: string;
  admin_email: string;
  target_name: string;
  target_email: string;
}
