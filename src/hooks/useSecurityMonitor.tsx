
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSecurityMonitor = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const logSecurityEvent = async (eventType: string, description: string) => {
      try {
        await supabase.rpc('log_security_event', {
          p_user_id: user.id,
          p_event_type: eventType,
          p_description: description,
          p_severity: 'low'
        });
      } catch (error) {
        console.error('Failed to log security event:', error);
      }
    };

    // Monitor for suspicious activity
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        logSecurityEvent('session_activity', 'User returned to application');
      }
    };

    // Monitor for suspicious navigation
    const handleBeforeUnload = () => {
      logSecurityEvent('session_activity', 'User leaving application');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);
};
