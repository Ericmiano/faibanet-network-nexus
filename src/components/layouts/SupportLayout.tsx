import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  HeadphonesIcon,
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Menu,
  X,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SupportLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const SupportLayout: React.FC<SupportLayoutProps> = ({
  children,
  activeSection,
  onSectionChange
}) => {
  const { user, profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    { id: 'tickets', label: 'Active Tickets', icon: MessageSquare, badge: '12', color: 'bg-orange-500' },
    { id: 'customers', label: 'Customer Lookup', icon: Users, color: 'bg-blue-500' },
    { id: 'queue', label: 'Support Queue', icon: Clock, badge: '8', color: 'bg-purple-500' },
    { id: 'resolved', label: 'Resolved Today', icon: CheckCircle, badge: '24', color: 'bg-green-500' },
    { id: 'escalations', label: 'Escalations', icon: AlertCircle, badge: '3', color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'w-80' : 'w-20'
        } bg-white shadow-xl border-r border-orange-200/50 transition-all duration-300 ease-in-out min-h-screen relative`}>
          
          {/* Header */}
          <div className="p-6 border-b border-orange-200/50 bg-gradient-to-r from-orange-500 to-amber-500">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                    <HeadphonesIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white">Support Center</h2>
                    <p className="text-sm text-orange-100">Help customers succeed</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white hover:bg-white/20"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
            
            {/* Support Agent Info */}
            {sidebarOpen && (
              <div className="mt-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white/30">
                    <AvatarFallback className="bg-gradient-to-br from-orange-600 to-amber-600 text-white">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      {profile?.full_name || 'Support Agent'}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <span className="text-sm text-orange-100">Available</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Search */}
            {sidebarOpen && (
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-200" />
                <Input 
                  placeholder="Search tickets, customers..." 
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-orange-200 backdrop-blur-sm"
                />
              </div>
            )}
          </div>

          {/* Stats */}
          {sidebarOpen && (
            <div className="p-4 border-b border-orange-200/50">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200">
                  <div className="text-lg font-bold text-green-800">24</div>
                  <div className="text-xs text-green-600">Resolved Today</div>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200">
                  <div className="text-lg font-bold text-orange-800">12</div>
                  <div className="text-xs text-orange-600">Active Tickets</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25' 
                      : 'text-gray-700 hover:bg-orange-100 hover:text-orange-800'
                  }`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : item.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge className={`${isActive ? 'bg-white/20 text-white' : 'bg-orange-500 text-white'} text-xs`}>
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {!sidebarOpen && item.badge && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          {sidebarOpen && (
            <div className="p-4 border-t border-orange-200/50">
              <div className="space-y-2">
                <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Tickets
                </Button>
              </div>
            </div>
          )}

          {/* Sign Out */}
          <div className={`absolute bottom-6 ${sidebarOpen ? 'left-6 right-6' : 'left-4 right-4'}`}>
            <Button 
              onClick={signOut}
              variant="outline" 
              className={`${sidebarOpen ? 'w-full justify-start gap-3' : 'w-12 h-12 p-0'} border-orange-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-orange-600`}
              title={!sidebarOpen ? 'Sign Out' : undefined}
            >
              <LogOut className="h-4 w-4" />
              {sidebarOpen && 'Sign Out'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="bg-white/80 backdrop-blur-md border-b border-orange-200/50 sticky top-0 z-30">
            <div className="flex items-center justify-between px-8 py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 capitalize">
                  {navigationItems.find(item => item.id === activeSection)?.label || 'Support Dashboard'}
                </h1>
                <p className="text-gray-600">
                  Help customers and resolve issues quickly
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-700 font-medium">Online</span>
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