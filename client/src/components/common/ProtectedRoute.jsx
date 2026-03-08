import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, roles, allowedRoles }) => {
  const { isAuthenticated, user, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();
  const effectiveRoles = allowedRoles || roles;

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (effectiveRoles && !effectiveRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
