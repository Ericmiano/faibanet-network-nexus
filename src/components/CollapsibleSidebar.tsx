
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  Users, 
  Package, 
  CreditCard, 
  HeadphonesIcon,
  Wifi,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface CollapsibleSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const CollapsibleSidebar = ({ activeTab, setActiveTab }: CollapsibleSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "customers", label: "Customers", icon: Users },
    { id: "packages", label: "Packages", icon: Package },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "support", label: "Support", icon: HeadphonesIcon },
  ];

  return (
    <div className={cn(
      "bg-card shadow-lg border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <Wifi className="h-8 w-8 text-primary flex-shrink-0" />
          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold text-foreground">Faibanet</h2>
              <p className="text-sm text-muted-foreground">ISP Management</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className={cn(
              "w-full gap-3 transition-all duration-200",
              collapsed ? "justify-center px-2" : "justify-start",
              activeTab === item.id 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => setActiveTab(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Button>
        ))}
      </nav>
    </div>
  );
};
