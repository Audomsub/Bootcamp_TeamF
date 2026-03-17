import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { Shield, Eye, EyeOff, Mail, Lock, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
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
      const response = await authService.loginAdmin(data);
      const { token, role, email } = response.data;
      if (role?.toLowerCase() !== 'admin') {
        setError('Access denied. Admin credentials required.');
        return;
      }
      const mockUser = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        phone: '',
        role: 'admin' as const,
        status: 'approved' as const,
        address: '',
        created_at: new Date().toISOString()
      };
      login(token, mockUser);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Decorative Gimmicks - Cinema-grade background elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        {/* Left Side: Brand Power */}
        <div className="hidden lg:flex flex-col animate-in fade-in slide-in-from-left-12 duration-1000 ease-out">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm w-fit mb-10">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Next-Gen Command Suite</span>
          </div>
          
          <h1 className="page-title !leading-[0.85] !mb-8">
            <span className="text-neutral-400 block mb-2">MASTER</span>
            <span className="text-neutral-900">IDENTITY</span>
          </h1>
          
          <p className="page-subtitle mb-12">
            Securely access the core infrastructure. Our executive dashboard provides high-fidelity analytics and operational control at your fingertips.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-8 glass-card border-none bg-white/40">
              <div className="flex items-center gap-4 mb-3">
                <Shield className="h-6 w-6 text-primary-500" />
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Security</span>
              </div>
              <p className="text-neutral-900 font-bold tracking-tight">Enterprise encryption as standard</p>
            </div>
            <div className="p-8 glass-card border-none bg-white/40">
              <div className="flex items-center gap-4 mb-3">
                <Zap className="h-6 w-6 text-accent-500" />
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Performance</span>
              </div>
              <p className="text-neutral-900 font-bold tracking-tight">Real-time sync and low-latency API</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 ease-out">
          <div className="glass-card p-10 lg:p-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center shadow-2xl">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tighter uppercase italic">Secure Entrance</h2>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] mt-1">Personnel Only</p>
              </div>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] font-bold text-red-600 flex items-center gap-3 animate-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="label">Access Email</label>
                  <div className="relative group">
                    <input
                      type="email"
                      {...register('email')}
                      className="input-field pl-14"
                      placeholder="admin@bootcamp.com"
                      required
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-[11px] font-bold text-red-500 ml-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label !mb-0">Secure Key</label>
                    <button type="button" className="text-[10px] font-bold text-neutral-400 hover:text-primary-600 transition-colors uppercase tracking-widest">Request Reset</button>
                  </div>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className="input-field pl-14 pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
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
                    <p className="mt-2 text-[11px] font-bold text-red-500 ml-1">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full group relative"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      Initialize System
                      <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-relaxed">
                Protected by end-to-end encryption.<br />
                Monitoring is active on all sessions.
              </p>
            </div>
          </div>
          
          {/* Visual Gimmick underneath card */}
          <div className="absolute -z-10 bottom-[-20px] left-[10%] right-[10%] h-[40px] bg-neutral-900/10 blur-[40px] rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
