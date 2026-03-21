import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { Shield, Eye, EyeOff, Mail, Lock, ChevronRight, Zap, Store, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Use useEffect to set the form value once it's mounted
  useEffect(() => {
    const savedEmail = localStorage.getItem('remember_email');
    if (savedEmail) {
      setRememberMe(true);
      setValue('email', savedEmail);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const response = await authService.login(data);
      
      // Save or remove email according to rememberMe preference
      if (rememberMe) {
        localStorage.setItem('remember_email', data.email);
      } else {
        localStorage.removeItem('remember_email');
      }

      const { token, role, email, user, shop } = response.data;

      const userRole = role?.toLowerCase() || '';
      const adminRoles = ['admin', 'administrator', 'superadmin', 'root'];

      if (adminRoles.includes(userRole)) {
        // Handle Admin Login - create fallback user object if backend didn't provide one
        const adminUser = user || { id: 0, name: 'Admin', email: email, role: 'admin', phone: '', status: 'approved', address: '', created_at: new Date().toISOString() };
        login(token, adminUser as any);
        navigate('/admin/dashboard');

      } else if (userRole === 'reseller') {
        // Handle Reseller Login
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

      } else {
        setError('ไม่พบสิทธิ์การเข้าใช้งานที่ถูกต้อง');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'เข้าสู่ระบบไม่สำเร็จ โปรดลองอีกครั้ง';

      if (err.response?.status === 401) {
        const errorData = err.response.data;
        if (errorData && typeof errorData === 'object' && errorData.message && errorData.message !== "อีเมลหรือรหัสผ่านไม่ถูกต้อง") {
          errorMessage = errorData.message;
        } else {
          errorMessage = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
        }
      } else if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object' && errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (typeof errorData === 'object' && errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'object' && errorData.status === 400) {
          errorMessage = 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีเมลและรหัสผ่าน';
        }
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-6 lg:p-12 relative overflow-hidden bg-neutral-50/50">
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        {/* Left Side: Brand Power */}
        <div className="hidden lg:flex flex-col animate-in fade-in slide-in-from-left-12 duration-1000 ease-out">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm w-fit mb-10">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-neutral-600">ยินดีต้อนรับเข้าสู่ระบบ</span>
          </div>

          <h1 className="page-title !leading-tight !mb-8">
            <span className="text-neutral-500 block mb-2 text-4xl lg:text-5xl">แพลตฟอร์มจัดการ</span>
            <span className="text-neutral-900">สินค้าและร้านค้า</span>
          </h1>

          <p className="page-subtitle mb-12 text-neutral-600 leading-relaxed text-lg">
            เข้าถึงระบบอย่างปลอดภัย เชื่อมต่อผู้ดูแลระบบและตัวแทนจำหน่ายผ่านชุดเครื่องมือที่ทรงพลังและระบบบริหารจัดการแบบ Real-time
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-8 glass-card border-none bg-white/40 rounded-[2rem]">
              <div className="flex items-center gap-4 mb-3">
                <Store className="h-6 w-6 text-accent-500" />
                <span className="text-xs font-semibold text-neutral-500">สำหรับตัวแทนจำหน่าย</span>
              </div>
              <p className="text-neutral-800 font-semibold text-sm">จัดการแคตตาล็อกและยอดขาย</p>
            </div>
            <div className="p-8 glass-card border-none bg-white/40 rounded-[2rem]">
              <div className="flex items-center gap-4 mb-3">
                <Shield className="h-6 w-6 text-primary-500" />
                <span className="text-xs font-semibold text-neutral-500">สำหรับผู้ดูแลระบบ</span>
              </div>
              <p className="text-neutral-800 font-semibold text-sm">ควบคุมระบบและเครือข่ายทั้งหมด</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 ease-out">
          <div className="glass-card p-10 lg:p-12 relative overflow-hidden group rounded-[2.5rem] bg-white shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>

            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center shadow-lg mb-5">
                <Lock className="h-8 w-8 text-white relative right-0.5" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">เข้าสู่ระบบ</h2>
              <p className="text-sm font-medium text-neutral-500 mt-2">สำหรับตัวแทนจำหน่ายและผู้ดูแลระบบ</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm font-medium text-red-600 flex items-center gap-3 animate-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0"></div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="label text-sm font-semibold text-neutral-700 block mb-2">อีเมลผู้ใช้งาน</label>
                <div className="relative group">
                  <input
                    type="email"
                    {...register('email')}
                    className="input-field pl-12 w-full h-12 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all bg-neutral-50"
                    placeholder="you@email.com"
                    required
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                </div>
                {errors.email && (
                  <p className="mt-2 text-xs font-medium text-red-500 ml-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="label text-sm font-semibold text-neutral-700 block mb-2">รหัสผ่าน</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="input-field pl-12 pr-12 w-full h-12 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all bg-neutral-50"
                    placeholder="••••••••"
                    required
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-xs font-medium text-red-500 ml-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                      rememberMe 
                        ? 'bg-neutral-900 border-neutral-900 group-hover:bg-neutral-800' 
                        : 'bg-white border-neutral-200 group-hover:border-neutral-300'
                    }`}>
                      {rememberMe && (
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white fill-none stroke-[4] stroke-current">
                          <path d="M20 6L9 17L4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors">
                    จดจำบัญชีผู้ใช้
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full h-12 rounded-xl bg-neutral-900 text-white font-semibold hover:bg-neutral-800 transition-all group relative flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      กำลังตรวจสอบ...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      เข้าสู่ระบบ
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
              <p className="text-sm text-neutral-600">
                ยังไม่มีบัญชีตัวแทนจำหน่าย?{' '}
                <Link to="/register" className="font-semibold text-accent-600 hover:text-accent-700 hover:underline">
                  สมัครสมาชิกที่นี่
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
