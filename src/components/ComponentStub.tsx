import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ComponentStubProps {
  componentName: string;
  reason?: string;
}

export const ComponentStub = ({ componentName, reason = "Database schema mismatch" }: ComponentStubProps) => {
  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
          <AlertTriangle className="h-5 w-5" />
          {componentName} - Component Disabled
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-orange-600 dark:text-orange-300">
          This component has been temporarily disabled due to: {reason}
        </p>
        <p className="text-sm text-orange-500 dark:text-orange-400 mt-2">
          Please update the component to use the correct database schema or implement the required tables.
        </p>
      </CardContent>
    </Card>
  );
};