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
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) {
    if (role === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="card max-w-md w-full text-center p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🛡️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">403 - Access Forbidden</h2>
          <p className="text-gray-500 mb-8">
            ขออภัย คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (พื้นที่นี้สำหรับ {role === 'admin' ? 'ผู้ดูแลระบบ' : 'ตัวแทนจำหน่าย'} เท่านั้น)
          </p>
          <button 
            onClick={() => window.location.href = user.role?.toLowerCase() === 'admin' ? '/admin/dashboard' : '/reseller/dashboard'} 
            className="w-full btn-primary bg-neutral-900 hover:bg-neutral-800 py-3 rounded-xl font-medium transition-all"
          >
            กลับสู่แดชบอร์ดของคุณ
          </button>
        </div>
      </div>
    );
  }

  if (requireApproval && user.status !== 'approved') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="card max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">บัญชีกำลังรอการอนุมัติ</h2>
          <p className="text-gray-500">
            บัญชีของคุณกำลังอยู่ระหว่างการตรวจสอบ คุณจะสามารถเข้าใช้งานแดชบอร์ดได้หลังจากได้รับการอนุมัติแล้ว
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
