import { useState, useEffect } from 'react';
import { Mail, X, CheckCircle2, Send } from 'lucide-react';

interface EmailNotificationProps {
  show: boolean;
  onClose: () => void;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  resellerEmail: string;
}

export default function EmailNotification({ show, onClose, orderNumber, customerName, totalAmount, resellerEmail }: EmailNotificationProps) {
  const [step, setStep] = useState(0); // 0=sending, 1=sent

  useEffect(() => {
    if (show) {
      setStep(0);
      const timer = setTimeout(() => setStep(1), 1500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white text-sm font-bold">Email Notification</h3>
              <p className="text-blue-100 text-xs">แจ้งเตือนคำสั่งซื้อใหม่</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 0 ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300">กำลังส่ง Email แจ้งเตือน...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Success indicator */}
              <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">ส่ง Email สำเร็จ!</p>
              </div>

              {/* Email preview */}
              <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-4 space-y-3 border border-neutral-100 dark:border-neutral-600">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-neutral-400 w-10">ถึง:</span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{resellerEmail || 'reseller@shop.com'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-neutral-400 w-10">เรื่อง:</span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">📦 คำสั่งซื้อใหม่ #{orderNumber}</span>
                </div>
                <div className="h-px bg-neutral-200 dark:bg-neutral-600" />
                <div className="text-xs text-neutral-600 dark:text-neutral-300 space-y-2">
                  <p>สวัสดีครับ/ค่ะ,</p>
                  <p>มีคำสั่งซื้อใหม่เข้ามาในร้านค้าของคุณ:</p>
                  <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600 space-y-1.5">
                    <p><span className="font-bold">เลขที่ออเดอร์:</span> {orderNumber}</p>
                    <p><span className="font-bold">ลูกค้า:</span> {customerName}</p>
                    <p><span className="font-bold">ยอดรวม:</span> ฿{Number(totalAmount).toLocaleString()}</p>
                  </div>
                  <p>กรุณาเข้าสู่ระบบเพื่อดำเนินการออเดอร์ได้เลย</p>
                  <p className="text-neutral-400">— ระบบแจ้งเตือนอัตโนมัติ</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 1 && (
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              ดำเนินการต่อ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
