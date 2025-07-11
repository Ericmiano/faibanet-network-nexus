import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any }>;
  changePassword: (newPassword: string) => Promise<{ error: any }>;
  changeInternetPassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Cleanup function to prevent auth limbo states
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const logSecurityEvent = async (eventType: string, description: string, severity: string = 'low') => {
    try {
      if (user?.id) {
        await supabase.rpc('log_security_event', {
          p_user_id: user.id,
          p_event_type: eventType,
          p_description: description,
          p_severity: severity
        });
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      console.log('Profile fetched successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        // Update session and user state
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle profile fetching
        if (session?.user && event !== 'TOKEN_REFRESHED') {
          // Use setTimeout to prevent potential issues
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id);
            }
          }, 100);
          
          if (event === 'SIGNED_IN') {
            setTimeout(async () => {
              await logSecurityEvent('login_success', 'User signed in successfully');
            }, 200);
          }
        } else if (!session) {
          setProfile(null);
        }
        
        // Always set loading to false after handling auth state
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      // Clean up existing state before signing up
      cleanupAuthState();
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        await logSecurityEvent('signup_failure', `Failed signup attempt for ${email}`, 'medium');
        return { error };
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      return { error: null };
    } catch (error) {
      console.error('Signup exception:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Clean up existing state first
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        await logSecurityEvent('login_failure', `Failed login attempt for ${email}`, 'medium');
        setLoading(false);
        return { error };
      }

      console.log('Sign in successful for:', email);
      // Don't set loading to false here, let the auth state change handle it
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      
      if (user) {
        await logSecurityEvent('logout', 'User signed out');
      }
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      console.log('Sign out complete');
    } catch (error) {
      console.error('Error signing out:', error);
      // Force clear state even if sign out fails
      setUser(null);
      setSession(null);
      setProfile(null);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user?.id);

      if (error) throw error;
      
      await fetchProfile(user!.id);
      await logSecurityEvent('profile_update', 'User updated profile information');
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // Log password change
      await supabase.from('password_change_logs').insert({
        user_id: user!.id,
        password_type: 'account'
      });

      await logSecurityEvent('password_change', 'Account password changed', 'medium');
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const changeInternetPassword = async (newPassword: string) => {
    try {
      const { error } = await supabase
        .from('customer_accounts')
        .update({ internet_password: newPassword })
        .eq('user_id', user?.id);

      if (error) throw error;

      // Log password change
      await supabase.from('password_change_logs').insert({
        user_id: user!.id,
        password_type: 'internet'
      });

      await logSecurityEvent('password_change', 'Internet password changed', 'medium');
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    changePassword,
    changeInternetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
