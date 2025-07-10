
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Key, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const PasswordManager = () => {
  const { changePassword, changeInternetPassword } = useAuth();
  const [loading, setLoading] = useState({ account: false, internet: false });
  
  const [accountForm, setAccountForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [internetForm, setInternetForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleAccountPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (accountForm.newPassword !== accountForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (accountForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading({ ...loading, account: true });

    try {
      const { error } = await changePassword(accountForm.newPassword);
      
      if (error) {
        toast.error('Failed to change password: ' + error.message);
      } else {
        toast.success('Account password changed successfully');
        setAccountForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading({ ...loading, account: false });
    }
  };

  const handleInternetPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (internetForm.newPassword !== internetForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (internetForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading({ ...loading, internet: true });

    try {
      const { error } = await changeInternetPassword(internetForm.newPassword);
      
      if (error) {
        toast.error('Failed to change internet password: ' + error.message);
      } else {
        toast.success('Internet password changed successfully');
        setInternetForm({
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading({ ...loading, internet: false });
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Password
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Change the password for your customer portal account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAccountPasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newAccountPassword">New Password</Label>
              <Input
                id="newAccountPassword"
                type="password"
                value={accountForm.newPassword}
                onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmAccountPassword">Confirm New Password</Label>
              <Input
                id="confirmAccountPassword"
                type="password"
                value={accountForm.confirmPassword}
                onChange={(e) => setAccountForm({ ...accountForm, confirmPassword: e.target.value })}
                required
              />
            </div>
            <Button type="submit" disabled={loading.account}>
              {loading.account ? 'Changing...' : 'Change Account Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Internet Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Internet Password
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Change your internet connection password (used for WiFi and network access)
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInternetPasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newInternetPassword">New Internet Password</Label>
              <Input
                id="newInternetPassword"
                type="password"
                value={internetForm.newPassword}
                onChange={(e) => setInternetForm({ ...internetForm, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmInternetPassword">Confirm New Internet Password</Label>
              <Input
                id="confirmInternetPassword"
                type="password"
                value={internetForm.confirmPassword}
                onChange={(e) => setInternetForm({ ...internetForm, confirmPassword: e.target.value })}
                required
              />
            </div>
            <Button type="submit" disabled={loading.internet}>
              {loading.internet ? 'Changing...' : 'Change Internet Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>Don't use the same password for multiple accounts.</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>Your internet password is used for WiFi and network authentication.</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>Password changes are logged for security purposes.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
