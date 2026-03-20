import { useState, useEffect, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

// Simple event-based toast manager to avoid context complexity if not needed
type ToastListener = (toast: Toast) => void;
const listeners = new Set<ToastListener>();

export const toast = {
  subscribe: (listener: ToastListener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  show: (type: ToastType, title: string, message?: string, duration: number = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, type, title, message, duration };
    listeners.forEach(listener => listener(newToast));
    return id;
  },

  success: (title: string, message?: string, duration?: number) => toast.show('success', title, message, duration),
  error: (title: string, message?: string, duration?: number) => toast.show('error', title, message, duration),
  info: (title: string, message?: string, duration?: number) => toast.show('info', title, message, duration),
  warning: (title: string, message?: string, duration?: number) => toast.show('warning', title, message, duration),
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts(prev => [...prev, newToast]);

      if (newToast.duration !== Infinity) {
        setTimeout(() => {
          removeToast(newToast.id);
        }, newToast.duration || 5000);
      }
    });
    return () => { unsubscribe(); };
  }, [removeToast]);

  return { toasts, removeToast };
}
