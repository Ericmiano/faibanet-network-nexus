
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
    <div className="w-64 bg-card shadow-lg border-r border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Wifi className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-xl font-bold text-foreground">Faibanet</h2>
            <p className="text-sm text-muted-foreground">ISP Management</p>
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
              activeTab === item.id 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
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
