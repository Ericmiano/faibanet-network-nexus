
import { useState } from "react";
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
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "customers":
        return <AdvancedCustomerManagement />;
      case "packages":
        return <PackageManagement />;
      case "payments":
        return <PaymentTracking />;
      case "reconciliation":
        return <PaymentReconciliation />;
      case "support":
        return <SupportTickets />;
      case "network":
        return <NetworkMonitoring />;
      case "reports":
        return <FinancialReporting />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <BreadcrumbNav activeTab={activeTab} />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Faibanet ISP Management</h1>
              <p className="text-muted-foreground mt-2">Complete ISP management solution</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
