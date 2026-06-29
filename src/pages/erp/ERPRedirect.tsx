import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

const dashboardRoutes: Record<UserRole, string> = {
  superadmin: '/erp/superadmin',
  admin: '/erp/admin',
  principal: '/erp/principal',
  teacher: '/erp/teacher',
  student: '/erp/student',
  parent: '/erp/parent',
  staff: '/erp/staff',
};

export default function ERPRedirect() {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!userProfile) return <Navigate to="/login" replace />;
  return <Navigate to={dashboardRoutes[userProfile.role] || '/login'} replace />;
}
