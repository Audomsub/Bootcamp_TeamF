import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  role?: 'admin' | 'reseller';
  requireApproval?: boolean;
}

export default function ProtectedRoute({ role, requireApproval = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Temporarily bypass authentication check to view UX/UI without logging in
  // Temporarily bypass authentication check to view UX/UI without logging in
  // if (isLoading) {
  //   return (
  //     <div className="h-screen flex items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  // }

  // if (role && user.role !== role) {
  //   // If admin tries to access reseller or vice versa
  //   if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  //   return <Navigate to="/reseller/dashboard" replace />;
  // }

  // if (requireApproval && user.status !== 'approved') {
  //   return (
  //     <div className="h-screen flex items-center justify-center">
  //       <div className="card max-w-md mx-auto text-center p-8">
  //         <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //           <Loader2 className="h-8 w-8 text-amber-600" />
  //         </div>
  //         <h2 className="text-xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
  //         <p className="text-gray-500">
  //           Your account is currently being reviewed. You'll be able to access your dashboard once approved.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return <Outlet />;
}
