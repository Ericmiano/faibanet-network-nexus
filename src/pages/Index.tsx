
import { useState, useCallback, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CustomerManagement } from "@/components/CustomerManagement";
import { PackageManagement } from "@/components/PackageManagement";
import { PaymentTracking } from "@/components/PaymentTracking";
import { PaymentReconciliation } from "@/components/PaymentReconciliation";
import { SupportTickets } from "@/components/SupportTickets";
import { DashboardOverview } from "@/components/DashboardOverview";
import { NetworkMonitoring } from "@/components/NetworkMonitoring";
import { AdvancedCustomerManagement } from "@/components/AdvancedCustomerManagement";
import { FinancialReporting } from "@/components/FinancialReporting";
import { EnhancedDashboard } from "@/components/EnhancedDashboard";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { performanceLogger } from "@/lib/performance";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex items-center justify-center min-h-[400px] p-6">
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-destructive">Something went wrong</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  </div>
);

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Performance monitoring
  useEffect(() => {
    performanceLogger.mark('page-load-start');
    return () => {
      performanceLogger.mark('page-load-end');
      performanceLogger.measure('page-load-time', 'page-load-start', 'page-load-end');
    };
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    performanceLogger.mark(`tab-switch-${tab}-start`);
    setActiveTab(tab);
    setTimeout(() => {
      performanceLogger.mark(`tab-switch-${tab}-end`);
      performanceLogger.measure(`tab-switch-${tab}`, `tab-switch-${tab}-start`, `tab-switch-${tab}-end`);
    }, 0);
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onDashboard: () => handleTabChange("dashboard"),
    onCustomers: () => handleTabChange("customers"),
    onPackages: () => handleTabChange("packages"),
    onPayments: () => handleTabChange("payments"),
    onSupport: () => handleTabChange("support"),
    onNetwork: () => handleTabChange("network"),
    onReports: () => handleTabChange("reports"),
  });

  const renderContent = useCallback(() => {
    const contentMap = {
      dashboard: <EnhancedDashboard />,
      customers: <AdvancedCustomerManagement />,
      packages: <PackageManagement />,
      payments: <PaymentTracking />,
      reconciliation: <PaymentReconciliation />,
      support: <SupportTickets />,
      network: <NetworkMonitoring />,
      reports: <FinancialReporting />,
    } as const;

    return contentMap[activeTab as keyof typeof contentMap] || <EnhancedDashboard />;
  }, [activeTab]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex min-h-screen bg-background">
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-2">
              <BreadcrumbNav activeTab={activeTab} />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Faibanet ISP Management</h1>
                <p className="text-muted-foreground mt-2">Complete ISP management solution with real-time monitoring</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            {renderContent()}
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
