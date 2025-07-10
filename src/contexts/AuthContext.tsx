
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const logSecurityEvent = async (eventType: string, description: string, severity: string = 'low') => {
    try {
      await supabase.rpc('log_security_event', {
        p_user_id: user?.id || null,
        p_event_type: eventType,
        p_description: description,
        p_severity: severity
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
          if (event === 'SIGNED_IN') {
            await logSecurityEvent('login_success', 'User signed in successfully');
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });

      if (error) {
        await logSecurityEvent('signup_failure', `Failed signup attempt for ${email}`, 'medium');
        return { error };
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        await logSecurityEvent('login_failure', `Failed login attempt for ${email}`, 'medium');
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await logSecurityEvent('logout', 'User signed out');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
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
