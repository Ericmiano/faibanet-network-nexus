import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  validation: {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    score: number;
  } | null;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  validation
}) => {
  if (!password || !validation) {
    return null;
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'very-strong': return 'hsl(var(--success))';
      case 'strong': return 'hsl(var(--success))';
      case 'medium': return 'hsl(var(--warning))';
      case 'weak': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted))';
    }
  };

  const getStrengthBadgeVariant = (strength: string) => {
    switch (strength) {
      case 'very-strong': return 'default';
      case 'strong': return 'secondary';
      case 'medium': return 'outline';
      case 'weak': return 'destructive';
      default: return 'outline';
    }
  };

  const getStrengthText = (strength: string) => {
    switch (strength) {
      case 'very-strong': return 'Very Strong';
      case 'strong': return 'Strong';
      case 'medium': return 'Medium';
      case 'weak': return 'Weak';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-3 mt-2">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Password Strength</span>
          <Badge variant={getStrengthBadgeVariant(validation.strength) as any}>
            {getStrengthText(validation.strength)}
          </Badge>
        </div>
        <Progress 
          value={validation.score} 
          className="h-2"
          style={{
            '--progress-foreground': getStrengthColor(validation.strength)
          } as React.CSSProperties}
        />
      </div>

      {/* Requirements List */}
      {validation.errors.length > 0 && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Requirements:</p>
          <div className="space-y-1">
            {validation.errors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <XCircle className="h-3 w-3 text-destructive flex-shrink-0" />
                <span className="text-muted-foreground">{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success indicators for met requirements */}
      {validation.isValid && (
        <div className="flex items-center gap-2 text-sm text-success">
          <CheckCircle className="h-3 w-3" />
          <span>All password requirements met</span>
        </div>
      )}

      {/* Tips for improvement */}
      {validation.strength === 'weak' || validation.strength === 'medium' ? (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-3 w-3 text-warning flex-shrink-0" />
            <span className="text-muted-foreground">
              {validation.strength === 'weak' 
                ? 'Consider making your password longer and more complex'
                : 'Add more character variety to improve strength'
              }
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};