import { useAuth } from "@/contexts/AuthContext";
import { SecureAuthPage } from "@/components/auth/SecureAuthPage";
import { RoleBasedDashboard } from "@/components/layouts/RoleBasedDashboard";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? <RoleBasedDashboard /> : <SecureAuthPage />;
};

export default Index;