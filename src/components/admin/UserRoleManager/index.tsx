
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Profile } from './types';
import { UserTable } from './UserTable';
import { RoleChangeDialog } from './RoleChangeDialog';
import { UserSearchInput } from './UserSearchInput';
import { AccessDenied } from './AccessDenied';

export const UserRoleManager = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newRole, setNewRole] = useState<'customer' | 'admin' | 'support'>('customer');
  const [reason, setReason] = useState('');
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsers();
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

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', selectedUser.id);

      if (updateError) throw updateError;

      toast.success(`Successfully changed ${selectedUser.full_name || selectedUser.email}'s role to ${newRole}`);
      setShowRoleDialog(false);
      setSelectedUser(null);
      setReason('');
      fetchUsers();
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
