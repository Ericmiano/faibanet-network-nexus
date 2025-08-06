import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Shield,
  Users,
  BarChart,
  Settings,
  Database,
  Activity,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Search,
  Crown
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeSection,
  onSectionChange
}) => {
  const { user, profile, signOut } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Command Center', icon: BarChart, color: 'text-blue-400' },
    { id: 'users', label: 'User Management', icon: Users, color: 'text-green-400' },
    { id: 'security', label: 'Security Center', icon: Shield, color: 'text-red-400' },
    { id: 'analytics', label: 'Analytics', icon: Activity, color: 'text-purple-400' },
    { id: 'system', label: 'System Status', icon: Database, color: 'text-yellow-400' },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, color: 'text-orange-400' },
    { id: 'settings', label: 'Configuration', icon: Settings, color: 'text-gray-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          sidebarCollapsed ? 'w-20' : 'w-80'
        } bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 transition-all duration-300 ease-in-out min-h-screen relative`}>
          
          {/* Header */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-600 to-orange-600">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white">Admin Console</h2>
                    <p className="text-sm text-gray-400">System Control</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-gray-400 hover:text-white"
              >
                {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </Button>
            </div>
            
            {/* Admin Info */}
            {!sidebarCollapsed && (
              <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-700/30">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-red-500">
                    <AvatarFallback className="bg-gradient-to-br from-red-600 to-orange-600 text-white">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      {profile?.full_name || 'Administrator'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-600 text-white border-red-500">
                        <Crown className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search */}
            {!sidebarCollapsed && (
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search system..." 
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/25' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : item.color}`} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className={`absolute bottom-6 ${sidebarCollapsed ? 'left-4 right-4' : 'left-6 right-6'}`}>
            <Button 
              onClick={signOut}
              variant="outline" 
              className={`${sidebarCollapsed ? 'w-12 h-12 p-0' : 'w-full justify-start gap-3'} border-gray-600 hover:bg-red-900/20 hover:border-red-500 hover:text-red-400 text-gray-400`}
              title={sidebarCollapsed ? 'Sign Out' : undefined}
            >
              <LogOut className="h-4 w-4" />
              {!sidebarCollapsed && 'Sign Out'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-30">
            <div className="flex items-center justify-between px-8 py-4">
              <div>
                <h1 className="text-2xl font-bold text-white capitalize flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  {navigationItems.find(item => item.id === activeSection)?.label || 'Admin Panel'}
                </h1>
                <p className="text-gray-400">
                  System Status: <span className="text-green-400">Operational</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-400">All Systems</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};