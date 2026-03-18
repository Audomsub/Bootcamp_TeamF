import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { Store, Eye, EyeOff, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function ResellerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const response = await authService.loginReseller(data);
      const { token, role, user, shop } = response.data;
      
      if (role?.toLowerCase() !== 'reseller') {
        setError('ปฏิเสธการเข้าถึง อนุญาตเฉพาะบัญชีตัวแทนจำหน่ายเท่านั้น');
        return;
      }

      if (!user) {
        setError('พบข้อผิดพลาด: ไม่พบข้อมูลผู้ใช้');
        return;
      }
      
      const userData = {
        ...user,
        phone: user.phone || '',
        status: user.status || 'approved',
        address: user.address || '',
        created_at: user.created_at || new Date().toISOString()
      };
      
      const shopData = shop ? {
        id: shop.id,
        user_id: user.id,
        shop_name: shop.shopName,
        shop_slug: shop.shopSlug,
      } : null;

      login(token, userData, shopData as any);
      navigate('/reseller/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <Store className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          เข้าสู่ระบบร้านค้าของคุณ
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          หรือ{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            สมัครสมาชิกเพื่อเป็นตัวแทนจำหน่าย
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="label">อีเมล</label>
              <div className="mt-1">
                <input
                  type="email"
                  {...register('email')}
                  className="input-field"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="label">รหัสผ่าน</label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  จดจำการเข้าสู่ระบบ
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-2.5 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  'เข้าสู่ระบบ'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}