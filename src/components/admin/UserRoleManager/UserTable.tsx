
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Crown, Clock } from 'lucide-react';
import { Profile } from './types';
import { getRoleBadgeVariant, getRoleIcon } from './utils';

interface UserTableProps {
  users: Profile[];
  loading: boolean;
  currentUserId?: string;
  onManageRole: (user: Profile) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  currentUserId,
  onManageRole
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          All Users ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Promoted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name || 'No name'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
                        <RoleIcon className="h-4 w-4" />
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? 'default' : 'secondary'}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.promoted_at ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Crown className="h-3 w-3 text-yellow-500" />
                          <div>
                            <div>{new Date(user.promoted_at).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              Admin promoted
                            </div>
                          </div>
                        </div>
                      ) : user.role === 'admin' ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Original admin
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onManageRole(user)}
                        disabled={user.id === currentUserId}
                      >
                        {user.id === currentUserId ? 'You' : 'Manage Role'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
