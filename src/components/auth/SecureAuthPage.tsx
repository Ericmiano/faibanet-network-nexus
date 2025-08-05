import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  Eye, 
  EyeOff, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Lock,
  RefreshCw,
  Info
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRateLimiting } from '@/hooks/useRateLimiting';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { toast } from 'sonner';

export const SecureAuthPage = () => {
  const { signIn, signUp, loading } = useAuth();
  const { isBlocked, checkRateLimit, logFailedAttempt } = useRateLimiting();
  const { validatePassword, generateStrongPassword, fetchPasswordPolicy } = usePasswordValidation();
  
  // Initialize security monitoring
  useSecurityMonitor();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [passwordValidation, setPasswordValidation] = useState<any>(null);

  useEffect(() => {
    fetchPasswordPolicy();
  }, [fetchPasswordPolicy]);

  useEffect(() => {
    if (formData.password) {
      const validation = validatePassword(formData.password);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation(null);
    }
  }, [formData.password, validatePassword]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  const validateForm = (isSignUp: boolean = false) => {
    const errors: Record<string, string> = {};
    
    // Email validation
    const sanitizedEmail = sanitizeInput(formData.email);
    if (!sanitizedEmail) {
      errors.email = 'Email is required';
    } else if (!validateEmail(sanitizedEmail)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (passwordValidation && !passwordValidation.isValid) {
      errors.password = 'Password does not meet security requirements';
    }
    
    if (isSignUp) {
      // Full name validation
      const sanitizedName = sanitizeInput(formData.fullName);
      if (!sanitizedName) {
        errors.fullName = 'Full name is required';
      } else if (sanitizedName.length < 2) {
        errors.fullName = 'Full name must be at least 2 characters';
      } else if (!/^[a-zA-Z\s-']+$/.test(sanitizedName)) {
        errors.fullName = 'Full name can only contain letters, spaces, hyphens, and apostrophes';
      }
      
      // Phone validation
      const sanitizedPhone = sanitizeInput(formData.phone);
      if (!sanitizedPhone) {
        errors.phone = 'Phone number is required';
      } else if (!validatePhoneNumber(sanitizedPhone)) {
        errors.phone = 'Please enter a valid phone number (e.g., +254712345678)';
      }
      
      // Confirm password validation
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
      const sanitizedEmail = sanitizeInput(formData.email);
      
      const canProceed = await checkRateLimit(sanitizedEmail);
      if (!canProceed) {
        setIsSubmitting(false);
        return;
      }

      const { error } = await signIn(sanitizedEmail, formData.password);
      
      if (error) {
        await logFailedAttempt(sanitizedEmail);
        setSubmitError(error.message || 'Invalid email or password');
        toast.error('Sign in failed. Please check your credentials.');
      } else {
        toast.success('Successfully signed in!');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
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
      const sanitizedData = {
        email: sanitizeInput(formData.email),
        fullName: sanitizeInput(formData.fullName),
        phone: sanitizeInput(formData.phone)
      };
      
      const { error } = await signUp(
        sanitizedData.email, 
        formData.password, 
        sanitizedData.fullName, 
        sanitizedData.phone
      );
      
      if (error) {
        setSubmitError(error.message || 'Failed to create account');
        toast.error(error.message || 'Account creation failed');
      } else {
        toast.success('Account created successfully! Please check your email for verification.');
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
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword();
    setFormData(prev => ({ 
      ...prev, 
      password: newPassword,
      confirmPassword: newPassword
    }));
    toast.success('Strong password generated!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl glass slide-up">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Wifi className="h-8 w-8 text-primary pulse-glow" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Faibanet
            </span>
          </div>
          <p className="text-muted-foreground">Secure Network Solutions</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-success" />
            <span>Enterprise-grade security</span>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" className="data-[state=active]:bg-gradient-primary">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-primary">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {isBlocked && (
              <Alert variant="destructive" className="fade-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Account temporarily locked due to multiple failed attempts. Please try again later.
                </AlertDescription>
              </Alert>
            )}

            {submitError && (
              <Alert variant="destructive" className="fade-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email Address</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    disabled={isSubmitting || isBlocked}
                    className={formErrors.email ? 'border-destructive' : ''}
                    autoComplete="email"
                    placeholder="your@email.com"
                  />
                  {formErrors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.email}
                    </p>
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
                      placeholder="Enter your password"
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
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.password}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200" 
                  disabled={isSubmitting || isBlocked}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Sign In Securely
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
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
                    placeholder="John Doe"
                  />
                  {formErrors.fullName && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.fullName}
                    </p>
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
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    disabled={isSubmitting}
                    className={formErrors.email ? 'border-destructive' : ''}
                    autoComplete="email"
                    placeholder="your@email.com"
                  />
                  {formErrors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signup-password">Password</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleGeneratePassword}
                      disabled={isSubmitting}
                      className="h-auto p-1 text-xs"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Generate
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      disabled={isSubmitting}
                      className={formErrors.password ? 'border-destructive' : ''}
                      autoComplete="new-password"
                      placeholder="Create a strong password"
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
                  
                  <PasswordStrengthIndicator 
                    password={formData.password} 
                    validation={passwordValidation} 
                  />
                  
                  {formErrors.password && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      disabled={isSubmitting}
                      className={formErrors.confirmPassword ? 'border-destructive' : ''}
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isSubmitting}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200" 
                  disabled={isSubmitting || (passwordValidation && !passwordValidation.isValid)}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Create Secure Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
              <Shield className="h-4 w-4 text-success" />
              <span>256-bit SSL encryption</span>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                <Info className="h-3 w-3 mr-1" />
                GDPR Compliant • SOC 2 Certified
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};