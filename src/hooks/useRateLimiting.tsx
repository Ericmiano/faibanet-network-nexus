
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RateLimitConfig {
  maxAttempts: number;
  windowMinutes: number;
}

export const useRateLimiting = (config: RateLimitConfig = { maxAttempts: 5, windowMinutes: 15 }) => {
  const [isBlocked, setIsBlocked] = useState(false);

  const checkRateLimit = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('check_rate_limit', {
        p_email: email,
        p_ip_address: '127.0.0.1' // In a real app, you'd get the actual IP
      });

      if (error) throw error;

      if (!data) {
        setIsBlocked(true);
        toast.error('Too many failed attempts. Please try again later.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow on error to avoid blocking legitimate users
    }
  }, []);

  const logFailedAttempt = useCallback(async (email: string) => {
    try {
      await supabase.rpc('log_failed_login', {
        p_email: email,
        p_ip_address: '127.0.0.1',
        p_user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log attempt:', error);
    }
  }, []);

  return {
    isBlocked,
    checkRateLimit,
    logFailedAttempt,
    resetBlock: () => setIsBlocked(false)
  };
};
