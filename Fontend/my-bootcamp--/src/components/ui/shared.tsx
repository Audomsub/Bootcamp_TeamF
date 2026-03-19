import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
export { Pagination } from './pagination';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
  color?: 'primary' | 'emerald' | 'amber' | 'rose' | 'indigo';
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  iconColor,
  iconBg,
  subtitle,
  color = 'primary',
}: StatCardProps) {
  const colorMap = {
    primary: { icon: 'text-primary-400', bg: 'bg-primary-500/10' },
    emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    amber: { icon: 'text-amber-400', bg: 'bg-amber-500/10' },
    rose: { icon: 'text-rose-400', bg: 'bg-rose-500/10' },
    indigo: { icon: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  };

  const selectedColor = colorMap[color];

  return (
    <div className={cn('card p-8 group relative overflow-hidden', className)}>
      {/* Dynamic Background Element */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 rounded-full -mr-12 -mt-12 transition-all duration-1000 group-hover:scale-150 blur-2xl opacity-20",
        color === 'primary' ? 'bg-primary-500' :
        color === 'emerald' ? 'bg-emerald-500' :
        color === 'amber' ? 'bg-amber-500' :
        color === 'rose' ? 'bg-rose-500' : 'bg-indigo-500'
      )}></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <p className="label !ml-0 !mb-0">{title}</p>
          <div className="flex flex-col gap-1.5">
            <p className="text-4xl font-black text-neutral-900 tracking-tighter drop-shadow-sm group-hover:text-primary-950 transition-colors uppercase">{value}</p>
            {trend && (
              <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-xl border border-neutral-200/50 w-fit">
                <span className={cn(
                  'text-[10px] font-black uppercase tracking-widest',
                  trend.value >= 0 ? 'text-emerald-600' : 'text-rose-600'
                )}>
                  {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.2em]">{trend.label}</span>
              </div>
            )}
            {subtitle && (
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1 italic opacity-80">{subtitle}</p>
            )}
          </div>
        </div>
        <div className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shrink-0',
          iconBg || selectedColor.bg,
          iconBg ? 'border-neutral-100' : 'border-neutral-200/50 hover:border-neutral-300'
        )}>
          <Icon className={cn('h-6 w-6', iconColor || selectedColor.icon)} />
        </div>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
      <div className="space-y-2">
        <h1 className="page-title !mb-0">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {children && (
        <div className="flex items-center gap-4 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-20 px-6 card border-dashed !bg-neutral-50/50">
      <div className="relative inline-block mb-6">
        <div className="absolute -inset-4 bg-primary-100 rounded-full blur-xl opacity-40"></div>
        <div className="relative w-20 h-20 bg-white rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-center mx-auto">
          <Icon className="h-10 w-10 text-neutral-300" />
        </div>
      </div>
      <h3 className="text-xl font-black text-neutral-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-sm font-medium text-neutral-500 max-w-sm mx-auto leading-relaxed">{description}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = { 
    sm: 'h-6 w-6 border-2', 
    md: 'h-10 w-10 border-[3px]', 
    lg: 'h-16 w-16 border-[4px]' 
  };
  return (
    <div className={cn('flex items-center justify-center py-20', className)}>
      <div className="relative">
        <div className={cn('opacity-10 border-neutral-900 rounded-full', sizeClasses[size])} />
        <div className={cn('absolute inset-0 border-transparent border-t-primary-600 rounded-full animate-spin', sizeClasses[size])} />
      </div>
    </div>
  );
}

