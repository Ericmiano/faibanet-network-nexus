import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRateLimiting } from '@/hooks/useRateLimiting';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

export const EnhancedAuthPage = () => {
  const { signIn, signUp, loading } = useAuth();
  const { isBlocked, checkRateLimit, logFailedAttempt } = useRateLimiting();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const validateForm = (isSignUp: boolean = false) => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (isSignUp) {
      if (!formData.fullName) {
        errors.fullName = 'Full name is required';
      }
      
      if (!formData.phone) {
        errors.phone = 'Phone number is required';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isBlocked || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      console.log('Attempting sign in for:', formData.email);
      
      const canProceed = await checkRateLimit(formData.email);
      if (!canProceed) {
        setIsSubmitting(false);
        return;
      }

      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Sign in failed:', error);
        await logFailedAttempt(formData.email);
        setSubmitError(error.message || 'Failed to sign in');
        toast.error(error.message || 'Failed to sign in');
      } else {
        console.log('Sign in successful, redirecting...');
        toast.success('Successfully signed in!');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setSubmitError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true) || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      console.log('Attempting sign up for:', formData.email);
      
      const { error } = await signUp(
        formData.email, 
        formData.password, 
        formData.fullName, 
        formData.phone
      );
      
      if (error) {
        console.error('Sign up failed:', error);
        setSubmitError(error.message || 'Failed to create account');
        toast.error(error.message || 'Failed to create account');
      } else {
        console.log('Sign up successful');
        toast.success('Account created successfully! Please check your email.');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setSubmitError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Wifi className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Faibanet</span>
          </div>
          <p className="text-muted-foreground">Reliable Internet Solutions</p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {isBlocked && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Too many failed attempts. Please try again later.
                </AlertDescription>
              </Alert>
            )}

            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    disabled={isSubmitting || isBlocked}
                    className={formErrors.email ? 'border-destructive' : ''}
                    autoComplete="email"
                  />
                  {formErrors.email && (
                    <p className="text-sm text-destructive">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      disabled={isSubmitting || isBlocked}
                      className={formErrors.password ? 'border-destructive' : ''}
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {formErrors.password && (
                    <p className="text-sm text-destructive">{formErrors.password}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || isBlocked}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    disabled={isSubmitting}
                    className={formErrors.fullName ? 'border-destructive' : ''}
                    autoComplete="name"
                  />
                  {formErrors.fullName && (
                    <p className="text-sm text-destructive">{formErrors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <Input
                    id="signup-phone"
                    placeholder="+254712345678"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    disabled={isSubmitting}
                    className={formErrors.phone ? 'border-destructive' : ''}
                    autoComplete="tel"
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-destructive">{formErrors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    disabled={isSubmitting}
                    className={formErrors.email ? 'border-destructive' : ''}
                    autoComplete="email"
                  />
                  {formErrors.email && (
                    <p className="text-sm text-destructive">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      disabled={isSubmitting}
                      className={formErrors.password ? 'border-destructive' : ''}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {formErrors.password && (
                    <p className="text-sm text-destructive">{formErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    disabled={isSubmitting}
                    className={formErrors.confirmPassword ? 'border-destructive' : ''}
                    autoComplete="new-password"
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-sm text-destructive">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure connection protected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
