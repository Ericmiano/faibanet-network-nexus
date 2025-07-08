
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  Users, 
  Package, 
  CreditCard, 
  HeadphonesIcon,
  Wifi,
  Settings
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "customers", label: "Customers", icon: Users },
    { id: "packages", label: "Packages", icon: Package },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "support", label: "Support", icon: HeadphonesIcon },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Wifi className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Faibanet</h2>
            <p className="text-sm text-gray-500">ISP Management</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              activeTab === item.id && "bg-blue-600 text-white hover:bg-blue-700"
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );
};
