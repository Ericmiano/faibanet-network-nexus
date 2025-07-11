
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock } from 'lucide-react';
import { AdminAction } from './types';
import { getRoleBadgeVariant } from './utils';

interface AdminActionsLogProps {
  actions: AdminAction[];
}

export const AdminActionsLog: React.FC<AdminActionsLogProps> = ({ actions }) => {
  const getActionBadgeVariant = (actionType: string) => {
    switch (actionType) {
      case 'promote_to_admin':
        return 'destructive';
      case 'demote_from_admin':
        return 'secondary';
      case 'promote_to_support':
        return 'default';
      case 'demote_from_support':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatActionType = (actionType: string) => {
    return actionType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Actions Log ({actions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No admin actions recorded yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Target User</TableHead>
                <TableHead>Role Change</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell>
                    <Badge variant={getActionBadgeVariant(action.action_type)}>
                      {formatActionType(action.action_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{action.admin_name || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">{action.admin_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{action.target_name || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">{action.target_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {action.old_role && (
                        <Badge variant={getRoleBadgeVariant(action.old_role)} className="text-xs">
                          {action.old_role}
                        </Badge>
                      )}
                      {action.old_role && action.new_role && (
                        <span className="text-muted-foreground">→</span>
                      )}
                      {action.new_role && (
                        <Badge variant={getRoleBadgeVariant(action.new_role)} className="text-xs">
                          {action.new_role}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm text-muted-foreground">
                      {action.reason || 'No reason provided'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(action.created_at).toLocaleDateString()}
                      <div className="text-xs text-muted-foreground">
                        {new Date(action.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
