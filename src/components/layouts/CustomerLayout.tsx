import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Wifi,
  Home,
  BarChart3,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';

interface CustomerLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  children,
  activeSection,
  onSectionChange
}) => {
  const { user, profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'usage', label: 'My Usage', icon: BarChart3 },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'support', label: 'Get Help', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <Wifi className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-800">FaibaNet</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-xl shadow-xl lg:shadow-none border-r border-gray-200/50 transition-transform duration-300 ease-in-out`}>
          
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <Wifi className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">FaibaNet</h2>
                <p className="text-sm text-gray-500">Customer Portal</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {profile?.full_name || 'Customer'}
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="absolute bottom-6 left-4 right-4">
            <Button 
              onClick={signOut}
              variant="outline" 
              className="w-full justify-start gap-3 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Desktop Header */}
          <div className="hidden lg:block bg-white/80 backdrop-blur-md border-b sticky top-0 z-30">
            <div className="flex items-center justify-between px-8 py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 capitalize">
                  {activeSection === 'overview' ? 'Dashboard' : activeSection}
                </h1>
                <p className="text-gray-500">
                  Welcome back, {profile?.full_name || 'Customer'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};