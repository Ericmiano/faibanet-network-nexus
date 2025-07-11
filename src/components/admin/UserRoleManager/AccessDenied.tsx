
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export const AccessDenied: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Access Denied</h3>
          <p className="text-muted-foreground">Only administrators can access user role management.</p>
        </div>
      </CardContent>
    </Card>
  );
};
