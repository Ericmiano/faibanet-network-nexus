import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerLayout } from './CustomerLayout';
import { AdminLayout } from './AdminLayout';
import { SupportLayout } from './SupportLayout';

// Customer Components
import { UsageMonitor } from '@/components/customer/UsageMonitor';
import { DeviceManager } from '@/components/customer/DeviceManager';
import { SupportTickets } from '@/components/customer/SupportTickets';
import { PasswordManager } from '@/components/customer/PasswordManager';

// Admin Components
import { UserRoleManager } from '@/components/admin/UserRoleManager';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { AdminSecurityDashboard } from '@/components/admin/AdminSecurityDashboard';

// Support Components - we'll create these
import { SupportQueue } from '@/components/support/SupportQueue';
import { CustomerLookup } from '@/components/support/CustomerLookup';

// Role-specific overview components
import { CustomerOverview } from '@/components/customer/CustomerOverview';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { SupportOverview } from '@/components/support/SupportOverview';

export const RoleBasedDashboard = () => {
  const { profile } = useAuth();
  const [activeSection, setActiveSection] = useState(
    profile?.role === 'admin' ? 'dashboard' : 
    profile?.role === 'support' ? 'tickets' : 'overview'
  );

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderCustomerContent = () => {
    switch (activeSection) {
      case 'overview':
        return <CustomerOverview />;
      case 'usage':
        return <UsageMonitor customerAccountId={profile.id} />;
      case 'billing':
        return <DeviceManager customerAccountId={profile.id} />;
      case 'support':
        return <SupportTickets customerId={profile.id} />;
      case 'settings':
        return <PasswordManager />;
      default:
        return <CustomerOverview />;
    }
  };

  const renderAdminContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminOverview />;
      case 'users':
        return <UserRoleManager />;
      case 'security':
        return <AdminSecurityDashboard />;
      case 'analytics':
        return <SecurityDashboard />;
      case 'system':
        return <div className="text-white">System Status Component</div>;
      case 'alerts':
        return <div className="text-white">Alerts Component</div>;
      case 'settings':
        return <div className="text-white">Configuration Component</div>;
      default:
        return <AdminOverview />;
    }
  };

  const renderSupportContent = () => {
    switch (activeSection) {
      case 'tickets':
        return <SupportQueue />;
      case 'customers':
        return <CustomerLookup />;
      case 'queue':
        return <SupportQueue />;
      case 'resolved':
        return <div>Resolved Tickets Component</div>;
      case 'escalations':
        return <div>Escalations Component</div>;
      default:
        return <SupportOverview />;
    }
  };

  // Render based on user role
  if (profile.role === 'admin') {
    return (
      <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderAdminContent()}
      </AdminLayout>
    );
  }

  if (profile.role === 'support') {
    return (
      <SupportLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderSupportContent()}
      </SupportLayout>
    );
  }

  // Default to customer layout
  return (
    <CustomerLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderCustomerContent()}
    </CustomerLayout>
  );
};