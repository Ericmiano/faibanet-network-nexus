
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Profile, AdminAction } from './types';
import { UserTable } from './UserTable';
import { RoleChangeDialog } from './RoleChangeDialog';
import { UserSearchInput } from './UserSearchInput';
import { AccessDenied } from './AccessDenied';
import { AdminActionsLog } from './AdminActionsLog';

export const UserRoleManager = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newRole, setNewRole] = useState<'customer' | 'admin' | 'support'>('customer');
  const [reason, setReason] = useState('');
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsers();
      fetchAdminActions();
    }
  }, [profile]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedUsers = (data || []).map(user => ({
        ...user,
        role: user.role as 'customer' | 'admin' | 'support'
      }));
      
      setUsers(typedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminActions = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_actions_with_profiles');
      
      if (error) throw error;
      setAdminActions(data || []);
    } catch (error) {
      console.error('Error fetching admin actions:', error);
      toast.error('Failed to load admin actions');
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    try {
      // Use the Supabase function for role change
      const { data, error } = await supabase.rpc('change_user_role', {
        target_user_id: selectedUser.id,
        new_role: newRole,
        reason: reason || null
      });

      if (error) throw error;

      toast.success(`Successfully changed ${selectedUser.full_name || selectedUser.email}'s role to ${newRole}`);
      setShowRoleDialog(false);
      setSelectedUser(null);
      setReason('');
      
      // Refresh both users and admin actions
      fetchUsers();
      fetchAdminActions();
    } catch (error: any) {
      console.error('Error changing user role:', error);
      toast.error(error.message || 'Failed to change user role');
    }
  };

  const handleManageRole = (user: Profile) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleDialog(true);
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (profile?.role !== 'admin') {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Role Management</h2>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'logs'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Admin Actions Log
        </button>
      </div>

      {activeTab === 'users' ? (
        <>
          {/* Search */}
          <UserSearchInput 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Users Table */}
          <UserTable
            users={filteredUsers}
            loading={loading}
            currentUserId={profile?.id}
            onManageRole={handleManageRole}
          />
        </>
      ) : (
        <AdminActionsLog actions={adminActions} />
      )}

      {/* Role Change Dialog */}
      <RoleChangeDialog
        open={showRoleDialog}
        onOpenChange={setShowRoleDialog}
        selectedUser={selectedUser}
        newRole={newRole}
        setNewRole={setNewRole}
        reason={reason}
        setReason={setReason}
        onChangeRole={handleRoleChange}
      />
    </div>
  );
};
