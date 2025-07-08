
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Package, 
  DollarSign, 
  AlertCircle, 
  Wifi,
  TrendingUp,
  UserCheck,
  UserX
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { CustomerManagement } from "@/components/CustomerManagement";
import { PackageManagement } from "@/components/PackageManagement";
import { PaymentTracking } from "@/components/PaymentTracking";
import { SupportTickets } from "@/components/SupportTickets";
import { DashboardOverview } from "@/components/DashboardOverview";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "customers":
        return <CustomerManagement />;
      case "packages":
        return <PackageManagement />;
      case "payments":
        return <PaymentTracking />;
      case "support":
        return <SupportTickets />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Faibanet ISP Management</h1>
          <p className="text-gray-600 mt-2">Complete ISP management solution</p>
        </div>
        
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
