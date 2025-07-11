
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, Crown } from 'lucide-react';

export const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin':
      return 'destructive' as const;
    case 'support':
      return 'secondary' as const;
    default:
      return 'default' as const;
  }
};

export const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin':
      return Crown;
    case 'support':
      return UserCheck;
    default:
      return Users;
  }
};
