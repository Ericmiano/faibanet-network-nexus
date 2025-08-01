import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserCog } from 'lucide-react';

export const UserManagementModule: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <Card>
        <CardContent className="text-center py-8">
          <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">User management coming soon</h3>
        </CardContent>
      </Card>
    </div>
  );
};