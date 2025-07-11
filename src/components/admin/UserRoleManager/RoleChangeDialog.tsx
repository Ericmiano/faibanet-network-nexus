
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Profile } from './types';
import { getRoleBadgeVariant, getRoleIcon } from './utils';

interface RoleChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: Profile | null;
  newRole: 'customer' | 'admin' | 'support';
  setNewRole: (role: 'customer' | 'admin' | 'support') => void;
  reason: string;
  setReason: (reason: string) => void;
  onChangeRole: () => void;
}

export const RoleChangeDialog: React.FC<RoleChangeDialogProps> = ({
  open,
  onOpenChange,
  selectedUser,
  newRole,
  setNewRole,
  reason,
  setReason,
  onChangeRole
}) => {
  if (!selectedUser) return null;

  const CurrentRoleIcon = getRoleIcon(selectedUser.role);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">User</p>
            <div className="font-medium">{selectedUser.full_name || 'No name'}</div>
            <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Current Role</p>
            <Badge variant={getRoleBadgeVariant(selectedUser.role)} className="flex items-center gap-1 w-fit">
              <CurrentRoleIcon className="h-4 w-4" />
              {selectedUser.role}
            </Badge>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">New Role</p>
            <Select value={newRole} onValueChange={(value: any) => setNewRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Reason (Optional)</p>
            <Textarea
              placeholder="Enter reason for role change..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onChangeRole}>
              Change Role
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
