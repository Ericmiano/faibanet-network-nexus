
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { EnhancedAuthPage } from "@/components/auth/EnhancedAuthPage";
import { CustomerDashboard } from "@/components/customer/CustomerDashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingScreen } from "@/components/LoadingSpinner";
import { useSecurityMonitor } from "@/hooks/useSecurityMonitor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  useSecurityMonitor();
  
  console.log('ProtectedRoute: user=', user?.id, 'loading=', loading);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading, user } = useAuth();
  
  console.log('AdminRoute: profile=', profile, 'loading=', loading, 'user=', user?.id);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    console.log('AdminRoute: No user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }
  
  if (profile?.role !== 'admin') {
    console.log('AdminRoute: Not admin, redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AuthRedirect = () => {
  const { user, profile, loading } = useAuth();
  
  console.log('AuthRedirect: user=', user?.id, 'profile=', profile, 'loading=', loading);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (user) {
    if (profile?.role === 'admin') {
      console.log('AuthRedirect: Admin user, redirecting to /admin');
      return <Navigate to="/admin" replace />;
    }
    console.log('AuthRedirect: Regular user, redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  return <EnhancedAuthPage />;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="faibanet-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/auth" element={<AuthRedirect />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <Index />
                      </AdminRoute>
                    </ProtectedRoute>
                  } 
                />
                <Route path="/" element={<AuthRedirect />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
