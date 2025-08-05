import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PasswordPolicy {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_symbols: boolean;
  max_age_days: number;
  history_count: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number;
}

export const usePasswordValidation = () => {
  const [policy, setPolicy] = useState<PasswordPolicy | null>(null);

  const fetchPasswordPolicy = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('password_policies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Failed to fetch password policy:', error);
        // Use default policy
        setPolicy({
          min_length: 12,
          require_uppercase: true,
          require_lowercase: true,
          require_numbers: true,
          require_symbols: true,
          max_age_days: 90,
          history_count: 5
        });
      } else {
        setPolicy(data);
      }
    } catch (error) {
      console.error('Error fetching password policy:', error);
    }
  }, []);

  const validatePassword = useCallback((password: string): ValidationResult => {
    const errors: string[] = [];
    let score = 0;

    if (!policy) {
      return {
        isValid: false,
        errors: ['Password policy not loaded'],
        strength: 'weak',
        score: 0
      };
    }

    // Length check
    if (password.length < policy.min_length) {
      errors.push(`Password must be at least ${policy.min_length} characters long`);
    } else {
      score += 20;
    }

    // Uppercase check
    if (policy.require_uppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (/[A-Z]/.test(password)) {
      score += 15;
    }

    // Lowercase check
    if (policy.require_lowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (/[a-z]/.test(password)) {
      score += 15;
    }

    // Numbers check
    if (policy.require_numbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else if (/\d/.test(password)) {
      score += 15;
    }

    // Symbols check
    if (policy.require_symbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 15;
    }

    // Additional strength checks
    if (password.length >= 16) score += 10;
    if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
    if (/^(.)\1*$/.test(password)) score -= 20; // All same character
    if (/1234|abcd|qwerty|password/i.test(password)) score -= 20; // Common patterns

    // Determine strength
    let strength: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak';
    if (score >= 80) strength = 'very-strong';
    else if (score >= 60) strength = 'strong';
    else if (score >= 40) strength = 'medium';

    return {
      isValid: errors.length === 0,
      errors,
      strength,
      score: Math.max(0, Math.min(100, score))
    };
  }, [policy]);

  const generateStrongPassword = useCallback((): string => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    const length = 16;
    
    // Ensure at least one character from each required category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }, []);

  return {
    policy,
    fetchPasswordPolicy,
    validatePassword,
    generateStrongPassword
  };
};