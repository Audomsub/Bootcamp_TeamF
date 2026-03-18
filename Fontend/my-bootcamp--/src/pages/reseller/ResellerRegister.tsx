import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/auth.service';
import { Store, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร'),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(8, 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร'),
  confirmPassword: z.string().min(1, 'กรุณายืนยันรหัสผ่าน'),
  phone: z.string().regex(/^\d{10}$/, 'กรุณาระบุเบอร์โทรศัพท์ 10 หลัก (เช่น 0812345678)'),
  address: z.string().min(5, 'กรุณาระบุที่อยู่ให้ครบถ้วน'),
  shopName: z.string().min(2, 'กรุณาระบุชื่อร้านค้าของคุณ'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function ResellerRegister() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      console.log('Form data being sent:', data);
      const response = await authService.register(data);
      console.log('Register response:', response.data);
      
      // จัดการ response จาก backend
      let responseMessage = '';
      if (typeof response.data === 'string') {
        responseMessage = response.data;
      } else if (typeof response.data === 'object' && response.data !== null && 'message' in response.data) {
        responseMessage = (response.data as any).message;
      } else {
        responseMessage = 'สมัครสมาชิกสำเร็จ';
      }
      
      // Backend ส่งข้อความกลับมาว่า "สมัครสำเร็จ กรุณารอการอนุมัติจาก Admin"
      if (responseMessage.includes('สำเร็จ')) {
        setSuccess(true);
      } else {
        setError(responseMessage);
      }
    } catch (err: any) {
      console.error('Register error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // จัดการ error response จาก backend
      let errorMessage = 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // ถ้า errorData เป็น object มี message field
        if (typeof errorData === 'object' && errorData !== null && 'message' in errorData) {
          errorMessage = (errorData as any).message;
        }
        // ถ้า errorData เป็น string
        else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
        // ถ้า errorData เป็น object มี error field (เช่น {timestamp, status, error, path})
        else if (typeof errorData === 'object' && errorData !== null && 'error' in errorData) {
          errorMessage = (errorData as any).error;
        }
        // ถ้า errorData เป็น object มี status 400 (Bad Request)
        else if (typeof errorData === 'object' && errorData !== null && 'status' in errorData && (errorData as any).status === 400) {
          errorMessage = 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูลที่กรอกใหม่';
        }
      }
      
      console.log('Final error message:', errorMessage);
      setError(errorMessage);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="glass-card bg-white/90 py-12 px-6 shadow-xl border-white/60 rounded-[2.5rem] sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-50 mb-6 border border-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">สมัครสมาชิกสำเร็จ!</h2>
            <p className="text-neutral-500 font-medium mb-8 leading-relaxed">
              สร้างบัญชีตัวแทนจำหน่ายของคุณเรียบร้อยแล้ว <br />
              <span className="text-primary-600 font-semibold">กรุณารอผู้ดูแลระบบอนุมัติบัญชี</span> จึงจะสามารถใช้งานได้
            </p>
            <Link to="/login" className="btn-primary w-full inline-flex justify-center py-3 text-base rounded-xl">
              ไปที่หน้าเข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Store className="h-7 w-7 text-white" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-neutral-900 tracking-tight">
          สมัครเป็นตัวแทนจำหน่าย
        </h2>
        <p className="mt-3 text-center text-sm font-medium text-neutral-500">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
            เข้าสู่ระบบที่นี่
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="glass-card bg-white/90 py-8 px-6 shadow-xl border-white/60 rounded-[2rem] sm:px-10">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-sm font-medium text-rose-600 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1.5">ชื่อ-นามสกุล</label>
                <input {...register('name')} className="input-field w-full" placeholder="สมชาย ใจดี" />
                {errors.name && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1.5">ชื่อร้านค้า</label>
                <input {...register('shopName')} className="input-field w-full" placeholder="ร้านของสมชาย" />
                {errors.shopName && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.shopName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">อีเมล</label>
              <input type="email" {...register('email')} className="input-field w-full" placeholder="you@example.com" />
              {errors.email && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1.5">รหัสผ่าน</label>
                <input type="password" {...register('password')} className="input-field w-full" placeholder="••••••••" />
                {errors.password && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1.5">ยืนยันรหัสผ่าน</label>
                <input type="password" {...register('confirmPassword')} className="input-field w-full" placeholder="••••••••" />
                {errors.confirmPassword && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">เบอร์โทรศัพท์</label>
              <input {...register('phone')} className="input-field w-full" placeholder="0812345678" />
              {errors.phone && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">ที่อยู่จัดส่ง / ติดต่อ</label>
              <textarea 
                {...register('address')} 
                rows={3} 
                className="input-field w-full resize-none" 
                placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล/แขวง, อำเภอ/เขต, จังหวัด, รหัสไปรษณีย์" 
              />
              {errors.address && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.address.message}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 text-base rounded-xl flex items-center justify-center gap-2 font-bold shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    กำลังสมัครสมาชิก...
                  </>
                ) : (
                  'สร้างบัญชีตัวแทนจำหน่าย'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}