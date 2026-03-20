import { useToast, type Toast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Simplified CSS-based animation version
// Checking package.json... it's NOT installed. We'll use CSS transitions.

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full sm:w-[380px]">
      {toasts.map((toastItem: Toast) => (
        <div
          key={toastItem.id}
          className={cn(
            "group relative overflow-hidden glass-card !rounded-2xl p-4 flex gap-4 animate-in slide-in-from-right-full fade-in duration-500",
            "border-l-4 shadow-2xl",
            toastItem.type === 'success' ? "border-l-emerald-500" :
              toastItem.type === 'error' ? "border-l-rose-500" :
                toastItem.type === 'warning' ? "border-l-amber-500" :
                  "border-l-primary-500"
          )}
        >
          {/* Progress Bar (Visual) */}
          <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 w-full animate-shrink-x" style={{ animationDuration: `${toastItem.duration || 5000}ms` }} />

          <div className={cn(
            "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center",
            toastItem.type === 'success' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
              toastItem.type === 'error' ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" :
                toastItem.type === 'warning' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                  "bg-primary-500/10 text-primary-600 dark:text-primary-400"
          )}>
            {toastItem.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
            {toastItem.type === 'error' && <AlertCircle className="h-5 w-5" />}
            {toastItem.type === 'warning' && <AlertTriangle className="h-5 w-5" />}
            {toastItem.type === 'info' && <Info className="h-5 w-5" />}
          </div>

          <div className="flex-1 min-w-0 py-1">
            <h4 className="text-sm font-black text-neutral-900 dark:text-white tracking-tight leading-none mb-1.5 uppercase">
              {toastItem.title}
            </h4>
            {toastItem.message && (
              <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 leading-relaxed truncate">
                {toastItem.message}
              </p>
            )}
          </div>

          <button
            onClick={() => removeToast(toastItem.id)}
            className="h-8 w-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
