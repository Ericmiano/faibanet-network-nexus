import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EnterpriseNavigation } from './EnterpriseNavigation';
import { AdminDashboard } from './dashboard/AdminDashboard';
import { CustomerManagementModule } from './customers/CustomerManagementModule';
import { NetworkMonitoringModule } from './network/NetworkMonitoringModule';
import { SupportTicketsModule } from './support/SupportTicketsModule';
import { PackageManagementModule } from './packages/PackageManagementModule';
import { BillingModule } from './billing/BillingModule';
import { AnalyticsModule } from './analytics/AnalyticsModule';
import { UserManagementModule } from './users/UserManagementModule';
import { 
  BarChart3, 
  Users, 
  Wifi, 
  LifeBuoy, 
  Package,
  CreditCard,
  TrendingUp,
  UserCog,
  Shield,
  Settings
} from 'lucide-react';

export const EnterpriseDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');

  const navigationItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: BarChart3,
      onClick: () => setActiveModule('dashboard'),
      roles: ['admin', 'superadmin', 'support']
    },
    {
      id: 'customers',
      title: 'Customers',
      icon: Users,
      onClick: () => setActiveModule('customers'),
      badge: 0,
      roles: ['admin', 'superadmin', 'support']
    },
    {
      id: 'network',
      title: 'Network',
      icon: Wifi,
      onClick: () => setActiveModule('network'),
      roles: ['admin', 'superadmin', 'technician']
    },
    {
      id: 'support',
      title: 'Support',
      icon: LifeBuoy,
      onClick: () => setActiveModule('support'),
      badge: 0,
      roles: ['admin', 'superadmin', 'support']
    },
    {
      id: 'packages',
      title: 'Packages',
      icon: Package,
      onClick: () => setActiveModule('packages'),
      roles: ['admin', 'superadmin']
    },
    {
      id: 'billing',
      title: 'Billing',
      icon: CreditCard,
      onClick: () => setActiveModule('billing'),
      roles: ['admin', 'superadmin']
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: TrendingUp,
      onClick: () => setActiveModule('analytics'),
      roles: ['admin', 'superadmin']
    },
    {
      id: 'users',
      title: 'User Management',
      icon: UserCog,
      onClick: () => setActiveModule('users'),
      roles: ['admin', 'superadmin']
    }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'customers':
        return <CustomerManagementModule />;
      case 'network':
        return <NetworkMonitoringModule />;
      case 'support':
        return <SupportTicketsModule />;
      case 'packages':
        return <PackageManagementModule />;
      case 'billing':
        return <BillingModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'users':
        return <UserManagementModule />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <EnterpriseNavigation
      navigationItems={navigationItems}
      activeModule={activeModule}
      onModuleChange={setActiveModule}
    >
      {renderActiveModule()}
    </EnterpriseNavigation>
  );
};