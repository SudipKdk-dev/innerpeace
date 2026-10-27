import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, token } = useAuth();
  const location = useLocation();

  if (!token && !isLoading) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl items-center justify-center px-6 py-20">
        <Card className="text-center">
          <p className="text-sm text-ink/70">Verifying admin session...</p>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
