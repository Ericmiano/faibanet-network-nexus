import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CollapsibleSidebar } from '@/components/ui/collapsible-sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, LogOut, User, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
  badge?: number;
  roles?: string[];
}

interface EnterpriseNavigationProps {
  navigationItems: NavigationItem[];
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
  children: React.ReactNode;
}

export const EnterpriseNavigation: React.FC<EnterpriseNavigationProps> = ({
  navigationItems,
  activeModule,
  onModuleChange,
  children
}) => {
  const { signOut, profile } = useAuth();
  const [notifications, setNotifications] = useState(3); // Mock notification count

  const filteredItems = navigationItems.filter(item => 
    !item.roles || item.roles.includes(profile?.role || 'customer')
  );

  const sidebarItems = filteredItems.map(item => ({
    ...item,
    onClick: () => onModuleChange(item.id)
  }));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Enhanced Sidebar */}
      <CollapsibleSidebar 
        items={sidebarItems}
        onItemClick={(item) => item.onClick?.()}
        defaultCollapsed={false}
        className="bg-sidebar border-sidebar-border"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    FaibaNet Enterprise
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Internet Service Provider Management Platform
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* System Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-full text-sm">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                All Systems Operational
              </div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {notifications > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {notifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Network Alert</p>
                      <p className="text-xs text-muted-foreground">
                        Router offline in Zone A - Priority: High
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Payment Received</p>
                      <p className="text-xs text-muted-foreground">
                        Customer payment of KES 2,500 processed
                      </p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                      <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  );
};